import type { ContentBlock } from '../crawler/types'

export interface Chunk {
    blocks: ContentBlock[]
    /** Tail of the previous part, for continuity only */
    before: ContentBlock[]
}

export interface OutlineItem {
    id: string
    level: number
    text: string
}
