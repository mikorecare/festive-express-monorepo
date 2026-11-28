import { getAuthenticatedSupabase } from '~~/server/utils/auth'

import {
    discoverCompetitors,
} from '~~/server/services/competitors/discover-competitors'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const apiKey = config.public.googleMapsApiKey

    const supabase = await getAuthenticatedSupabase(event)

    if (!apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'GOOGLE_MAPS_API_KEY is not configured',
        })
    }

    const body = await readBody<{
        query?: string
        lowLat?: number
        lowLng?: number
        highLat?: number
        highLng?: number
    }>(event)

    const textQuery = (
        body?.query ?? 'holiday lighting Florida'
    ).trim()

    // Default area: Tampa to Naples, Florida.
    const lowLat = Number(body?.lowLat ?? 26.1)
    const lowLng = Number(body?.lowLng ?? -82.8)
    const highLat = Number(body?.highLat ?? 27.9)
    const highLng = Number(body?.highLng ?? -81.9)

    // Validate search query.
    if (!textQuery) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Search query is required',
        })
    }

    // Validate geographic boundaries.
    const coordinates = [
        lowLat,
        lowLng,
        highLat,
        highLng,
    ]

    if (
        !coordinates.every(Number.isFinite) ||
        lowLat < -90 ||
        highLat > 90 ||
        lowLng < -180 ||
        highLng > 180 ||
        lowLat >= highLat ||
        lowLng >= highLng
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid search boundaries',
        })
    }

    // --------------------------------------------------
    // Start discovery run.
    // --------------------------------------------------

    const { data: runRow, error: runErr } = await supabase
        .from('competitor_runs')
        .insert({
            query: textQuery,
            location:
                `Box: ${lowLat},${lowLng} ` +
                `to ${highLat},${highLng}`,
        })
        .select('id')
        .single()

    if (runErr || !runRow) {
        throw createError({
            statusCode: 500,
            statusMessage:
                runErr?.message ?? 'Failed to start run',
        })
    }

    const runId = runRow.id as string

    // --------------------------------------------------
    // Execute IDs-first discovery.
    // --------------------------------------------------

    let result

    try {
        result = await discoverCompetitors(
            apiKey,
            textQuery,
            {
                lowLat,
                lowLng,
                highLat,
                highLng,
                maxResults: 20,
            },
            supabase,
        )
    } catch (e) {
        const message =
            e instanceof Error
                ? e.message
                : String(e)

        const { error: logErr } = await supabase
            .from('competitor_runs')
            .update({
                finished_at: new Date().toISOString(),
                meta: {
                    error: message,
                },
            })
            .eq('id', runId)

        if (logErr) {
            console.error(
                '[discovery] Failed to record run error:',
                logErr.message,
            )
        }

        throw createError({
            statusCode: 500,
            statusMessage: message,
        })
    }

    // --------------------------------------------------
    // Complete discovery run.
    // --------------------------------------------------

    const { stats, failures } = result

    const { error: finishErr } = await supabase
        .from('competitor_runs')
        .update({
            finished_at: new Date().toISOString(),

            // Count only newly inserted competitors.
            found_count: stats.inserted,

            meta: {
                ...stats,
                failures,
            },
        })
        .eq('id', runId)

    if (finishErr) {
        console.error(
            '[discovery] Failed to finalize run:',
            finishErr.message,
        )

        // Do not report discovery as failed when
        // competitors have already been inserted.
    }

    // --------------------------------------------------
    // Preserve existing response keys.
    // Additional statistics are backward-compatible.
    // --------------------------------------------------

    return {
        runId,
        found: stats.inserted,
        returned: stats.returned,
        skipped: stats.skipped,
        failed: stats.failed,
        stats,

        newPlaceIds: result.competitors.map(
            competitor => competitor.place_id,
        ),
    }
})