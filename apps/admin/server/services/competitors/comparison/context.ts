import type { ComparisonSite, SiteRecord, Signal } from './types'
export function record(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
const string = (v: unknown) => typeof v === 'string' ? v.trim() : ''
export function buildComparisonSite(site: SiteRecord, prefix: string): ComparisonSite {
    const intel = record(site.intelligence)
    const raw = record(site.seo_raw)
    const meta = record(raw.analysisMeta)
    const coverage = record(meta.coverage)
    let complete = site.status === 'analyzed' && meta.status === 'ok' && meta.truncated === false && raw.contentTruncated === false && coverage.synthesisOk === true && typeof coverage.pages === 'number' && coverage.pages > 0 && coverage.pages === coverage.fullyReviewedPages && coverage.omittedParts === 0
    const signals: Signal[] = []
    const dataGaps: string[] = []
    const add = (category: string, text: string, extra: Partial<Signal> = {}) => {
        if (text) signals.push({id: `${prefix}${signals.length + 1}`, category, text, ...extra})
    }
    if (!complete) dataGaps.push('Capture or analysis completeness is not established; absence is not evidence of missing offerings.')
    for (const key of ['summary','tone']) {
        if (string(intel[key])) add(key, string(intel[key])); else dataGaps.push(`${key} unavailable`)
    }
    for (const key of ['claimedAdvantages','serviceHighlights','detectableWeaknesses','promotions','trustSignals','callsToAction','serviceAreas']) {
        const values = intel[key]
        if (!Array.isArray(values)) {dataGaps.push(`${key} unavailable`); continue}
        // Legacy/incomplete absence claims are not reliable.
        if (key === 'detectableWeaknesses' && !complete) continue
        for (const value of values) add(key, string(value))
    }
    if (Array.isArray(intel.packages)) for (const p of intel.packages) {
        const item = record(p)
        if (string(item.name)) add('package', JSON.stringify({name:item.name, price: string(item.price) || null, includes:Array.isArray(item.includes)?item.includes.filter(x=>typeof x==='string'):[]}))
    } else dataGaps.push('Packages unavailable')
    const pricing = record(intel.pricingSignals)
    if (Object.keys(pricing).length) add('pricingSignals', JSON.stringify(pricing)); else dataGaps.push('Pricing signals unavailable')
    if (typeof site.rating === 'number' && Number.isFinite(site.rating)) add('placesRating', String(site.rating))
    if (typeof site.review_count === 'number' && Number.isFinite(site.review_count)) add('placesReviewCount', String(site.review_count))
    if (site.price_level) add('placesPriceLevel', site.price_level)
    // Upstream analyzer verifies quote presence. This is not proof of the claim's truth.
    // Bound the evidence sent to Gemini; retain all structured facts above.
    if (dataGaps.length) complete = false
    if (Array.isArray(raw.evidence)) {
        const seen = new Set<string>()
        for (const item of raw.evidence) {
            const e = record(item), sourceUrl = string(e.sourceUrl), blockId = string(e.blockId), quote = string(e.quote), claim = string(e.claim)
            const key = JSON.stringify([sourceUrl,blockId,quote])
            if (!sourceUrl || !blockId || !quote || !claim || seen.has(key)) continue
            seen.add(key); add('sourceQuote', claim, {sourceUrl,blockId,quote})
            if (seen.size >= 40) break
        }
    }
    return {name:site.name, rating:site.rating, reviewCount:site.review_count, priceLevel:site.price_level, intelligence: {...site.intelligence, ...(!complete ? {detectableWeaknesses: []} : {})}, complete, signals:complete ? signals : signals.filter(s=>s.category!=='detectableWeaknesses'), dataGaps}
}
