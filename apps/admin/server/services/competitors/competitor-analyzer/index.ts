import { GoogleGenAI } from '@google/genai'
import pLimit from 'p-limit'
import { AVAILABLE_MODELS } from '../../shared/ai/models'
import { packBatches } from '../../shared/ai/batching'
import { DEFAULT_CHUNK_CHARS, DEFAULT_BATCH_CHARS } from '../../shared/ai/chunk-config'
import type { AiUsage } from '../../shared/ai/types'
import { planParts } from './parts'
import { MAX_COMPETITOR_CHUNKS_PER_PAGE, MAX_NEW_PARTS_PER_RUN } from './config'
import { prioritizePages } from './page-priority'
import { selectParts } from './coverage'
import { extractBatch } from './extract'
import { mergeFacts } from './merge'
import { synthesize } from './synthesis'
import type { AnalysisPage, AnalysisOptions, SiteAnalysisResult, Part } from './types'
export type { AnalysisPage, AnalysisOptions, SiteAnalysisResult, Evidence } from './types'
const positive = (n:number|undefined, fallback:number, min=1) => Number.isFinite(n) ? Math.max(min,Math.floor(n!)) : fallback
export async function analyzeCompetitorSite(apiKey:string|undefined, pages:AnalysisPage[], options:AnalysisOptions={}):Promise<SiteAnalysisResult> {
    const models = options.models?.length ? options.models : AVAILABLE_MODELS
    const usage:AiUsage={modelsUsed:{},tokens:{input:0,output:0,thoughts:0,cached:0}}
    pages = prioritizePages(pages)
    const plans = pages.map(p=>planParts(p,positive(options.chunkChars,DEFAULT_CHUNK_CHARS,1500),positive(options.maxChunksPerPage,MAX_COMPETITOR_CHUNKS_PER_PAGE),{models,thinking:options.thinkingLevel===undefined?'LOW':options.thinkingLevel}))
    const planned = plans.flatMap(p=>p.parts)
    // Round-robin across pages so a long page cannot consume the entire site budget.
    const ordered:Part[]=[]
    for(let i=0;i<Math.max(0,...plans.map(p=>p.parts.length));i++) for(const p of plans) if(p.parts[i]) ordered.push(p.parts[i]!)
    // Reuse all matching cached parts, then spend the bounded budget only on new work.
    const { selected, pending, cache, cachedParts } = selectParts(
        ordered, options.previousCache ?? {}, positive(options.maxTotalParts, MAX_NEW_PARTS_PER_RUN),
    )
    const omittedByPageLimit = plans.reduce((n,p)=>n+p.omitted,0)
    const omittedByRunBudget = planned.length-selected.length
    const omitted = omittedByPageLimit + omittedByRunBudget
    const ai=apiKey?new GoogleGenAI({apiKey}):null
    if(ai){
        const limit=pLimit(positive(options.concurrency,2))
        const run=async(batch:Part[])=>{try{for(const [key,value] of await extractBatch(ai,models,usage,batch,options)) cache[key]=value}catch(e){console.error('[competitor-extract]',e instanceof Error?e.message:String(e))}}
        await Promise.all(packBatches(pending,positive(options.batchSize,3),positive(options.batchChars,DEFAULT_BATCH_CHARS)).map(b=>limit(()=>run(b))))
        await Promise.all(pending.filter(p=>!cache[p.key]).map(p=>limit(()=>run([p]))))
    }
    const successful=selected.filter(p=>!!cache[p.key]); const failed=selected.length-successful.length
    const fullyReviewedPages=plans.filter((p,i)=>p.parts.length>0&&!p.omitted&&!pages[i]!.contentTruncated&&!pages[i]!.likelyClientRendered&&p.parts.every(x=>!!cache[x.key])).length
    const truncated=!!options.incompleteCapture||omitted>0||pages.some(p=>p.contentTruncated||p.likelyClientRendered)||plans.some(p=>!p.parts.length)
    const values=[...new Set(successful.map(p=>p.key))].map(k=>cache[k]!)
    let intelligence=values.length?mergeFacts(values.map(v=>v.intelligence)):null
    let synthesisOk=false
    if(intelligence){
        const summaries=values.map(v=>v.intelligence.summary)
        intelligence.summary=summaries.join(' ').slice(0,600)
        if(ai) try{Object.assign(intelligence,await synthesize(ai,models,usage,intelligence,summaries,truncated||failed>0));synthesisOk=true}catch(e){console.error('[competitor-synthesis]',e instanceof Error?e.message:String(e))}
    }
    return {intelligence,status:!intelligence?'failed':failed||truncated||!synthesisOk?'partial':'ok',parts:{total:selected.length,ok:successful.length,failed},truncated,...usage,evidence:values.flatMap(v=>v.evidence),cache,coverage:{pages:pages.length,fullyReviewedPages,plannedParts:planned.length+plans.reduce((n,p)=>n+p.omitted,0),cachedParts,omittedParts:omitted,synthesisOk,omittedByPageLimit,omittedByRunBudget,newPartsRequested:pending.length,capture:options.captureDiagnostics}}
}
export function analyzeCompetitorPage(apiKey:string,page:AnalysisPage,options:AnalysisOptions={}) {return analyzeCompetitorSite(apiKey,[page],options)}
export async function analyzeCompetitors(apiKey:string|undefined,pages:{place_id:string;page:AnalysisPage}[],options:AnalysisOptions={}) {
    const limit=pLimit(positive(options.concurrency,2)); const results=new Map<string,SiteAnalysisResult>()
    await Promise.all(pages.map(({place_id,page})=>limit(async()=>{results.set(place_id,await analyzeCompetitorSite(apiKey,[page],{...options,concurrency:1}))})))
    return results
}
