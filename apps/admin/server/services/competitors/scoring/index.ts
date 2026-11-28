import { RUBRIC, RUBRIC_VERSION, MIN_SCORE_COVERAGE } from './rubric'
import type { Assessment, Level, SiteScore } from './types'
export { RUBRIC, RUBRIC_VERSION } from './rubric'
export type { Assessment, SiteScore } from './types'

export function calculateSiteScore(raw: Assessment[], allowedIds: Set<string>, complete: boolean): SiteScore {
    const criteria = RUBRIC.map(r => {
        const matches = raw.filter(a => a.criterionId === r.id)
        const a = matches.length === 1 ? matches[0] : undefined
        const refs = [...new Set(a?.evidenceIds ?? [])].filter(id => allowedIds.has(id))
        let level: Level = a?.level ?? null
        // Unknown is not zero. No absence-based zero on incomplete/legacy captures.
        if (level !== null && (!Number.isInteger(level) || level < 0 || level > 4 || (level > 0 && !refs.length) || (level === 0 && !complete))) level = null
        return { criterionId: r.id, label: r.label, weight: r.weight, level, evidenceIds: refs,
            points: level === null ? null : level * r.weight / 4,
            explanation: level === null ? 'Insufficient or unverified assessment data.' : a!.explanation,
            improvement: level === null ? 'Collect more relevant evidence before scoring.' : a!.improvement }
    })
    const measured = criteria.filter(c => c.points !== null)
    const coverage = measured.reduce((n,c) => n + c.weight, 0)
    const overall = coverage >= MIN_SCORE_COVERAGE ? Math.round(100 * measured.reduce((n,c) => n + c.points!, 0) / coverage) : null
    return { overall, coverage, provisional: !complete || coverage < 100, criteria }
}

export function compareScores(ours: SiteScore, theirs: SiteScore) {
    const common = ours.criteria.filter(c => c.points !== null && theirs.criteria.some(t => t.criterionId === c.criterionId && t.points !== null))
    const coverage = common.reduce((n,c) => n + c.weight, 0)
    const usable = coverage >= MIN_SCORE_COVERAGE
    const ourScore = usable ? Math.round(100 * common.reduce((n,c) => n + c.points!,0) / coverage) : null
    const theirScore = usable ? Math.round(100 * common.reduce((n,c) => n + theirs.criteria.find(t => t.criterionId === c.criterionId)!.points!,0) / coverage) : null
    const delta = ourScore === null || theirScore === null ? null : ourScore - theirScore
    const provisional = ours.provisional || theirs.provisional
    return { rubricVersion: RUBRIC_VERSION, ours, theirs, headToHead: { coverage, ours: ourScore, theirs: theirScore, delta, provisional,
        verdict: delta === null || provisional ? 'insufficient_data' : delta === 0 ? 'tie' : delta > 0 ? 'ours' : 'theirs' } }
}
