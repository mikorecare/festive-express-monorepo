import { GoogleGenAI, type GenerateContentConfig } from '@google/genai'
import { COMPETITOR_SYSTEM_INSTRUCTION } from './constants'
import {
    CompetitorIntelligence,
    CompetitorAnalysisOptions,
    CompetitorAnalysisResult,
    CompetitorPackage,
    competitorResponseSchema,
    CompetitorState,
    CompetitorWorkItem,
} from './types'
import {
    buildChunks,
    outlineOf,
    norm,
    fit,
    sha1,
    MAX_RAISED,
    DEFAULT_CHUNK_CHARS,
    DEFAULT_MAX_CHUNKS,
    cacheGet,
    generateWithFallback,
    cacheSet,
    blockSize,
    AVAILABLE_MODELS,
    type SeoReportMeta,
} from '../seo-analyzer'

// Bump whenever the prompt or schema changes, otherwise old cached results are reused
const COMPETITOR_PROMPT_VERSION = 'competitor-v7'
const MAX_ITEMS_PER_PART = 6
const MAX_LIST_ITEMS = 12
const MAX_PACKAGES = 12
const MAX_INCLUDES = 10

const GENERIC_PACKAGE_WORDS = new Set(['holiday', 'lighting', 'lights', 'rental', 'package', 'packages', 'plan'])

// "Joy Holiday Lighting Rental Package" and "Joy" are the same package
function packageKey(name: string): string {
    const words = name
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, ' ')
        .split(/\s+/)
        .filter((w) => w && !GENERIC_PACKAGE_WORDS.has(w))
    return words.join(' ') || norm(name)
}

function emptyPricing(): CompetitorIntelligence['pricingSignals'] {
    return { hasPricing: false, model: null, priceRangeHint: null, financingMentioned: false }
}

function createCompetitorState(
    p: ExtractedPageData,
    chunkChars: number,
    maxChunks: number,
): CompetitorState | null {
    let blocks = p.blocks
    if (blocks.length === 0 && p.bodySnippet) {
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
        chunks,
        outline: chunks.length > 1 ? outlineOf(blocks) : undefined,
        truncated: truncated || p.contentTruncated,
        path,
        title: p.title,
        next: 0,
        summary: '',
        raised: [],
        claimedAdvantages: [],
        serviceHighlights: [],
        detectableWeaknesses: [],
        packages: [],
        promotions: [],
        trustSignals: [],
        callsToAction: [],
        serviceAreas: [],
        pricing: emptyPricing(),
        tone: '',
        final: null,
        ok: 0,
        cached: 0,
        failed: 0,
    }
}

function uniqStrings(arr: unknown, cap: number, max = 200): string[] {
    if (!Array.isArray(arr)) return []
    const seen = new Set<string>()
    const out: string[] = []
    for (const x of arr) {
        if (typeof x !== 'string') continue
        const k = norm(x)
        if (!k || seen.has(k)) continue
        seen.add(k)
        out.push(fit(x, max))
        if (out.length >= cap) break
    }
    return out
}

function sanitizePackages(arr: unknown): CompetitorPackage[] {
    if (!Array.isArray(arr)) return []
    const out: CompetitorPackage[] = []
    const seen = new Set<string>()
    for (const x of arr) {
        if (!x || typeof x !== 'object') continue
        const o = x as Record<string, unknown>
        const name = typeof o.name === 'string' ? fit(o.name, 80) : ''
        const k = packageKey(name)
        if (!k || seen.has(k)) continue
        seen.add(k)
        out.push({
            name,
            price: typeof o.price === 'string' && o.price.trim() ? fit(o.price, 80) : null,
            includes: uniqStrings(o.includes, MAX_INCLUDES, 120),
        })
        if (out.length >= MAX_ITEMS_PER_PART + 2) break
    }
    return out
}

function sanitizeCompetitor(
    r: {
        summary?: string
        claimedAdvantages?: unknown
        serviceHighlights?: unknown
        detectableWeaknesses?: unknown
        packages?: unknown
        promotions?: unknown
        trustSignals?: unknown
        callsToAction?: unknown
        serviceAreas?: unknown
        pricingSignals?: unknown
        tone?: unknown
    },
): CompetitorIntelligence {
    const ps = (r.pricingSignals ?? {}) as Record<string, unknown>
    return {
        summary: fit(typeof r.summary === 'string' ? r.summary : '', 800),
        claimedAdvantages: uniqStrings(r.claimedAdvantages, MAX_ITEMS_PER_PART),
        serviceHighlights: uniqStrings(r.serviceHighlights, MAX_ITEMS_PER_PART),
        detectableWeaknesses: uniqStrings(r.detectableWeaknesses, MAX_ITEMS_PER_PART),
        packages: sanitizePackages(r.packages),
        promotions: uniqStrings(r.promotions, MAX_ITEMS_PER_PART),
        trustSignals: uniqStrings(r.trustSignals, MAX_ITEMS_PER_PART),
        callsToAction: uniqStrings(r.callsToAction, MAX_ITEMS_PER_PART),
        serviceAreas: uniqStrings(r.serviceAreas, MAX_ITEMS_PER_PART),
        pricingSignals: {
            hasPricing: Boolean(ps.hasPricing),
            model: typeof ps.model === 'string' ? ps.model : null,
            priceRangeHint: typeof ps.priceRangeHint === 'string' ? ps.priceRangeHint : null,
            financingMentioned: Boolean(ps.financingMentioned),
        },
        tone: typeof r.tone === 'string' ? fit(r.tone, 40) : '',
    }
}

function mergePackages(dst: CompetitorPackage[], src: CompetitorPackage[]) {
    for (const p of src) {
        const k = packageKey(p.name)
        const hit = dst.find((d) => packageKey(d.name) === k)
        if (!hit) {
            if (dst.length < MAX_PACKAGES) dst.push({ ...p, includes: [...p.includes] })
            continue
        }
        if (p.name.length < hit.name.length) hit.name = p.name // keep the short, clean name
        hit.price ??= p.price
        const seen = new Set(hit.includes.map(norm))
        for (const i of p.includes) {
            const n = norm(i)
            if (!seen.has(n) && hit.includes.length < MAX_INCLUDES) {
                hit.includes.push(i)
                seen.add(n)
            }
        }
    }
}

function snapshot(s: CompetitorState): CompetitorIntelligence {
    return {
        summary: s.summary,
        claimedAdvantages: s.claimedAdvantages.slice(0, MAX_LIST_ITEMS),
        serviceHighlights: s.serviceHighlights.slice(0, MAX_LIST_ITEMS),
        detectableWeaknesses: s.detectableWeaknesses.slice(0, MAX_LIST_ITEMS),
        packages: s.packages.slice(0, MAX_PACKAGES),
        promotions: s.promotions.slice(0, MAX_LIST_ITEMS),
        trustSignals: s.trustSignals.slice(0, MAX_LIST_ITEMS),
        callsToAction: s.callsToAction.slice(0, MAX_LIST_ITEMS),
        serviceAreas: s.serviceAreas.slice(0, MAX_LIST_ITEMS),
        pricingSignals: s.pricing,
        tone: s.tone,
    }
}

function buildCompetitorItem(s: CompetitorState, context: string): CompetitorWorkItem {
    const chunk = s.chunks[s.next]!
    const isLast = s.next === s.chunks.length - 1
    const first = chunk.blocks[0]!
    const last = chunk.blocks[chunk.blocks.length - 1]!

    const input: Record<string, unknown> = {
        path: s.path,
        title: s.title,
        ...(s.outline ? { outline: s.outline } : {}),
        part: {
            n: s.next + 1,
            of: s.chunks.length,
            isLast,
            blocks: first.id === last.id ? first.id : `${first.id}-${last.id}`,
        },
        ...(s.next > 0
            ? {
                summarySoFar: s.summary,
                alreadyReported: s.raised,
                packagesSoFar: s.packages.map((p) => ({ name: p.name, price: p.price })),
            }
            : {}),
        ...(chunk.before.length
            ? { contextBefore: chunk.before.map((b) => ({ text: b.text.slice(0, 200) })) }
            : {}),
        ...(isLast && s.truncated
            ? {
                note: 'The page is longer than what was captured. Do not comment on content that may exist after the last block.',
            }
            : {}),
        // STRIPPED: only send text to Gemini
        blocks: chunk.blocks.map((b) => ({ text: b.text })),
    }

    return {
        state: s,
        chunk,
        isLast,
        partNo: s.next + 1,
        key: sha1(JSON.stringify([input, context, COMPETITOR_PROMPT_VERSION])),
        input,
        size: chunk.blocks.reduce((n, b) => n + blockSize(b), 0) + 400,
        attempts: 0,
    }
}

function applyCompetitorResult(
    t: CompetitorWorkItem,
    v: CompetitorIntelligence,
    meta: SeoReportMeta,
) {
    const s = t.state

    const addUnique = (dst: string[], src: string[]) => {
        const seen = new Set(dst.map(norm))
        for (const x of src) {
            const k = norm(x)
            if (!seen.has(k)) {
                dst.push(x)
                seen.add(k)
            }
        }
    }
    addUnique(s.claimedAdvantages, v.claimedAdvantages)
    addUnique(s.serviceHighlights, v.serviceHighlights)
    addUnique(s.detectableWeaknesses, v.detectableWeaknesses)
    addUnique(s.promotions, v.promotions ?? [])
    addUnique(s.trustSignals, v.trustSignals)
    addUnique(s.callsToAction, v.callsToAction)
    addUnique(s.serviceAreas, v.serviceAreas)
    mergePackages(s.packages, v.packages)

    s.pricing.hasPricing ||= v.pricingSignals.hasPricing
    s.pricing.financingMentioned ||= v.pricingSignals.financingMentioned
    s.pricing.model ??= v.pricingSignals.model
    s.pricing.priceRangeHint ??= v.pricingSignals.priceRangeHint
    // An actual package price is stronger evidence than the model's flag
    if (s.packages.some((p) => p.price)) s.pricing.hasPricing = true

    if (v.tone) s.tone = v.tone
    if (v.summary) s.summary = v.summary

    s.raised = [...s.raised, ...v.detectableWeaknesses].slice(-MAX_RAISED)

    if (t.isLast) s.final = snapshot(s)

    s.ok++
    s.next++
    if (t.attempts > 1) meta.chunks.retriedOk++
}

export async function analyzeCompetitorPage(
    apiKey: string,
    page: ExtractedPageData,
    options: CompetitorAnalysisOptions = {},
): Promise<CompetitorAnalysisResult> {
    const models = options.models && options.models.length > 0 ? options.models : AVAILABLE_MODELS
    const chunkChars = Math.max(1500, options.chunkChars ?? DEFAULT_CHUNK_CHARS)
    const maxChunks = Math.max(1, options.maxChunksPerPage ?? DEFAULT_MAX_CHUNKS)
    const thinkingLevel = options.thinkingLevel === undefined ? 'LOW' : options.thinkingLevel
    const thinking = thinkingLevel ? { thinkingConfig: { thinkingLevel } as any } : {}

    const state = createCompetitorState(page, chunkChars, maxChunks)
    if (!state) {
        return {
            intelligence: null,
            status: 'failed',
            parts: { total: 0, ok: 0, failed: 0 },
            truncated: false,
            modelsUsed: {},
            tokens: { input: 0, output: 0, thoughts: 0, cached: 0 },
        }
    }

    const ai = new GoogleGenAI({ apiKey })
    const meta: SeoReportMeta = {
        aiEnabled: true,
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

    const config: GenerateContentConfig = {
        systemInstruction: COMPETITOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: competitorResponseSchema,
        // The output is larger now (packages, promotions etc.) and thinking tokens count toward this limit
        maxOutputTokens: 8192,
        ...thinking,
    }

    for (; ;) {
        const items = state.next < state.chunks.length ? [buildCompetitorItem(state, '')] : []
        if (items.length === 0) break

        const toCall: CompetitorWorkItem[] = []
        for (const t of items) {
            meta.chunks.total++
            const hit = cacheGet<CompetitorIntelligence>(t.key)
            if (hit) {
                meta.chunks.cached++
                t.state.cached++
                applyCompetitorResult(t, hit, meta)
            } else {
                toCall.push(t)
            }
        }

        const retryPool: CompetitorWorkItem[] = []
        for (const t of toCall) t.attempts++
        const payload = toCall.map((t, id) => ({ id, ...t.input }))
        const contents = `<items>\n${JSON.stringify(payload)}\n</items>`

        try {
            const out = await generateWithFallback(ai, models, meta, {
                contents,
                config,
                parse: (text) => {
                    const data = JSON.parse(text) as { results?: any[] }
                    if (!Array.isArray(data?.results)) throw new Error('Malformed competitor response')
                    return data.results
                },
            })
            const byId = new Map(out.map((r: any) => [r.id as number, r]))
            toCall.forEach((t, id) => {
                const r = byId.get(id)
                if (!r) {
                    meta.chunks.missing++
                    t.lastError = 'model omitted this id'
                    retryPool.push(t)
                    return
                }
                const value = sanitizeCompetitor(r)
                cacheSet<CompetitorIntelligence>(t.key, value)
                applyCompetitorResult(t, value, meta)
            })
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            console.error('[competitor-analyzer] AI batch failed:', msg)
            for (const t of toCall) t.lastError = msg
            retryPool.push(...toCall)
        }

        for (const t of retryPool) {
            t.attempts++
            try {
                const out = await generateWithFallback(ai, models, meta, {
                    contents: `<items>\n${JSON.stringify([{ id: 0, ...t.input }])}\n</items>`,
                    config,
                    parse: (text) => {
                        const data = JSON.parse(text) as { results?: any[] }
                        if (!Array.isArray(data?.results) || !data.results[0]) {
                            throw new Error('Malformed competitor response')
                        }
                        return data.results
                    },
                })
                const r = out[0]
                if (!r) throw new Error('Empty retry response')
                const value = sanitizeCompetitor(r)
                cacheSet<CompetitorIntelligence>(t.key, value)
                applyCompetitorResult(t, value, meta)
            } catch (e) {
                meta.chunks.failed++
                t.state.failed++
                t.state.summary =
                    `${t.state.summary} [Part ${t.partNo} could not be analysed.]`.trim().slice(-900)
                t.state.next++
            }
        }
    }

    const status: CompetitorAnalysisResult['status'] =
        state.failed === 0 ? 'ok' : state.ok > 0 ? 'partial' : 'failed'

    const intelligence: CompetitorIntelligence | null =
        state.final ?? (state.ok > 0 ? snapshot(state) : null)

    return {
        intelligence,
        status,
        parts: { total: state.chunks.length, ok: state.ok, failed: state.failed },
        truncated: state.truncated,
        modelsUsed: meta.modelsUsed,
        tokens: meta.tokens,
    }
}

export async function analyzeCompetitors(
    apiKey: string | undefined,
    pages: { place_id: string; page: ExtractedPageData }[],
    options: CompetitorAnalysisOptions = {},
): Promise<Map<string, CompetitorAnalysisResult>> {
    const results = new Map<string, CompetitorAnalysisResult>()
    if (!apiKey) {
        for (const { place_id } of pages) {
            results.set(place_id, {
                intelligence: null,
                status: 'failed',
                parts: { total: 0, ok: 0, failed: 0 },
                truncated: false,
                modelsUsed: {},
                tokens: { input: 0, output: 0, thoughts: 0, cached: 0 },
            })
        }
        return results
    }

    const concurrency = Math.max(1, options.concurrency ?? 2)
    const { default: pLimit } = await import('p-limit')
    const limit = pLimit(concurrency)

    await Promise.all(
        pages.map(({ place_id, page }) =>
            limit(async () => {
                const r = await analyzeCompetitorPage(apiKey, page, options)
                results.set(place_id, r)
            }),
        ),
    )

    return results
}