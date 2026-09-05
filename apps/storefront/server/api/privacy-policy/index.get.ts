import { serverSupabaseClient } from '#supabase/server'

type PrivacyContent = {
    id?: string
    banner_image_url?: string | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
    is_active?: boolean
    created_at?: string
    updated_at?: string
}

type PrivacyResponse = {
    success: boolean
    data: PrivacyContent | null
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("privacy_policy")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error("Privacy policy fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load privacy policy"
            })
        }

        return {
            success: true,
            data: data || null
        }

    } catch (error: any) {
        console.error("Privacy policy API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load privacy policy"
        })
    }
})