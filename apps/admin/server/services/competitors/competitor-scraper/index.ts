import * as cheerio from 'cheerio'
import { fetchWithTimeout } from '../../shared/crawler/fetch'
import { MAX_HTML_CHARS, SNIPPET_CHARS } from '../../shared/crawler/config'
import { collapse } from '../../shared/text'
import { extractMarketingContent } from './content'
import { extractMoneyFromDocument } from './pricing'
import type { CompetitorScrapedPage } from './types'

export type { CompetitorScrapedPage, MarketingContentBlock } from './types'
export { extractMoneyLines } from './pricing'
export { extractMarketingContent } from './content'

export async function scrapeCompetitorPage(url: string): Promise<CompetitorScrapedPage> {
    const page: CompetitorScrapedPage = { url, finalUrl: url, status: 0, fetchError: null,
        title: '', blocks: [], bodySnippet: '', contentTruncated: false,
        likelyClientRendered: false, priceLines: [], promoLines: [] }
    try {
        const res = await fetchWithTimeout(url)
        page.finalUrl = res.url || url
        page.status = res.status
        const type = res.headers.get('content-type') || ''
        if (!res.ok || (type && !/html|xhtml/i.test(type))) {
            await res.body?.cancel().catch(() => {})
            page.fetchError = !res.ok ? `HTTP ${res.status}` : `Not HTML (${type})`
            return page
        }
        // Stream bytes so oversized responses are not fully buffered.
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let html = '', bytes = 0
        if (reader) {
            try {
                for (;;) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const remaining = MAX_HTML_CHARS - bytes
                    if (value.length > remaining) {
                        html += decoder.decode(value.subarray(0, remaining), { stream: true })
                        page.contentTruncated = true
                        await reader.cancel()
                        break
                    }
                    bytes += value.length
                    html += decoder.decode(value, { stream: true })
                }
                html += decoder.decode()
            } finally { reader.releaseLock() }
        }
        const $ = cheerio.load(html)
        page.title = collapse($('title').first().text())
        const money = extractMoneyFromDocument($)
        page.priceLines = money.prices
        page.promoLines = money.promos
        const extracted = extractMarketingContent($, page.finalUrl)
        page.blocks = extracted.blocks
        page.contentTruncated ||= extracted.truncated
        const text = page.blocks.map(b => b.text).join(' ')
        page.bodySnippet = text.slice(0, SNIPPET_CHARS)
        page.likelyClientRendered = text.split(/\s+/).filter(Boolean).length < 80 && !!$('#__nuxt,#app,#root,#__next').length
        return page
    } catch (error) {
        page.fetchError = error instanceof Error ? error.message : String(error)
        return page
    }
}
