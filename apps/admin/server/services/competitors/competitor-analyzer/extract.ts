import type { GoogleGenAI } from '@google/genai'
import type { AiUsage } from '../../shared/ai/types'
import { generateWithFallback } from '../../shared/ai/generate'
import { extractSchema } from './schema'
import { EXTRACT_PROMPT } from './prompts'
import { sanitizeCompetitor } from './sanitize'
import { verifyEvidence } from './evidence'
import type { Part, ExtractedPart, AnalysisOptions } from './types'
export async function extractBatch(ai: GoogleGenAI, models: readonly string[], usage: AiUsage, batch: Part[], options: AnalysisOptions) {
    const thinkingLevel = options.thinkingLevel === undefined ? 'LOW' : options.thinkingLevel
    const out = await generateWithFallback(ai, models, usage, {
        contents: JSON.stringify(batch.map((p,id) => ({id, url:p.sourceUrl,title:p.title,blocks:p.blocks.map(b=>({id:b.id,tag:b.tag,text:b.text})),contextBefore:p.before.map(b=>({text:b.text}))}))),
        config: {systemInstruction:EXTRACT_PROMPT,responseMimeType:'application/json',responseSchema:extractSchema,maxOutputTokens:8192,...(thinkingLevel ? {thinkingConfig:{thinkingLevel} as any}: {})},
        parse: text => { const r=JSON.parse(text); if (!Array.isArray(r.results)) throw new Error('Invalid results'); return r.results as any[] }
    })
    const results = new Map<string, ExtractedPart>()
    for (const [id,p] of batch.entries()) {
        const r = out.find(x=>x?.id===id)
        if (!r || typeof r.summary !== 'string' || !Array.isArray(r.packages) || !Array.isArray(r.evidence) || !['claimedAdvantages','serviceHighlights','promotions','trustSignals','callsToAction','serviceAreas'].every(k=>Array.isArray(r[k])) || !r.pricingSignals || typeof r.pricingSignals.hasPricing !== 'boolean') continue
        const intelligence = sanitizeCompetitor(r)
        intelligence.detectableWeaknesses = []
        results.set(p.key,{intelligence,evidence:verifyEvidence(r.evidence,p)})
    }
    return results
}
