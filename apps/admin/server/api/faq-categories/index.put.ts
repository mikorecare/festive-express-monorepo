import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        if (!body.id) {
            throw new Error('ID is required for update')
        }

        const payload = {
            name: body.name,
            slug: body.slug,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('faq_categories')
            .update(payload)
            .eq('id', body.id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error("Error updating FAQ category:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update FAQ category"
        }
    }
})