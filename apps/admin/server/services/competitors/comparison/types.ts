import type { CompetitorIntelligence } from '../types'
import type { Assessment } from '../scoring/types'
export interface SiteRecord {
    id: string
    name: string
    intelligence: CompetitorIntelligence | null
    rating: number | null
    review_count: number | null
    price_level: string | null
    last_analyzed_at: string | null
    last_scraped_at: string | null
    status: string | null
    seo_raw: unknown
}
export interface Signal { id: string; category: string; text: string; sourceUrl?: string; blockId?: string; quote?: string }
export interface ComparisonSite {
    name: string
    rating: number | null
    reviewCount: number | null
    priceLevel: string | null
    intelligence: Partial<CompetitorIntelligence>
    complete: boolean
    signals: Signal[]
    dataGaps: string[]
}
export interface GeneratedComparison {
    executiveSummary: string
    pricingComparison: {item:string; ours:string; theirs:string; verdict:'we_cheaper'|'they_cheaper'|'similar'|'not_comparable'; insight:string}[]
    packageGaps: {theyOfferWeLack:string[]; weOfferTheyLack:string[]; packageRecommendations:string[]}
    websiteComparison: {messagingAndClaims:string; trustSignals:string; conversionFlow:string; seoAndContent:string; whereTheyBeatUs:string[]}
    marketingWeaknessesToExploit: string[]
    prioritizedActions: {action:string; area:'pricing'|'packages'|'website'|'messaging'|'seo'; impact:'high'|'medium'|'low'; effort:'high'|'medium'|'low'; evidence:string}[]
    salesBattlecard: {scenario:string; theirPitch:string; ourWinningPitch:string}[]
    dataGaps: string[]
    assessments: {ours:Assessment[]; theirs:Assessment[]}
}
