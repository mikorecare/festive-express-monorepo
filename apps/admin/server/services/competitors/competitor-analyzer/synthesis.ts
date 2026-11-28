import type { GoogleGenAI } from '@google/genai'
import type { AiUsage } from '../../shared/ai/types'
import { generateWithFallback } from '../../shared/ai/generate'
import type { CompetitorIntelligence } from '../types'
import { SYNTHESIS_PROMPT } from './prompts'
import { synthesisSchema } from './schema'
import { uniqStrings } from './sanitize'
import { normalizeTone } from './config'
import { fit } from '../../shared/text'
export async function synthesize(ai:GoogleGenAI, models:readonly string[], usage:AiUsage, facts:CompetitorIntelligence, summaries:string[], incomplete:boolean) {
    return generateWithFallback(ai,models,usage,{
        contents:JSON.stringify({facts,summaries,incomplete}),
        config:{systemInstruction:SYNTHESIS_PROMPT,responseMimeType:'application/json',responseSchema:synthesisSchema,maxOutputTokens:2048},
        parse:text=>{const r=JSON.parse(text); if(typeof r.summary!=='string'||!r.summary.trim()||typeof r.tone!=='string'||!Array.isArray(r.detectableWeaknesses)) throw new Error('Invalid synthesis'); return {summary:fit(r.summary,600),tone:normalizeTone(r.tone),detectableWeaknesses:incomplete?[]:uniqStrings(r.detectableWeaknesses,12)} }
    })
}
