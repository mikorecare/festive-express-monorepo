import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'

export type PostCategory = { id: number; name: string; slug: string }
export type Tag = { id: number; name: string; slug: string }

export type PostListItem = {
    id: string
    title: string
    slug: string
    summary: string | null
    featured_image: string | null
    published_at: string | null
    created_at: string
    category: PostCategory | null
    tags: Tag[]
    author: { full_name: string | null } | null
}

export type BlogListResponse = {
    posts: PostListItem[]
}

const STORAGE_BUCKET = 'about-us'

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()

    const { data, error } = await supabase
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
            post_tags ( tag:tags ( id, name, slug ) ),
            author:users!posts_author_id_fkey ( full_name )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (error) {
        console.error('blog list', error)
        throw createError({ statusCode: 500, message: 'Failed to load blog posts' })
    }

    const transformedPosts = (data || []).map((post: any) => {
        let featuredImage = post.featured_image
        if (featuredImage && !/^https?:\/\//i.test(featuredImage)) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(featuredImage.replace(/^\/+/, ''))
            featuredImage = urlData?.publicUrl || featuredImage
        }

        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            featured_image: featuredImage,
            published_at: post.published_at,
            created_at: post.created_at,
            category: post.category ?? null,
            tags: (post.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
            author: post.author ?? null,
        } as PostListItem
    })

    return { posts: transformedPosts } as BlogListResponse
}, {
    name: CACHE_MAP.POSTS_PUBLIC,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
})