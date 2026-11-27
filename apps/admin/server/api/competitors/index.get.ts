import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const limit = Math.min(Number(q.limit) || 50, 200)
    const search = String(q.search ?? '').trim()
    const status = String(q.status ?? '').trim()

    const supabase = await getAuthenticatedSupabase(event)

    let query = supabase
        .from('competitors')
        .select(
            'id, created_at, updated_at, name, website, address, phone, rating, review_count, price_level, status, is_internal, intelligence, last_scraped_at, last_analyzed_at, error',
        )
        .order('created_at', { ascending: false })
        .limit(limit)

    if (search) query = query.ilike('name', `%${search}%`)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return { competitors: data ?? [] }
})