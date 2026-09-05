import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("settings")
            .select("*")

        if (error) {
            console.error("Settings fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load settings"
            })
        }

        const settingsData: Record<string, any> = {}
        if (data && Array.isArray(data)) {
            data.forEach((row: any) => {
                if (row.key && row.value !== undefined) {
                    settingsData[row.key] = row.value
                }
            })
        }

        return {
            success: true,
            data: settingsData
        }

    } catch (error: any) {
        console.error("Settings API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load settings"
        })
    }
})