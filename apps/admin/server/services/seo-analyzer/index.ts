import type { ExtractedPageData } from '../shared/crawler/types'
import type { SeoReportOptions, SeoReportMeta, PageState, PageAuditReport, AuditIssue, Severity } from './types'
import { AVAILABLE_MODELS } from '../shared/ai/models'
import { DEFAULT_CHUNK_CHARS, DEFAULT_MAX_CHUNKS, DEFAULT_BATCH_CHARS } from '../shared/ai/chunk-config'
import { runChecks } from './rules'
import { applyDuplicateChecks } from './duplicates'
import { GoogleGenAI } from '@google/genai'
import { aiEligible, createState } from './state'
import type { GenerateContentConfig } from '@google/genai'
import { SEO_SYSTEM_INSTRUCTION } from './prompts'
import { aiResponseSchema } from './schema'
import { reviewPages } from './review'
import { MAX_AI_ISSUES_PER_PAGE } from './config'
import { fit } from '../shared/text'
import { topIssues, fallbackSummary } from './summary'
import { generateWithFallback } from '../shared/ai/generate'

export async function generateFullSeoReport(
    pages: ExtractedPageData[],
    apiKey: string | undefined,
    options: SeoReportOptions = {},
) {
    const models = options.models && options.models.length > 0 ? options.models : AVAILABLE_MODELS
    const useAi = options.useAi !== false && Boolean(apiKey)
    const batchSize = Math.max(1, options.batchSize ?? 8)
    const concurrency = Math.max(1, options.aiConcurrency ?? 3)
    const chunkChars = Math.max(1500, options.chunkChars ?? DEFAULT_CHUNK_CHARS)
    const maxChunks = Math.max(1, options.maxChunksPerPage ?? DEFAULT_MAX_CHUNKS)
    const batchChars = Math.max(chunkChars, options.batchChars ?? DEFAULT_BATCH_CHARS)
    const thinkingLevel = options.thinkingLevel === undefined ? 'LOW' : options.thinkingLevel
    const context = (options.siteContext || '').trim().slice(0, 500)

    const meta: SeoReportMeta = {
        aiEnabled: useAi,
        modelsUsed: {},
        tokens: { input: 0, output: 0, thoughts: 0, cached: 0 },
        cachedPages: 0,
        aiFailedPages: 0,
        partialPages: 0,
        skippedPages: 0,
        truncatedPages: 0,
        chunks: { total: 0, cached: 0, failed: 0, missing: 0, retriedOk: 0, dropped: 0 },
        suggestionsLost: 0,
    }

    const entries = pages.map(runChecks)
    applyDuplicateChecks(entries)

    const states = new Map<number, PageState>()
    const thinking = thinkingLevel ? { thinkingConfig: { thinkingLevel } as any } : {}
    let ai: GoogleGenAI | null = null

    if (useAi) {
        ai = new GoogleGenAI({ apiKey: apiKey! })

        pages.forEach((p, i) => {
            if (!aiEligible(p)) {
                meta.skippedPages++
                return
            }
            const state = createState(i, p, entries[i]!.issues.map((x) => x.message), chunkChars, maxChunks)
            if (!state) {
                meta.skippedPages++
                return
            }
            if (state.truncated) meta.truncatedPages++
            states.set(i, state)
        })

        const config: GenerateContentConfig = {
            systemInstruction: SEO_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: aiResponseSchema,
            maxOutputTokens: 12288,
            ...thinking,
        }

        await reviewPages(ai, [...states.values()], {
            models,
            meta,
            config,
            context,
            batchSize,
            batchChars,
            concurrency,
        })
    }

    const severityWeight = { critical: 0, warning: 1, info: 2 }

    const reports: PageAuditReport[] = pages.map((p, i) => {
        const entry = entries[i]!
        const st = states.get(i)
        const known = new Set(entry.issues.map((x) => x.message.toLowerCase()))

        let aiStatus: PageAuditReport['ai'] = 'skipped'
        if (st) {
            if (st.failed === 0) aiStatus = st.cached === st.chunks.length ? 'cached' : 'ok'
            else aiStatus = st.ok > 0 ? 'partial' : 'failed'
            if (aiStatus === 'cached') meta.cachedPages++
            else if (aiStatus === 'partial') meta.partialPages++
            else if (aiStatus === 'failed') meta.aiFailedPages++
        }

        const seen = new Set<string>()
        const aiIssues: AuditIssue[] = (st?.issues ?? [])
            .filter((x) => {
                const k = x.message.toLowerCase()
                if (known.has(k) || seen.has(k)) return false
                seen.add(k)
                return true
            })
            .sort((a, b) => severityWeight[a.severity] - severityWeight[b.severity])
            .slice(0, MAX_AI_ISSUES_PER_PAGE)
            .map((x) => {
                const block = x.blockId ? st!.blockById.get(x.blockId) : undefined
                return {
                    severity: x.severity,
                    category: x.category,
                    message: x.message,
                    recommendation: x.recommendation,
                    source: 'ai' as const,
                    locations: block
                        ? [
                            {
                                selector: block.selector,
                                line: block.line,
                                snippet: '',
                                text: x.evidence,
                            },
                        ]
                        : undefined,
                }
            })

        return {
            url: p.url,
            finalUrl: p.finalUrl,
            status: p.status,
            score: entry.score,
            loadTimeMs: p.loadTimeMs,
            fetchError: p.fetchError,
            ai: aiStatus,
            aiParts: {
                total: st?.chunks.length ?? 0,
                ok: st?.ok ?? 0,
                truncated: Boolean(st?.truncated),
            },
            contentTruncated: p.contentTruncated,
            suggestionsLost: Boolean(st && st.ok > 0 && !st.final),
            currentMeta: {
                title: p.title,
                description: p.metaDescription,
                h1s: p.h1s,
                canonical: p.canonical,
                wordCount: p.wordCount,
            },
            issues: [...entry.issues, ...aiIssues],
            aiSuggestions: (() => {
                const final = st?.final
                if (final) {
                    return {
                        suggestedTitle: final.suggestedTitle,
                        suggestedDescription: final.suggestedDescription,
                        contentFeedback: final.contentFeedback,
                    }
                }
                if (!st || st.ok === 0) {
                    return { suggestedTitle: '', suggestedDescription: '', contentFeedback: '' }
                }
                // Partial page: the last part failed but earlier parts succeeded.
                // Synthesize deterministic suggestions from what we already know.
                return {
                    suggestedTitle: fit(p.title, 60),
                    suggestedDescription: fit(p.metaDescription || p.bodySnippet, 160),
                    contentFeedback: st.summary
                        ? fit(st.summary, 400)
                        : 'Content was reviewed in parts but the final part could not be analysed.',
                }
            })(),
        }
    })

    const counts: Record<Severity, number> = { critical: 0, warning: 0, info: 0 }
    for (const r of reports) for (const i of r.issues) counts[i.severity]++
    const scored = reports.filter((r) => !r.fetchError)
    const avgScore = Math.round(scored.reduce((s, r) => s + r.score, 0) / (scored.length || 1))
    const stats = {
        pagesScanned: pages.length,
        pagesFailed: pages.length - scored.length,
        avgScore,
        counts,
        top: topIssues(reports),
    }

    let executiveSummary = fallbackSummary(stats)
    const aiWorked = Object.keys(meta.modelsUsed).length > 0 || meta.chunks.cached > 0
    if (ai && aiWorked) {
        try {
            executiveSummary = await generateWithFallback(ai, models, meta, {
                contents:
                    `${context ? `Site context from the owner: ${context}\n\n` : ''}Site audit statistics (JSON):\n${JSON.stringify(stats)}\n\n` +
                    'Write a 3-sentence executive summary: (1) overall SEO health, (2) the most significant pattern across pages, (3) the single highest-priority action. ' +
                    'Plain text only, no markdown or bullets. Use only the numbers provided.',
                config: { maxOutputTokens: 1024, ...thinking },
                parse: (t) => {
                    const s = t.trim()
                    if (!s) throw new Error('Empty summary')
                    return s
                },
            })
        } catch (e) {
            console.error(
                '[seo-analyzer] Summary failed, using generated fallback:',
                e instanceof Error ? e.message : e,
            )
        }
    }

    return { executiveSummary, pages: reports, meta }
}
export { AVAILABLE_MODELS } from '../shared/ai/models'
export type { Severity, IssueCategory, IssueLocation, AuditIssue, PageAuditReport, SeoReportOptions, SeoReportMeta } from './types'
export { sleep, sha1, norm, fit } from '../shared/text'
export { isNoindex, toLocation } from './helpers'
export { PROMPT_VERSION, MAX_AI_ISSUES_PER_PART, MAX_AI_ISSUES_PER_PAGE } from './config'
export { DEFAULT_CHUNK_CHARS, DEFAULT_MAX_CHUNKS, DEFAULT_BATCH_CHARS, BLOCK_OVERHEAD, CONTEXT_BLOCKS, MAX_RAISED, MAX_OUTLINE } from '../shared/ai/chunk-config'
export { cacheGet, cacheSet } from '../shared/ai/cache'
export { blockSize, isMajorHeading, buildChunks, outlineOf } from '../shared/ai/chunking'
export { buildItem } from './state'
export { generateWithFallback } from '../shared/ai/generate'
