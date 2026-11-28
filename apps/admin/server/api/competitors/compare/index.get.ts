import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { compareWebsites, validatePair } from '~~/server/services/competitors/comparison'

// Backwards-compatible GET: serves cache or generates on miss; cachedOnly=1 is read-only.
export default defineEventHandler(async event => {
    setResponseHeader(event,'Cache-Control','private, no-store')
    const db = await getAuthenticatedSupabase(event)
    const q = getQuery(event)
    const pair = validatePair(q.internalId,q.competitorId)
    const config = useRuntimeConfig(event)
    return compareWebsites({db,apiKey:config.geminiApiKey as string,...pair,refresh:q.refresh==='1',cachedOnly:q.cachedOnly==='1'})
})
