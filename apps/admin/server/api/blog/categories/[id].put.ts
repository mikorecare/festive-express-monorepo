import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) throw new Error('Category ID is required')
        if (!body.name?.trim()) throw new Error('Name is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')

        const { data, error } = await admin
            .from('post_categories')
            .update({
                name: body.name.trim(),
                slug: body.slug.trim(),
                description: body.description || null,
            } as any)
            .eq('id', id)
            .select('id, name, slug, description')
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error updating category:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to update category',
        }
    }
})