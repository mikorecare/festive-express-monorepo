import pLimit from 'p-limit'
import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { discoverSiteUrls, urlKey } from '~~/server/services/shared/crawler/discover'
import { scrapeCompetitorPage } from '~~/server/services/competitors/competitor-scraper'
import { analyzeCompetitorSite } from '~~/server/services/competitors/competitor-analyzer'
import { prioritizeUrls } from '~~/server/services/competitors/competitor-analyzer/page-priority'
import { MAX_CAPTURE_PAGES, MAX_DISCOVERY_CANDIDATES } from '~~/server/services/competitors/competitor-analyzer/config'
import type { CompetitorIntelligence } from '~~/server/services/competitors/types'

type AnalyzeResult = { name: string; ok: boolean; reason: string }

const AMOUNT_RE_G = /\$\s?\d[\d,]*(?:\.\d{1,2})?/g
const normAmount = (a: string) => a.replace(/[\s,]/g, '').replace(/\.00$/, '')
const amountsOf = (s: string): string[] => (s.match(AMOUNT_RE_G) ?? []).map(normAmount)


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
        .select('id, place_id, name, website, seo_raw')
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

        // Discover a wider bounded candidate pool before choosing the capture set.
        const discovered = await discoverSiteUrls(c.website, MAX_DISCOVERY_CANDIDATES)
        const candidates = [...new Map([c.website, ...discovered].map(url => [urlKey(url), url])).values()]
        const entryKey = urlKey(c.website)
        const urls = [c.website, ...prioritizeUrls(candidates.filter(url => urlKey(url) !== entryKey))]
            .slice(0, MAX_CAPTURE_PAGES)
        const discoveryLimitReached = discovered.length >= MAX_DISCOVERY_CANDIDATES
        const deferredPages = Math.max(0, candidates.length - urls.length)

        console.log(`[analyze] Found ${urls.length} pages. Scraping in batches...`)

        // 2. Scrape them in batches of 5 (single marketing content fetch)
        const limit = pLimit(5)
        const scrapedPages = await Promise.all(
            urls.map(u => limit(() => scrapeCompetitorPage(u)))
        )

        // 3. Filter out failed pages
        const validPages = scrapedPages.filter(p => !p.fetchError && (p.blocks.length > 0 || p.priceLines.length > 0 || p.promoLines.length > 0 || !!p.bodySnippet))
        console.log(`[analyze] ${validPages.length}/${urls.length} pages scraped OK for ${c.name}`)

        if (validPages.length === 0) {
            const msg = 'Could not scrape any pages (blocked or empty)'
            await supabase.from('competitors').update({ status: 'failed', error: msg }).eq('id', c.id)
            results.push({ name: c.name, ok: false, reason: msg })
            continue
        }

        const realAmounts = new Set<string>()
        const promoAmounts = new Set<string>()
        
        let priceCount = 0
        let promoCount = 0

        // 5. Merge all pages into one document. Each page starts with a PAGE marker,
        //    followed by its PRICE and PROMO lines, with source IDs for evidence lookup.
        const mergedBlocks = validPages.flatMap((p, pi) => {
            const realPrices = p.priceLines
            const promos = p.promoLines

            realPrices.forEach((l) => amountsOf(l).forEach((a) => realAmounts.add(a)))
                ;p.promoLines.forEach((l) =>
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
                    sourceUrl: p.finalUrl,
                    sourceBlockId: `price-${i}`,
                    tag: 'p',
                    level: 0,
                    selector: 'price',
                    line: 0,
                    text: `PRICE: ${line}`,
                })),
                ...promos.map((line, i) => ({
                    id: `p${pi}-promo${i}`,
                    sourceUrl: p.finalUrl,
                    sourceBlockId: `promo-${i}`,
                    tag: 'p',
                    level: 0,
                    selector: 'promo',
                    line: 0,
                    text: `PROMO: ${line}`,
                })),
                ...p.blocks.map(b => ({ ...b, id: `p${pi}-${b.id}`, sourceUrl: p.finalUrl, sourceBlockId: b.id })),
                ...(!p.blocks.length && !p.priceLines.length && !p.promoLines.length && p.bodySnippet ? [{ id: `p${pi}-body`, sourceUrl: p.finalUrl, sourceBlockId: "body", tag: "body", level: 0, selector: "body", line: 0, text: p.bodySnippet }] : []),
            ]
        })
        const firstPage = validPages[0]!
        const captureDiagnostics = {
            discoveredCandidates: candidates.length,
            requestedPages: urls.length,
            deferredPages,
            discoveryLimitReached,
            failedOrEmptyPages: urls.length - validPages.length,
            truncatedPages: validPages.filter(p => p.contentTruncated).length,
            clientRenderedPages: validPages.filter(p => p.likelyClientRendered).length,
        }
        const contentTruncated = discoveryLimitReached || deferredPages > 0 ||
            captureDiagnostics.failedOrEmptyPages > 0 || captureDiagnostics.truncatedPages > 0 ||
            captureDiagnostics.clientRenderedPages > 0
        console.log('[analyze] Capture diagnostics:', captureDiagnostics)

        console.log(`[analyze] Merged ${mergedBlocks.length} blocks (${priceCount} price lines, ${promoCount} promo lines) from ${validPages.length} pages. Saving...`)

        const previousCache = body?.refresh === true ? {} : (c.seo_raw as any)?.analysisCache ?? {}
        const rawSnapshot = { finalUrl: c.website, title: firstPage.title, pagesScraped: validPages.length, blocks: mergedBlocks, contentTruncated, analysisCache: previousCache, captureDiagnostics }
        // Retain source references and previous cache even on scrape-only requests.
        await supabase.from('competitors').update({
            status: 'scraped',
            seo_raw: rawSnapshot,
            last_scraped_at: new Date().toISOString(),
            error: null
        }).eq('id', c.id)

        if (!useAi) {
            results.push({ name: c.name, ok: true, reason: 'scraped' })
            continue
        }

        console.log(`[analyze] Calling Gemini for ${c.name}...`)
        try {
            const analysis = await analyzeCompetitorSite(config.geminiApiKey as string, validPages, { previousCache, incompleteCapture: contentTruncated, captureDiagnostics })

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
                console.warn(`[analyze] ${c.name}: incomplete coverage`, analysis.coverage)
            }

            stripPromoPrices(analysis.intelligence, promoAmounts, realAmounts)

            const { error: saveError } = await supabase.from('competitors').update({
                status: 'analyzed',
                intelligence: analysis.intelligence,
                seo_raw: { ...rawSnapshot, analysisCache: analysis.cache, analysisMeta: { coverage: analysis.coverage, parts: analysis.parts, truncated: analysis.truncated, status: analysis.status, tokens: analysis.tokens, modelsUsed: analysis.modelsUsed }, evidence: analysis.evidence },
                last_analyzed_at: new Date().toISOString(),
                error: analysis.status === 'partial'
                    ? `Partial analysis: ${analysis.parts.failed} failed, ${analysis.coverage.omittedParts} omitted (page limit: ${analysis.coverage.omittedByPageLimit}, run budget: ${analysis.coverage.omittedByRunBudget}); ${captureDiagnostics.deferredPages} pages deferred, ${captureDiagnostics.failedOrEmptyPages} pages failed or empty, ${captureDiagnostics.truncatedPages} pages truncated, ${captureDiagnostics.clientRenderedPages} possibly client-rendered; discovery cap: ${captureDiagnostics.discoveryLimitReached ? "reached" : "not reached"}; synthesis: ${analysis.coverage.synthesisOk ? "ok" : "failed"}`
                    : null,
            }).eq('id', c.id)
            if (saveError) throw new Error(saveError.message)
            results.push({ name: c.name, ok: true, reason: analysis.status })
        } catch (e: any) {
            await supabase.from('competitors').update({ status: 'failed', error: e.message }).eq('id', c.id)
            results.push({ name: c.name, ok: false, reason: e.message })
        }
    }

    return { results }
})