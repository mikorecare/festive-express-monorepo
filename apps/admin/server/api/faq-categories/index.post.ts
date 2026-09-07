import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            name: body.name,
            slug: body.slug,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('faq_categories')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error

        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error("Error creating FAQ category:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create FAQ category"
        }
    }
})