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

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText'

const FIELD_MASK = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.websiteUri',
    'places.nationalPhoneNumber',
    'places.rating',
    'places.userRatingCount',
    'places.priceLevel',
].join(',')

export async function discoverCompetitors(
    apiKey: string,
    textQuery: string,
    // Change opts to take a rectangle instead of lat/lng/radius
    opts: {
        lowLat: number
        lowLng: number
        highLat: number
        highLng: number
        maxResults?: number
    },
): Promise<PlaceCompetitor[]> {
    const res = await fetch(PLACES_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify({
            textQuery,
            maxResultCount: Math.min(opts.maxResults ?? 20, 20), // Max allowed is 20
            locationRestriction: {
                rectangle: {
                    low: { latitude: opts.lowLat, longitude: opts.lowLng },
                    high: { latitude: opts.highLat, longitude: opts.highLng },
                },
            },
        }),
        signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Places ${res.status}: ${body.slice(0, 300)}`)
    }

    const data = (await res.json()) as { places?: any[] }
    return (data.places ?? []).map((p) => ({
        place_id: p.id,
        name: p.displayName?.text ?? '(unnamed)',
        address: p.formattedAddress ?? null,
        website: p.websiteUri ?? null,
        phone: p.nationalPhoneNumber ?? null,
        rating: typeof p.rating === 'number' ? p.rating : null,
        review_count: typeof p.userRatingCount === 'number' ? p.userRatingCount : null,
        price_level: p.priceLevel ?? null,
        places_raw: p,
    }))
}