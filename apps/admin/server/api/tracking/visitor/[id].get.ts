import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({ statusCode: 400, statusMessage: 'Missing visitor id' })
        }

        const query = getQuery(event)
        const page = Math.max(parseInt(query.page as string) || 1, 1)
        const itemsPerPage = Math.min(
            Math.max(parseInt(query.limit as string) || 100, 1),
            500
        )
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1
        const ascending = query.order === 'asc'

        // --- Fetch events -------------------------------------------------
        let qb = admin
            .from('tracking_events')
            .select(
                `id, timestamp, event_type, page_path, full_url, host, environment,
                 source, source_detail, query_params, duration_ms, element_info,
                 session_id, ip_address, os_name, os_version, device_type,
                 device_model, device_vendor, browser_name, browser_version,
                 screen_width, screen_height, pixel_ratio, user_agent`,
                { count: 'exact' }
            )
            .eq('visitor_id', id)
            .order('timestamp', { ascending })
            .range(from, to)

        if (query.from) qb = qb.gte('timestamp', String(query.from))
        if (query.to) qb = qb.lte('timestamp', String(query.to))
        if (query.event_type) qb = qb.eq('event_type', String(query.event_type))

        const { data, error, count } = await qb
        if (error) {
            console.error('[visitor detail] supabase error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            })
            throw error
        }

        // --- Fetch summary (optional) -------------------------------------
        let summary: any = null
        const { data: sumData, error: sumErr } = await admin.rpc(
            'admin_visitor_summary',
            { p_visitor_id: id }
        )
        if (!sumErr && sumData && sumData.length > 0) {
            summary = sumData[0]
        } else if (sumErr) {
            // Non-fatal — the events are still returned below
            console.warn('[visitor detail] summary rpc error:', {
                message: sumErr.message,
                details: sumErr.details,
                hint: sumErr.hint,
                code: sumErr.code,
            })
        }

        return {
            success: true,
            visitor_id: id,
            summary,
            data: data || [],
            pagination: {
                currentPage: page,
                itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage),
            },
        }
    } catch (error) {
        console.error('Error fetching visitor events:', error)
        return {
            success: false,
            data: [],
            summary: null,
            pagination: { currentPage: 1, itemsPerPage: 100, totalItems: 0, totalPages: 0 },
            error: error instanceof Error ? error.message : 'Failed to fetch visitor',
        }
    }
})