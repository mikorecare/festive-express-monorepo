import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const email = query.email as string
        const token = query.s as string

        if (!email || !token) {
            throw new Error('Missing email or token')
        }

        const decodedEmail = decodeURIComponent(email)

        const admin = getSupabase()

        const { data, error } = await admin.rpc('confirm_newsletter', {
            p_email: decodedEmail,
            p_token: token
        })

        if (error) throw error

        return data
    } catch (error: any) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to confirm',
        }
    }
})