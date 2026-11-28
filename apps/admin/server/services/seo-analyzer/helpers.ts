import type { ExtractedPageData, ElementRef } from '../shared/crawler/types'
import type { IssueLocation } from './types'

export const isNoindex = (p: ExtractedPageData) => /\b(noindex|none)\b/.test(p.robots ?? '')

export const toLocation = (r: ElementRef): IssueLocation => ({
    selector: r.selector,
    line: r.line,
    snippet: r.html,
    text: r.text,
})
