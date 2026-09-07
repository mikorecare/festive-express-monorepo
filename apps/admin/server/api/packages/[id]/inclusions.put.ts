import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)
        const { inclusions } = body

        if (!id) {
            throw new Error('Package ID is required')
        }

        const { error: deleteError } = await supabase
            .from('package_inclusions')
            .delete()
            .eq('package_id', id)

        if (deleteError) throw deleteError

        if (inclusions && inclusions.length > 0) {
            const { error: insertError } = await supabase
                .from('package_inclusions')
                .insert(inclusions)

            if (insertError) throw insertError
        }

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating package inclusions:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update package inclusions'
        }
    }
})