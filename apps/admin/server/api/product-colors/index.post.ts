import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            color_key: body.color_key,
            color_label: body.color_label,
            hex: body.hex || null,
            swatch_css: body.swatch_css || null,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('product_colors')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error

        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error('Error creating product color:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create product color'
        }
    }
})