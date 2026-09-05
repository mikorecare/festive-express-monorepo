import { serverSupabaseClient } from '#supabase/server'

type Step = {
    title: string
    description: string
}

type HowItWorksContent = {
    id?: string
    banner_image_url?: string | null
    title?: string | null
    subtitle?: string | null
    steps?: Step[] | null
    footer_description?: string | null
    is_active?: boolean
    created_at?: string
    updated_at?: string
}

type HowItWorksResponse = {
    success: boolean
    data: HowItWorksContent | null
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("how_it_works")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error("How it works fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load how it works content"
            })
        }

        return {
            success: true,
            data: data || null
        }

    } catch (error: any) {
        console.error("How it works API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load how it works content"
        })
    }
})