import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Product ID is required'
            })
        }

        const { data: existingProduct, error: checkError } = await supabase
            .from('products')
            .select('id, name')
            .eq('id', id)
            .single()

        if (checkError || !existingProduct) {
            throw createError({
                statusCode: 404,
                message: 'Product not found'
            })
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error

        return {
            success: true,
            message: `Product "${existingProduct.name}" deleted successfully`
        }
    } catch (error) {
        console.error('Error deleting product:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete product'
        }
    }
})