import type { ContentBlock } from '../crawler/types'
import { BLOCK_OVERHEAD, CONTEXT_BLOCKS, MAX_OUTLINE } from './chunk-config'
import type { Chunk, OutlineItem } from './chunk-types'

// ---- Chunking -------------------------------------------------------------
export const blockSize = (b: ContentBlock) => b.text.length + BLOCK_OVERHEAD

export const isMajorHeading = (b: ContentBlock) => b.level > 0 && b.level <= 3

/**
 * Pack blocks into parts of about `budget` chars. Prefer to split right before a
 * heading (once the part is at least half full) and never leave a heading as the
 * last block of a part.
 */
export function buildChunks(
    blocks: ContentBlock[],
    budget: number,
    maxChunks: number,
): { chunks: Chunk[]; truncated: boolean } {
    const groups: ContentBlock[][] = []
    let cur: ContentBlock[] = []
    let size = 0

    for (const b of blocks) {
        const sz = blockSize(b)
        if (cur.length > 0 && size + sz > budget) {
            let cut = cur.length
            let before = 0
            const prefix = cur.map((x) => (before += blockSize(x)))
            for (let j = cur.length - 1; j > 0; j--) {
                if (isMajorHeading(cur[j]!) && prefix[j - 1]! >= size * 0.5) {
                    cut = j
                    break
                }
            }
            if (cut === cur.length && cur.length > 1 && cur[cur.length - 1]!.level > 0) cut = cur.length - 1
            groups.push(cur.slice(0, cut))
            cur = cur.slice(cut)
            size = cur.reduce((s, x) => s + blockSize(x), 0)
        }
        cur.push(b)
        size += sz
    }
    if (cur.length > 0) groups.push(cur)

    const truncated = groups.length > maxChunks
    const kept = groups.slice(0, maxChunks)
    const chunks: Chunk[] = kept.map((g, i) => ({
        blocks: g,
        before: i === 0 ? [] : kept[i - 1]!.slice(-CONTEXT_BLOCKS),
    }))
    return { chunks, truncated }
}

export function outlineOf(blocks: ContentBlock[]): OutlineItem[] {
    return blocks
        .filter((b) => b.level > 0)
        .slice(0, MAX_OUTLINE)
        .map((b) => ({ id: b.id, level: b.level, text: b.text.slice(0, 100) }))
}
