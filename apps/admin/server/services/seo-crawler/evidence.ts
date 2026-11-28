import type { PageEvidence } from '../shared/crawler/types'

export function emptyEvidence(): PageEvidence {
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
