// Deduplicate only identical hints of the same kind. Keep original indexes for
// evidence lookup in seo_raw.blocks. Never remove normal blocks or move quotes
// across URLs: identical text can have different package or service context.
export function uniqueHints(lines: string[], tag: 'price' | 'promo') {
    const seen = new Set<string>()
    return lines.flatMap((text, i) => {
        const key = text.replace(/\s+/g, ' ').trim()
        if (!key || seen.has(key)) return []
        seen.add(key)
        return [{ id: `${tag}-${i}`, tag: 'p', level: 0, selector: tag, line: 0,
            text: `${tag.toUpperCase()}: ${text}` }]
    })
}
