
export type SourceType = 'qr' | 'meta_ads' | 'organic' | 'direct'

export interface SourceInfo {
    source: SourceType
    sourceDetail: string | null
    queryParams: Record<string, string>
}

export function detectSource(search: string): SourceInfo {
    const params = new URLSearchParams(search)
    const obj: Record<string, string> = {}
    params.forEach((v, k) => (obj[k] = v))

    // QR code: has ?s= (scan marker) — e.g. ?q=voucher&d=true&s=eddm
    if (obj.s) {
        return { source: 'qr', sourceDetail: obj.s, queryParams: obj }
    }

    // Meta ads: has q + d but no s — e.g. ?q=voucher&d=true
    if (obj.q && obj.d) {
        return { source: 'meta_ads', sourceDetail: obj.q, queryParams: obj }
    }

    // Has some query params but doesn't match — treat as organic/referral
    if (Object.keys(obj).length > 0) {
        return { source: 'organic', sourceDetail: null, queryParams: obj }
    }

    // No params
    return { source: 'direct', sourceDetail: null, queryParams: {} }
}