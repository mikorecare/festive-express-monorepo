import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("inclusion_items")
            .select(
                "id, name, slug, description, color_options, features, specifications, sort_order"
            )
            .order("sort_order", { ascending: true })

        if (error) {
            console.error("Inclusion items fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load inclusion items"
            })
        }

        return {
            success: true,
            data: data || []
        }

    } catch (error: any) {
        console.error("Inclusion items API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load inclusion items"
        })
    }
})