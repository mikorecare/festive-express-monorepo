import type { SupabaseClient } from '@supabase/supabase-js'
import type { PlaceCompetitor } from './types'

export async function findExistingPlaceIds(supabase: SupabaseClient, placeIds: string[]): Promise<Set<string>> {
    if (!placeIds.length) return new Set<string>()
    const { data, error } = await supabase.from('competitors').select('place_id').in('place_id', placeIds)
    if (error) throw new Error(`Failed to check existing competitors: ${error.message}`)
    return new Set<string>((data ?? []).map(row => row.place_id).filter((id): id is string => typeof id === 'string' && id.length > 0))
}

export async function insertNewCompetitors(supabase: SupabaseClient, competitors: PlaceCompetitor[]): Promise<string[]> {
    if (!competitors.length) return []
    const uniqueCompetitors = [...new Map(competitors.map(c => [c.place_id, c])).values()]
    const { data, error } = await supabase.from('competitors').upsert(
        uniqueCompetitors.map(c => ({ ...c, status: 'discovered' as const })),
        { onConflict: 'place_id', ignoreDuplicates: true },
    ).select('place_id')
    if (error) throw new Error(`Failed to insert competitors: ${error.message}`)
    return (data ?? []).map(row => row.place_id).filter((id): id is string => typeof id === 'string' && id.length > 0)
}
