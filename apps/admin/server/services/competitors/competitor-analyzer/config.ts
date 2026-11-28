export const VERSION = 'competitor-independent-v2-original-contract'
export const MAX_ITEMS_PER_PART = 6
export const MAX_INCLUDES = 10
export const MAX_PACKAGES = 12
export const MAX_LIST_ITEMS = 12

export const TONES = ["Budget/Value", "Mid-market", "Premium/Luxury", "Local/Family-Owned", "Corporate/Professional", "Unclear"] as const
export function normalizeTone(value: unknown): string { return TONES.find(t => t === value) ?? "Unclear" }

// Competitor-specific limits; technical SEO uses its existing shared settings.
export const MAX_CAPTURE_PAGES = 50
export const MAX_DISCOVERY_CANDIDATES = 150
export const MAX_COMPETITOR_CHUNKS_PER_PAGE = 32
// Maximum uncached parts per run, not a lifetime limit on reviewed parts.
export const MAX_NEW_PARTS_PER_RUN = 160
