import type { AiChunkResult, PageState, SeoReportMeta, WorkItem, AiChunkValue } from './types'
import { GoogleGenAI } from '@google/genai'
import type { GenerateContentConfig } from '@google/genai'
import pLimit from 'p-limit'
import { generateWithFallback } from '../shared/ai/generate'
import { sanitize } from './sanitize'
import { cacheSet, cacheGet } from '../shared/ai/cache'
import { applyResult, buildItem, applyFailure } from './state'
import { packBatches } from '../shared/ai/batching'

export function parseBatch(text: string): AiChunkResult[] {
    const data = JSON.parse(text)
    if (!Array.isArray(data?.results)) throw new Error('Malformed AI response')
    return data.results
}

/**
 * Review every page part by part. Round 0 sends part 1 of every page, round 1
 * sends part 2 of the pages that have one, and so on. Within a round, parts of
 * different pages are batched and run in parallel; each page's own parts stay
 * strictly in order so the running summary is always available.
 *
 * Any item that fails inside a batch is retried alone once, so one bad item
 * cannot take down the rest of its batch.
 */
export async function reviewPages(
    ai: GoogleGenAI,
    states: PageState[],
    o: {
        models: readonly string[]
        meta: SeoReportMeta
        config: GenerateContentConfig
        context: string
        batchSize: number
        batchChars: number
        concurrency: number
    },
) {
    const limit = pLimit(o.concurrency)

    const runBatch = async (batch: WorkItem[]): Promise<WorkItem[]> => {
        // Returns the items that still failed (empty = all good).
        try {
            const payload = batch.map((t, id) => ({ id, ...t.input }))
            const contents =
                `${o.context ? `Site context from the owner: ${o.context}\n\n` : ''}` +
                `<items>\n${JSON.stringify(payload)}\n</items>`
            const out = await generateWithFallback(ai, o.models, o.meta, {
                contents,
                config: o.config,
                parse: parseBatch,
            })
            const byId = new Map(out.map((r) => [r.id, r]))
            const failed: WorkItem[] = []
            batch.forEach((t, id) => {
                const r = byId.get(id)
                if (!r) {
                    o.meta.chunks.missing++
                    t.lastError = 'model omitted this id'
                    failed.push(t)
                    return
                }
                const value = sanitize(r, t.chunk, o.meta)
                cacheSet(t.key, value)
                applyResult(t, value, o.meta)
            })
            return failed
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            console.error('[seo-analyzer] AI batch failed:', msg)
            for (const t of batch) t.lastError = msg
            return [...batch]
        }
    }

    for (; ;) {
        const items = states.filter((s) => s.next < s.chunks.length).map((s) => buildItem(s, o.context))
        if (items.length === 0) break

        const toCall: WorkItem[] = []
        for (const t of items) {
            o.meta.chunks.total++
            const hit = cacheGet<AiChunkValue>(t.key)

            if (hit) {
                o.meta.chunks.cached++
                t.state.cached++
                applyResult(t, hit, o.meta)
            } else {
                toCall.push(t)
            }
        }

        // Pass 1: normal batched calls
        const retryPool: WorkItem[] = []
        await Promise.all(
            packBatches(toCall, o.batchSize, o.batchChars).map((batch) =>
                limit(async () => {
                    for (const t of batch) t.attempts++
                    const still = await runBatch(batch)
                    retryPool.push(...still)
                }),
            ),
        )

        // Pass 2: retry each failed item alone, once
        await Promise.all(
            retryPool.map((t) =>
                limit(async () => {
                    t.attempts++
                    const still = await runBatch([t])
                    if (still.length > 0) {
                        o.meta.chunks.failed++
                        applyFailure(t, o.meta)
                    }
                }),
            ),
        )
    }
}
