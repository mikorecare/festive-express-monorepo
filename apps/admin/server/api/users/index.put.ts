import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        if (!body.id) {
            throw new Error('User ID is required for update')
        }

        const payload = {
            display_name: body.display_name || null,
            first_name: body.first_name,
            last_name: body.last_name || null,
            email: body.email,
            department: body.department || null,
            role: body.role || 'customer',
            phone: body.phone || null,
            mobile_phone: body.mobile_phone || null,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('user_profiles')
            .update(payload)
            .eq('id', body.id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user'
        }
    }
})