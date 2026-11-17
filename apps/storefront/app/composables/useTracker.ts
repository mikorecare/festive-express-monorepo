import { ref } from 'vue'
import { UAParser } from 'ua-parser-js'

// ---------------------------------------------------------------------------
// Device info
// ---------------------------------------------------------------------------

export interface DeviceInfo {
    os_name: string | null
    os_version: string | null
    device_type: 'mobile' | 'tablet' | 'desktop'
    device_model: string | null
    device_vendor: string | null
    browser_name: string | null
    browser_version: string | null
    screen_width: number
    screen_height: number
    pixel_ratio: number
    user_agent: string
}

export function getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent
    const parser = new UAParser(ua)
    const result = parser.getResult()

    let deviceType: DeviceInfo['device_type'] = 'desktop'
    if (result.device.type === 'mobile') deviceType = 'mobile'
    else if (result.device.type === 'tablet') deviceType = 'tablet'

    let osName = result.os.name ?? null
    if (!osName && /iPad|iPhone|iPod/.test(ua)) osName = 'iOS'

    return {
        os_name: osName,
        os_version: result.os.version ?? null,
        device_type: deviceType,
        device_model: result.device.model ?? null,
        device_vendor: result.device.vendor ?? null,
        browser_name: result.browser.name ?? null,
        browser_version: result.browser.version ?? null,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        pixel_ratio: window.devicePixelRatio,
        user_agent: ua,
    }
}

/**
 * Enrich DeviceInfo using the Chromium-only userAgentData API.
 * No-op on Firefox/Safari (they don't expose it).
 * `model` and `platformVersion` are high-entropy values that require an
 * explicit async request in modern Chromium.
 */
export async function getDeviceInfoEnriched(): Promise<DeviceInfo> {
    const base = getDeviceInfo()
    if (!import.meta.client) return base

    const uaData = (navigator as any).userAgentData
    if (!uaData?.getHighEntropyValues) return base

    try {
        const values = await uaData.getHighEntropyValues(['model', 'platformVersion'])
        return {
            ...base,
            device_model: values.model || base.device_model,
            os_version: base.os_version ?? values.platformVersion ?? null,
        }
    } catch {
        return base
    }
}

// ---------------------------------------------------------------------------
// Fingerprint
// ---------------------------------------------------------------------------

function getDeviceFingerprint(): string {
    if (!import.meta.client) return 'ssr'
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillStyle = '#f60'
        ctx.fillRect(125, 1, 62, 20)
        ctx.fillStyle = '#069'
        ctx.fillText('device-fp', 2, 15)
    }
    const raw = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
    ].join('|')

    let hash = 0
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i)
        hash |= 0
    }
    return 'fp_' + Math.abs(hash).toString(36)
}

// ---------------------------------------------------------------------------
// Source / environment detection
// ---------------------------------------------------------------------------

function detectSource(search: string) {
    const params = new URLSearchParams(search)
    const obj: Record<string, string> = {}
    params.forEach((v, k) => (obj[k] = v))

    if (obj.s) return { source: 'qr' as const, sourceDetail: obj.s, queryParams: obj }
    if (obj.q && obj.d) return { source: 'meta_ads' as const, sourceDetail: obj.q, queryParams: obj }
    if (Object.keys(obj).length > 0) return { source: 'organic' as const, sourceDetail: null, queryParams: obj }
    return { source: 'direct' as const, sourceDetail: null, queryParams: {} }
}

function detectEnvironment(host: string): 'local' | 'staging' | 'production' {
    if (host.includes('localhost') || host.includes('127.0.0.1')) return 'local'
    if (host.includes('staging') || host.includes('stg') || host.includes('preview')) return 'staging'
    return 'production'
}

function extractPath(url: string): string {
    const qIndex = url.indexOf('?')
    const hashIndex = url.indexOf('#')
    let end = url.length
    if (qIndex !== -1) end = Math.min(end, qIndex)
    if (hashIndex !== -1) end = Math.min(end, hashIndex)
    return url.slice(0, end) || '/'
}

// ---------------------------------------------------------------------------
// Singleton composable
// ---------------------------------------------------------------------------

let trackerSingleton: ReturnType<typeof _useTracker> | null = null

function _useTracker() {
    const sessionId = ref<string>('')
    const deviceFp = ref<string>('')
    let deviceInfo: DeviceInfo | null = null

    let pageEnterTime = Date.now()
    let currentPath = '/'
    let currentFullUrl = ''

    function buildBasePayload() {
        const loc = window.location
        const { source, sourceDetail, queryParams } = detectSource(loc.search)
        return {
            device_fingerprint: deviceFp.value,
            session_id: sessionId.value,
            host: loc.host,
            environment: detectEnvironment(loc.host),
            page_path: currentPath,
            full_url: currentFullUrl,
            query_params: queryParams,
            source,
            source_detail: sourceDetail,
            // Device metadata (null-safe spread; every field is optional)
            ...(deviceInfo ?? {}),
        }
    }

    async function send(payload: Record<string, any>) {
        try {
            await $fetch('/api/track', { method: 'POST', body: payload })
        } catch (e) {
            // swallow — tracking must never break the app
            console.warn('[tracker] failed', e)
        }
    }

    function reportPageView(durationMs: number) {
        return send({ ...buildBasePayload(), event_type: 'pageview', duration_ms: durationMs })
    }

    function trackClick(el: HTMLElement, extra?: Record<string, any>) {
        return send({
            ...buildBasePayload(),
            event_type: 'click',
            element_info: {
                tag: el.tagName,
                id: el.id,
                class: el.className,
                text: el.innerText?.slice(0, 80),
                ...extra,
            },
        })
    }

    function onRouteChange(newUrl: string) {

        if (newUrl === currentFullUrl) return

        const now = Date.now()
        const duration = now - pageEnterTime
        reportPageView(duration)
        currentFullUrl = newUrl
        currentPath = extractPath(newUrl)
        pageEnterTime = now
        reportPageView(0)
    }

    function sendUnload(durationMs: number) {
        const payload = JSON.stringify({
            ...buildBasePayload(),
            event_type: 'pageview',
            duration_ms: durationMs,
        })
        // keepalive survives unload; endpoint is same-origin so no CORS
        fetch('/api/track', {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        })
    }

    function handleBeforeUnload() {
        sendUnload(Date.now() - pageEnterTime)
    }

    // visibilitychange fires more reliably than beforeunload on mobile,
    // especially when the tab is backgrounded or the app is killed.
    function handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            sendUnload(Date.now() - pageEnterTime)
            // Reset timer so we don't double-count when the page becomes
            // visible again (the user didn't actually leave).
            pageEnterTime = Date.now()
        }
    }

    async function init() {
        if (!import.meta.client) return
        sessionId.value = crypto.randomUUID()
        deviceFp.value = getDeviceFingerprint()

        // Collect device info once per session — it doesn't change mid-session.
        // Enrichment is async, so we fire the initial pageview after it resolves.
        deviceInfo = await getDeviceInfoEnriched()

        currentPath = window.location.pathname
        currentFullUrl = window.location.href
        pageEnterTime = Date.now()

        reportPageView(0)

        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    function destroy() {
        if (!import.meta.client) return
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        reportPageView(Date.now() - pageEnterTime)
    }

    return { init, destroy, trackClick, onRouteChange, deviceFp, sessionId }
}

export function useTracker() {
    if (!trackerSingleton) trackerSingleton = _useTracker()
    return trackerSingleton
}