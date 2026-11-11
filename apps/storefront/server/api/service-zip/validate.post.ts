import { getSupabase } from "~~/server/utils/supabase";

interface Body {
    place_id: string
    package: string
    save?: boolean
}

interface PlaceDetailsResponse {
    id?: string
    formattedAddress?: string
    location?: { latitude: number; longitude: number }
    addressComponents?: Array<{
        longText: string
        shortText: string
        types: string[]
    }>
    error?: { code: number; message: string; status: string }
}

const PRICE_PER_FOOT = 10
const MAX_MINUTES = 45

export default defineEventHandler(async (event) => {
    const body = await readBody<Body>(event)
    const placeId = body?.place_id?.trim()
    const pkg = body?.package?.trim()

    if (!placeId) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'missing_address',
            message: 'Please choose a valid address.',
        }
    }
    if (!pkg) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'missing_package',
            message: 'Please choose a package first.',
        }
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
        console.error('[service-zip] Missing GOOGLE_MAPS_API_KEY')
        return {
            in_service_area: false,
            ok: false,
            reason: 'server_error',
            message: 'We’re having trouble checking your address right now. Please try again.',
        }
    }

    // 1. Place Details
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
    let placeRes: Response
    try {
        placeRes = await fetch(url, {
            headers: {
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'id,formattedAddress,location,addressComponents',
            },
        })
    } catch (e) {
        console.error('[service-zip] Place fetch failed', e)
        return {
            in_service_area: false,
            ok: false,
            reason: 'lookup_failed',
            message: 'We couldn’t look up that address. Please try again.',
        }
    }

    if (!placeRes.ok) {
        console.error('[service-zip] Place lookup non-OK', placeRes.status, await placeRes.text())
        return {
            in_service_area: false,
            ok: false,
            reason: 'lookup_failed',
            message: 'We couldn’t find that address. Please try another.',
        }
    }

    const place = (await placeRes.json()) as PlaceDetailsResponse

    if (!place.id || !place.location) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'invalid_place',
            message: 'We couldn’t find that address. Please try another.',
        }
    }

    // 2. Extract components
    const comps = place.addressComponents ?? []
    const get = (type: string) => comps.find((c) => c.types.includes(type))?.longText
    const getShort = (type: string) => comps.find((c) => c.types.includes(type))?.shortText

    const postal_code = get('postal_code')
    const country = get('country') || 'United States'
    const city = get('locality') || get('administrative_area_level_2')
    const state = getShort('administrative_area_level_1')

    // 3. No ZIP
    if (!postal_code) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'no_postal_code',
            message: 'We couldn’t determine a ZIP code for that address. Please pick a more specific address.',
            place_id: place.id,
            formatted_address: place.formattedAddress,
            country,
            city,
            state,
            lat: place.location.latitude,
            lng: place.location.longitude,
        }
    }

    const supabase = getSupabase()

    // 4. Cached? (exclude the origin row)
    const { data: existing, error: fetchErr } = await supabase
        .from('service_zips')
        .select('*')
        .eq('postal_code', postal_code)
        .eq('country', country)
        .eq('is_origin', false)
        .maybeSingle()

    if (fetchErr) {
        console.error('[service-zip] cache lookup failed', fetchErr)
        return {
            in_service_area: false,
            ok: false,
            reason: 'server_error',
            message: 'We’re having trouble checking your address right now. Please try again.',
        }
    }

    let distanceMeters: number | null = existing?.distance_meters ?? null
    let distanceMiles: number | null = existing?.distance_miles ?? null
    let durationSeconds: number | null = existing?.duration_seconds ?? null

    // 5. Compute distance if not cached
    if (!existing) {
        const { data: origin, error: originErr } = await supabase
            .from('service_zips')
            .select('id, lat, lng, place_id')
            .eq('is_origin', true)
            .single()

        if (originErr || !origin) {
            console.error('[service-zip] origin missing', originErr)
            return {
                in_service_area: false,
                ok: false,
                reason: 'server_error',
                message: 'We’re having trouble checking your address right now. Please try again.',
            }
        }

        let routesRes: Response
        try {
            routesRes = await fetch(
                'https://routes.googleapis.com/directions/v2:computeRoutes',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': apiKey,
                        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
                    },
                    body: JSON.stringify({
                        origin: origin.place_id
                            ? { placeId: origin.place_id }
                            : { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
                        destination: { placeId },
                        travelMode: 'DRIVE',
                        routingPreference: 'TRAFFIC_UNAWARE',
                    }),
                },
            )
        } catch (e) {
            console.error('[service-zip] routes fetch failed', e)
            return {
                in_service_area: false,
                ok: false,
                reason: 'routing_failed',
                message: 'We couldn’t check the drive time for that address. Please try again.',
            }
        }

        if (!routesRes.ok) {
            console.error('[service-zip] routes non-OK', routesRes.status, await routesRes.text())
            return {
                in_service_area: false,
                ok: false,
                reason: 'routing_failed',
                message: 'We couldn’t check the drive time for that address. Please try again.',
            }
        }

        const route = ((await routesRes.json()) as any).routes?.[0]
        if (!route?.distanceMeters) {
            return {
                in_service_area: false,
                ok: false,
                reason: 'no_route',
                message: 'We couldn’t find a driving route to that address. Please try another.',
            }
        }

        distanceMeters = route.distanceMeters
        distanceMiles = Number((distanceMeters! / 1609.344).toFixed(2))
        durationSeconds = route.duration
            ? parseInt(String(route.duration).replace('s', ''), 10)
            : null
    }

    // 6. Insert when requested
    let saved: typeof existing = null

    if (body.save && !existing) {
        const { data: inserted, error: insertErr } = await supabase
            .from('service_zips')
            .insert({
                postal_code,
                country,
                city,
                state,
                formatted_address: place.formattedAddress,
                place_id: place.id,
                lat: place.location.latitude,
                lng: place.location.longitude,
                distance_meters: distanceMeters,
                distance_miles: distanceMiles,
                duration_seconds: durationSeconds,
                is_origin: false,
                category: 'service',
            })
            .select()
            .single()

        if (insertErr && insertErr.code !== '23505') {
            console.error('[service-zip] insert failed', insertErr)
        }
        saved = inserted ?? null
    }

    // 7. Duration gate — ≤ MAX_MINUTES
    const durationMinutes = durationSeconds != null ? durationSeconds / 60 : null

    if (durationMinutes == null) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'no_duration',
            message: 'We couldn’t determine the drive time for that address. Please try another.',
            place_id: place.id,
            formatted_address: place.formattedAddress,
            postal_code,
            country,
            city,
            state,
            lat: place.location.latitude,
            lng: place.location.longitude,
            distance_meters: distanceMeters,
            distance_miles: distanceMiles,
            duration_seconds: durationSeconds,
            duration_minutes: null,
            cached: !!existing,
            saved,
        }
    }

    if (durationMinutes > MAX_MINUTES) {
        return {
            in_service_area: false,
            ok: false,
            reason: 'out_of_range',
            message: 'This address is outside our serviceable area. Please pick a different address.',
            place_id: place.id,
            formatted_address: place.formattedAddress,
            postal_code,
            country,
            city,
            state,
            lat: place.location.latitude,
            lng: place.location.longitude,
            distance_meters: distanceMeters,
            distance_miles: distanceMiles,
            duration_seconds: durationSeconds,
            duration_minutes: Number(durationMinutes.toFixed(1)),
            cached: !!existing,
            saved,
        }
    }

    // 8. Forward to estimator
    const config = useRuntimeConfig()
    const target = `${config.estimatorApiUrl}/api/overage`

    try {
        const estimatorRes = await fetch(target, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: place.formattedAddress,
                pricePerFoot: PRICE_PER_FOOT,
                package: pkg,
            }),
        })

        const estimatorData = await estimatorRes.json().catch(() => null)
        console.log('[service-zip] estimator response:', estimatorData)
        if (!estimatorRes.ok) {
            console.error('[service-zip] estimator non-OK', estimatorRes.status, estimatorData)
            return {
                in_service_area: true,
                ok: false,
                reason: 'estimator_error',
                message: 'We couldn’t calculate pricing for that address. Please try again or contact us.',
                place_id: place.id,
                formatted_address: place.formattedAddress,
                postal_code,
                country,
                city,
                state,
                lat: place.location.latitude,
                lng: place.location.longitude,
                distance_meters: distanceMeters,
                distance_miles: distanceMiles,
                duration_seconds: durationSeconds,
                duration_minutes: Number(durationMinutes.toFixed(1)),
                cached: !!existing,
                saved,
            }
        }

        return {
            in_service_area: true,
            ok: true,
            place_id: place.id,
            formatted_address: place.formattedAddress,
            postal_code,
            country,
            city,
            state,
            lat: place.location.latitude,
            lng: place.location.longitude,
            distance_meters: distanceMeters,
            distance_miles: distanceMiles,
            duration_seconds: durationSeconds,
            duration_minutes: Number(durationMinutes.toFixed(1)),
            cached: !!existing,
            saved,
            estimator: estimatorData,
        }
    } catch (error: any) {
        console.error('[service-zip] estimator unreachable', error)
        return {
            in_service_area: true,
            ok: false,
            reason: 'estimator_unreachable',
            message: 'We couldn’t calculate pricing for that address. Please try again or contact us.',
            place_id: place.id,
            formatted_address: place.formattedAddress,
            postal_code,
            country,
            city,
            state,
            lat: place.location.latitude,
            lng: place.location.longitude,
            distance_meters: distanceMeters,
            distance_miles: distanceMiles,
            duration_seconds: durationSeconds,
            duration_minutes: Number(durationMinutes.toFixed(1)),
            cached: !!existing,
            saved,
        }
    }
})