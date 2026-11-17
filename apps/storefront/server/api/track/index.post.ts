
import { createHash } from 'node:crypto'
import { getSupabase } from '~~/server/utils/supabase'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrackBody {
    device_fingerprint: string
    session_id: string
    host: string
    environment: 'local' | 'staging' | 'production'
    page_path: string
    full_url: string
    query_params: Record<string, string>
    source: 'qr' | 'meta_ads' | 'organic' | 'direct'
    source_detail: string | null
    event_type: 'pageview' | 'click'
    element_info?: Record<string, any> | null
    duration_ms?: number | null
    timestamp?: string

    // Device metadata (all optional — Firefox/Safari can't provide model)
    os_name?: string | null
    os_version?: string | null
    device_type?: 'mobile' | 'tablet' | 'desktop' | null
    device_model?: string | null
    device_vendor?: string | null
    browser_name?: string | null
    browser_version?: string | null
    screen_width?: number | null
    screen_height?: number | null
    pixel_ratio?: number | null
    user_agent?: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize an IP for stable visitor hashing:
 * - IPv4: use as-is
 * - IPv6: collapse to /64 prefix (RFC 4941 privacy extensions rotate the
 *   lower 64 bits every few hours — without this, one device looks like
 *   many visitors).
 */
function normalizeIp(ip: string): string {
    if (!ip || ip === 'unknown') return ip
    if (!ip.includes(':')) return ip // IPv4

    // Strip IPv4-mapped prefix and zone id
    const cleaned = ip.replace(/^::ffff:/i, '').split('%')[0] ?? ip
    if (!cleaned.includes(':')) return cleaned

    // Handle "::" compression by expanding to 8 groups first
    const parts = cleaned.split('::')
    const head = parts[0] ? parts[0].split(':') : []
    const tail = parts[1] ? parts[1].split(':') : []
    const missing = 8 - head.length - tail.length
    const groups = [
        ...head,
        ...Array(Math.max(missing, 0)).fill('0'),
        ...tail,
    ]

    // Keep first 4 groups = /64
    return groups.slice(0, 4).map((g) => g || '0').join(':') + '::/64'
}

/**
 * Stable composite visitor identity: sha256(ip | device_fingerprint).
 * Same (ip, device) pair → same visitor_id, across sessions, tabs, days.
 */
function computeVisitorId(ip: string, deviceFingerprint: string): string {
    const normalized = normalizeIp(ip)
    return createHash('sha256')
        .update(`${normalized}|${deviceFingerprint}`)
        .digest('hex')
        .slice(0, 32)
}

/** Pick the best available client IP from proxy headers. */
function extractClientIp(event: any): string {
    const cfIp = getHeader(event, 'cf-connecting-ip')
    const realIp = getHeader(event, 'x-real-ip')
    const forwarded = getHeader(event, 'x-forwarded-for')
    const firstForwarded = forwarded?.split(',')[0]?.trim()

    return (
        cfIp?.trim() ||
        realIp?.trim() ||
        firstForwarded ||
        getRequestIP(event) ||
        'unknown'
    )
}

/** Coerce to string or null — prevents numbers/objects leaking into text columns. */
function asString(v: unknown): string | null {
    if (v === null || v === undefined) return null
    if (typeof v === 'string') return v
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    return null
}

/** Coerce to number or null. */
function asNumber(v: unknown): number | null {
    if (v === null || v === undefined) return null
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : null
}

/** Reject arrays and non-objects for JSONB columns. */
function asObject(v: unknown): Record<string, any> | null {
    if (v === null || v === undefined) return null
    if (typeof v !== 'object' || Array.isArray(v)) return null
    return v as Record<string, any>
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default defineEventHandler(async (event) => {
    const body = await readBody<TrackBody>(event)

    // --- Validation --------------------------------------------------------
    if (!body?.event_type || !body?.session_id || !body?.host) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    if (body.event_type !== 'pageview' && body.event_type !== 'click') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid event_type' })
    }

    if (typeof body.session_id !== 'string' || typeof body.host !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid field types' })
    }

    // --- Derive identity ---------------------------------------------------
    const ipAddress = extractClientIp(event)
    const visitorId = computeVisitorId(ipAddress, body.device_fingerprint ?? '')

    // --- Persist -----------------------------------------------------------
    const supabase = getSupabase()

    const { error } = await supabase.from('tracking_events').insert({
        // identity
        ip_address: ipAddress,
        visitor_id: visitorId,
        device_fingerprint: body.device_fingerprint,
        session_id: body.session_id,

        // environment
        host: body.host,
        environment: body.environment,

        // access source
        page_path: body.page_path,
        full_url: body.full_url,
        query_params: asObject(body.query_params) ?? {},
        source: body.source,
        source_detail: body.source_detail ?? null,

        // event
        event_type: body.event_type,
        element_info: body.event_type === 'click' ? asObject(body.element_info) : null,
        duration_ms: body.event_type === 'pageview' ? asNumber(body.duration_ms) : null,
        timestamp: body.timestamp ?? new Date().toISOString(),

        // device metadata
        os_name: asString(body.os_name),
        os_version: asString(body.os_version),
        device_type: body.device_type ?? null,
        device_model: asString(body.device_model),
        device_vendor: asString(body.device_vendor),
        browser_name: asString(body.browser_name),
        browser_version: asString(body.browser_version),
        screen_width: asNumber(body.screen_width),
        screen_height: asNumber(body.screen_height),
        pixel_ratio: asNumber(body.pixel_ratio),
        user_agent: asString(body.user_agent),
    })

    if (error) {
        console.error('[track] insert failed', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        })
        throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { ok: true }
})