import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import { XMLParser } from 'fast-xml-parser'
import pLimit from 'p-limit'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Points at a concrete element in the raw HTML so the report can say "here". */
export interface ElementRef {
    /** A reasonably stable CSS selector, e.g. 'img[src="/hero.jpg"]', 'h1', 'meta[name="description"]' */
    selector: string
    /** Outer HTML, trimmed to ~200 chars */
    html: string
    /** 1-based line number in the raw HTML where the element starts */
    line: number
    /** Text content if relevant (headings, paragraphs) */
    text?: string
}

/**
 * One piece of visible page content, in document order.
 * The whole page is kept as a flat list of these so the analyzer can cut it
 * into parts without losing order, and the AI can point at a block by id.
 */
export interface ContentBlock {
    /** Stable within one page: b0, b1, b2 ... */
    id: string
    /** h1-h6, p, ul, ol, dl, blockquote, table, figcaption, div */
    tag: string
    /** 1-6 for headings, 0 otherwise */
    level: number
    /** Readable selector, with :nth-of-type when siblings share the tag */
    selector: string
    /** 1-based line in the raw HTML, 0 if it could not be located */
    line: number
    /** Visible text (lists joined with " • ", tables with " | "), clipped */
    text: string
}

export interface PageEvidence {
    missingAlt: ElementRef[]      // first 10 images with no alt attribute
    multipleH1: ElementRef[]      // the *extra* H1s (not the first)
    noH1: ElementRef[]            // fallback anchor (<main> or <body>) when there's no H1
    headingSkip: ElementRef[]     // the offending heading
    thinContent: ElementRef | null // <main> or <body> wrapper when content is thin
    hero: ElementRef | null       // first <h2> or <p> inside <main>/hero section
    title: ElementRef | null
    metaDescription: ElementRef | null
    canonical: ElementRef | null
    lang: ElementRef | null
    viewport: ElementRef | null
    ogTags: ElementRef[]          // existing <meta property="og:*">
    jsonLd: ElementRef[]          // invalid JSON-LD <script> blocks
    paragraphs: ElementRef[]      // first ~6 visible <p> inside <main>
}

export interface ExtractedPageData {
    url: string
    finalUrl: string
    status: number
    fetchError: string | null
    loadTimeMs: number
    ttfbMs: number
    title: string
    metaDescription: string
    canonical: string | null
    robots: string | null
    lang: string | null
    hasViewport: boolean
    h1s: string[]
    h2s: string[]
    headingLevels: number[]
    missingAltCount: number
    totalImages: number
    hasOgTags: boolean
    schemaCount: number
    invalidSchemaCount: number
    /** Words in the main content only (nav, header chrome, footer, aside excluded) */
    wordCount: number
    likelyClientRendered: boolean
    /** First SNIPPET_CHARS of the main content (kept for compatibility / fallback) */
    bodySnippet: string
    /** The whole main content as ordered blocks, for chunked AI review */
    blocks: ContentBlock[]
    /** True when MAX_BLOCKS / MAX_CONTENT_CHARS cut the content short */
    contentTruncated: boolean
    /** Element-level evidence per issue kind */
    evidence: PageEvidence
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const USER_AGENT = 'Admin-SEO-Auditor/1.0'
const FETCH_TIMEOUT_MS = 12_000
const MAX_HTML_CHARS = 3_000_000
const MAX_SITEMAPS = 10
export const SNIPPET_CHARS = 1000
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|zip|gz|mp[34]|css|js|json|xml|txt|docx?|xlsx?|pptx?)$/i

/** Limits for the block list handed to the analyzer. */
const MAX_BLOCKS = 600
const MAX_CONTENT_CHARS = 120_000
const TEXT_MAX_HEADING = 200
const TEXT_MAX_LIST = 1200
const TEXT_MAX_DEFAULT = 700

/**
 * Selector for subtrees that render nothing to a sighted user.
 * Tailwind's `.hidden`/`.md:hidden`/`.sr-only`, explicit `aria-hidden`,
 * and inline `display:none` are the common cases. Stripped before reading text.
 */
const HIDDEN_SELECTOR =
    '.hidden, [hidden], [aria-hidden="true"], .sr-only, [style*="display:none"], [style*="display: none"], [style*="visibility:hidden"], [style*="visibility: hidden"]'

/** Site chrome that should not count as page content. */
const CHROME_SELECTOR =
    'nav, aside, footer, [role="navigation"], [role="contentinfo"], [role="banner"], [role="complementary"]'

const BLOCK_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, ul, ol, dl, blockquote, table, figcaption, div'
/** A block nested inside one of these is already covered by its parent block. */
const NESTED_PARENTS = 'ul, ol, dl, blockquote, table, p, h1, h2, h3, h4, h5, h6, figcaption'

const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, '')
const collapse = (s: string) => s.replace(/\s+/g, ' ').trim()

export function urlKey(raw: string): string {
    try {
        const u = new URL(raw)
        const path = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') || '/' : '/'
        return `${u.protocol}//${stripWww(u.hostname)}${path}${u.search}`
    } catch {
        return raw
    }
}

function fetchWithTimeout(url: string, init: RequestInit = {}) {
    return fetch(url, {
        ...init,
        redirect: 'follow',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ...init.headers,
        },
    })
}

// ---------------------------------------------------------------------------
// Element ref helpers
// ---------------------------------------------------------------------------

function lineOf(html: string, needle: string): number {
    const idx = html.indexOf(needle)
    if (idx < 0) return 0
    let line = 1
    for (let i = 0; i < idx; i++) if (html.charCodeAt(i) === 10) line++
    return line
}

/** O(log n) position -> 1-based line lookup, built once per page. */
function makeLineIndexer(html: string) {
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
function visibleText($el: cheerio.Cheerio<any>, maxText: number): string {
    const cleaned = $el.clone()
    cleaned.find(HIDDEN_SELECTOR).remove()
    return cleaned.text().replace(/\s+/g, ' ').trim().slice(0, maxText)
}

function refFor(
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

const cssEscape = (s: string) => s.replace(/[^\w-]/g, '\\$&')

/** Selector for content blocks: tag + id/first class, plus :nth-of-type when ambiguous. */
function blockSelector($el: cheerio.Cheerio<any>, tag: string): string {
    const id = $el.attr('id')
    if (id) return `${tag}#${cssEscape(id)}`
    const cls = ($el.attr('class') || '').split(/\s+/).filter(Boolean)[0]
    let selector = cls ? `${tag}.${cssEscape(cls)}` : tag
    const siblings = $el.parent().children(tag)
    if (siblings.length > 1) selector += `:nth-of-type(${siblings.index($el) + 1})`
    return selector
}

function emptyEvidence(): PageEvidence {
    return {
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
    }
}

// ---------------------------------------------------------------------------
// Content blocks (whole page, in order)
// ---------------------------------------------------------------------------

function blockText($el: cheerio.Cheerio<any>, tag: string): string {
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

function extractBlocks(
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

// ---------------------------------------------------------------------------
// Discovery (sitemaps + BFS fallback)
// ---------------------------------------------------------------------------

export async function discoverSiteUrls(inputUrl: string, maxPages = 30): Promise<string[]> {
    const normalized = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`
    const entry = new URL(normalized)
    const found = new Map<string, string>()

    const tryAdd = (raw: string, base?: string, stripQuery = false): string | null => {
        if (found.size >= maxPages) return null
        let u: URL
        try {
            u = new URL(raw, base)
        } catch {
            return null
        }
        if (!/^https?:$/.test(u.protocol)) return null
        if (stripWww(u.hostname) !== stripWww(entry.hostname)) return null
        if (SKIP_EXT.test(u.pathname)) return null
        u.hash = ''
        if (stripQuery) u.search = ''
        const key = urlKey(u.toString())
        if (found.has(key)) return null
        found.set(key, u.toString())
        return u.toString()
    }

    const parser = new XMLParser()
    const visited = new Set<string>()
    const asArray = <T,>(v: T | T[] | undefined | null): T[] =>
        v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]
    const locOf = (node: any): string | null => (typeof node?.loc === 'string' ? node.loc.trim() : null)

    async function readSitemap(sitemapUrl: string) {
        if (visited.has(sitemapUrl) || visited.size >= MAX_SITEMAPS || found.size >= maxPages) return
        visited.add(sitemapUrl)
        try {
            const res = await fetchWithTimeout(sitemapUrl)
            if (!res.ok) return
            const parsed = parser.parse(await res.text())
            for (const sub of asArray<any>(parsed?.sitemapindex?.sitemap)) {
                const loc = locOf(sub)
                if (loc) await readSitemap(loc)
            }
            for (const item of asArray<any>(parsed?.urlset?.url)) {
                const loc = locOf(item)
                if (loc) tryAdd(loc)
            }
        } catch {
            // sitemap unavailable
        }
    }

    const sitemapCandidates: string[] = []
    try {
        const res = await fetchWithTimeout(`${entry.origin}/robots.txt`)
        if (res.ok) {
            for (const m of (await res.text()).matchAll(/^\s*sitemap:\s*(\S+)/gim)) {
                if (m[1]) sitemapCandidates.push(m[1])
            }
        }
    } catch {
        // no robots.txt
    }
    sitemapCandidates.push(`${entry.origin}/sitemap.xml`)
    for (const s of sitemapCandidates) await readSitemap(s)

    if (found.size === 0) {
        tryAdd(normalized)
        let frontier = [normalized]
        for (let depth = 0; depth < 2 && frontier.length > 0 && found.size < maxPages; depth++) {
            const limit = pLimit(5)
            const next: string[] = []
            await Promise.all(
                frontier.map((pageUrl) =>
                    limit(async () => {
                        try {
                            const res = await fetchWithTimeout(pageUrl)
                            const type = res.headers.get('content-type') || ''
                            if (!res.ok || (type && !/html/i.test(type))) return
                            const $ = cheerio.load(await res.text())
                            $('a[href]').each((_, el) => {
                                const href = $(el).attr('href')?.trim()
                                if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return
                                if (($(el).attr('rel') || '').toLowerCase().includes('nofollow')) return
                                const added = tryAdd(href, res.url || pageUrl, true)
                                if (added) next.push(added)
                            })
                        } catch {
                            // skip
                        }
                    }),
                ),
            )
            frontier = next
        }
    }

    return Array.from(found.values()).slice(0, maxPages)
}

// ---------------------------------------------------------------------------
// Scrape
// ---------------------------------------------------------------------------

function emptyPage(url: string, init: Partial<ExtractedPageData> = {}): ExtractedPageData {
    return {
        url,
        finalUrl: url,
        status: 0,
        fetchError: null,
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
        evidence: emptyEvidence(),
        ...init,
    }
}

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
            res.headers.get('x-robots-tag') || '',
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
        ttfbMs,
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