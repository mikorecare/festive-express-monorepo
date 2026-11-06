import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email, firstName, lastName } = body

        if (!email || !email.includes('@')) {
            throw new Error('Please provide a valid email address.')
        }
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required.')
        }

        const admin = getSupabase()
        const { data, error } = await admin.rpc('subscribe_newsletter', {
            p_email: email,
            p_first_name: firstName,
            p_last_name: lastName
        })

        if (error) throw error

        return data
    } catch (error: any) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to subscribe',
        }
    }
})