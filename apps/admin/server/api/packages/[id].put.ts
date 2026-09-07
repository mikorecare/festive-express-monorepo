import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw new Error('Package ID is required')
        }

        const payload = {
            name: body.name,
            slug: body.slug,
            description: body.description || null,
            price: body.price || 0,
            sale_price: body.sale_price || 0,
            sort_order: body.sort_order || 0,
            is_popular: body.is_popular || false,
            is_active: body.is_active !== undefined ? body.is_active : true,
            image_url: body.image_url || null,
            title_image_url: body.title_image_url || null,
            icon_url: body.icon_url || null,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('packages')
            .update(payload)
            .eq('id', id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating package:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update package'
        }
    }
})