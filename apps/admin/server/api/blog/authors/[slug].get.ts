import { getHrisPortal } from '~~/server/utils/hris'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    console.log(slug);
    if (!slug) {
        return {
            success: false,
            data: null,
            error: 'Author slug is required',
        }
    }

    try {
        const { apiUrl, apikey } = getHrisPortal()

        const data = await $fetch(`${apiUrl}/authors/${encodeURIComponent(slug)}`, {
            headers: {
                'x-api-key': apikey,
            },
        })
        return { success: true, data: data || null }
    } catch (error) {
        console.error(`Error fetching author (${slug}):`, error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch author',
        }
    }
})