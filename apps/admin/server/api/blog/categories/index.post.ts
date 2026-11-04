import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const body = await readBody(event)

        if (!body.name?.trim()) throw new Error('Name is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')

        const { data, error } = await admin
            .from('post_categories')
            .insert({
                name: body.name.trim(),
                slug: body.slug.trim(),
                description: body.description || null,
            } as any)
            .select('id, name, slug, description')
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error creating category:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create category',
        }
    }
})