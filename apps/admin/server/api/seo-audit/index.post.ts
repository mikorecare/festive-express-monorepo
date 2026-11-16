import pLimit from 'p-limit'
import { generateFullSeoReport } from '~~/server/utils/seo-analyzer'
import { discoverSiteUrls, scrapePageSeo } from '~~/server/utils/seo-crawler'
import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)

    const body = await readBody<{
        url: string
        /** 'site' = crawl sitemap (default), 'page' = scan this exact URL only */
        mode?: 'site' | 'page'
        maxPages?: number
        useAi?: boolean
        siteContext?: string
    }>(event)

    if (!body?.url) {
        throw createError({ statusCode: 400, statusMessage: 'Website URL is required' })
    }

    const useAi = body.useAi !== false
    if (useAi && !config.geminiApiKey) {
        throw createError({ statusCode: 500, statusMessage: 'GEMINI_API_KEY is not configured' })
    }

    const modelsConfig = (config as { geminiModels?: string }).geminiModels
    const models = modelsConfig
        ? modelsConfig.split(',').map((m) => m.trim()).filter(Boolean)
        : undefined

    const mode = body.mode === 'page' ? 'page' : 'site'
    const maxPages = Math.min(Math.max(Number(body.maxPages) || 15, 1), 50)

    // -------------------------------------------------------------------------
    // Discovery: single URL vs full crawl
    // -------------------------------------------------------------------------
    let urls: string[]
    if (mode === 'page') {
        // Normalize protocol, keep the exact path/query the user typed.
        const raw = body.url.trim()
        urls = [raw.startsWith('http') ? raw : `https://${raw}`]
    } else {
        urls = await discoverSiteUrls(body.url, maxPages)
    }

    if (urls.length === 0) {
        throw createError({ statusCode: 422, statusMessage: 'No pages could be discovered for this URL' })
    }

    const limit = pLimit(5)
    const scrapedPages = await Promise.all(
        urls.map((u) =>
            limit(() =>
                scrapePageSeo(u).catch((e) => {
                    console.error('[seo-audit] scrape threw for', u, e instanceof Error ? e.message : e)
                    // scrapePageSeo is written to never reject, but guard anyway.
                    return {
                        ...({} as any),
                        url: u,
                        finalUrl: u,
                        status: 0,
                        fetchError: 'Internal error while scraping this page',
                        loadTimeMs: 0,
                        ttfbMs: 0,
                        title: '',
                        metaDescription: '',
                        canonical: null,
                        robots: null,
                        lang: null,
                        hasViewport: false,
                        h1s: [],
                        h2s: [],
                        headingLevels: [],
                        missingAltCount: 0,
                        totalImages: 0,
                        hasOgTags: false,
                        schemaCount: 0,
                        invalidSchemaCount: 0,
                        wordCount: 0,
                        likelyClientRendered: false,
                        bodySnippet: '',
                        blocks: [],
                        contentTruncated: false,
                        evidence: {
                            missingAlt: [],
                            multipleH1: [],
                            noH1: [],
                            headingSkip: [],
                            thinContent: null,
                            hero: null,
                            title: null,
                            metaDescription: null,
                            canonical: null,
                            lang: null,
                            viewport: null,
                            ogTags: [],
                            jsonLd: [],
                            paragraphs: [],
                        },
                    } as ExtractedPageData
                }),
            ),
        ),
    )

    const { executiveSummary, pages, meta } = await generateFullSeoReport(
        scrapedPages,
        config.geminiApiKey,
        { models, useAi, siteContext: body.siteContext },
    )

    const counts = { critical: 0, warning: 0, info: 0 }
    for (const page of pages) for (const issue of page.issues) counts[issue.severity]++

    const scored = pages.filter((p) => !p.fetchError)
    const overallScore = Math.round(
        scored.reduce((sum, p) => sum + p.score, 0) / (scored.length || 1),
    )

    const report = {
        scannedAt: new Date().toISOString(),
        targetUrl: body.url,
        mode,
        overallScore,
        pagesFailed: pages.length - scored.length,
        counts,
        executiveSummary,
        pages,
        meta,
    }

    // -------------------------------------------------------------------------
    // Persist (unchanged from your current version)
    // -------------------------------------------------------------------------
    let auditId: string | null = null
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const accessToken = getCookie(event, 'sb-access-token')
        let userId: string | null = null
        if (accessToken) {
            const { data: userData } = await supabase.auth.getUser(accessToken)
            userId = userData?.user?.id ?? null
        }

        const { data: auditRow, error: auditErr } = await supabase
            .from('seo_audits')
            .insert({
                user_id: userId,
                target_url: body.url,
                site_context: body.siteContext ?? null,
                use_ai: useAi,
                overall_score: overallScore,
                pages_total: pages.length,
                pages_failed: report.pagesFailed,
                critical_count: counts.critical,
                warning_count: counts.warning,
                info_count: counts.info,
                executive_summary: executiveSummary,
                report,
                raw_pages: scrapedPages,
            })
            .select('id')
            .single()

        if (auditErr) {
            console.error('[seo-audit] failed to insert seo_audits:', auditErr.message)
        } else if (auditRow?.id) {
            auditId = auditRow.id
            const pageRows = pages.map((p) => {
                const c = { critical: 0, warning: 0, info: 0 }
                for (const i of p.issues) c[i.severity]++
                return {
                    audit_id: auditId,
                    url: p.url,
                    final_url: p.finalUrl,
                    status: p.status,
                    score: p.score,
                    load_time_ms: p.loadTimeMs,
                    fetch_error: p.fetchError,
                    ai_status: p.ai,
                    issue_count: p.issues.length,
                    critical_count: c.critical,
                    warning_count: c.warning,
                    info_count: c.info,
                    page: p,
                }
            })
            if (pageRows.length > 0) {
                const { error: pagesErr } = await supabase.from('seo_audit_pages').insert(pageRows)
                if (pagesErr) console.error('[seo-audit] failed to insert seo_audit_pages:', pagesErr.message)
            }
        }
    } catch (e) {
        console.error('[seo-audit] persistence error:', e instanceof Error ? e.message : e)
    }

    return { ...report, auditId }
})