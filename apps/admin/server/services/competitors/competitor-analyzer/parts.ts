import { buildChunks } from '../../shared/ai/chunking'
import { sha1 } from '../../shared/text'
import { VERSION } from './config'
import { uniqueHints } from './deduplicate'
import type { AnalysisPage, Part } from './types'
export function planParts(page: AnalysisPage, budget: number, max: number, policy: unknown) {
    const blocks = [...uniqueHints(page.priceLines ?? [], 'price'), ...uniqueHints(page.promoLines ?? [], 'promo'), ...page.blocks]
    if (!blocks.length && page.bodySnippet) blocks.push({id:'body',tag:'body',level:0,selector:'body',line:0,text:page.bodySnippet})
    const all = buildChunks(blocks,budget,Number.MAX_SAFE_INTEGER).chunks
    const parts: Part[] = all.slice(0,max).map(c => {
        const input = {sourceUrl: page.finalUrl, title: page.title, blocks:c.blocks, before:c.before}
        return {...input, key:sha1(JSON.stringify([VERSION,policy,input.sourceUrl,input.title,c.blocks.map(b=>[b.id,b.tag,b.text]),c.before.map(b=>[b.id,b.tag,b.text])])),size:JSON.stringify(input).length}
    })
    return {parts, omitted:all.length-parts.length}
}
