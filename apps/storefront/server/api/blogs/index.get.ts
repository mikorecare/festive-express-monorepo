import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { getHrisPortal } from '~~/server/utils/hris'

export type PostCategory = { id: number; name: string; slug: string }
export type Tag = { id: number; name: string; slug: string }

export type PostAuthor = {
    author_slug?: string | null
    full_name: string | null
    job_title?: string | null
    display_photo_url?: string | null
}

export type PostListItem = {
    id: string
    author_slug: string | null
    title: string
    slug: string
    summary: string | null
    featured_image: string | null
    published_at: string | null
    created_at: string
    category: PostCategory | null
    tags: Tag[]
    author: PostAuthor | null
}

export type BlogListResponse = {
    posts: PostListItem[]
}

const STORAGE_BUCKET = 'about-us'

async function fetchAuthorsMap(): Promise<Map<string, PostAuthor>> {
    const map = new Map<string, PostAuthor>()
    try {
        const { apiUrl, apikey } = getHrisPortal()
        const baseUrl = apiUrl.replace(/\/+$/, '')

        const res = await $fetch<PostAuthor[] | { data?: PostAuthor[] }>(
            `${baseUrl}/authors`,
            {
                headers: {
                    'x-api-key': apikey,
                },
            },
        )

        const list = Array.isArray(res) ? res : res?.data || []
        for (const item of list) {
            if (item?.author_slug) {
                map.set(item.author_slug, {
                    author_slug: item.author_slug,
                    full_name: item.full_name ?? null,
                    job_title: item.job_title ?? null,
                    display_photo_url: item.display_photo_url ?? null,
                })
            }
        }
    } catch (err) {
        console.error('Failed to fetch authors for blog list cache:', err)
    }
    return map
}

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()

    const [{ data, error }, authorsMap] = await Promise.all([
        supabase
            .from('posts')
            .select(`
                id,
                author_slug,
                title,
                slug,
                summary,
                featured_image,
                published_at,
                created_at,
                category:post_categories ( id, name, slug ),
                post_tags ( tag:tags ( id, name, slug ) )
            `)
            .eq('status', 'published')
            .order('published_at', { ascending: false }),
        fetchAuthorsMap(),
    ])

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

        const author = post.author_slug ? (authorsMap.get(post.author_slug) ?? null) : null

        return {
            id: post.id,
            author_slug: post.author_slug ?? null,
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            featured_image: featuredImage,
            published_at: post.published_at,
            created_at: post.created_at,
            category: post.category ?? null,
            tags: (post.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
            author,
        } as PostListItem
    })

    return { posts: transformedPosts } as BlogListResponse
}, {
    name: CACHE_MAP.POSTS_PUBLIC,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
})