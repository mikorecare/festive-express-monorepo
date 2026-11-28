import { GoogleGenAI } from '@google/genai'
import { AVAILABLE_MODELS } from '../../shared/ai/models'
import { generateWithFallback } from '../../shared/ai/generate'
import type { AiUsage } from '../../shared/ai/types'
import { sha1 } from '../../shared/text'
import { calculateSiteScore, compareScores, RUBRIC_VERSION } from '../scoring'
import { buildComparisonSite } from './context'
import { comparisonSchema, parseComparison } from './schema'
import { COMPARISON_VERSION, SYSTEM_INSTRUCTION } from './prompts'
import { loadSites, readCached, saveComparison, type Database } from './repository'
export interface CompareOptions { db: Database; apiKey?: string; internalId: string; competitorId: string; refresh?: boolean; cachedOnly?: boolean }
export function validatePair(internalId: unknown, competitorId: unknown) {
    if (typeof internalId !== 'string' || typeof competitorId !== 'string' || !internalId.trim() || !competitorId.trim() || internalId.length > 128 || competitorId.length > 128) throw createError({statusCode:400,statusMessage:'Both competitorId and internalId are required'})
    const pair = {internalId:internalId.trim(), competitorId:competitorId.trim()}
    if (pair.internalId === pair.competitorId) throw createError({statusCode:400,statusMessage:'Pick a different site to compare against.'})
    return pair
}
export async function compareWebsites(options: CompareOptions) {
    const {db, apiKey, refresh, cachedOnly} = options
    const {internalId,competitorId} = validatePair(options.internalId,options.competitorId)
    const sites = await loadSites(db,internalId,competitorId)
    const ours = buildComparisonSite(sites.ours,'O')
    const theirs = buildComparisonSite(sites.theirs,'T')
    const sourceAnalyzedAt = {internal:sites.ours.last_analyzed_at, competitor:sites.theirs.last_analyzed_at}
    const payload = {ourSite:ours,competitorSite:theirs}
    const fingerprint = sha1(JSON.stringify({internalId,competitorId,sourceAnalyzedAt,payload,version:COMPARISON_VERSION,rubric:RUBRIC_VERSION,models:AVAILABLE_MODELS,prompt:SYSTEM_INSTRUCTION,schema:comparisonSchema}))
    if (!refresh || cachedOnly) {
        const cached = await readCached(db,internalId,competitorId,fingerprint)
        if (cached) return {comparison:cached,cached:true}
    }
    if (cachedOnly) throw createError({statusCode:404,statusMessage:'No current comparison. Generate a comparison first.'})
    if (!apiKey) throw createError({statusCode:503,statusMessage:'Gemini API key is not configured'})
    const usage: AiUsage = {modelsUsed:{},tokens:{input:0,output:0,thoughts:0,cached:0}}
    const ai = new GoogleGenAI({apiKey})
    let generated
    try {
        generated = await generateWithFallback(ai,AVAILABLE_MODELS,usage,{
            contents:`Compare OUR site vs the COMPETITOR using the data below. Cover pricing, packages, website/conversion, messaging and content, and end with prioritized actions. Also return the additive rubric assessments.\n<data>${JSON.stringify(payload)}</data>`,
            config:{systemInstruction:SYSTEM_INSTRUCTION,responseMimeType:'application/json',responseSchema:comparisonSchema,maxOutputTokens:16000},
            parse:parseComparison
        })
    } catch (error) {
        console.error('[competitor-compare] Gemini generation failed',error instanceof Error?error.message:String(error))
        throw createError({statusCode:502,statusMessage:'Could not generate competitor comparison'})
    }
    const {assessments,...battlecard} = generated
    const marketingScore = compareScores(calculateSiteScore(assessments.ours,new Set(ours.signals.filter(s=>!s.category.startsWith('places')).map(s=>s.id)),ours.complete),calculateSiteScore(assessments.theirs,new Set(theirs.signals.filter(s=>!s.category.startsWith('places')).map(s=>s.id)),theirs.complete))
    const comparison = {...battlecard, websiteComparison:{...battlecard.websiteComparison, contentQuality:battlecard.websiteComparison.seoAndContent}, dataGaps:[...new Set([...battlecard.dataGaps,...ours.dataGaps.map(g=>`Our site: ${g}`),...theirs.dataGaps.map(g=>`Competitor: ${g}`)])], marketingScore,
        scoreEvidence:{ours:ours.signals,theirs:theirs.signals},
        _meta:{generatedAt:new Date().toISOString(),sourceAnalyzedAt,fingerprint,comparisonVersion:COMPARISON_VERSION,rubricVersion:RUBRIC_VERSION,coverage:{ours:ours.complete,theirs:theirs.complete},...usage}}
    // Reject results if a source was reanalyzed while Gemini was generating.
    const latest = await loadSites(db,internalId,competitorId)
    if (latest.ours.last_analyzed_at !== sourceAnalyzedAt.internal || latest.theirs.last_analyzed_at !== sourceAnalyzedAt.competitor || JSON.stringify(buildComparisonSite(latest.ours,'O'))!==JSON.stringify(ours) || JSON.stringify(buildComparisonSite(latest.theirs,'T'))!==JSON.stringify(theirs)) throw createError({statusCode:409,statusMessage:'Source data changed during comparison. Generate again.'})
    await saveComparison(db,internalId,competitorId,comparison)
    return {comparison,cached:false}
}
