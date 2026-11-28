import type { ExtractedPageData } from '../shared/crawler/types'
import { fetchWithTimeout } from '../shared/crawler/fetch'
import { emptyPage } from './empty-page'
import { FETCH_TIMEOUT_MS, MAX_HTML_CHARS } from '../shared/crawler/config'
import { extractSeoPage } from './extractor'

export async function scrapePageSeo(url: string): Promise<ExtractedPageData> {
    const start = performance.now()

    let res: Response
    try {
        res = await fetchWithTimeout(url)
    } catch (e: any) {
        return emptyPage(url, {
            fetchError:
                e?.name === 'TimeoutError'
                    ? `Timed out after ${FETCH_TIMEOUT_MS / 1000}s`
                    : e?.message || 'Request failed',
        })
    }

    const ttfbMs = Math.round(performance.now() - start)
    const base = { finalUrl: res.url || url, status: res.status, ttfbMs }

    if (res.status >= 400) {
        res.body?.cancel().catch(() => { })
        return emptyPage(url, { ...base, loadTimeMs: ttfbMs })
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType && !/html|xhtml/i.test(contentType)) {
        res.body?.cancel().catch(() => { })
        return emptyPage(url, {
            ...base,
            loadTimeMs: ttfbMs,
            fetchError: `Not an HTML page (${contentType.split(';')[0]})`,
        })
    }

    let html: string
    try {
        html = (await res.text()).slice(0, MAX_HTML_CHARS)
    } catch (e: any) {
        return emptyPage(url, {
            ...base,
            fetchError:
                e?.name === 'TimeoutError' ? 'Timed out while downloading the page' : 'Failed to read response body',
        })
    }
    const loadTimeMs = Math.round(performance.now() - start)

    return extractSeoPage(url, html, base, loadTimeMs, res.headers)
}

export type { ElementRef, ContentBlock, PageEvidence, ExtractedPageData } from '../shared/crawler/types'
export { SNIPPET_CHARS } from '../shared/crawler/config'
export { extractPriceTexts } from './pricing'
export { urlKey, discoverSiteUrls } from '../shared/crawler/discover'
