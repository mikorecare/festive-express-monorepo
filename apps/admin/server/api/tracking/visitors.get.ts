// server/api/admin/tracking/visitors.get.ts
import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const query = getQuery(event)

        // --- Pagination ---------------------------------------------------
        const page = Math.max(parseInt(query.page as string) || 1, 1)
        const itemsPerPage = Math.min(
            Math.max(parseInt(query.limit as string) || 50, 1),
            200
        )
        const offset = (page - 1) * itemsPerPage

        // --- Safe param coercion ------------------------------------------
        // Empty strings from `?from=&to=` must become null, not ''.
        const asNullableString = (v: unknown): string | null =>
            v === undefined || v === null || v === '' ? null : String(v)

        const rpcParams = {
            p_from: asNullableString(query.from),
            p_to: asNullableString(query.to),
            p_source: asNullableString(query.source),
            p_environment: asNullableString(query.environment),
            p_device_type: asNullableString(query.device_type),
            p_os_name: asNullableString(query.os_name),
            p_search: asNullableString(query.search),
            p_limit: itemsPerPage,
            p_offset: offset,
        }

        // --- Call the Postgres function -----------------------------------
        const { data, error } = await admin.rpc('admin_visitor_list', rpcParams)

        if (error) {
            console.error('[visitors] rpc error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                params: rpcParams,
            })
            throw error
        }

        const rows = (data || []) as any[]
        const totalItems = rows.length > 0 ? Number(rows[0].total_count) : 0

        return {
            success: true,
            data: rows,
            pagination: {
                currentPage: page,
                itemsPerPage,
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
            },
        }
    } catch (error) {
        console.error('Error fetching visitor list:', error)
        return {
            success: false,
            data: [],
            pagination: { currentPage: 1, itemsPerPage: 50, totalItems: 0, totalPages: 0 },
            error: error instanceof Error ? error.message : 'Failed to fetch visitors',
        }
    }
})