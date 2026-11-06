import { getSupabaseAdmin } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'about-us'

export default defineEventHandler(async (event) => {
    const supabase = getSupabaseAdmin()
    const slug = getRouterParam(event, 'slug')
    const limit = Number(getQuery(event).limit) || 3

    if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

    // 1. Find the current post's tag IDs
    const { data: current, error: currentError } = await supabase
        .from('posts')
        .select('id, post_tags ( tag_id )')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (currentError || !current) {
        throw createError({ statusCode: 404, message: 'Post not found' })
    }

    const tagIds = (current.post_tags || []).map((pt: any) => pt.tag_id)
    if (!tagIds.length) return { posts: [] }

    // 2. Find posts that share any of those tags
    const { data: matches, error: matchError } = await supabase
        .from('posts')
        .select(`
      id,
      title,
      slug,
      summary,
      featured_image,
      published_at,
      post_tags!inner ( tag_id )
    `)
        .eq('status', 'published')
        .in('post_tags.tag_id', tagIds)
        .neq('id', current.id)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (matchError) throw matchError

    // 3. De-dupe (a post can match on multiple tags and appear multiple times)
    const seen = new Set<string>()
    const unique = (matches || []).filter((p: any) => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
    })

    // 4. Resolve image URLs
    const transformed = unique.map((p: any) => {
        let img = p.featured_image
        if (img && !/^https?:\/\//i.test(img)) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(img.replace(/^\/+/, ''))
            img = urlData?.publicUrl || img
        }
        return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            featured_image: img,
            published_at: p.published_at,
        }
    })

    return { posts: transformed }
})