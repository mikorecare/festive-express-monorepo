import type { Severity, IssueCategory } from './types'

export const PROMPT_VERSION = 'chunked-v2'

export const MAX_AI_ISSUES_PER_PART = 3

export const MAX_AI_ISSUES_PER_PAGE = 10

export const SEVERITIES: Severity[] = ['critical', 'warning', 'info']

export const CATEGORIES: IssueCategory[] = ['technical', 'content', 'metadata']
