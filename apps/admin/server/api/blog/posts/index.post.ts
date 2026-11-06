import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const body = await readBody(event)
        console.log("hi")
        if (!body.title?.trim()) throw new Error('Title is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')
        if (!body.content?.trim()) throw new Error('Content is required')

        // ── Derive author from session ──────────────────────────────────────
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('Not authenticated')
        }

        const payload = {
            author_id: user.id,
            category_id: body.category_id ?? null,
            title: body.title.trim(),
            slug: body.slug.trim(),
            summary: body.summary || null,
            content: body.content,
            featured_image: body.featured_image || null,
            status: body.status || 'draft',
            published_at: body.published_at || null,
        }

        const { data: post, error } = await supabase
            .from('posts')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error

        const tagIds: number[] = Array.isArray(body.tag_ids) ? body.tag_ids : []
        if (tagIds.length) {
            const rows = tagIds.map((tag_id) => ({ post_id: post.id, tag_id }))
            const { error: tagError } = await supabase
                .from('post_tags')
                .insert(rows)
            if (tagError) throw tagError
        }

        await Promise.all([
            purgeLandingCache(CACHE_MAP.POSTS_PUBLIC),
            purgeLandingCache(CACHE_MAP.POSTS_ADMIN),
            purgeLandingCache(CACHE_MAP.POST_DETAIL),
        ])

        return { success: true, id: post.id }
    } catch (error) {
        console.error('Error creating post:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to create post',
        }
    }
})