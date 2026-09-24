import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)
        const { settings } = body

        if (!settings || !Array.isArray(settings)) {
            throw new Error('Settings array is required')
        }

        for (const setting of settings) {
            const { error } = await supabase
                .from("settings")
                .update({
                    value: setting.value,
                    updated_at: new Date().toISOString(),
                })
                .eq("key", setting.key)

            if (error) throw error
        }

        await purgeLandingCache(CACHE_MAP.GLOBAL_SETTINGS)
        return { success: true }
    } catch (error) {
        console.error("Error saving settings:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save settings"
        }
    }
})