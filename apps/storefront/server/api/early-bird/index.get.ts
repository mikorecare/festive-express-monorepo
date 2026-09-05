import { serverSupabaseClient } from '#supabase/server'

interface EarlyBirdSettings {
    early_bird_enabled: boolean
    early_bird_expires_at: string | null
    early_bird_title: string
    early_bird_description: string
    early_bird_icon_url: string
    early_bird_icon_secondary_url: string
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("settings")
            .select("key, value")
            .in("key", [
                "early_bird_enabled",
                "early_bird_expires_at",
                "early_bird_title",
                "early_bird_description",
                "early_bird_icon_url",
                "early_bird_icon_secondary_url",
            ])

        if (error) {
            console.error("Early bird settings fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load early bird settings"
            })
        }

        const settings: EarlyBirdSettings = {
            early_bird_enabled: false,
            early_bird_expires_at: null,
            early_bird_title: "Early Bird Special Pricing",
            early_bird_description: "See packages for details.",
            early_bird_icon_url: "",
            early_bird_icon_secondary_url: "",
        }

        const rows = (data || []) as { key: string; value: string | null }[]
        for (const row of rows) {
            const value = typeof row.value === "string"
                ? row.value.replace(/^"|"$/g, "")
                : row.value

            switch (row.key) {
                case "early_bird_enabled":
                    settings.early_bird_enabled = value === "true" || value === "1" || value === "yes"
                    break
                case "early_bird_expires_at":
                    settings.early_bird_expires_at = value
                    break
                case "early_bird_title":
                    if (value) settings.early_bird_title = value
                    break
                case "early_bird_description":
                    if (value) settings.early_bird_description = value
                    break
                case "early_bird_icon_url":
                    settings.early_bird_icon_url = value || ""
                    break
                case "early_bird_icon_secondary_url":
                    settings.early_bird_icon_secondary_url = value || ""
                    break
            }
        }

        if (settings.early_bird_icon_url && !settings.early_bird_icon_url.startsWith('http')) {
            const { data: urlData } = supabase
                .storage
                .from('Products')
                .getPublicUrl(settings.early_bird_icon_url.replace(/^\/+/, ''))
            settings.early_bird_icon_url = urlData?.publicUrl || settings.early_bird_icon_url
        }

        if (settings.early_bird_icon_secondary_url && !settings.early_bird_icon_secondary_url.startsWith('http')) {
            const { data: urlData } = supabase
                .storage
                .from('Products')
                .getPublicUrl(settings.early_bird_icon_secondary_url.replace(/^\/+/, ''))
            settings.early_bird_icon_secondary_url = urlData?.publicUrl || settings.early_bird_icon_secondary_url
        }

        return {
            success: true,
            data: settings
        }

    } catch (error: any) {
        console.error("Early bird API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load early bird settings"
        })
    }
})