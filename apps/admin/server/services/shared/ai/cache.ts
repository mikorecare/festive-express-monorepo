

// ---- Cache ----------------------------------------------------------------
export const CACHE_TTL_MS = 12 * 60 * 60 * 1000

export const CACHE_MAX = 2000

export const aiCache = new Map<string, { at: number; value: unknown }>()

export function cacheGet<T>(key: string): T | null {
    const hit = aiCache.get(key)
    if (!hit) return null
    if (Date.now() - hit.at > CACHE_TTL_MS) {
        aiCache.delete(key)
        return null
    }
    return hit.value as T
}

export function cacheSet<T>(key: string, value: T): void {
    if (aiCache.size >= CACHE_MAX) {
        const oldest = aiCache.keys().next().value
        if (oldest) aiCache.delete(oldest)
    }
    aiCache.set(key, { at: Date.now(), value })
}
