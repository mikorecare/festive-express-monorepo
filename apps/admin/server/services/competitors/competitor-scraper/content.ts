import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import { collapse } from '../../shared/text'
import { blockSelector } from '../../shared/crawler/element-refs'
import { HIDDEN_SELECTOR, MAX_BLOCKS, MAX_CONTENT_CHARS, TEXT_MAX_DEFAULT } from '../../shared/crawler/config'
import type { MarketingContentBlock } from './types'

const structural = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,td,th,div,section,article,header,footer,nav,aside,main,details,summary,form,label,button,a,br'
const excluded = 'script,style,noscript,template,svg,iframe,object'

export function extractMarketingContent($: cheerio.CheerioAPI, sourceUrl: string) {
    $(excluded).remove()
    const blocks: MarketingContentBlock[] = []
    let chars = 0
    let truncated = false
    const emit = (el: Element, raw: string, href?: string) => {
        let text = collapse(raw)
        if (!text) return
        const $el = $(el)
        const tag = el.tagName.toLowerCase()
        const region: MarketingContentBlock['region'] = $el.closest('[role="alert"],[role="banner"],.announcement,.topbar,.promo-banner').length ? 'banner'
            : $el.closest('nav,[role="navigation"]').length ? 'navigation'
            : $el.closest('footer,[role="contentinfo"]').length ? 'footer'
            : $el.closest('header').length ? 'header'
            : $el.closest('main,[role="main"]').length ? 'main' : 'other'
        const potentiallyHidden = !!$el.closest(HIDDEN_SELECTOR).length
        while (text) {
            if (blocks.length >= MAX_BLOCKS || chars >= MAX_CONTENT_CHARS) { truncated = true; return }
            const max = Math.min(TEXT_MAX_DEFAULT, MAX_CONTENT_CHARS - chars)
            let cut = Math.min(max, text.length)
            if (cut < text.length) {
                const space = text.lastIndexOf(' ', cut)
                if (space > cut / 2) cut = space
            }
            const part = text.slice(0, cut).trim()
            text = text.slice(cut).trimStart()
            if (!part) continue
            blocks.push({ id: `b${blocks.length}`, tag, level: /^h[1-6]$/.test(tag) ? Number(tag[1]) : 0,
                selector: blockSelector($el, tag), line: 0, text: potentiallyHidden ? `[Potentially hidden HTML] ${part}` : part, region, sourceUrl,
                ...(href ? { href } : {}), ...(potentiallyHidden ? { potentiallyHidden } : {}) })
            chars += part.length
        }
    }
    // Walk in document order, grouping inline text but retaining short standalone CTAs.
    const walk = (el: Element) => {
        if (truncated) return
        const $el = $(el)
        const tag = el.tagName.toLowerCase()
        if (tag === 'input') {
            if (/^(submit|button)$/i.test($el.attr('type') || '')) emit(el, $el.attr('value') || $el.attr('aria-label') || '')
            return
        }
        let pending = ''
        const flush = () => { emit(el, pending, tag === 'a' ? $el.attr('href') : undefined); pending = '' }
        for (const child of el.children) {
            if (truncated) break
            if (child.type === 'text') pending += child.data
            else if (child.type === 'tag') {
                const $child = $(child)
                if ( $child.is(structural) || $child.find(structural).length || $child.is('input') || $child.is(HIDDEN_SELECTOR) || $child.find(HIDDEN_SELECTOR).length) {
                    flush(); walk(child)
                } else if ($child.is('img')) {
                    // Do not claim a photograph was viewed; only preserve its provided description.
                    const alt = $child.attr('alt')
                    if (alt) { flush(); emit(child, `[Image description: ${alt}]`) }
                } else pending += $child.text()
            }
        }
        flush()
        if ((tag === 'a' || tag === 'button') && !$el.text().trim()) {
            emit(el, $el.attr('aria-label') || $el.attr('title') || '', tag === 'a' ? $el.attr('href') : undefined)
        }
    }
    const body = $('body')[0]
    if (body) walk(body)
    const seen = new Set<string>()
    const unique = blocks.filter(b => {
        const key = JSON.stringify([b.region, b.tag, b.text.toLowerCase(), b.href, b.potentiallyHidden])
        if (seen.has(key)) return false
        seen.add(key); return true
    })
    // Keep IDs stable within this extracted snapshot even after deduplication.
    return { blocks: unique, truncated }
}
