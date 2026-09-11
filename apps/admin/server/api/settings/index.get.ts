import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const keys = (query.keys as string)?.split(',') || []

        let queryBuilder = supabase
            .from("settings")
            .select("key, value")

        if (keys.length > 0) {
            queryBuilder = queryBuilder.in("key", keys)
        }

        const { data, error } = await queryBuilder

        if (error) throw error
        
        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error("Error fetching settings:", error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : "Failed to fetch settings"
        }
    }
})