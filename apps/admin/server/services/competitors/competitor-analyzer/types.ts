import type { ContentBlock } from '../../shared/crawler/types'
import type { CompetitorIntelligence, CompetitorAnalysisOptions, CompetitorAnalysisResult } from '../types'
export interface AnalysisPage {
    finalUrl: string
    title: string
    blocks: ContentBlock[]
    bodySnippet?: string
    contentTruncated?: boolean
    likelyClientRendered?: boolean
    priceLines?: string[]
    promoLines?: string[]
}
export interface Evidence { sourceUrl: string; blockId: string; quote: string; claim: string }
export interface ExtractedPart { intelligence: CompetitorIntelligence; evidence: Evidence[] }
export interface Part { key: string; sourceUrl: string; title: string; blocks: ContentBlock[]; before: ContentBlock[]; size: number }
export interface AnalysisOptions extends CompetitorAnalysisOptions {
    batchSize?: number
    maxTotalParts?: number
    previousCache?: Record<string, ExtractedPart>
    incompleteCapture?: boolean
    captureDiagnostics?: CaptureDiagnostics
}
export interface CaptureDiagnostics {
    discoveredCandidates: number
    requestedPages: number
    deferredPages: number
    discoveryLimitReached: boolean
    failedOrEmptyPages: number
    truncatedPages: number
    clientRenderedPages: number
}
export interface SiteAnalysisResult extends CompetitorAnalysisResult {
    evidence: Evidence[]
    cache: Record<string, ExtractedPart>
    coverage: { pages: number; fullyReviewedPages: number; plannedParts: number; cachedParts: number; omittedParts: number; synthesisOk: boolean; omittedByPageLimit: number; omittedByRunBudget: number; newPartsRequested: number; capture?: CaptureDiagnostics }
}
