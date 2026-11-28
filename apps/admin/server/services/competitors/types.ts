import type { ContentBlock } from '../shared/crawler/types'
import { Type, type Schema } from '@google/genai'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface CompetitorPackage {
    name: string
    /** Exact price text as written on the page ("From $1,200", "$8/ft"), or null if none is shown. */
    price: string | null
    includes: string[]
}

export interface CompetitorIntelligence {
    /** Running summary of the page (last part's summary). */
    summary: string
    claimedAdvantages: string[]
    serviceHighlights: string[]
    detectableWeaknesses: string[]
    packages: CompetitorPackage[]
    /** Discounts, coupons, vouchers, early-bird offers. Never package prices. */
    promotions: string[]
    trustSignals: string[]
    callsToAction: string[]
    serviceAreas: string[]
    pricingSignals: {
        hasPricing: boolean
        model: string | null
        priceRangeHint: string | null
        financingMentioned: boolean
    }
    tone: string
}

export interface CompetitorAnalysisResult {
    intelligence: CompetitorIntelligence | null
    /** 'ok' = all parts reviewed, 'partial' = some parts failed, 'failed' = none worked. */
    status: 'ok' | 'partial' | 'failed'
    parts: { total: number; ok: number; failed: number }
    truncated: boolean
    modelsUsed: Record<string, number>
    tokens: { input: number; output: number; thoughts: number; cached: number }
}

export interface CompetitorAnalysisOptions {
    models?: readonly string[]
    chunkChars?: number
    maxChunksPerPage?: number
    batchChars?: number
    concurrency?: number
    thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | null
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

export interface CompetitorChunkValue {
    summary: string
    claimedAdvantages: string[]
    serviceHighlights: string[]
    detectableWeaknesses: string[]
    packages: CompetitorPackage[]
    promotions: string[]
    trustSignals: string[]
    callsToAction: string[]
    serviceAreas: string[]
    pricingSignals: CompetitorIntelligence['pricingSignals']
    tone: string
}

export interface CompetitorState {
    chunks: { blocks: ContentBlock[]; before: ContentBlock[] }[]
    outline?: { id: string; level: number; text: string }[]
    truncated: boolean
    path: string
    title: string
    next: number
    summary: string
    raised: string[]
    claimedAdvantages: string[]
    serviceHighlights: string[]
    detectableWeaknesses: string[]
    packages: CompetitorPackage[]
    promotions: string[]
    trustSignals: string[]
    callsToAction: string[]
    serviceAreas: string[]
    pricing: CompetitorIntelligence['pricingSignals']
    tone: string
    final: CompetitorIntelligence | null
    ok: number
    cached: number
    failed: number
}

export interface CompetitorWorkItem {
    state: CompetitorState
    chunk: { blocks: ContentBlock[]; before: ContentBlock[] }
    isLast: boolean
    partNo: number
    key: string
    input: Record<string, unknown>
    size: number
    attempts: number
    lastError?: string
}

// ---------------------------------------------------------------------------
// Gemini response schema
// ---------------------------------------------------------------------------

export const competitorResponseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    claimedAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
                    serviceHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    packages: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                price: { type: Type.STRING, nullable: true },
                                includes: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                            required: ['name', 'price', 'includes'],
                        },
                    },
                    promotions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    pricingSignals: {
                        type: Type.OBJECT,
                        properties: {
                            hasPricing: { type: Type.BOOLEAN },
                            model: { type: Type.STRING, nullable: true },
                            priceRangeHint: { type: Type.STRING, nullable: true },
                            financingMentioned: { type: Type.BOOLEAN },
                        },
                        required: ['hasPricing', 'model', 'priceRangeHint', 'financingMentioned'],
                    },
                    trustSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
                    callsToAction: { type: Type.ARRAY, items: { type: Type.STRING } },
                    serviceAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    detectableWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tone: { type: Type.STRING },
                },
                required: [
                    'id', 'summary', 'claimedAdvantages', 'serviceHighlights', 'packages', 'promotions',
                    'pricingSignals', 'trustSignals', 'callsToAction', 'serviceAreas',
                    'detectableWeaknesses', 'tone',
                ],
            },
        },
    },
    required: ['results'],
}