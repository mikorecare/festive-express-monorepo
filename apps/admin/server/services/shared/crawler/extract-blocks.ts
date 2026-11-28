import * as cheerio from 'cheerio'
import { collapse } from '../text'
import type { ContentBlock } from './types'
import type { Element } from 'domhandler'
import { makeLineIndexer, blockSelector } from './element-refs'
import { BLOCK_SELECTOR, MAX_BLOCKS, MAX_CONTENT_CHARS, NESTED_PARENTS, TEXT_MAX_HEADING, TEXT_MAX_LIST, TEXT_MAX_DEFAULT } from './config'

export function blockText($el: cheerio.Cheerio<any>, tag: string): string {
    if (tag === 'ul' || tag === 'ol') {
        const items = $el
            .find('li')
            .toArray()
            .map((li) => collapse(cheerio.load('')(li).text()))
            .filter(Boolean)
        if (items.length) return items.join(' • ')
    }
    if (tag === 'table') {
        const rows = $el
            .find('tr')
            .toArray()
            .map((tr) =>
                cheerio
                    .load('')(tr)
                    .find('th, td')
                    .toArray()
                    .map((c) => collapse(cheerio.load('')(c).text()))
                    .filter(Boolean)
                    .join(' | '),
            )
            .filter(Boolean)
        if (rows.length) return rows.join(' ; ')
    }
    return collapse($el.text())
}

export function extractBlocks(
    $: cheerio.CheerioAPI,
    $root: cheerio.Cheerio<any>,
    html: string,
): { blocks: ContentBlock[]; truncated: boolean } {
    const rootEl = $root[0] as Element | undefined
    const blocks: ContentBlock[] = []
    if (!rootEl) return { blocks, truncated: false }

    const lineAt = makeLineIndexer(html)
    let cursor = 0
    let chars = 0
    let truncated = false

    $root.find(BLOCK_SELECTOR).each((_, node) => {
        if (blocks.length >= MAX_BLOCKS || chars >= MAX_CONTENT_CHARS) {
            truncated = true
            return false
        }
        const el = node as Element
        const tag = (el.tagName as string).toLowerCase()
        const $el = $(el)
        const isHeading = /^h[1-6]$/.test(tag)

        // Only leaf-ish divs: anything with block children is covered by those children.
        if (tag === 'div' && $el.find(BLOCK_SELECTOR).length > 0) return
        // Nested inside a block we already take whole (li in ul, p in blockquote, ...).
        if ($el.parentsUntil(rootEl).filter(NESTED_PARENTS).length > 0) return

        let text = blockText($el, tag)
        const minLen = isHeading ? 2 : tag === 'div' ? 25 : 15
        if (text.length < minLen) return

        const max = isHeading
            ? TEXT_MAX_HEADING
            : tag === 'ul' || tag === 'ol' || tag === 'table'
                ? TEXT_MAX_LIST
                : TEXT_MAX_DEFAULT
        if (text.length > max) text = `${text.slice(0, max).trimEnd()}…`

        const needle = ($.html(el) || '').slice(0, 40)
        const at = needle ? html.indexOf(needle, cursor) : -1
        let line = 0
        if (at >= 0) {
            line = lineAt(at)
            cursor = at + 1
        }

        blocks.push({
            id: `b${blocks.length}`,
            tag,
            level: isHeading ? Number(tag[1]) : 0,
            selector: blockSelector($el, tag),
            line,
            text,
        })
        chars += text.length
    })

    return { blocks, truncated: truncated || blocks.length >= MAX_BLOCKS }
}
