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
    paragraphs: ElementRef[]      // first ~6 visible <p> inside <main>, used by AI
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
    wordCount: number
    likelyClientRendered: boolean
    bodySnippet: string
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

/**
 * Selector for subtrees that render nothing to a sighted user.
 * Tailwind's `.hidden`/`.md:hidden`/`.sr-only`, explicit `aria-hidden`,
 * and inline `display:none` are the common cases. Stripped before reading text.
 */
const HIDDEN_SELECTOR =
    '.hidden, [hidden], [aria-hidden="true"], .sr-only, [style*="display:none"], [style*="display: none"], [style*="visibility:hidden"], [style*="visibility: hidden"]'


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

    // ---- headings (before stripping nav/footer so refs stay valid) ----
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
    for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i]! - headingLevels[i - 1]! > 1) {
            const el = allHeadingEls[i]
            if (el) evidence.headingSkip.push(refFor(html, el, $))
            break
        }
    }

    // ---- strip noise, then read visible content ----
    // Scripts/styles/etc. never contribute visible text.
    $('script, style, noscript, template, svg').remove()
    // Hidden subtrees (Tailwind .hidden, .sr-only, aria-hidden="true", inline
    // display:none) are still in the DOM for responsive layouts. Dropping them
    // before text extraction keeps wordCount and bodySnippet honest.
    $(HIDDEN_SELECTOR).remove()

    const bodyText = collapse($('body').text())
    const wordCount = bodyText ? bodyText.split(' ').length : 0
    const mainText = collapse($('main').first().text())
    const snippetSource = mainText.length >= 200 ? mainText : bodyText
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

    // Paragraph evidence for AI (first 6 visible <p> inside main, capped)
    const mainScope = $('main').length ? $('main') : $('body')
    mainScope.find('p').each((_, el) => {
        if (evidence.paragraphs.length >= 6) return
        const text = visibleText($(el), 200)
        if (text.length < 20) return
        evidence.paragraphs.push(refFor(html, el as Element, $, { maxText: 200 }))
    })

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
        bodySnippet: snippetSource.slice(0, SNIPPET_CHARS),
        evidence,
    }
}