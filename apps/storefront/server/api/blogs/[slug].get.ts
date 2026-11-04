import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'about-us'

export default defineEventHandler(async (event) => {
    const supabase = getSupabase()
    const slug = getRouterParam(event, 'slug')

    if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            category:post_categories ( id, name, slug ),
            post_tags ( tag:tags ( id, name, slug ) )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error || !data) {
        throw createError({ statusCode: 404, message: 'Post not found' })
    }

    let featuredImage = data.featured_image
    if (featuredImage && !/^https?:\/\//i.test(featuredImage)) {
        const { data: urlData } = supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(featuredImage.replace(/^\/+/, ''))
        featuredImage = urlData?.publicUrl || featuredImage
    }

    return {
        ...data,
        featured_image: featuredImage,
        tags: (data.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
    }
})