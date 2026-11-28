import type { ExtractedPageData } from '../shared/crawler/types'
import { isNoindex } from './helpers'
import type { PageState, WorkItem, AiChunkValue, SeoReportMeta } from './types'
import { buildChunks, outlineOf, blockSize } from '../shared/ai/chunking'
import { sha1 } from '../shared/text'
import { PROMPT_VERSION } from './config'
import { MAX_RAISED } from '../shared/ai/chunk-config'

export const aiEligible = (p: ExtractedPageData) =>
    !p.fetchError && p.status < 400 && !isNoindex(p) && p.wordCount >= 30

export function createState(
    index: number,
    p: ExtractedPageData,
    known: string[],
    chunkChars: number,
    maxChunks: number,
): PageState | null {
    let blocks = p.blocks
    if (blocks.length === 0 && p.bodySnippet) {
        // Crawler found text but no block structure: fall back to the snippet.
        blocks = [{ id: 'b0', tag: 'body', level: 0, selector: 'body', line: 0, text: p.bodySnippet }]
    }
    if (blocks.length === 0) return null

    const { chunks, truncated } = buildChunks(blocks, chunkChars, maxChunks)
    let path = p.finalUrl
    try {
        const u = new URL(p.finalUrl)
        path = u.pathname + u.search
    } catch {
        // keep as is
    }

    return {
        index,
        path,
        title: p.title,
        description: p.metaDescription,
        h1: p.h1s.slice(0, 2),
        words: p.wordCount,
        known: known.slice(0, 8).map((m) => m.slice(0, 80)),
        outline: chunks.length > 1 ? outlineOf(blocks) : undefined,
        chunks,
        truncated: truncated || p.contentTruncated,
        blockById: new Map(blocks.map((b) => [b.id, b])),
        next: 0,
        summary: '',
        raised: [],
        issues: [],
        final: null,
        ok: 0,
        cached: 0,
        failed: 0,
    }
}

export function buildItem(s: PageState, context: string): WorkItem {
    const chunk = s.chunks[s.next]!
    const isLast = s.next === s.chunks.length - 1
    const first = chunk.blocks[0]!
    const last = chunk.blocks[chunk.blocks.length - 1]!

    const input: Record<string, unknown> = {
        path: s.path,
        title: s.title,
        description: s.description,
        h1: s.h1,
        words: s.words,
        known: s.known,
        ...(s.outline ? { outline: s.outline } : {}),
        part: {
            n: s.next + 1,
            of: s.chunks.length,
            isLast,
            blocks: first.id === last.id ? first.id : `${first.id}-${last.id}`,
        },
        ...(s.next > 0 ? { summarySoFar: s.summary, alreadyReported: s.raised } : {}),
        ...(chunk.before.length
            ? { contextBefore: chunk.before.map((b) => ({ id: b.id, text: b.text.slice(0, 200) })) }
            : {}),
        ...(isLast && s.truncated
            ? {
                note: 'The page is longer than what was captured. Do not comment on content that may exist after the last block.',
            }
            : {}),
        blocks: chunk.blocks.map((b) => ({ id: b.id, tag: b.tag, text: b.text })),
    }

    return {
        state: s,
        chunk,
        isLast,
        partNo: s.next + 1,
        key: sha1(JSON.stringify([input, context, PROMPT_VERSION])),
        input,
        size: chunk.blocks.reduce((n, b) => n + blockSize(b), 0) + 400,
        attempts: 0,
    }
}

export function applyResult(t: WorkItem, v: AiChunkValue, meta: SeoReportMeta) {
    const s = t.state
    s.issues.push(...v.aiIssues)
    if (v.summary) s.summary = v.summary
    s.raised = [...s.raised, ...v.aiIssues.map((i) => i.message.slice(0, 80))].slice(-MAX_RAISED)
    if (t.isLast) s.final = v
    s.ok++
    s.next++
    if (t.attempts > 1) meta.chunks.retriedOk++
}

export function applyFailure(t: WorkItem, meta: SeoReportMeta) {
    const s = t.state
    s.failed++
    s.summary = `${s.summary} [Part ${t.partNo} could not be analysed.]`.trim().slice(-900)
    if (t.isLast) meta.suggestionsLost++
    s.next++
}
