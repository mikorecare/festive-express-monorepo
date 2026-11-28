export function packBatches<T extends { size: number }>(items: T[], maxItems: number, maxChars: number): T[][] {
    const batches: T[][] = []
    let cur: T[] = []
    let size = 0
    for (const t of items) {
        if (cur.length > 0 && (cur.length >= maxItems || size + t.size > maxChars)) {
            batches.push(cur)
            cur = []
            size = 0
        }
        cur.push(t)
        size += t.size
    }
    if (cur.length > 0) batches.push(cur)
    return batches
}
