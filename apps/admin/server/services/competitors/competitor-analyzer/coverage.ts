import type { ExtractedPart, Part } from './types'

export function selectParts(ordered: Part[], previous: Record<string, ExtractedPart>, maxNew: number) {
    const cache: Record<string, ExtractedPart> = {}
    const selected: Part[] = []
    const pending: Part[] = []
    const newKeys = new Set<string>()
    for (const p of ordered) {
        const hit = previous[p.key]
        if (hit?.intelligence && Array.isArray(hit.evidence)) {
            cache[p.key] = hit
            selected.push(p)
        } else if (newKeys.has(p.key)) {
            selected.push(p)
        } else if (pending.length < maxNew) {
            newKeys.add(p.key)
            pending.push(p)
            selected.push(p)
        }
    }
    return { selected, pending, cache, cachedParts: selected.filter(p => !!cache[p.key]).length }
}
