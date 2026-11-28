import type { ExtractedPageData } from '../shared/crawler/types'
import { emptyEvidence } from './evidence'

export function emptyPage(url: string, init: Partial<ExtractedPageData> = {}): ExtractedPageData {
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
