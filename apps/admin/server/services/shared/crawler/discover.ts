import { stripWww } from '../text'
import { SKIP_EXT, MAX_SITEMAPS } from './config'
import { XMLParser } from 'fast-xml-parser'
import { fetchWithTimeout } from './fetch'
import pLimit from 'p-limit'
import * as cheerio from 'cheerio'

export function urlKey(raw: string): string {
    try {
        const u = new URL(raw)
        const path = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') || '/' : '/'
        return `${u.protocol}//${stripWww(u.hostname)}${path}${u.search}`
    } catch {
        return raw
    }
}

export async function discoverSiteUrls(inputUrl: string, maxPages = 30): Promise<string[]> {
    const normalized = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`
    const entry = new URL(normalized)
    const found = new Map<string, string>()

    const tryAdd = (raw: string, base?: string, stripQuery = false): string | null => {
        if (found.size >= maxPages) return null
        let u: URL
        try {
            u = new URL(raw, base)
        } catch {
            return null
        }
        if (!/^https?:$/.test(u.protocol)) return null
        if (stripWww(u.hostname) !== stripWww(entry.hostname)) return null
        if (SKIP_EXT.test(u.pathname)) return null
        u.hash = ''
        if (stripQuery) u.search = ''
        const key = urlKey(u.toString())
        if (found.has(key)) return null
        found.set(key, u.toString())
        return u.toString()
    }

    const parser = new XMLParser()
    const visited = new Set<string>()
    const asArray = <T,>(v: T | T[] | undefined | null): T[] =>
        v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]
    const locOf = (node: any): string | null => (typeof node?.loc === 'string' ? node.loc.trim() : null)

    async function readSitemap(sitemapUrl: string) {
        if (visited.has(sitemapUrl) || visited.size >= MAX_SITEMAPS || found.size >= maxPages) return
        visited.add(sitemapUrl)
        try {
            const res = await fetchWithTimeout(sitemapUrl)
            if (!res.ok) return
            const parsed = parser.parse(await res.text())
            for (const sub of asArray<any>(parsed?.sitemapindex?.sitemap)) {
                const loc = locOf(sub)
                if (loc) await readSitemap(loc)
            }
            for (const item of asArray<any>(parsed?.urlset?.url)) {
                const loc = locOf(item)
                if (loc) tryAdd(loc)
            }
        } catch {
            // sitemap unavailable
        }
    }

    const sitemapCandidates: string[] = []
    try {
        const res = await fetchWithTimeout(`${entry.origin}/robots.txt`)
        if (res.ok) {
            for (const m of (await res.text()).matchAll(/^\s*sitemap:\s*(\S+)/gim)) {
                if (m[1]) sitemapCandidates.push(m[1])
            }
        }
    } catch {
        // no robots.txt
    }
    sitemapCandidates.push(`${entry.origin}/sitemap.xml`)
    for (const s of sitemapCandidates) await readSitemap(s)

    if (found.size === 0) {
        tryAdd(normalized)
        let frontier = [normalized]
        for (let depth = 0; depth < 2 && frontier.length > 0 && found.size < maxPages; depth++) {
            const limit = pLimit(5)
            const next: string[] = []
            await Promise.all(
                frontier.map((pageUrl) =>
                    limit(async () => {
                        try {
                            const res = await fetchWithTimeout(pageUrl)
                            const type = res.headers.get('content-type') || ''
                            if (!res.ok || (type && !/html/i.test(type))) return
                            const $ = cheerio.load(await res.text())
                            $('a[href]').each((_, el) => {
                                const href = $(el).attr('href')?.trim()
                                if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return
                                if (($(el).attr('rel') || '').toLowerCase().includes('nofollow')) return
                                const added = tryAdd(href, res.url || pageUrl, true)
                                if (added) next.push(added)
                            })
                        } catch {
                            // skip
                        }
                    }),
                ),
            )
            frontier = next
        }
    }

    return Array.from(found.values()).slice(0, maxPages)
}
