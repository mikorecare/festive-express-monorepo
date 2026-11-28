import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { compareWebsites, validatePair } from '~~/server/services/competitors/comparison'

// Preferred generation endpoint. GET with cachedOnly=1 can retrieve the result.
export default defineEventHandler(async event => {
    setResponseHeader(event,'Cache-Control','private, no-store')
    const db = await getAuthenticatedSupabase(event)
    const body = await readBody(event)
    const pair = validatePair(body?.internalId,body?.competitorId)
    const config = useRuntimeConfig(event)
    return compareWebsites({db,apiKey:config.geminiApiKey as string,...pair,refresh:body?.refresh===true})
})
