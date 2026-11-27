import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' })

    const supabase = await getAuthenticatedSupabase(event)

    const { error } = await supabase.from('competitors').delete().eq('id', id)
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return { ok: true }
})