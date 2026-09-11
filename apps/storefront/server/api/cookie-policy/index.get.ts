import { getSupabase } from '~~/server/utils/supabase'

type CookieContent = {
    id?: string
    banner_image_url?: string | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
    is_active?: boolean
    created_at?: string
    updated_at?: string
}

type CookieResponse = {
    success: boolean
    data: CookieContent | null
}

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()

    try {
        const { data, error } = await supabase
            .from("cookie_policy")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error("Cookie policy fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load cookie policy"
            })
        }

        if (data && data.banner_image_url && !data.banner_image_url.startsWith('http')) {
            const { data: urlData } = supabase
                .storage
                .from('Products')
                .getPublicUrl(data.banner_image_url.replace(/^\/+/, ''))
            data.banner_image_url = urlData?.publicUrl || data.banner_image_url
        }

        return {
            success: true,
            data: data || null
        }

    } catch (error: any) {
        console.error("Cookie policy API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load cookie policy"
        })
    }
}, {
    name: 'cookie_policy_cache',
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true
})
