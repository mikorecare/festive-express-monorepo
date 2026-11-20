import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { getHrisPortal } from '~~/server/utils/hris'

const STORAGE_BUCKET = 'about-us'

export interface AuthorProfile {
    id?: string
    author_slug: string
    full_name: string
    job_title?: string | null
    bio?: string | null
    display_photo_url?: string | null
    social_links?: Record<string, string | null> | null
    x_handle?: string | null
}

export interface AuthorPostItem {
    id: string
    author_slug: string | null
    title: string
    slug: string
    summary: string | null
    featured_image: string | null
    published_at: string | null
    category: { id: number; name: string; slug: string } | null
    tags: { id: number; name: string; slug: string }[]
}

async function fetchHrisAuthor(slug: string): Promise<AuthorProfile | null> {
    try {
        const { apiUrl, apikey } = getHrisPortal()
        const baseUrl = apiUrl.replace(/\/+$/, '')

        const res = await $fetch<
            AuthorProfile | { data?: AuthorProfile | AuthorProfile[] } | null
        >(`${baseUrl}/authors/${encodeURIComponent(slug)}`, {
            headers: {
                'x-api-key': apikey,
            },
        })

        if (!res) return null

        if ('data' in res && res.data) {
            if (Array.isArray(res.data)) {
                return res.data.find((a) => a.author_slug === slug) || res.data[0] || null
            }
            return res.data
        }

        return res as AuthorProfile
    } catch (err) {
        console.error(`Failed to fetch HRIS author (${slug}):`, err)
        return null
    }
}

export default defineCachedEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
        throw createError({ statusCode: 400, message: 'Author slug is required' })
    }

    const supabase = getSupabase()

    const [author, { data: postsData, error: postsError }] = await Promise.all([
        fetchHrisAuthor(slug),
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
                category:post_categories ( id, name, slug ),
                post_tags ( tag:tags ( id, name, slug ) )
            `)
            .eq('author_slug', slug)
            .eq('status', 'published')
            .order('published_at', { ascending: false }),
    ])

    if (postsError) {
        console.error(`Error fetching posts for author (${slug}):`, postsError)
        throw createError({ statusCode: 500, message: 'Failed to load author posts' })
    }

    const posts: AuthorPostItem[] = (postsData || []).map((post: any) => {
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
            author_slug: post.author_slug ?? null,
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            featured_image: featuredImage,
            published_at: post.published_at,
            category: post.category ?? null,
            tags: (post.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
        }
    })

    if (!author && posts.length === 0) {
        throw createError({ statusCode: 404, message: 'Author not found' })
    }

    return {
        author: author || {
            author_slug: slug,
            full_name: 'Festive Express Team',
            job_title: null,
            bio: null,
            display_photo_url: null,
            social_links: null,
        },
        posts,
    }
}, {
    name: CACHE_MAP.POSTS_PUBLIC,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
    getKey: (event) => event.path,
})