import { addIssue, type Entry } from './rules'
import { isNoindex } from './helpers'
import type { ExtractedPageData } from '../shared/crawler/types'

export function applyDuplicateChecks(entries: Entry[]) {
    const indexable = entries.filter(
        (e) => !e.raw.fetchError && e.raw.status < 400 && !isNoindex(e.raw),
    )

    const groupsBy = (pick: (p: ExtractedPageData) => string) => {
        const map = new Map<string, Entry[]>()
        for (const e of indexable) {
            const key = pick(e.raw).toLowerCase().trim()
            if (!key) continue
            map.set(key, [...(map.get(key) ?? []), e])
        }
        return [...map.values()].filter((g) => g.length > 1)
    }

    const titles = groupsBy((p) => p.title)
    const descriptions = groupsBy((p) => p.metaDescription)
    const h1s = groupsBy((p) => p.h1s[0] ?? '')

    for (const g of titles)
        for (const e of g)
            addIssue(
                e,
                'warning',
                'metadata',
                `Duplicate title (shared with ${g.length - 1} other page${g.length > 2 ? 's' : ''})`,
                'Give each page a unique title that reflects its own topic.',
                4,
            )
    for (const g of descriptions)
        for (const e of g)
            addIssue(
                e,
                'warning',
                'metadata',
                `Duplicate meta description (shared with ${g.length - 1} other page${g.length > 2 ? 's' : ''})`,
                'Write a unique description for each page.',
                3,
            )
    for (const g of h1s)
        for (const e of g)
            addIssue(
                e,
                'info',
                'content',
                `Same H1 as ${g.length - 1} other page${g.length > 2 ? 's' : ''}`,
                'Differentiate H1s so each page targets its own topic.',
                2,
            )

    return { titles: titles.length, descriptions: descriptions.length, h1s: h1s.length }
}
