import { getSupabase } from '~~/server/utils/supabase'

export default defineCachedEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('about_us')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle()

        if (error) {
            throw error
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
    } catch (error) {
        console.error('Error fetching about us content:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch about us content',
            data: null
        }
    }
}, {
    name: 'about_us_cache',
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true
})
