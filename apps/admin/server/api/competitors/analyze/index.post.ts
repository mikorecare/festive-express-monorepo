import pLimit from 'p-limit'
import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { discoverSiteUrls } from '~~/server/utils/seo-crawler'
import { scrapeCompetitorPage } from '~~/server/utils/competitors/competitor-scraper'
import { analyzeCompetitorPage } from '~~/server/utils/competitors/competitor-analyzer'
import type { CompetitorIntelligence } from '~~/server/utils/competitors/types'

type AnalyzeResult = { name: string; ok: boolean; reason: string }

const AMOUNT_RE_G = /\$\s?\d[\d,]*(?:\.\d{1,2})?/g
const normAmount = (a: string) => a.replace(/[\s,]/g, '').replace(/\.00$/, '')
const amountsOf = (s: string): string[] => (s.match(AMOUNT_RE_G) ?? []).map(normAmount)
const normLine = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

const pagePathOf = (url: string): string => {
    try {
        const u = new URL(url)
        return u.pathname + u.search || '/'
    } catch {
        return url
    }
}

/**
 * Backstop: if the model still put a promotion amount into a price field,
 * remove it. An amount is dropped only when it appeared in promo lines
 * and never in a real price line.
 */
function stripPromoPrices(
    intel: CompetitorIntelligence,
    promoAmounts: Set<string>,
    realAmounts: Set<string>,
) {
    const promoOnly = (text: string | null | undefined) => {
        if (!text) return false
        const amts = amountsOf(text)
        return amts.length > 0 && amts.every((a) => promoAmounts.has(a) && !realAmounts.has(a))
    }

    for (const p of intel.packages ?? []) {
        if (promoOnly(p.price)) p.price = null
    }
    if (promoOnly(intel.pricingSignals.priceRangeHint)) intel.pricingSignals.priceRangeHint = null

    intel.pricingSignals.hasPricing =
        (intel.packages ?? []).some((p) => p.price) || Boolean(intel.pricingSignals.priceRangeHint)
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const body = await readBody(event)
    const supabase = await getAuthenticatedSupabase(event)

    const ids: string[] = Array.isArray(body?.ids) ? body.ids : []
    const useAi = body?.useAi !== false

    if (ids.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'No competitors selected' })
    }

    const { data: targets, error: tErr } = await supabase
        .from('competitors')
        .select('id, place_id, name, website')
        .in('id', ids)

    if (tErr || !targets) throw createError({ statusCode: 500, statusMessage: 'DB error' })

    const results: AnalyzeResult[] = []

    for (const c of targets) {
        if (!c.website) {
            await supabase.from('competitors').update({ status: 'failed', error: 'No website' }).eq('id', c.id)
            results.push({ name: c.name, ok: false, reason: 'No website' })
            continue
        }

        console.log(`[analyze] Discovering ALL pages for ${c.website}...`)

        // 1. Find up to 50 pages
        let urls = await discoverSiteUrls(c.website, 50)
        if (urls.length === 0) urls = [c.website]

        console.log(`[analyze] Found ${urls.length} pages. Scraping in batches...`)

        // 2. Scrape them in batches of 5 (SEO scrape + money pass)
        const limit = pLimit(5)
        const scrapedPages = await Promise.all(
            urls.map(u => limit(() => scrapeCompetitorPage(u)))
        )

        // 3. Filter out failed pages
        const validPages = scrapedPages.filter(p => !p.fetchError && p.blocks.length > 0)
        console.log(`[analyze] ${validPages.length}/${urls.length} pages scraped OK for ${c.name}`)

        if (validPages.length === 0) {
            const msg = 'Could not scrape any pages (blocked or empty)'
            await supabase.from('competitors').update({ status: 'failed', error: msg }).eq('id', c.id)
            results.push({ name: c.name, ok: false, reason: msg })
            continue
        }

        // 4. Site-wide amounts (ticker, banner, popup) are promotions, not prices:
        //    an amount that shows up on half the pages (min 3) is not tied to one package.
        const pageCount = new Map<string, number>()
        for (const p of validPages) {
            for (const l of new Set(p.priceLines.map(normLine))) {
                pageCount.set(l, (pageCount.get(l) ?? 0) + 1)
            }
        }
        const siteWideAt = Math.max(3, Math.ceil(validPages.length * 0.5))
        const isSiteWide = (l: string) => (pageCount.get(normLine(l)) ?? 0) >= siteWideAt

        const realAmounts = new Set<string>()
        const promoAmounts = new Set<string>()
        const seenPromos = new Set<string>()
        let priceCount = 0
        let promoCount = 0

        // 5. Merge all pages into one document. Each page starts with a PAGE marker,
        //    followed by its PRICE lines and PROMO lines (a promo repeated on many pages is listed once).
        const mergedBlocks = validPages.flatMap((p, pi) => {
            const realPrices = p.priceLines.filter((l) => !isSiteWide(l))
            const promos = [...p.promoLines, ...p.priceLines.filter(isSiteWide)].filter((l) => {
                const k = normLine(l)
                if (seenPromos.has(k)) return false
                seenPromos.add(k)
                return true
            })

            realPrices.forEach((l) => amountsOf(l).forEach((a) => realAmounts.add(a)))
                ;[...p.promoLines, ...p.priceLines.filter(isSiteWide)].forEach((l) =>
                    amountsOf(l).forEach((a) => promoAmounts.add(a)),
                )
            priceCount += realPrices.length
            promoCount += promos.length

            return [
                {
                    id: `p${pi}`,
                    tag: 'h1',
                    level: 1,
                    selector: 'page',
                    line: 0,
                    text: `PAGE: ${pagePathOf(p.finalUrl)}${p.title ? ` — ${p.title}` : ''}`,
                },
                ...realPrices.map((line, i) => ({
                    id: `p${pi}-price${i}`,
                    tag: 'p',
                    level: 0,
                    selector: 'price',
                    line: 0,
                    text: `PRICE: ${line}`,
                })),
                ...promos.map((line, i) => ({
                    id: `p${pi}-promo${i}`,
                    tag: 'p',
                    level: 0,
                    selector: 'promo',
                    line: 0,
                    text: `PROMO: ${line}`,
                })),
                ...p.blocks.map(b => ({ ...b, id: `p${pi}-${b.id}` })),
            ]
        })
        const firstPage = validPages[0]!

        // Full blocks go to the analyzer (it needs ids/tags for chunking and the outline)
        const mergedContent = {
            finalUrl: c.website,
            title: firstPage.title,
            blocks: mergedBlocks,
            contentTruncated: false,
        }

        console.log(`[analyze] Merged ${mergedBlocks.length} blocks (${priceCount} price lines, ${promoCount} promo lines) from ${validPages.length} pages. Saving...`)

        // Only pure text is stored in the database
        await supabase.from('competitors').update({
            status: 'scraped',
            seo_raw: {
                finalUrl: c.website,
                title: firstPage.title,
                pagesScraped: validPages.length,
                blocks: mergedBlocks.map(b => ({ text: b.text })),
                contentTruncated: false,
            },
            last_scraped_at: new Date().toISOString(),
            error: null
        }).eq('id', c.id)

        if (!useAi) {
            results.push({ name: c.name, ok: true, reason: 'scraped' })
            continue
        }

        console.log(`[analyze] Calling Gemini for ${c.name}...`)
        try {
            const analysis = await analyzeCompetitorPage(config.geminiApiKey as string, mergedContent as any)

            if (analysis.status === 'failed' || !analysis.intelligence) {
                // Keep any previous intelligence; only record the failure
                await supabase.from('competitors').update({
                    status: 'failed',
                    error: 'AI analysis failed',
                }).eq('id', c.id)
                results.push({ name: c.name, ok: false, reason: 'AI analysis failed' })
                continue
            }

            if (analysis.truncated) {
                console.warn(`[analyze] ${c.name}: content was truncated (${analysis.parts.total} parts). Consider raising maxChunksPerPage.`)
            }

            stripPromoPrices(analysis.intelligence, promoAmounts, realAmounts)

            await supabase.from('competitors').update({
                status: 'analyzed',
                intelligence: analysis.intelligence,
                last_analyzed_at: new Date().toISOString(),
                error: analysis.status === 'partial'
                    ? `Partial analysis: ${analysis.parts.failed} of ${analysis.parts.total} parts failed`
                    : null,
            }).eq('id', c.id)
            results.push({ name: c.name, ok: true, reason: analysis.status })
        } catch (e: any) {
            await supabase.from('competitors').update({ status: 'failed', error: e.message }).eq('id', c.id)
            results.push({ name: c.name, ok: false, reason: e.message })
        }
    }

    return { results }
})