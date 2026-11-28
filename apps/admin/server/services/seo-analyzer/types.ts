import type { AiUsage } from '../shared/ai/types'
import type { OutlineItem, Chunk } from '../shared/ai/chunk-types'
import type { ContentBlock } from '../shared/crawler/types'

export type Severity = 'critical' | 'warning' | 'info'

export type IssueCategory = 'technical' | 'content' | 'metadata'

export interface IssueLocation {
    selector: string
    line: number
    snippet: string
    text?: string
}

export interface AuditIssue {
    severity: Severity
    category: IssueCategory
    message: string
    recommendation: string
    source?: 'rule' | 'ai'
    /** Where the problem is; undefined for page-level issues (redirects, noindex). */
    locations?: IssueLocation[]
}

export interface PageAuditReport {
    url: string
    finalUrl: string
    status: number
    score: number
    loadTimeMs: number
    fetchError: string | null
    /** 'partial' = some parts of a long page failed, the rest were reviewed */
    ai: 'ok' | 'cached' | 'skipped' | 'failed' | 'partial'
    /** How many parts the page was split into and how many were reviewed */
    aiParts: { total: number; ok: number; truncated: boolean }
    /** True when the crawler or the chunk cap cut the page short */
    contentTruncated: boolean
    /** True when the last part failed, so suggestions had to be synthesized */
    suggestionsLost: boolean
    currentMeta: {
        title: string
        description: string
        h1s: string[]
        canonical: string | null
        wordCount: number
    }
    issues: AuditIssue[]
    aiSuggestions: {
        suggestedTitle: string
        suggestedDescription: string
        contentFeedback: string
    }
}

export interface SeoReportOptions {
    models?: readonly string[]
    useAi?: boolean
    siteContext?: string
    /** Max parts (of any page) per Gemini request */
    batchSize?: number
    aiConcurrency?: number
    thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | null
    /** Target size of one page part, in characters of page text (default 6000) */
    chunkChars?: number
    /** Hard cap on parts per page; anything beyond is not reviewed (default 8) */
    maxChunksPerPage?: number
    /** Max characters of page text per Gemini request (default 24000) */
    batchChars?: number
}

export interface SeoReportMeta extends AiUsage {
    aiEnabled: boolean
    /** Pages whose every part came from cache */
    cachedPages: number
    /** Pages where no part could be reviewed */
    aiFailedPages: number
    /** Pages where some parts failed */
    partialPages: number
    skippedPages: number
    /** Pages whose content was cut by the crawler or the part cap */
    truncatedPages: number
    chunks: {
        total: number
        cached: number
        failed: number
        /** Model returned, but omitted this item's id */
        missing: number
        /** Items recovered by the per-item retry pass */
        retriedOk: number
        /** AI issues dropped by sanitize (bad shape / over the per-part cap) */
        dropped: number
    }
    /** Last-part failures that left suggestedTitle/Description empty */
    suggestionsLost: number
}

export interface AiIssue {
    severity: Severity
    category: IssueCategory
    message: string
    recommendation: string
    /** id of a block in this page ('' = page-level) */
    blockId: string
    /** verified quote from that block */
    evidence: string
}

/** What one part of a page produces (this is what gets cached). */
export interface AiChunkValue {
    summary: string
    suggestedTitle: string
    suggestedDescription: string
    contentFeedback: string
    aiIssues: AiIssue[]
}

export interface AiChunkResult {
    id: number
    summary: string
    suggestedTitle: string
    suggestedDescription: string
    contentFeedback: string
    aiIssues: {
        severity: string
        category: string
        message: string
        recommendation: string
        blockId: string
        evidence: string
    }[]
}

export interface PageState {
    index: number
    path: string
    title: string
    description: string
    h1: string[]
    words: number
    known: string[]
    outline?: OutlineItem[]
    chunks: Chunk[]
    truncated: boolean
    blockById: Map<string, ContentBlock>
    // progress
    next: number
    summary: string
    raised: string[]
    issues: AiIssue[]
    final: AiChunkValue | null
    ok: number
    cached: number
    failed: number
}

export interface WorkItem {
    state: PageState
    chunk: Chunk
    isLast: boolean
    partNo: number
    key: string
    input: Record<string, unknown>
    size: number
    attempts: number
    lastError?: string
}
