import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) throw new Error('Tag ID is required')
        if (!body.name?.trim()) throw new Error('Name is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')

        const { data, error } = await admin
            .from('tags')
            .update({
                name: body.name.trim(),
                slug: body.slug.trim(),
            })
            .eq('id', id)
            .select('id, name, slug')
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error updating tag:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update tag',
        }
    }
})