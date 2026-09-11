import { getSupabase } from '~~/server/utils/supabase'

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()

    try {
        const { data, error } = await supabase
            .from("settings")
            .select("key, value")
            .eq("key", "hero_subtitle")
            .maybeSingle()

        if (error) {
            console.error("Hero settings fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load hero settings"
            })
        }

        let hero_subtitle = "Choose the perfect package|for your home"
        if (data) {
            const value = typeof data.value === "string"
                ? data.value.replace(/^"|"$/g, "")
                : data.value
            if (value) hero_subtitle = value
        }

        return {
            success: true,
            data: { hero_subtitle }
        }

    } catch (error: any) {
        console.error("Hero settings API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load hero settings"
        })
    }
}, {
    name: 'hero_subtitle_cache',
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true
})
