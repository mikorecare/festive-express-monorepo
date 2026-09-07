import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .order('sort_order', { ascending: true })

        if (error) throw error

        // Transform URLs to public URLs
        const transformedData = (data || []).map((item) => {
            let imageUrl = item.image_url
            if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from('Gallery')
                    .getPublicUrl(imageUrl.replace(/^\/+/, ''))
                imageUrl = urlData?.publicUrl || imageUrl
            }

            return {
                ...item,
                image_url: imageUrl || null
            }
        })

        return {
            success: true,
            data: transformedData || []
        }
    } catch (error) {
        console.error("Error fetching gallery items:", error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : "Failed to fetch gallery items"
        }
    }
})