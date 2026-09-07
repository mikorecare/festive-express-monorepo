
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)
        const { settings } = body

        if (!settings || !Array.isArray(settings)) {
            throw new Error('Settings array is required')
        }

        const rows = settings.map((setting: { key: string; value: string }) => ({
            key: setting.key,
            value: setting.value,
            updated_at: new Date().toISOString(),
        }))

        const { error } = await supabase
            .from("settings")
            .upsert(rows, { onConflict: "key" })

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error("Error saving settings:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save settings"
        }
    }
})