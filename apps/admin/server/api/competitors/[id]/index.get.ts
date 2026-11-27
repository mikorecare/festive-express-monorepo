import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' })

    const supabase = await getAuthenticatedSupabase(event)

    const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            throw createError({ statusCode: 404, statusMessage: 'Competitor not found' })
        }
        throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { competitor: data }
})