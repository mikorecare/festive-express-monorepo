

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
