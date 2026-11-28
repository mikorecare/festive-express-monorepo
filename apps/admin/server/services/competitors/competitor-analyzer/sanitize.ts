import type { CompetitorIntelligence, CompetitorPackage } from '../types'
import { norm, fit } from '../../shared/text'
import { MAX_ITEMS_PER_PART, MAX_INCLUDES, normalizeTone } from './config'
export function uniqStrings(arr: unknown, cap: number, max = 200): string[] {
    if (!Array.isArray(arr)) return []
    const seen = new Set<string>()
    const out: string[] = []
    for (const x of arr) {
        if (typeof x !== 'string') continue
        const k = norm(x)
        if (!k || seen.has(k)) continue
        seen.add(k)
        out.push(fit(x, max))
        if (out.length >= cap) break
    }
    return out
}

function sanitizePackages(arr: unknown): CompetitorPackage[] {
    if (!Array.isArray(arr)) return []
    const out: CompetitorPackage[] = []
    const seen = new Set<string>()
    for (const x of arr) {
        if (!x || typeof x !== 'object') continue
        const o = x as Record<string, unknown>
        const name = typeof o.name === 'string' ? fit(o.name, 80) : ''
        const k = name ? norm(name) + "|" + norm(typeof o.price === "string" ? o.price : "") : ""
        if (!k || seen.has(k)) continue
        seen.add(k)
        out.push({
            name,
            price: typeof o.price === 'string' && o.price.trim() ? o.price.trim() : null,
            includes: uniqStrings(o.includes, MAX_INCLUDES, 120),
        })
        if (out.length >= MAX_ITEMS_PER_PART + 2) break
    }
    return out
}

export function sanitizeCompetitor(
    r: {
        summary?: string
        claimedAdvantages?: unknown
        serviceHighlights?: unknown
        detectableWeaknesses?: unknown
        packages?: unknown
        promotions?: unknown
        trustSignals?: unknown
        callsToAction?: unknown
        serviceAreas?: unknown
        pricingSignals?: unknown
        tone?: unknown
    },
): CompetitorIntelligence {
    const ps = (r.pricingSignals ?? {}) as Record<string, unknown>
    return {
        summary: fit(typeof r.summary === 'string' ? r.summary : '', 600),
        claimedAdvantages: uniqStrings(r.claimedAdvantages, MAX_ITEMS_PER_PART),
        serviceHighlights: uniqStrings(r.serviceHighlights, MAX_ITEMS_PER_PART),
        detectableWeaknesses: uniqStrings(r.detectableWeaknesses, MAX_ITEMS_PER_PART),
        packages: sanitizePackages(r.packages),
        promotions: uniqStrings(r.promotions, MAX_ITEMS_PER_PART),
        trustSignals: uniqStrings(r.trustSignals, MAX_ITEMS_PER_PART),
        callsToAction: uniqStrings(r.callsToAction, MAX_ITEMS_PER_PART),
        serviceAreas: uniqStrings(r.serviceAreas, MAX_ITEMS_PER_PART),
        pricingSignals: {
            hasPricing: ps.hasPricing === true,
            model: typeof ps.model === 'string' ? ps.model : null,
            priceRangeHint: typeof ps.priceRangeHint === 'string' ? ps.priceRangeHint : null,
            financingMentioned: ps.financingMentioned === true,
        },
        tone: normalizeTone(r.tone),
    }
}

