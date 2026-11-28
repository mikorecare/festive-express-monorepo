import { createHash } from 'node:crypto'

export const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, '')

export const collapse = (s: string) => s.replace(/\s+/g, ' ').trim()

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const sha1 = (s: string) => createHash('sha1').update(s).digest('hex')

export const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

export function fit(text: string, max: number): string {
    const t = (text || '').replace(/\s+/g, ' ').trim()
    if (t.length <= max) return t
    const cut = t.slice(0, max + 1)
    const space = cut.lastIndexOf(' ')
    return (space > max * 0.6 ? cut.slice(0, space) : t.slice(0, max)).replace(/[\s,;:–-]+$/, '')
}
