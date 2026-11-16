import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

    const supabase = await getAuthenticatedSupabase(event)

    // seo_audit_pages has ON DELETE CASCADE, so this removes both rows.
    const { error } = await supabase.from('seo_audits').delete().eq('id', id)

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
})