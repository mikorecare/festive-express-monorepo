export type CompetitorStatus = 'discovered' | 'scraped' | 'analyzed' | 'failed';
export type Priority = 'high' | 'medium' | 'low';
export type Verdict = 'we_cheaper' | 'they_cheaper' | 'similar' | 'not_comparable';
export interface Intelligence {
  summary?: string; claimedAdvantages?: string[]; serviceHighlights?: string[];
  detectableWeaknesses?: string[]; packages?: { name: string; price: string | null; includes: string[] }[];
  promotions?: string[]; trustSignals?: string[]; callsToAction?: string[]; serviceAreas?: string[]; tone?: string;
  pricingSignals?: { hasPricing: boolean; model: string | null; priceRangeHint: string | null; financingMentioned: boolean };
}
export interface SourceEvidence { sourceUrl?: string; blockId?: string; quote?: string; claim?: string; id?: string; text?: string; category?: string }
export interface AnalysisMeta { status?: string; truncated?: boolean; coverage?: { pages: number; fullyReviewedPages: number; plannedParts: number; cachedParts: number; omittedParts: number; synthesisOk: boolean }; parts?: { total: number; ok: number; failed: number }; tokens?: { input: number; output: number; thoughts: number; cached: number } }
export interface CompetitorRow { id: string; created_at: string; name: string; address: string | null; website: string | null; phone: string | null; rating: number | null; review_count: number | null; price_level: string | null; status: CompetitorStatus; intelligence: Intelligence | null; is_internal: boolean; error?: string | null; last_analyzed_at?: string | null; seo_raw?: { pagesScraped?: number; blocks?: { text: string }[]; contentTruncated?: boolean; analysisMeta?: AnalysisMeta; evidence?: SourceEvidence[] } | null, place_id?: string | null }
export interface ScoreCriterion { criterionId: string; label: string; weight: number; level: 0 | 1 | 2 | 3 | 4 | null; points: number | null; evidenceIds: string[]; explanation: string; improvement: string }
export interface SiteScore { overall: number | null; coverage: number; provisional: boolean; criteria: ScoreCriterion[] }
export interface MarketingScore { rubricVersion: string; ours: SiteScore; theirs: SiteScore; headToHead: { coverage: number; ours: number | null; theirs: number | null; delta: number | null; provisional: boolean; verdict: string } }
export interface Comparison { executiveSummary: string; pricingComparison: { item: string; ours: string; theirs: string; verdict: Verdict; insight: string }[]; packageGaps: { theyOfferWeLack: string[]; weOfferTheyLack: string[]; packageRecommendations: string[] }; websiteComparison: { messagingAndClaims: string; trustSignals: string; conversionFlow: string; seoAndContent: string; contentQuality?: string; whereTheyBeatUs: string[] }; marketingWeaknessesToExploit: string[]; prioritizedActions: { action: string; area: 'pricing' | 'packages' | 'website' | 'messaging' | 'seo'; impact: Priority; effort: Priority; evidence: string }[]; salesBattlecard: { scenario: string; theirPitch: string; ourWinningPitch: string }[]; dataGaps: string[]; marketingScore?: MarketingScore; scoreEvidence?: { ours: SourceEvidence[]; theirs: SourceEvidence[] }; _meta?: { generatedAt?: string; sourceAnalyzedAt?: { internal: string | null; competitor: string | null } } }
export interface AnalyzeResult { name: string; ok: boolean; reason: string }
