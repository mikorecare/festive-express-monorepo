import type { GoogleGenAI, GenerateContentConfig } from '@google/genai'
import type { AiUsage } from './types'
import { sleep } from '../text'

// ---- Model fallback -------------------------------------------------------
export const cooldownUntil = new Map<string, number>()

export type ErrorKind = 'fatal' | 'busy' | 'missing' | 'other'

export function classifyError(e: any): ErrorKind {
    const status: number | undefined = e?.status ?? e?.code ?? e?.error?.code
    const msg = String(e?.message ?? '')
    if (status === 401 || /API key/i.test(msg)) return 'fatal'
    if (status === 404 || status === 403 || /not found|no longer available|not supported for/i.test(msg))
        return 'missing'
    if (
        status === 429 ||
        (typeof status === 'number' && status >= 500) ||
        /UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand|timed? ?out/i.test(msg)
    )
        return 'busy'
    return 'other'
}

export async function generateWithFallback<T>(
    ai: GoogleGenAI,
    models: readonly string[],
    meta: AiUsage,
    req: { contents: string; config: GenerateContentConfig; parse: (text: string) => T },
): Promise<T> {
    const errors: string[] = []

    for (let pass = 0; pass < 2; pass++) {
        const live = models.filter((m) => (cooldownUntil.get(m) ?? 0) <= Date.now())
        const chain = live.length > 0 ? live : models
        let sawBusy = false

        for (const model of chain) {
            try {
                const res = await ai.models.generateContent({
                    model,
                    contents: req.contents,
                    config: req.config,
                })

                const u = res.usageMetadata
                meta.tokens.input += u?.promptTokenCount ?? 0
                meta.tokens.output += u?.candidatesTokenCount ?? 0
                meta.tokens.thoughts += u?.thoughtsTokenCount ?? 0
                meta.tokens.cached += u?.cachedContentTokenCount ?? 0

                if (!res.text) throw new Error('Empty response')
                const value = req.parse(res.text)
                meta.modelsUsed[model] = (meta.modelsUsed[model] ?? 0) + 1
                return value
            } catch (e: any) {
                const kind = classifyError(e)
                errors.push(`${model}: ${String(e?.message ?? e).slice(0, 120)}`)
                if (kind === 'fatal') throw e
                if (kind === 'busy') {
                    sawBusy = true
                    cooldownUntil.set(model, Date.now() + 60_000)
                }
                if (kind === 'missing') cooldownUntil.set(model, Date.now() + 60 * 60_000)
            }
        }

        if (!sawBusy) break
        await sleep(1500)
    }

    throw new Error(`All Gemini models failed: ${errors.join(' | ')}`)
}
