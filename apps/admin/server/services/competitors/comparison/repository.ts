import type { getAuthenticatedSupabase } from '~~/server/utils/auth'
import type { SiteRecord } from './types'
import { record } from './context'
export type Database = Awaited<ReturnType<typeof getAuthenticatedSupabase>>
export async function loadSites(db: Database, internalId: string, competitorId: string) {
    const cols = 'id, name, intelligence, rating, review_count, price_level, last_analyzed_at, last_scraped_at, status, seo_raw'
    const result = await db.from('competitors').select(cols).in('id',[internalId,competitorId])
    if (result.error) throw createError({statusCode:500,statusMessage:'Could not load competitor records'})
    const rows = (result.data ?? []) as unknown as SiteRecord[]
    const ours = rows.find(r=>r.id===internalId), theirs = rows.find(r=>r.id===competitorId)
    if (!ours || !theirs) throw createError({statusCode:404,statusMessage:'One or both competitor records not found'})
    for (const site of [ours,theirs]) {
        if (!site.intelligence || !site.last_analyzed_at) throw createError({statusCode:400,statusMessage:'Both sites must be analyzed before comparing.'})
        if (site.status !== 'analyzed' || (site.last_scraped_at && Date.parse(site.last_scraped_at)>Date.parse(site.last_analyzed_at))) throw createError({statusCode:409,statusMessage:'A site has stale or unfinished analysis. Reanalyze before comparing.'})
    }
    return {ours,theirs}
}
export async function readCached(db: Database, internalId: string, competitorId: string, fingerprint: string) {
    const {data,error} = await db.from('competitor_battlecards').select('comparison_data').eq('internal_id',internalId).eq('external_id',competitorId)
    if (error) throw createError({statusCode:500,statusMessage:'Could not read comparison cache'})
    const matches = (data ?? []).map(r=>record(r.comparison_data)).filter(r=>record(r._meta).fingerprint===fingerprint && !!r.marketingScore && !!r.executiveSummary)
    return matches.sort((a,b)=>String(record(b._meta).generatedAt ?? '').localeCompare(String(record(a._meta).generatedAt ?? '')))[0] ?? null
}
// Never delete the previous report before a successful replacement. Existing schema may not
// have a unique pair constraint, so update existing rows and insert only if none exist.
export async function saveComparison(db: Database, internalId: string, competitorId: string, comparison: Record<string,unknown>) {
    // JSON-safe plain data, compatible with the existing JSON/JSONB comparison_data field.
    const comparison_data = JSON.parse(JSON.stringify(comparison))
    const update = () => db.from('competitor_battlecards').update({comparison_data}).eq('internal_id',internalId).eq('external_id',competitorId).select('comparison_data')
    const result = await update()
    if (result.error) throw createError({statusCode:500,statusMessage:'Could not save comparison'})
    if (result.data?.length) return
    const inserted = await db.from('competitor_battlecards').insert({internal_id:internalId,external_id:competitorId,comparison_data})
    if (!inserted.error) return
    // A concurrent insert may have won if the database has a unique pair constraint.
    if (inserted.error.code === '23505') {
        const retried = await update()
        if (!retried.error && retried.data?.length) return
    }
    throw createError({statusCode:500,statusMessage:'Could not save comparison'})
}
