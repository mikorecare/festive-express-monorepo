import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const { data, error } = await supabase
            .from('tags')
            .select('id, name, slug')
            .order('name', { ascending: true })

        if (error) throw error
        return { success: true, data: data || [] }
    } catch (error) {
        console.error('Error fetching tags:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch tags',
        }
    }
})