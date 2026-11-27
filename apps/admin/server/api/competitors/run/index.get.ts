import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const limit = Math.min(Number(q.limit) || 50, 200)

    const supabase = await getAuthenticatedSupabase(event)

    const { data, error } = await supabase
        .from('competitor_runs')
        .select('id, query, location, started_at, finished_at, found_count, scraped_count, analyzed_count, meta')
        .order('started_at', { ascending: false })
        .limit(limit)

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return { runs: data ?? [] }
})