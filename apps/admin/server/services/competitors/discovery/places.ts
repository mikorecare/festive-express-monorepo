import { PLACES_BASE_URL, PLACES_SEARCH_URL, SEARCH_FIELD_MASK, DETAILS_FIELD_MASK, PAGE_SIZE, MAX_SEARCH_PAGES, MAX_SEARCH_RESULTS, REQUEST_TIMEOUT_MS } from './config'
import type { DiscoveryOptions, GooglePlace, PlaceCompetitor, PlacesSearchResponse } from './types'

async function requestPlaces<T>(url: string, apiKey: string, fieldMask: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': fieldMask },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Places ${res.status}: ${body.slice(0, 300)}`)
    }
    return await res.json() as T
}

export async function searchPlaceIds(apiKey: string, textQuery: string, opts: DiscoveryOptions): Promise<{ ids: string[]; pages: number }> {
    const ids = new Set<string>()
    const seenTokens = new Set<string>()
    let pageToken: string | undefined
    let pages = 0
    const searchBody = {
        textQuery,
        pageSize: PAGE_SIZE,
        locationRestriction: { rectangle: {
            low: { latitude: opts.lowLat, longitude: opts.lowLng },
            high: { latitude: opts.highLat, longitude: opts.highLng },
        } },
    }
    while (pages < MAX_SEARCH_PAGES && ids.size < MAX_SEARCH_RESULTS) {
        const data = await requestPlaces<PlacesSearchResponse>(PLACES_SEARCH_URL, apiKey, SEARCH_FIELD_MASK, {
            method: 'POST',
            body: JSON.stringify({ ...searchBody, ...(pageToken ? { pageToken } : {}) }),
        })
        pages++
        for (const place of data.places ?? []) if (place.id) ids.add(place.id)
        pageToken = data.nextPageToken
        if (!pageToken || seenTokens.has(pageToken)) break
        seenTokens.add(pageToken)
    }
    return { ids: [...ids].slice(0, MAX_SEARCH_RESULTS), pages }
}

export async function fetchPlaceDetails(apiKey: string, placeId: string): Promise<PlaceCompetitor> {
    const place = await requestPlaces<GooglePlace>(`${PLACES_BASE_URL}/${encodeURIComponent(placeId)}`, apiKey, DETAILS_FIELD_MASK, { method: 'GET' })
    if (!place.id) throw new Error('Place Details returned no Place ID')
    return {
        place_id: place.id,
        name: place.displayName?.text ?? '(unnamed)',
        address: place.formattedAddress ?? null,
        website: place.websiteUri ?? null,
        phone: place.nationalPhoneNumber ?? null,
        rating: typeof place.rating === 'number' ? place.rating : null,
        review_count: typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
        price_level: place.priceLevel ?? null,
        places_raw: place,
    }
}
