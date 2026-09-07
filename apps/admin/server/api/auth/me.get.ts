
import { getSupabase } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    try {
        const accessToken = getCookie(event, 'sb-access-token');

        if (!accessToken) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            });
        }

        const supabase = getSupabase();
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            throw createError({
                statusCode: 401,
                message: 'Invalid or expired token'
            });
        }

        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        return {
            user: {
                id: user.id,
                email: user.email,
                role: profile?.role || 'user',
                display_name: profile?.display_name || user.email?.split('@')[0] || '',
                full_name: profile?.full_name || '',
            }
        };
    } catch (error: any) {
        console.error('Error fetching user:', error);

        if (error.statusCode) {
            throw error;
        }

        return {
            success: false,
            message: error.message || 'Failed to fetch user'
        };
    }
});