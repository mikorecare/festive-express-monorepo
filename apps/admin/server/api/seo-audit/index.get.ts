import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const limit = Math.min(Number(q.limit) || 50, 200)
    const search = String(q.search ?? '').trim()

    const supabase = await getAuthenticatedSupabase(event)

    let query = supabase
        .from('seo_audits')
        .select(
            'id, created_at, target_url, overall_score, pages_total, pages_failed, critical_count, warning_count, info_count, executive_summary, use_ai',
        )
        .order('created_at', { ascending: false })
        .limit(limit)

    if (search) query = query.ilike('target_url', `%${search}%`)

    const { data, error } = await query

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { audits: data ?? [] }
})