import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const accessToken = getCookie(event, 'sb-access-token')
    if (!accessToken) {
        throw createError({ statusCode: 401, message: 'Not authenticated' })
    }

    // Optional: verify it's still valid before handing it out
    const admin = getSupabaseAdmin()
    const { data: { user }, error } = await admin.auth.getUser(accessToken)
    if (error || !user) {
        throw createError({ statusCode: 401, message: 'Session expired' })
    }

    return { accessToken }
})