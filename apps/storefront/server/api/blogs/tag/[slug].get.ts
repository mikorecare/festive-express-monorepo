import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'about-us'

export default defineEventHandler(async (event) => {
    const supabase = getSupabase()
    const slug = getRouterParam(event, 'slug')

    if (!slug) throw createError({ statusCode: 400, message: 'Tag slug is required' })

    const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id, name, slug')
        .eq('slug', slug)
        .single()

    if (tagError || !tag) {
        throw createError({ statusCode: 404, message: 'Tag not found' })
    }

    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
      id,
      title,
      slug,
      summary,
      featured_image,
      published_at,
      created_at,
      category:post_categories ( id, name, slug ),
      post_tags!inner ( tag_id )
    `)
        .eq('status', 'published')
        .eq('post_tags.tag_id', tag.id)
        .order('published_at', { ascending: false })

    if (postsError) throw postsError

    // 3. Resolve image URLs
    const transformed = (posts || []).map((post: any) => {
        let img = post.featured_image
        if (img && !/^https?:\/\//i.test(img)) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(img.replace(/^\/+/, ''))
            img = urlData?.publicUrl || img
        }
        return {
            ...post,
            featured_image: img,
            post_tags: undefined, // remove junction data
        }
    })

    return { tag, posts: transformed }
})