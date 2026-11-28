import * as cheerio from 'cheerio'
import { collapse } from '../../shared/text'

const MAX_LINES = 40
const AMOUNT_RE = /\$\s?\d[\d,]*(?:\.\d{1,2})?/
// Used to name a price when its card has no heading tag
const LABEL_FALLBACK = '[class*="title"], [class*="name"], strong, b'

/** Wording that makes an amount a promotion rather than a price. */
const PROMO_WORDS = new RegExp(
    [
        '\\boff\\b',
        '\\bsav(?:e|es|ed|ing|ings)\\b',
        '\\bdiscount(?:s|ed)?\\b',
        '\\bpromo(?:s|tion|tions|tional)?\\b',
        '\\bcoupon(?:s)?\\b',
        '\\bvoucher(?:s)?\\b',
        '\\brebate(?:s)?\\b',
        '\\bgift\\s?card(?:s)?\\b',
        '\\bbonus\\b',
        '\\bcash\\s?back\\b',
        '\\blimited[\\s-]?time\\b',
        '\\bsale\\b',
        '\\breward(?:s)?\\b',
        '\\breferral\\b',
        '\\b(?:use|enter|apply)\\s+(?:the\\s+)?(?:promo\\s+|coupon\\s+|discount\\s+)?code\\b',
    ].join('|'),
    'i',
)

/** Class/id names of containers that hold announcements, not products. */
const PROMO_CONTAINER = /ticker|marquee|announce|promo|coupon|topbar|top-bar|ribbon|countdown|discount|voucher|popup|modal|toast/i

/** schema.org prices (Product/Offer), e.g. "Joy: $1299" */
function jsonLdPriceLines($: cheerio.CheerioAPI): string[] {
    const out: string[] = []
    $('script[type="application/ld+json"]').each((_, el) => {
        let data: unknown
        try {
            data = JSON.parse($(el).html() || '')
        } catch {
            return
        }
        const walk = (node: any, inheritedName = ''): void => {
            if (!node || typeof node !== 'object') return
            if (Array.isArray(node)) {
                node.forEach((n) => walk(n, inheritedName))
                return
            }
            const name = typeof node.name === 'string' ? node.name : inheritedName
            const price = node.price ?? node.lowPrice
            if (price !== undefined && price !== null && String(price).trim() !== '') {
                const cur = typeof node.priceCurrency === 'string' ? node.priceCurrency : 'USD'
                out.push(`${name || 'Item'}: ${cur === 'USD' ? '$' : `${cur} `}${price}`)
            }
            for (const v of Object.values(node)) walk(v, name)
        }
        walk(data)
    })
    return out
}

/** True when the amount sits inside a ticker / banner / popup style container. */
function inPromoContainer($: cheerio.CheerioAPI, el: any): boolean {
    const chain = [el, ...$(el).parents().toArray().slice(0, 8)]
    return chain.some((n: any) => {
        const tag = String(n.tagName || '').toLowerCase()
        if (tag === 'marquee') return true
        const sig = `${n.attribs?.class ?? ''} ${n.attribs?.id ?? ''}`
        if (PROMO_CONTAINER.test(sig)) return true
        const role = String(n.attribs?.role ?? '').toLowerCase()
        return role === 'alert' || role === 'marquee' || role === 'timer'
    })
}

export function extractMoneyLines(html: string): { prices: string[]; promos: string[] } {
    return extractMoneyFromDocument(cheerio.load(html))
}

export function extractMoneyFromDocument($: cheerio.CheerioAPI): { prices: string[]; promos: string[] } {
    const prices: string[] = []
    const promos: string[] = []
    const seenPrices = new Set<string>()
    const seenPromos = new Set<string>()
    const addPrice = (line: string) => {
        const l = collapse(line)
        if (l && !seenPrices.has(l) && prices.length < MAX_LINES) {
            seenPrices.add(l)
            prices.push(l)
        }
    }
    const addPromo = (line: string) => {
        const l = collapse(line).slice(0, 160)
        if (l && !seenPromos.has(l) && promos.length < MAX_LINES) {
            seenPromos.add(l)
            promos.push(l)
        }
    }

    // 1. Structured data (schema.org offers are real prices)
    for (const l of jsonLdPriceLines($)) addPrice(l)

    // 2. Money amounts in short leaf elements
    $('body *').each((_, el) => {
        const $el = $(el)
        if ($el.closest('script,style,noscript,template,svg').length) return
        if ($el.children().length > 0) return
        const text = collapse($el.text())
        if (!text || text.length > 120 || !AMOUNT_RE.test(text)) return

        // Context: climb until the ancestor holds more than just the amount (max 2 levels)
        let ctxNode = $el.parent()
        for (let i = 0; i < 2 && collapse(ctxNode.text()).length <= text.length + 2 && ctxNode.parent().length; i++) {
            ctxNode = ctxNode.parent()
        }
        const ctxText = collapse(ctxNode.text())
        const at = ctxText.indexOf(text)
        const around = at >= 0 ? ctxText.slice(Math.max(0, at - 80), at + text.length + 80) : text

        if (PROMO_WORDS.test(around) || inPromoContainer($, el)) {
            addPromo(ctxText.length <= 160 ? ctxText : around)
            return
        }

        // A price: name what it belongs to (nearest heading, else a title-like element, in a surrounding card)
        let label = ''
        let node = $el
        for (let i = 0; i < 5 && !label; i++) {
            node = node.parent()
            if (!node.length) break
            label = collapse(node.find('h1,h2,h3,h4,h5').first().text())
            if (!label) {
                const alt = node
                    .find(LABEL_FALLBACK)
                    .filter((_i, e) => {
                        const t = collapse($(e).text())
                        return t.length >= 2 && t.length <= 60 && !AMOUNT_RE.test(t)
                    })
                    .first()
                label = collapse(alt.text())
            }
        }
        label = label.slice(0, 80)
        addPrice(label && !text.includes(label) ? `${label}: ${text}` : text)
    })

    return { prices, promos }
}

