import type { CompetitorIntelligence } from '../types'
import { norm } from '../../shared/text'
import { MAX_LIST_ITEMS, MAX_PACKAGES, MAX_INCLUDES } from './config'
import { uniqStrings } from './sanitize'
// Restore the original lighting-package aliases (Joy Holiday Lighting Rental Package -> Joy).
const GENERIC_PACKAGE_WORDS = new Set(['holiday', 'lighting', 'lights', 'rental', 'package', 'packages', 'plan'])
function packageKey(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w && !GENERIC_PACKAGE_WORDS.has(w)).join(' ') || norm(name)
}
export function mergeFacts(parts: CompetitorIntelligence[]): CompetitorIntelligence {
    const list = (key: 'claimedAdvantages'|'serviceHighlights'|'promotions'|'trustSignals'|'callsToAction'|'serviceAreas') => uniqStrings(parts.flatMap(p => p[key]), MAX_LIST_ITEMS)
    const packages: CompetitorIntelligence['packages'] = []
    for (const p of parts.flatMap(x => x.packages)) {
        // Original contract: one package per normalized name; retain the first explicit price.
        const hit = packages.find(x => packageKey(x.name) === packageKey(p.name))
        if (hit) { if (p.name.length < hit.name.length) hit.name = p.name; hit.price ??= p.price; hit.includes = uniqStrings([...hit.includes, ...p.includes], MAX_INCLUDES) }
        else if (packages.length < MAX_PACKAGES) packages.push({...p, includes: [...p.includes]})
    }
    const pricing = parts.map(p => p.pricingSignals)
    return { summary: '', tone: parts.find(p=>p.tone && p.tone !== 'Unclear')?.tone ?? 'Unclear', detectableWeaknesses: [], packages,
        claimedAdvantages: list('claimedAdvantages'), serviceHighlights: list('serviceHighlights'), promotions: list('promotions'),
        trustSignals: list('trustSignals'), callsToAction: list('callsToAction'), serviceAreas: list('serviceAreas'),
        pricingSignals: { hasPricing: packages.some(p => !!p.price) || pricing.some(p => p.hasPricing),
            model: pricing.find(p=>p.model)?.model ?? null,
            priceRangeHint: pricing.find(p=>p.priceRangeHint)?.priceRangeHint ?? null,
            financingMentioned: pricing.some(p => p.financingMentioned) }
    }
}
