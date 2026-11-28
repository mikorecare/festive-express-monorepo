import type { ContentBlock } from '../../shared/crawler/types'

export interface MarketingContentBlock extends ContentBlock {
    region: 'header' | 'navigation' | 'main' | 'footer' | 'banner' | 'other'
    sourceUrl: string
    href?: string
    potentiallyHidden?: boolean
}

/** Only business content; no technical SEO metrics. */
export interface CompetitorScrapedPage {
    url: string
    finalUrl: string
    status: number
    fetchError: string | null
    title: string
    blocks: MarketingContentBlock[]
    bodySnippet: string
    contentTruncated: boolean
    likelyClientRendered: boolean
    priceLines: string[]
    promoLines: string[]
}
