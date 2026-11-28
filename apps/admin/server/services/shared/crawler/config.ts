

export const USER_AGENT = 'Admin-SEO-Auditor/1.0'

export const FETCH_TIMEOUT_MS = 12_000

export const MAX_HTML_CHARS = 3_000_000

export const MAX_SITEMAPS = 10

export const SNIPPET_CHARS = 1000

export const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|zip|gz|mp[34]|css|js|json|xml|txt|docx?|xlsx?|pptx?)$/i

/** Limits for the block list handed to the analyzer. */
export const MAX_BLOCKS = 600

export const MAX_CONTENT_CHARS = 120_000

export const TEXT_MAX_HEADING = 200

export const TEXT_MAX_LIST = 1200

export const TEXT_MAX_DEFAULT = 700

/**
 * Selector for subtrees that render nothing to a sighted user.
 * Tailwind's `.hidden`/`.md:hidden`/`.sr-only`, explicit `aria-hidden`,
 * and inline `display:none` are the common cases. Stripped before reading text.
 */
export const HIDDEN_SELECTOR =
    '.hidden, [hidden], [aria-hidden="true"], .sr-only, [style*="display:none"], [style*="display: none"], [style*="visibility:hidden"], [style*="visibility: hidden"]'

/** Site chrome that should not count as page content. */
export const CHROME_SELECTOR =
    'nav, aside, footer, [role="navigation"], [role="contentinfo"], [role="banner"], [role="complementary"]'

export const BLOCK_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, ul, ol, dl, blockquote, table, figcaption, div'

/** A block nested inside one of these is already covered by its parent block. */
export const NESTED_PARENTS = 'ul, ol, dl, blockquote, table, p, h1, h2, h3, h4, h5, h6, figcaption'
