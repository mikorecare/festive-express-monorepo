export interface PlaceCompetitor {
    place_id: string
    name: string
    address: string | null
    website: string | null
    phone: string | null
    rating: number | null
    review_count: number | null
    price_level: string | null
    places_raw: unknown
}
export interface DiscoveryOptions {
    lowLat: number
    lowLng: number
    highLat: number
    highLng: number
    maxResults?: number
}
export interface GooglePlace {
    id: string
    displayName?: { text?: string; languageCode?: string }
    formattedAddress?: string
    websiteUri?: string
    nationalPhoneNumber?: string
    rating?: number
    userRatingCount?: number
    priceLevel?: string
}
export interface PlacesSearchResponse {
    places?: { id?: string }[]
    nextPageToken?: string
}
export interface DiscoveryFailure { placeId: string; error: string }
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
export interface DiscoveryResult {
    competitors: PlaceCompetitor[]
    stats: DiscoveryStats
    failures: DiscoveryFailure[]
}
