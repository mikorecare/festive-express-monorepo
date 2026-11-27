import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const supabase = await getAuthenticatedSupabase(event)
    const { data, error } = await supabase
        .from('competitors')
        .select('id, name')
        .eq('is_internal', true)
        .eq('status', 'analyzed')

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return { internals: data ?? [] }
})