import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Post ID is required')

        const { data, error } = await supabase
            .from('posts')
            .select(
                `*,
         category:post_categories ( id, name, slug ),
         post_tags ( tag_id, tag:tags ( id, name, slug ) )`
            )
            .eq('id', id)
            .single()

        if (error) throw error

        const transformed = {
            ...data,
            category: data?.category ?? null,
            tags: (data?.post_tags || []).map((pt: any) => ({
                tag_id: pt.tag_id,
                ...pt.tag,
            })),
            post_tags: undefined,
        }

        return { success: true, data: transformed }
    } catch (error) {
        console.error('Error fetching post:', error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch post',
        }
    }
})