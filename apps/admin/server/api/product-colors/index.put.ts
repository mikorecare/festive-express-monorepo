import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        if (!body.id) {
            throw new Error('ID is required for update')
        }

        const payload = {
            color_key: body.color_key,
            color_label: body.color_label,
            hex: body.hex || null,
            swatch_css: body.swatch_css || null,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('product_colors')
            .update(payload)
            .eq('id', body.id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating product color:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update product color'
        }
    }
})