import { FETCH_TIMEOUT_MS, USER_AGENT } from './config'

export function fetchWithTimeout(url: string, init: RequestInit = {}) {
    return fetch(url, {
        ...init,
        redirect: 'follow',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ...init.headers,
        },
    })
}
