import * as cheerio from 'cheerio'
import { HIDDEN_SELECTOR } from './config'
import type { Element } from 'domhandler'
import type { ElementRef } from './types'

export function lineOf(html: string, needle: string): number {
    const idx = html.indexOf(needle)
    if (idx < 0) return 0
    let line = 1
    for (let i = 0; i < idx; i++) if (html.charCodeAt(i) === 10) line++
    return line
}

/** O(log n) position -> 1-based line lookup, built once per page. */
export function makeLineIndexer(html: string) {
    const newlines: number[] = []
    for (let i = 0; i < html.length; i++) if (html.charCodeAt(i) === 10) newlines.push(i)
    return (pos: number) => {
        let lo = 0
        let hi = newlines.length
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (newlines[mid]! < pos) lo = mid + 1
            else hi = mid
        }
        return lo + 1
    }
}

/**
 * Read an element's visible text, ignoring hidden descendants.
 * Uses a clone so the live tree is untouched (refs may be read again later).
 */
export function visibleText($el: cheerio.Cheerio<any>, maxText: number): string {
    const cleaned = $el.clone()
    cleaned.find(HIDDEN_SELECTOR).remove()
    return cleaned.text().replace(/\s+/g, ' ').trim().slice(0, maxText)
}

export function refFor(
    rawHtml: string,
    el: Element,
    $: cheerio.CheerioAPI,
    opts: { maxHtml?: number; maxText?: number } = {},
): ElementRef {
    const $el = $(el)
    const maxHtml = opts.maxHtml ?? 200
    const maxText = opts.maxText ?? 120
    const outer = ($.html(el) || '').slice(0, maxHtml)
    const text = visibleText($el, maxText)

    // Try to build a selector that is both readable and reasonably unique.
    const tag = el.tagName as string
    const id = $el.attr('id')
    const cls = ($el.attr('class') || '').split(/\s+/).filter(Boolean)[0]
    let selector = tag
    if (id) selector = `${tag}#${id}`
    else if (cls) selector = `${tag}.${cls}`
    else if (tag === 'img' && $el.attr('src')) selector = `img[src="${$el.attr('src')}"]`
    else if (tag === 'meta' && $el.attr('name')) selector = `meta[name="${$el.attr('name')}"]`
    else if (tag === 'meta' && $el.attr('property')) selector = `meta[property="${$el.attr('property')}"]`
    else if (tag === 'link' && $el.attr('rel')) selector = `link[rel="${$el.attr('rel')}"]`

    return {
        selector,
        html: outer,
        line: lineOf(rawHtml, outer.slice(0, 60)),
        text: text || undefined,
    }
}

export const cssEscape = (s: string) => s.replace(/[^\w-]/g, '\\$&')

/** Selector for content blocks: tag + id/first class, plus :nth-of-type when ambiguous. */
export function blockSelector($el: cheerio.Cheerio<any>, tag: string): string {
    const id = $el.attr('id')
    if (id) return `${tag}#${cssEscape(id)}`
    const cls = ($el.attr('class') || '').split(/\s+/).filter(Boolean)[0]
    let selector = cls ? `${tag}.${cssEscape(cls)}` : tag
    const siblings = $el.parent().children(tag)
    if (siblings.length > 1) selector += `:nth-of-type(${siblings.index($el) + 1})`
    return selector
}
