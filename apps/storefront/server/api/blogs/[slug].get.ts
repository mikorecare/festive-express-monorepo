import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { getHrisPortal } from '~~/server/utils/hris'

const STORAGE_BUCKET = 'about-us'

interface HrisAuthor {
    id?: string
    author_slug?: string
    full_name?: string
    job_title?: string | null
    display_photo_url?: string | null
    bio?: string | null
    social_links?: Record<string, string | null> | null
    x_handle?: string | null
}

async function fetchAuthorBySlug(slug: string): Promise<HrisAuthor | null> {
    try {
        const { apiUrl, apikey } = getHrisPortal()
        const baseUrl = apiUrl.replace(/\/+$/, '')

        const res = await $fetch<HrisAuthor | { data?: HrisAuthor | HrisAuthor[] }>(
            `${baseUrl}/authors/${encodeURIComponent(slug)}`,
            {
                headers: {
                    'x-api-key': apikey,
                },
            },
        )

        if (!res) return null
        if ('data' in res && res.data) {
            if (Array.isArray(res.data)) return res.data[0] || null
            return res.data
        }
        return res as HrisAuthor
    } catch (err) {
        console.error(`Failed to fetch author (${slug}) for post cache:`, err)
        return null
    }
}

export default defineCachedEventHandler(async (event) => {
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

    const author = data.author_slug ? await fetchAuthorBySlug(data.author_slug) : null

    return {
        ...data,
        featured_image: featuredImage,
        author,
        tags: (data.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
    }
}, {
    name: CACHE_MAP.POST_DETAIL,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,

    getKey: (event) => event.path,
})