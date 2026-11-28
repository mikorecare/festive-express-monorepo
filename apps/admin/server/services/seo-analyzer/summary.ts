import type { PageAuditReport, Severity } from './types'

export function topIssues(reports: PageAuditReport[], limit = 8) {
    const freq = new Map<string, { message: string; severity: Severity; pages: number }>()
    for (const r of reports) {
        const seen = new Set<string>()
        for (const i of r.issues) {
            const key = i.message.replace(/\d+/g, '#').replace(/\(.*?\)/g, '').trim()
            if (seen.has(key)) continue
            seen.add(key)
            const cur = freq.get(key)
            if (cur) cur.pages++
            else freq.set(key, { message: key, severity: i.severity, pages: 1 })
        }
    }
    const weight = { critical: 2, warning: 1, info: 0 }
    return [...freq.values()]
        .sort((a, b) => weight[b.severity] - weight[a.severity] || b.pages - a.pages)
        .slice(0, limit)
}

export function fallbackSummary(stats: {
    pagesScanned: number
    avgScore: number
    counts: Record<Severity, number>
    top: ReturnType<typeof topIssues>
}): string {
    const { pagesScanned, avgScore, counts, top } = stats
    const first = top[0]
    return (
        `Scanned ${pagesScanned} page${pagesScanned === 1 ? '' : 's'} with an average score of ${avgScore}/100, ` +
        `finding ${counts.critical} critical issue${counts.critical === 1 ? '' : 's'}, ${counts.warning} warning${counts.warning === 1 ? '' : 's'} and ${counts.info} notice${counts.info === 1 ? '' : 's'}. ` +
        (first
            ? `The most significant pattern is "${first.message}" on ${first.pages} page${first.pages === 1 ? '' : 's'}. `
            : '') +
        `Start with the critical issues, then the warnings that repeat across many pages.`
    )
}
