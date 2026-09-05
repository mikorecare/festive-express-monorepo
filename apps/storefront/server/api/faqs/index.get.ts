import { serverSupabaseClient } from '#supabase/server'

type FaqItem = {
    id: number
    question: string
    answer: string
    sort_order: number
    is_active: boolean
}

type CategoryWithFaqs = {
    id: number
    name: string
    sort_order: number
    faqs: FaqItem[]
}

type Settings = {
    contact_phone_display: string
    contact_phone: string
    contact_email: string
}

type FaqsResponse = {
    categories: CategoryWithFaqs[]
    settings: Settings
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        // Fetch FAQ categories with their FAQs
        const { data: categoriesData, error: categoriesError } = await supabase
            .from("faq_categories")
            .select(`
                id,
                name,
                sort_order,
                faqs (
                    id,
                    question,
                    answer,
                    sort_order,
                    is_active
                )
            `)
            .eq("is_active", true)
            .order("sort_order")

        if (categoriesError) {
            console.error("FAQ categories fetch error:", categoriesError)
            throw createError({
                statusCode: 500,
                message: "Failed to load FAQ categories"
            })
        }

        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
            .from("settings")
            .select("key, value")
            .in("key", ["contact_phone_display", "contact_phone", "contact_email"])

        if (settingsError) {
            console.error("Settings fetch error:", settingsError)
            throw createError({
                statusCode: 500,
                message: "Failed to load settings"
            })
        }

        // Process categories and filter FAQs
        const categories: CategoryWithFaqs[] = ((categoriesData || []) as any[]).map((cat) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order,
            faqs: (cat.faqs || [])
                .filter((f: any) => f.is_active)
                .sort((a: any, b: any) => a.sort_order - b.sort_order)
        }))

        // Process settings
        const settingsMap: Record<string, string> = {}
        if (settingsData && Array.isArray(settingsData)) {
            settingsData.forEach((row: any) => {
                const value = typeof row.value === "string"
                    ? row.value.replace(/^"|"$/g, "")
                    : row.value
                settingsMap[row.key] = value || ""
            })
        }

        const settings: Settings = {
            contact_phone_display: settingsMap.contact_phone_display || "",
            contact_phone: settingsMap.contact_phone || "",
            contact_email: settingsMap.contact_email || "",
        }

        if (settings.contact_phone) {
            settings.contact_phone = settings.contact_phone.replace(/[^\d+]/g, "")
        }

        return {
            success: true,
            categories,
            settings
        }

    } catch (error: any) {
        console.error("FAQs API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load FAQs"
        })
    }
})