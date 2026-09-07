import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        if (!body.id) {
            throw new Error('ID is required for update')
        }

        const payload = {
            year: body.year || null,
            description: body.description || null,
            image_url: body.image_url,
            image_position: body.image_position || 'right',
            divider_image_url: body.divider_image_url || null,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('gallery_items')
            .update(payload)
            .eq('id', body.id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error("Error updating gallery item:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update gallery item"
        }
    }
})