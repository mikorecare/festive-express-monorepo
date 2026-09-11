import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'Gallery'

export default defineCachedEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            throw error
        }

        const transformedData = (data || []).map((item) => {
            let imageUrl = item.image_url
            if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(imageUrl.replace(/^\/+/, ''))
                imageUrl = urlData?.publicUrl || imageUrl
            }

            let dividerImageUrl = item.divider_image_url
            if (dividerImageUrl && !dividerImageUrl.startsWith('http://') && !dividerImageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(dividerImageUrl.replace(/^\/+/, ''))
                dividerImageUrl = urlData?.publicUrl || dividerImageUrl
            }

            return {
                ...item,
                image_url: imageUrl || null,
                divider_image_url: dividerImageUrl || null
            }
        })

        return {
            success: true,
            data: transformedData || []
        }
    } catch (error) {
        console.error('Error fetching gallery items:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch gallery items',
            data: []
        }
    }
}, {
    name: 'gallery_landing_cache',
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true
})
