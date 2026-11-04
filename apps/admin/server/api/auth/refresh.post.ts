import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'sb-refresh-token')
    if (!refreshToken) {
        throw createError({ statusCode: 401, message: 'No refresh token' })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
    })

    if (error || !data.session) {
        // Refresh token invalid/expired — force re-login
        deleteCookie(event, 'sb-access-token')
        deleteCookie(event, 'sb-refresh-token')
        deleteCookie(event, 'sb-auth')
        throw createError({ statusCode: 401, message: 'Session expired' })
    }

    const isProduction = process.env.NODE_ENV === 'production'

    // Update both tokens with fresh values
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

    return { success: true }
})