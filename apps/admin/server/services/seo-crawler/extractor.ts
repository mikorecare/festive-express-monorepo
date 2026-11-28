import type { ExtractedPageData } from '../shared/crawler/types'
import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import { collapse } from '../shared/text'
import { emptyEvidence } from './evidence'
import { refFor, visibleText } from '../shared/crawler/element-refs'
import { HIDDEN_SELECTOR, CHROME_SELECTOR, SNIPPET_CHARS } from '../shared/crawler/config'
import { extractBlocks } from '../shared/crawler/extract-blocks'

/** Parse the already downloaded HTML; no network requests. */
export function extractSeoPage(
    url: string,
    html: string,
    base: { finalUrl: string; status: number; ttfbMs: number },
    loadTimeMs: number,
    headers: Headers,
): ExtractedPageData {
    const $ = cheerio.load(html)
    const metaContent = (attr: 'name' | 'property', value: string) =>
        $('meta')
            .filter((_, el) => ($(el).attr(attr) || '').toLowerCase() === value)
            .first()
            .attr('content')
            ?.trim() || ''

    // ---- head-level data + evidence ----
    const titleEl = ($('head > title').first()[0] ?? $('title').first()[0]) as Element | undefined
    const title = collapse($(titleEl).text())
    const descEl = $('meta[name="description"]')[0] as Element | undefined
    const metaDescription = collapse(metaContent('name', 'description'))

    const canonicalEl = $('link')
        .filter((_, el) =>
            ($(el).attr('rel') || '').toLowerCase().split(/\s+/).includes('canonical'),
        )
        .first()[0] as Element | undefined
    const rawCanonical = canonicalEl ? $(canonicalEl).attr('href')?.trim() : undefined
    let canonical: string | null = null
    if (rawCanonical) {
        try {
            canonical = new URL(rawCanonical, base.finalUrl).toString()
        } catch {
            canonical = rawCanonical
        }
    }

    const robots =
        [
            metaContent('name', 'robots'),
            metaContent('name', 'googlebot'),
            headers.get('x-robots-tag') || '',
        ]
            .filter(Boolean)
            .join(', ')
            .toLowerCase() || null

    const htmlEl = $('html')[0] as Element | undefined
    const lang = htmlEl ? ($(htmlEl).attr('lang') || '').trim() || null : null
    const viewportEl = $('meta[name="viewport"]')[0] as Element | undefined
    const hasViewport = Boolean(viewportEl)
    const hasOgTags = Boolean(metaContent('property', 'og:title') && metaContent('property', 'og:image'))

    // ---- evidence: head ----
    const evidence = emptyEvidence()
    evidence.title = titleEl ? refFor(html, titleEl, $) : null
    evidence.metaDescription = descEl ? refFor(html, descEl, $) : null
    evidence.canonical = canonicalEl ? refFor(html, canonicalEl, $) : null
    evidence.lang = htmlEl ? refFor(html, htmlEl, $, { maxHtml: 120 }) : null
    evidence.viewport = viewportEl ? refFor(html, viewportEl, $) : null

    // ---- images ----
    let totalImages = 0
    let missingAltCount = 0
    $('img').each((_, el) => {
        const $el = $(el)
        const role = ($el.attr('role') || '').toLowerCase()
        if ($el.attr('aria-hidden') === 'true' || role === 'presentation' || role === 'none') return
        if ($el.attr('width') === '1' && $el.attr('height') === '1') return
        totalImages++
        if ($el.attr('alt') === undefined) {
            missingAltCount++
            if (evidence.missingAlt.length < 10) {
                evidence.missingAlt.push(refFor(html, el as Element, $))
            }
        }
    })

    // ---- structured data ----
    let schemaCount = 0
    let invalidSchemaCount = 0
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            JSON.parse($(el).html() || '')
            schemaCount++
        } catch {
            invalidSchemaCount++
            evidence.jsonLd.push(refFor(html, el as Element, $))
        }
    })

    // ---- OG tags ----
    $('meta[property^="og:"]').each((_, el) => {
        evidence.ogTags.push(refFor(html, el as Element, $))
    })

    // ---- headings (before stripping so refs stay valid) ----
    const h1Els = $('h1').toArray() as Element[]
    const h2Els = $('h2').toArray() as Element[]

    // Headings use visible text only, so a heading that lives entirely inside
    // a `.hidden` / `[aria-hidden="true"]` wrapper is treated as absent.
    const h1s = h1Els.map((el) => visibleText($(el), 300)).filter(Boolean)
    const h2s = h2Els.map((el) => visibleText($(el), 300)).filter(Boolean)

    const allHeadingEls = $('h1, h2, h3, h4, h5, h6').toArray() as Element[]
    const headingLevels = allHeadingEls
        .map((el) => Number((el.tagName as string)?.[1]))
        .filter((n) => n >= 1 && n <= 6)

    // H1 evidence
    if (h1Els.length === 0) {
        const anchor = ($('main')[0] ?? $('body')[0]) as Element | undefined
        if (anchor) evidence.noH1.push(refFor(html, anchor, $))
    } else if (h1Els.length > 1) {
        h1Els.slice(1).forEach((el) => evidence.multipleH1.push(refFor(html, el, $)))
    }

    // Heading-skip evidence
    let skips = 0
    for (let i = 1; i < headingLevels.length && skips < 5; i++) {
        if (headingLevels[i]! - headingLevels[i - 1]! > 1) {
            const el = allHeadingEls[i]
            if (el) {
                evidence.headingSkip.push(refFor(html, el, $))
                skips++
            }
        }
    }

    // ---- strip noise, then read visible content ----
    // Scripts/styles/etc. never contribute visible text.
    $('script, style, noscript, template, svg').remove()
    // Hidden subtrees (Tailwind .hidden, .sr-only, aria-hidden="true", inline
    // display:none) are still in the DOM for responsive layouts.
    $(HIDDEN_SELECTOR).remove()
    // Site chrome. A <header> is only chrome when it has no H1 and is link-heavy,
    // so hero headers inside the page survive.
    $('header').each((_, el) => {
        const $h = $(el)
        if ($h.find('h1').length) return
        if ($h.find('nav').length || $h.find('a[href]').length >= 4) $h.remove()
    })
    $(CHROME_SELECTOR).remove()

    // Content root: <main> if it holds real content, otherwise the cleaned <body>.
    const bodyText = collapse($('body').text())
    const mainEl = $('main').first()
    const mainText = collapse(mainEl.text())
    const mainWords = mainText ? mainText.split(' ').length : 0
    const useMain = mainEl.length > 0 && mainWords >= 40
    const $root = useMain ? mainEl : $('body')
    const contentText = useMain ? mainText : bodyText

    const wordCount = contentText ? contentText.split(' ').length : 0
    const likelyClientRendered = wordCount < 80 && $('#__nuxt, #app, #root, #__next').length > 0

    // Thin-content evidence
    if (wordCount < 100) {
        const wrap = ($('main')[0] ?? $('body')[0]) as Element | undefined
        if (wrap) evidence.thinContent = refFor(html, wrap, $, { maxText: 160 })
    }

    // Hero evidence: first <h2> or <p> inside main / hero-ish container
    const heroContainer = $('main, section.hero, header.hero, [class*="hero"]').first()
    if (heroContainer.length) {
        const heroEl = heroContainer.find('h2, p').first()[0] as Element | undefined
        if (heroEl) evidence.hero = refFor(html, heroEl, $)
    }

    // First visible paragraphs (kept for compatibility)
    const mainScope = $('main').length ? $('main') : $('body')
    mainScope.find('p').each((_, el) => {
        if (evidence.paragraphs.length >= 6) return
        const text = visibleText($(el), 200)
        if (text.length < 20) return
        evidence.paragraphs.push(refFor(html, el as Element, $, { maxText: 200 }))
    })

    // The whole content, in order, for chunked AI review
    const { blocks, truncated } = extractBlocks($, $root, html)

    return {
        url,
        finalUrl: base.finalUrl,
        status: base.status,
        fetchError: null,
        loadTimeMs,
        ttfbMs: base.ttfbMs,
        title,
        metaDescription,
        canonical,
        robots,
        lang,
        hasViewport,
        h1s,
        h2s: h2s.slice(0, 10),
        headingLevels,
        missingAltCount,
        totalImages,
        hasOgTags,
        schemaCount,
        invalidSchemaCount,
        wordCount,
        likelyClientRendered,
        bodySnippet: contentText.slice(0, SNIPPET_CHARS),
        blocks,
        contentTruncated: truncated,
        evidence,
    }
}
