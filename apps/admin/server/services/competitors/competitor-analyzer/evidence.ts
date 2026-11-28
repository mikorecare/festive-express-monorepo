import type { Evidence, Part } from './types'
import { norm } from '../../shared/text'
export function verifyEvidence(raw: unknown, part: Part): Evidence[] {
    if (!Array.isArray(raw)) return []
    const out: Evidence[] = []
    for (const e of raw) {
        if (!e || typeof e.claim !== 'string' || typeof e.quote !== 'string' || typeof e.blockId !== 'string') continue
        const block = part.blocks.find(b => b.id === e.blockId)
        const quote = e.quote.trim()
        if (!block || !quote || !norm(block.text).includes(norm(quote))) continue
        out.push({sourceUrl: part.sourceUrl, blockId: block.id, quote, claim: e.claim.slice(0, 300)})
        if (out.length >= 24) break
    }
    return out
}
