import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
    try {
        const admin = getSupabaseAdmin()

        const { data: videos, error } = await admin
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        const ids = (videos || []).map((v) => v.id)
        let counts: Record<string, number> = {}

        if (ids.length) {
            const { data: links } = await admin
                .from('post_videos')
                .select('video_id')
                .in('video_id', ids)

            for (const row of links || []) {
                counts[row.video_id] = (counts[row.video_id] || 0) + 1
            }
        }

        return {
            success: true,
            data: (videos || []).map((v) => ({
                ...v,
                post_count: counts[v.id] || 0,
            })),
        }
    } catch (error) {
        console.error('Error fetching videos:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch videos',
        }
    }
})