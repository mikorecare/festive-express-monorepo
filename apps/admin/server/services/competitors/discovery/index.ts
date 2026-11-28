import type { SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_MAX_NEW_RESULTS, MAX_SEARCH_RESULTS, DETAILS_CONCURRENCY } from './config'
import { searchPlaceIds, fetchPlaceDetails } from './places'
import { findExistingPlaceIds, insertNewCompetitors } from './repository'
import type { DiscoveryOptions, DiscoveryResult, DiscoveryFailure, PlaceCompetitor } from './types'

export async function discoverCompetitors(apiKey: string, textQuery: string, opts: DiscoveryOptions, supabase: SupabaseClient): Promise<DiscoveryResult> {
    const requestedLimit = opts.maxResults ?? DEFAULT_MAX_NEW_RESULTS
    const maxResults = Number.isFinite(requestedLimit) ? Math.max(0, Math.min(Math.floor(requestedLimit), MAX_SEARCH_RESULTS)) : DEFAULT_MAX_NEW_RESULTS
    const search = await searchPlaceIds(apiKey, textQuery, opts)
    const existingIds = await findExistingPlaceIds(supabase, search.ids)
    const newIds = search.ids.filter(id => !existingIds.has(id))
    const selectedIds = newIds.slice(0, maxResults)
    const competitors: PlaceCompetitor[] = []
    const failures: DiscoveryFailure[] = []
    for (let i = 0; i < selectedIds.length; i += DETAILS_CONCURRENCY) {
        const batch = selectedIds.slice(i, i + DETAILS_CONCURRENCY)
        const results = await Promise.allSettled(batch.map(id => fetchPlaceDetails(apiKey, id)))
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') competitors.push(result.value)
            else failures.push({ placeId: batch[index]!, error: result.reason instanceof Error ? result.reason.message : String(result.reason) })
        })
    }
    if (selectedIds.length && !competitors.length && failures.length) {
        throw new Error(`All ${failures.length} Place Details requests failed. First error: ${failures[0]?.error}`)
    }
    const insertedIds = new Set(await insertNewCompetitors(supabase, competitors))
    const uniqueInserted = [...new Map(competitors.filter(c => insertedIds.has(c.place_id)).map(c => [c.place_id, c])).values()]
    const stats = {
        returned: search.ids.length,
        existing: existingIds.size,
        newCandidates: newIds.length,
        detailsRequested: selectedIds.length,
        detailsFetched: competitors.length,
        inserted: uniqueInserted.length,
        skipped: existingIds.size + competitors.length - uniqueInserted.length,
        failed: failures.length,
        pages: search.pages,
    }
    console.log('[discovery] Completed:', stats)
    return { competitors: uniqueInserted, stats, failures }
}
