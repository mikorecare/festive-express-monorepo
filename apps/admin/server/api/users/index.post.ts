import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            display_name: body.display_name || null,
            first_name: body.first_name,
            last_name: body.last_name || null,
            email: body.email,
            department: body.department || null,
            role: body.role || 'customer',
            phone: body.phone || null,
            mobile_phone: body.mobile_phone || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('user_profiles')
            .insert(payload)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error('Error creating user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create user'
        }
    }
})