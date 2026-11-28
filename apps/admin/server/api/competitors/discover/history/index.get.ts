import {
    getAuthenticatedSupabase,
} from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const supabase = await getAuthenticatedSupabase(event)

    const { data, error } = await supabase
        .from('competitor_runs')
        .select(`
            id,
            query,
            location,
            finished_at,
            found_count,
            meta
        `)
        .not('finished_at', 'is', null)
        .order('finished_at', { ascending: false })
        .limit(10)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return {
        runs: data ?? [],
    }
})