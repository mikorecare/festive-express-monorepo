import type { CheerioAPI } from 'cheerio'

export const PRICE_RE = /\$\s?\d[\d,]*(?:\.\d{1,2})?/

// Finds short leaf elements containing a price and labels each with the nearest heading,
// e.g. "Joy: $1,299"
export function extractPriceTexts($: CheerioAPI): string[] {
    const out: string[] = []
    const seen = new Set<string>()
    $('body *').each((_, el) => {
        const $el = $(el)
        if ($el.children().length > 0) return
        if (['script', 'style', 'noscript'].includes((el as any).tagName)) return
        const text = $el.text().replace(/\s+/g, ' ').trim()
        if (!text || text.length > 120 || !PRICE_RE.test(text)) return

        let heading = ''
        let node = $el
        for (let i = 0; i < 5 && !heading; i++) {
            node = node.parent()
            if (!node.length) break
            heading = node.find('h1,h2,h3,h4,h5').first().text().replace(/\s+/g, ' ').trim()
        }
        const line = heading && !text.includes(heading) ? `${heading}: ${text}` : text
        if (!seen.has(line)) {
            seen.add(line)
            out.push(line)
        }
    })
    return out
}
