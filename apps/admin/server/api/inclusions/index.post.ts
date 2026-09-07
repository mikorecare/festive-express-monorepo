import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            name: body.name,
            slug: body.slug,
            description: body.description || null,
            image_url: body.image_url || null,
            sort_order: body.sort_order || 0,
            color_options: body.color_options || [],
            features: body.features || [],
            specifications: body.specifications || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('inclusion_items')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error

        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error('Error creating inclusion:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create inclusion'
        }
    }
})