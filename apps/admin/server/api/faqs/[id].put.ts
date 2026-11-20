import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw new Error('FAQ ID is required')
        }

        const payload = {
            category_id: body.category_id,
            question: body.question,
            answer: body.answer,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('faqs')
            .update(payload)
            .eq('id', id)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.FAQS)
        return {
            success: true
        }
    } catch (error) {
        console.error("Error updating FAQ:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update FAQ"
        }
    }
})