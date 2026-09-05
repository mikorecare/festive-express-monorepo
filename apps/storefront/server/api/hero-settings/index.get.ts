import { serverSupabaseClient } from '#supabase/server'

interface HeroSettings {
    hero_h1_white: string
    hero_h1_orange: string
    hero_description_1: string
    hero_description_2: string
    hero_button_label: string
    hero_countdown_enabled: boolean
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("settings")
            .select("key, value")
            .in("key", [
                "hero_h1_white",
                "hero_h1_orange",
                "hero_description_1",
                "hero_description_2",
                "hero_button_label",
                "hero_countdown_enabled",
            ])

        if (error) {
            console.error("Hero settings fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load hero settings"
            })
        }

        const settings: HeroSettings = {
            hero_h1_white: "RENT THE MAGIC",
            hero_h1_orange: "ENJOY THE SEASON",
            hero_description_1: "Giftwrapped in One Simple Package.",
            hero_description_2: "(No ladders. No tangled cords. No storage. No stress.)",
            hero_button_label: "Explore the Packages",
            hero_countdown_enabled: true,
        }

        const unwrap = (value: unknown) => {
            if (value == null) return ""
            if (typeof value === "string") return value.replace(/^"|"$/g, "")
            return String(value)
        }

        const rows = (data || []) as { key: string; value: string | null }[]

        for (const row of rows) {
            const value = unwrap(row.value)

            switch (row.key) {
                case "hero_h1_white":
                    if (value) settings.hero_h1_white = value
                    break
                case "hero_h1_orange":
                    if (value) settings.hero_h1_orange = value
                    break
                case "hero_description_1":
                    if (value) settings.hero_description_1 = value
                    break
                case "hero_description_2":
                    if (value) settings.hero_description_2 = value
                    break
                case "hero_button_label":
                    if (value) settings.hero_button_label = value
                    break
                case "hero_countdown_enabled":
                    settings.hero_countdown_enabled = value === "true" || value === "1" || value === "yes"
                    break
            }
        }

        return {
            success: true,
            data: settings
        }

    } catch (error: any) {
        console.error("Hero settings API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load hero settings"
        })
    }
})