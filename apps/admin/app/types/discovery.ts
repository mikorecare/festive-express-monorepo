export interface DiscoveryStats {
    returned: number
    existing: number
    newCandidates: number
    detailsRequested: number
    detailsFetched: number
    inserted: number
    skipped: number
    failed: number
    pages: number
}

export interface DiscoveryResponse {
    runId: string
    found: number
    returned: number
    skipped: number
    failed: number
    newPlaceIds: string[]
    stats: DiscoveryStats
}

export interface DiscoveryRun {
    id: string
    query: string
    location: string
    finished_at: string | null
    found_count: number | null
    meta: (Partial<DiscoveryStats> & {
        error?: string
    }) | null
}

export type DiscoveryArea = 'sarasota' | 'florida'

export interface DiscoveryBounds {
    lowLat: number
    lowLng: number
    highLat: number
    highLng: number
}