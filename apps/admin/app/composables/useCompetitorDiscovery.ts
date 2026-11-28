import type {
    DiscoveryArea,
    DiscoveryBounds,
    DiscoveryResponse,
    DiscoveryRun,
} from '~/types/discovery'

const SEARCH_AREAS: Record<DiscoveryArea, DiscoveryBounds> = {
    sarasota: {
        lowLat: 26.9,
        lowLng: -82.8,
        highLat: 27.7,
        highLng: -82.0,
    },
    florida: {
        lowLat: 26.1,
        lowLng: -82.8,
        highLat: 27.9,
        highLng: -81.9,
    },
}

export function useCompetitorDiscovery() {
    const query = ref('holiday lighting Florida')
    const searchArea = ref<DiscoveryArea>('florida')

    const loadingDiscover = ref(false)
    const loadingHistory = ref(false)

    const discoveryResult = ref<DiscoveryResponse | null>(null)
    const discoveryError = ref<string | null>(null)
    const historyError = ref<string | null>(null)

    const history = ref<DiscoveryRun[]>([])

    const newPlaceIds = computed(
        () => new Set(discoveryResult.value?.newPlaceIds ?? []),
    )

    const loadHistory = async () => {
        if (loadingHistory.value) return

        loadingHistory.value = true
        historyError.value = null

        try {
            const res = await $fetch<{
                runs: DiscoveryRun[]
            }>('/api/competitors/discover/history')

            history.value = res.runs ?? []
        } catch (e: any) {
            historyError.value =
                e?.data?.statusMessage ||
                'Failed to load discovery history'
        } finally {
            loadingHistory.value = false
        }
    }

    const runDiscovery = async () => {
        if (loadingDiscover.value || !query.value.trim()) {
            return null
        }

        loadingDiscover.value = true
        discoveryResult.value = null
        discoveryError.value = null

        try {
            const res = await $fetch<DiscoveryResponse>(
                '/api/competitors/discover',
                {
                    method: 'POST',
                    body: {
                        query: query.value.trim(),
                        ...SEARCH_AREAS[searchArea.value],
                    },
                },
            )

            discoveryResult.value = res

            return res
        } catch (e: any) {
            discoveryError.value =
                e?.data?.statusMessage ||
                'Competitor discovery failed'

            return null
        } finally {
            await loadHistory()
            loadingDiscover.value = false
        }
    }

    const clearResult = () => {
        discoveryResult.value = null
        discoveryError.value = null
    }

    onMounted(loadHistory)

    return {
        query,
        searchArea,

        loadingDiscover,
        loadingHistory,

        discoveryResult,
        discoveryError,
        historyError,

        history,
        newPlaceIds,

        runDiscovery,
        loadHistory,
        clearResult,
    }
}