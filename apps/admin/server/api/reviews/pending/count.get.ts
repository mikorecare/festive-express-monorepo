import { getSupabase } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase();

        const { count, error } = await supabase
            .from("reviews")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        if (error) {
            throw error;
        }

        return {
            success: true,
            count: count || 0
        };
    } catch (error) {
        console.error("Error fetching pending reviews count:", error);
        return {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : 'Failed to fetch count'
        };
    }
});