import type { AnalysisPage } from './types'

const groups: [RegExp, number][] = [
    [/pricing|packages?|plans?|rates?|cost|specials?|promotions?|offers?|discount/, 100],
    [/services?|installation|holiday|christmas|permanent|architectural|commercial|residential|lighting/, 95],
    [/faq|questions|testimonials?|reviews?|warranty|guarantee/, 90],
    [/about|team|company|insurance|license/, 85],
    [/contact|quote|booking|estimate/, 80],
    [/service-areas?|locations?|areas-we-serve/, 70],
    [/gallery|portfolio|projects?/, 60],
]

export function pagePriority(url: string): number {
    let path: string
    try { path = new URL(url).pathname.toLowerCase() } catch { return 40 }
    if (path === '/' || !path) return 120
    if (/privacy|terms-of-use|cookie-policy|accessibility-statement/.test(path)) return 0
    if (/(^|\/)(blog|articles?|news)(\/|$)/.test(path)) return 30
    for (const [pattern, priority] of groups) if (pattern.test(path)) return priority
    return 50
}

export function prioritizeUrls(urls: string[]): string[] {
    return [...urls].sort((a, b) => pagePriority(b) - pagePriority(a))
}

export function prioritizePages<T extends AnalysisPage>(pages: T[]): T[] {
    const priority = (p: T) => pagePriority(p.finalUrl) +
        ((p.priceLines?.length || p.promoLines?.length) ? 25 : 0)
    return [...pages].sort((a, b) => priority(b) - priority(a))
}
