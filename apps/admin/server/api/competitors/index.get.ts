import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)

    const limit = Math.max(
        1,
        Math.min(Number(q.limit) || 50, 200),
    )

    const search = String(q.search ?? '').trim()
    const status = String(q.status ?? '').trim()

    const placeIds = [
        ...new Set(
            String(q.placeIds ?? '')
                .split(',')
                .map(id => id.trim())
                .filter(Boolean),
        ),
    ]

    if (placeIds.length > 60) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Too many Place IDs',
        })
    }

    const supabase = await getAuthenticatedSupabase(event)

    let query = supabase
        .from('competitors')
        .select(`
            id,
            place_id,
            created_at,
            updated_at,
            name,
            website,
            address,
            phone,
            rating,
            review_count,
            price_level,
            status,
            is_internal,
            intelligence,
            last_scraped_at,
            last_analyzed_at,
            error
        `)
        .order('created_at', {
            ascending: false,
        })
        .limit(limit)

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    if (status) {
        query = query.eq('status', status)
    }

    if (placeIds.length > 0) {
        query = query.in('place_id', placeIds)
    }

    const { data, error } = await query

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return {
        competitors: data ?? [],
    }
})