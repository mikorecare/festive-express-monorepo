import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Missing project id')

        const body = await readBody(event)
        const images = body.images || []

        // 1. Get current image IDs in the DB to know what to delete
        const { data: existing, error: fetchErr } = await supabase
            .from('project_images')
            .select('id')
            .eq('project_id', id)
        if (fetchErr) throw fetchErr

        const existingIds = (existing || []).map((img) => img.id)
        const incomingIds = images.filter((img: any) => img.id).map((img: any) => img.id)

        // 2. Delete removed images
        const toDelete = existingIds.filter((eid) => !incomingIds.includes(eid))
        if (toDelete.length) {
            const { error: delErr } = await supabase
                .from('project_images')
                .delete()
                .in('id', toDelete)
            if (delErr) throw delErr
        }

        // 3. Separate existing vs new images
        const toUpdate = images.filter((img: any) => img.id).map((img: any, index: number) => ({
            id: img.id,
            project_id: id,
            image_url: img.image_url,
            alt_text: img.alt_text || null,
            title: img.title || null,
            caption: img.caption || null,
            description: img.description || null,
            room_or_area: img.room_or_area || null,
            sort_order: index,
            is_featured: !!img.is_featured,
            seo_creator: img.seo_creator || 'Festive Express',
            seo_copyright: img.seo_copyright || '© 2026 Festive Express',
            seo_license: img.seo_license || 'https://festive.express/terms',
            seo_acquire_page: img.seo_acquire_page || 'https://festive.express/contact',
        }))

        const toInsert = images.filter((img: any) => !img.id).map((img: any, index: number) => ({
            project_id: id,
            image_url: img.image_url,
            alt_text: img.alt_text || null,
            title: img.title || null,
            caption: img.caption || null,
            description: img.description || null,
            room_or_area: img.room_or_area || null,
            sort_order: index,
            is_featured: !!img.is_featured,
            seo_creator: img.seo_creator || 'Festive Express',
            seo_copyright: img.seo_copyright || '© 2026 Festive Express',
            seo_license: img.seo_license || 'https://festive.express/terms',
            seo_acquire_page: img.seo_acquire_page || 'https://festive.express/contact',
        }))

        // 4. Run updates and inserts
        if (toUpdate.length) {
            const { error: updateErr } = await supabase
                .from('project_images')
                .upsert(toUpdate)
            if (updateErr) throw updateErr
        }

        if (toInsert.length) {
            const { error: insertErr } = await supabase
                .from('project_images')
                .insert(toInsert)
            if (insertErr) throw insertErr
        }

        return { success: true }
    } catch (error) {
        console.error('Error syncing images:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sync images',
        }
    }
})