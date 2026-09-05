import { serverSupabaseClient } from '#supabase/server'

type TermsContent = {
    id?: string
    title?: string | null
    subtitle?: string | null
    description?: string | null
    is_active?: boolean
    created_at?: string
    updated_at?: string
}

type TermsResponse = {
    success: boolean
    data: TermsContent | null
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("terms_of_use")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error("Terms of use fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load terms of use"
            })
        }

        return {
            success: true,
            data: data || null
        }

    } catch (error: any) {
        console.error("Terms of use API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load terms of use"
        })
    }
})