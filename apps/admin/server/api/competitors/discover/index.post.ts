import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { discoverCompetitors } from '~~/server/utils/competitors/discover-competitors'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const apiKey = config.public.googleMapsApiKey
    if (!apiKey) {
        throw createError({ statusCode: 500, statusMessage: 'GOOGLE_MAPS_API_KEY is not configured' })
    }

    const body = await readBody<{
        query?: string
        // Default to a wide box covering Tampa to Naples, FL
        lowLat?: number
        lowLng?: number
        highLat?: number
        highLng?: number
    }>(event)

    const textQuery = (body?.query ?? 'holiday lighting Florida').trim()

    // Default: Tampa (27.9) down to Naples (26.1), and from Gulf coast (-82.8) to inland (-81.9)
    const lowLat = Number(body?.lowLat ?? 26.1)
    const lowLng = Number(body?.lowLng ?? -82.8)
    const highLat = Number(body?.highLat ?? 27.9)
    const highLng = Number(body?.highLng ?? -81.9)

    const supabase = await getAuthenticatedSupabase(event)

    // Start a run row
    const { data: runRow, error: runErr } = await supabase
        .from('competitor_runs')
        .insert({ query: textQuery, location: `Box: ${lowLat},${lowLng} to ${highLat},${highLng}` })
        .select('id')
        .single()
    if (runErr || !runRow) {
        throw createError({ statusCode: 500, statusMessage: runErr?.message ?? 'Failed to start run' })
    }
    const runId = runRow.id as string

    let found
    try {
        found = await discoverCompetitors(apiKey, textQuery, {
            lowLat,
            lowLng,
            highLat,
            highLng,
            maxResults: 20,
        })
    } catch (e) {
        await supabase
            .from('competitor_runs')
            .update({ finished_at: new Date().toISOString(), meta: { error: String(e) } })
            .eq('id', runId)
        throw createError({ statusCode: 502, statusMessage: e instanceof Error ? e.message : 'Places failed' })
    }

    // Upsert on place_id
    if (found.length > 0) {
        const { error: upsertErr } = await supabase.from('competitors').upsert(
            found.map((c) => ({
                place_id: c.place_id,
                name: c.name,
                address: c.address,
                website: c.website,
                phone: c.phone,
                rating: c.rating,
                review_count: c.review_count,
                price_level: c.price_level,
                places_raw: c.places_raw,
                status: 'discovered' as const,
            })),
            { onConflict: 'place_id' },
        )
        if (upsertErr) {
            await supabase
                .from('competitor_runs')
                .update({ finished_at: new Date().toISOString(), meta: { error: upsertErr.message } })
                .eq('id', runId)
            throw createError({ statusCode: 500, statusMessage: upsertErr.message })
        }
    }

    await supabase
        .from('competitor_runs')
        .update({
            finished_at: new Date().toISOString(),
            found_count: found.length,
        })
        .eq('id', runId)

    return { runId, found: found.length }
})