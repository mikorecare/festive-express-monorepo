import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) throw new Error('Post ID is required')
        if (!body.title?.trim()) throw new Error('Title is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')
        if (!body.content?.trim()) throw new Error('Content is required')

        const payload = {
            category_id: body.category_id ?? null,
            title: body.title.trim(),
            slug: body.slug.trim(),
            summary: body.summary || null,
            content: body.content,
            featured_image: body.featured_image || null,
            status: body.status || 'draft',
            published_at: body.published_at || null,
            updated_at: new Date().toISOString(),
        }

        const { error } = await admin.from('posts').update(payload).eq('id', id)
        if (error) throw error

        // Sync tags: wipe & re-insert (simple + idempotent)
        const { error: delError } = await admin
            .from('post_tags')
            .delete()
            .eq('post_id', id)
        if (delError) throw delError

        const tagIds: number[] = Array.isArray(body.tag_ids) ? body.tag_ids : []
        if (tagIds.length) {
            const rows = tagIds.map((tag_id) => ({ post_id: id, tag_id }))
            const { error: tagError } = await admin.from('post_tags').insert(rows)
            if (tagError) throw tagError
        }

        await Promise.all([
            purgeLandingCache(CACHE_MAP.POSTS_PUBLIC),
            purgeLandingCache(CACHE_MAP.POSTS_ADMIN),
            purgeLandingCache(CACHE_MAP.POST_DETAIL),
        ])

        return { success: true, id }
    } catch (error) {
        console.error('Error updating post:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update post',
        }
    }
})