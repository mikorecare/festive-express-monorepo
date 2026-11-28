import type { ContentBlock } from '../shared/crawler/types'
import { norm, fit } from '../shared/text'
import type { AiChunkResult, SeoReportMeta, AiChunkValue, AiIssue, Severity, IssueCategory } from './types'
import type { Chunk } from '../shared/ai/chunk-types'
import { MAX_AI_ISSUES_PER_PART, SEVERITIES, CATEGORIES } from './config'

export function verifyEvidence(evidence: string, block: ContentBlock): string {
    const e = (evidence || '').replace(/\s+/g, ' ').trim().slice(0, 120)
    if (e && norm(block.text).includes(norm(e))) return e
    // The quote is not actually in that block: show the block's own text instead.
    return fit(block.text, 120)
}

export function sanitize(r: AiChunkResult, chunk: Chunk, meta: SeoReportMeta): AiChunkValue {
    const ids = new Map(chunk.blocks.map((b) => [b.id, b]))
    const raw = Array.isArray(r.aiIssues) ? r.aiIssues : []

    const shaped = raw.filter((i) => i?.message && i?.recommendation)
    const overflow = Math.max(0, shaped.length - MAX_AI_ISSUES_PER_PART)
    if (overflow > 0) {
        meta.chunks.dropped += overflow
        console.warn(
            `[seo-analyzer] sanitize dropped ${overflow} aiIssue(s) over per-part cap (part had ${shaped.length})`,
        )
    }

    const aiIssues: AiIssue[] = shaped
        .slice(0, MAX_AI_ISSUES_PER_PART)
        .map((i) => {
            const block = ids.get((i.blockId || '').trim())
            return {
                severity: SEVERITIES.includes(i.severity as Severity) ? (i.severity as Severity) : 'info',
                category: CATEGORIES.includes(i.category as IssueCategory)
                    ? (i.category as IssueCategory)
                    : 'content',
                message: i.message.trim(),
                recommendation: i.recommendation.trim(),
                blockId: block?.id ?? '',
                evidence: block ? verifyEvidence(i.evidence, block) : '',
            }
        })

    return {
        summary: fit(r.summary, 800),
        suggestedTitle: fit(r.suggestedTitle, 60),
        suggestedDescription: fit(r.suggestedDescription, 160),
        contentFeedback: (r.contentFeedback || '').trim(),
        aiIssues,
    }
}
