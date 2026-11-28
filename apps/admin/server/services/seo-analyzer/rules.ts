import type { ExtractedPageData } from '../shared/crawler/types'
import type { AuditIssue, Severity, IssueCategory, IssueLocation } from './types'
import { urlKey } from '../shared/crawler/discover'
import { isNoindex, toLocation } from './helpers'

export interface Entry {
    raw: ExtractedPageData
    score: number
    issues: AuditIssue[]
}

export function addIssue(
    e: Entry,
    severity: Severity,
    category: IssueCategory,
    message: string,
    recommendation: string,
    penalty: number,
    locations?: IssueLocation[],
) {
    e.issues.push({ severity, category, message, recommendation, source: 'rule', locations })
    e.score = Math.max(0, e.score - penalty)
}

export function findHeadingSkip(levels: number[]): string | null {
    for (let i = 1; i < levels.length; i++) {
        if (levels[i]! - levels[i - 1]! > 1) return `h${levels[i - 1]} → h${levels[i]}`
    }
    return null
}

export function runChecks(p: ExtractedPageData): Entry {
    const e: Entry = { raw: p, score: 100, issues: [] }

    if (p.fetchError) {
        addIssue(
            e,
            'critical',
            'technical',
            `Page could not be audited: ${p.fetchError}`,
            'Check that the URL is reachable from the server and returns an HTML page.',
            100,
        )
        return e
    }
    if (p.status >= 400) {
        addIssue(
            e,
            'critical',
            'technical',
            `HTTP ${p.status} error`,
            'Fix the broken route or configure a 301 redirect, and remove it from the sitemap.',
            100,
        )
        return e
    }

    const csr = p.likelyClientRendered
    const ev = p.evidence

    // Redirect
    if (urlKey(p.finalUrl) !== urlKey(p.url)) {
        addIssue(
            e,
            'warning',
            'technical',
            `URL redirects to ${p.finalUrl}`,
            'Link to and list the final URL in the sitemap to avoid redirect hops.',
            3,
        )
    }
    // Noindex
    if (isNoindex(p)) {
        addIssue(
            e,
            'critical',
            'technical',
            'Page is set to noindex',
            'Remove noindex (meta tag or X-Robots-Tag header) if this page should rank.',
            20,
        )
    }
    // CSR
    if (csr) {
        addIssue(
            e,
            'warning',
            'technical',
            'Page looks client-rendered (almost no HTML text found)',
            'The crawler reads raw HTML only. Make sure key content is server-rendered, or verify this page in a browser-based tool.',
            5,
        )
    }

    // Title
    if (!p.title) {
        addIssue(
            e,
            'critical',
            'metadata',
            'Missing <title> tag',
            'Add a unique, descriptive title of 30–60 characters.',
            15,
            ev.title ? [toLocation(ev.title)] : undefined,
        )
    } else if (p.title.length < 30 || p.title.length > 60) {
        addIssue(
            e,
            'warning',
            'metadata',
            `Title length is ${p.title.length} chars`,
            'Aim for 30–60 characters so it is not truncated in search results.',
            5,
            ev.title ? [toLocation(ev.title)] : undefined,
        )
    }

    // Meta description
    if (!p.metaDescription) {
        addIssue(
            e,
            'warning',
            'metadata',
            'Missing meta description',
            'Add a 120–155 character summary to improve click-through rate.',
            8,
        )
    } else if (p.metaDescription.length < 70 || p.metaDescription.length > 160) {
        addIssue(
            e,
            'info',
            'metadata',
            `Meta description length is ${p.metaDescription.length} chars`,
            'Aim for 120–155 characters.',
            2,
            ev.metaDescription ? [toLocation(ev.metaDescription)] : undefined,
        )
    }

    // Headings
    if (!csr) {
        if (p.h1s.length === 0) {
            addIssue(
                e,
                'critical',
                'content',
                'Missing <h1> heading',
                'Add a single primary H1 describing the page topic.',
                10,
                ev.noH1.map(toLocation),
            )
        } else if (p.h1s.length > 1) {
            addIssue(
                e,
                'warning',
                'content',
                `Multiple H1 tags (${p.h1s.length})`,
                'Use one H1 and demote the others to H2.',
                5,
                ev.multipleH1.map(toLocation),
            )
        }
        const skip = findHeadingSkip(p.headingLevels)
        if (skip) {
            addIssue(
                e,
                'info',
                'content',
                `Heading level skipped (${skip})`,
                'Keep heading levels sequential for accessibility and clear structure.',
                2,
                ev.headingSkip.map(toLocation),
            )
        }
    }

    // Canonical
    if (!p.canonical) {
        addIssue(
            e,
            'warning',
            'technical',
            'Missing canonical tag',
            'Add <link rel="canonical"> pointing to the preferred URL.',
            5,
        )
    } else if (![p.url, p.finalUrl].some((u) => urlKey(u) === urlKey(p.canonical!))) {
        addIssue(
            e,
            'warning',
            'technical',
            `Canonical points to a different URL (${p.canonical})`,
            'If this page should rank on its own, make the canonical self-referencing; otherwise remove it from the sitemap.',
            4,
            ev.canonical ? [toLocation(ev.canonical)] : undefined,
        )
    }

    // Content depth
    if (!csr) {
        if (p.wordCount < 100) {
            addIssue(
                e,
                'warning',
                'content',
                `Thin content (${p.wordCount} words)`,
                'Add useful, unique copy. Aim for 300+ words where the page type allows it.',
                6,
                ev.thinContent ? [toLocation(ev.thinContent)] : undefined,
            )
        } else if (p.wordCount < 250) {
            addIssue(
                e,
                'info',
                'content',
                `Light content (${p.wordCount} words)`,
                'Consider adding more detail if this page targets a competitive topic.',
                3,
            )
        }

        // One issue per offending image so each one can be pinned
        if (ev.missingAlt.length > 0) {
            for (const img of ev.missingAlt) {
                addIssue(
                    e,
                    'warning',
                    'content',
                    'Image is missing alt text',
                    'Describe what the image shows in the alt attribute. Use alt="" only if the image is purely decorative.',
                    1,
                    [toLocation(img)],
                )
            }
            // Cap total penalty so a gallery page doesn't drop to 0 unfairly
            const extra = Math.max(0, p.missingAltCount - ev.missingAlt.length)
            if (extra > 0) {
                addIssue(
                    e,
                    'info',
                    'content',
                    `${extra} more image${extra > 1 ? 's' : ''} missing alt text`,
                    'Add descriptive alt text to the remaining images.',
                    Math.min(extra, 3),
                )
            }
        }
    }

    // Technical hygiene
    if (!p.lang) {
        addIssue(
            e,
            'info',
            'technical',
            'Missing lang attribute on <html>',
            'Add lang (for example lang="en") for accessibility and language targeting.',
            1,
            ev.lang ? [toLocation(ev.lang)] : undefined,
        )
    }
    if (!p.hasViewport) {
        addIssue(
            e,
            'warning',
            'technical',
            'Missing viewport meta tag',
            'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
            3,
        )
    }
    if (!p.hasOgTags) {
        addIssue(
            e,
            'info',
            'metadata',
            'Missing Open Graph tags',
            'Add og:title and og:image for social previews.',
            2,
        )
    }
    if (p.invalidSchemaCount > 0) {
        addIssue(
            e,
            'warning',
            'technical',
            `Invalid JSON-LD (${p.invalidSchemaCount} block${p.invalidSchemaCount > 1 ? 's' : ''})`,
            'Fix the JSON syntax so search engines can read the structured data.',
            3,
            ev.jsonLd.map(toLocation),
        )
    } else if (p.schemaCount === 0) {
        addIssue(
            e,
            'info',
            'technical',
            'No JSON-LD structured data',
            'Add Schema.org markup relevant to the page type.',
            2,
        )
    }
    if (p.ttfbMs > 1500) {
        addIssue(
            e,
            'info',
            'technical',
            `Slow server response (${p.ttfbMs} ms)`,
            'Check server render time, caching and CDN. Measured from this server, so treat as a hint.',
            2,
        )
    }

    return e
}
