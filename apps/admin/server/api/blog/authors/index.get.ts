import { getHrisPortal } from '~~/server/utils/hris'

export default defineEventHandler(async () => {
    try {
        const { apiUrl, apikey } = getHrisPortal()
        const data = await $fetch(`${apiUrl}/authors`, {
            headers: {
                'x-api-key': apikey,
            },
        })

        return { success: true, data: data || [] }
    } catch (error) {
        console.error('Error fetching authors:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch authors',
        }
    }
})