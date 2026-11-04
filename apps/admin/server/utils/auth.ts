import { createClient } from '@supabase/supabase-js'
import { getSupabase } from './supabase'

export async function getAuthenticatedSupabase(event: any) {
    const config = useRuntimeConfig()
    const accessToken = getCookie(event, 'sb-access-token')
    if (!accessToken) throw new Error('Not authenticated')

    const supabase = getSupabase()

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (!error && user) {
        // Valid — return a client that carries the JWT so any .from() calls
        // are RLS-scoped to this user
        return createClient(
            config.public.supabaseUrl,
            config.supabase.secretKey,
            {
                global: { headers: { Authorization: `Bearer ${accessToken}` } },
                auth: { persistSession: false, autoRefreshToken: false },
            },
        )
    }

    // 2. Token invalid/expired — try refresh
    const refreshToken = getCookie(event, 'sb-refresh-token')
    if (!refreshToken) throw new Error('Session expired')

    const { data, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
    })

    if (refreshError || !data.session) {
        throw new Error('Session expired')
    }

    const isProduction = process.env.NODE_ENV === 'production'
    setCookie(event, 'sb-access-token', data.session.access_token, {
        maxAge: 60 * 60 * 8,
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    })
    setCookie(event, 'sb-refresh-token', data.session.refresh_token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    })

    // 3. Return a client carrying the NEW token
    return createClient(
        config.public.supabaseUrl,
        config.supabase.secretKey,
        {
            global: {
                headers: { Authorization: `Bearer ${data.session.access_token}` },
            },
            auth: { persistSession: false, autoRefreshToken: false },
        },
    )
}