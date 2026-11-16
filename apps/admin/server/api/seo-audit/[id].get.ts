import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

    const supabase = await getAuthenticatedSupabase(event)

    const { data, error } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) {
        throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
    }

    return data
})