import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabaseAdmin()
        const body = await readBody(event)

        const payload = {
            category_id: body.category_id,
            question: body.question,
            answer: body.answer,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('faqs')
            .insert(payload)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.FAQS)
        return {
            success: true
        }
    } catch (error) {
        console.error("Error creating FAQ:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create FAQ"
        }
    }
})