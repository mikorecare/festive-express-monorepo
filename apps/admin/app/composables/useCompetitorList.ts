import type {
  CompetitorRow,
  AnalyzeResult,
} from '~/types/competitor-ui'

import type {
  DiscoveryRun,
} from '~/types/discovery'

import {
  useCompetitorDiscovery,
} from '~/composables/useCompetitorDiscovery'

export function useCompetitorList() {
  const { showToast } = useToast()

  const discovery = useCompetitorDiscovery()

  const useAi = ref(true)

  const loadingAnalyze = ref(false)
  const loadingList = ref(false)

  const competitors = ref<CompetitorRow[]>([])
  const latestCompetitors = ref<CompetitorRow[]>([])

  const statusFilter = ref('all')
  const search = ref('')

  const selectedIds = ref(new Set<string>())
  const activeIds = ref(new Set<string>())

  const showDiscoveryModal = ref(false)
  const showNewOnly = ref(false)

  const recentlyAnalyzedIds = ref(new Set<string>())

  const isBusy = computed(
    () =>
      loadingAnalyze.value ||
      loadingList.value ||
      discovery.loadingDiscover.value,
  )

  // --------------------------------------------------
  // Load competitor records
  // --------------------------------------------------

  const loadCompetitors = async () => {
    loadingList.value = true

    try {
      const res = await $fetch<{
        competitors: CompetitorRow[]
      }>('/api/competitors', {
        query: {
          limit: 200,
        },
      })

      competitors.value = res.competitors ?? []

      // Refresh the exact latest-discovery records
      // independently from the normal 200-row list.
      if (
        showNewOnly.value &&
        discovery.newPlaceIds.value.size > 0
      ) {
        const latest = await $fetch<{
          competitors: CompetitorRow[]
        }>('/api/competitors', {
          query: {
            limit: 60,
            placeIds: [
              ...discovery.newPlaceIds.value,
            ].join(','),
          },
        })

        latestCompetitors.value =
          latest.competitors ?? []
      }

      return true
    } catch (e: any) {
      showToast(
        e?.data?.statusMessage ||
        'Failed to load competitors',
        'error',
      )

      return false
    } finally {
      loadingList.value = false
    }
  }

  const refreshCompetitor = async (id: string) => {
    const res = await $fetch<{
      competitor: CompetitorRow
    }>(`/api/competitors/${id}`)

    const updated = res.competitor

    if (!updated) return

    const updateRows = (rows: CompetitorRow[]) => {
      const index = rows.findIndex(
        competitor => competitor.id === id,
      )

      if (index !== -1) {
        rows[index] = {
          ...rows[index],
          ...updated,
        }
      }
    }

    updateRows(competitors.value)
    updateRows(latestCompetitors.value)
  }

  const markRecentlyAnalyzed = (id: string) => {
    recentlyAnalyzedIds.value = new Set([
      ...recentlyAnalyzedIds.value,
      id,
    ])
  }

  onMounted(loadCompetitors)

  // --------------------------------------------------
  // Discovery modal
  // --------------------------------------------------

  const openDiscovery = () => {
    if (isBusy.value) return

    discovery.discoveryError.value = null
    showDiscoveryModal.value = true
  }

  const closeDiscovery = () => {
    if (discovery.loadingDiscover.value) return

    showDiscoveryModal.value = false
  }

  const reuseSearch = (run: DiscoveryRun) => {
    if (isBusy.value) return

    discovery.query.value = run.query

    if (run.location === 'Box: 26.9,-82.8 to 27.7,-82') {
      discovery.searchArea.value = 'sarasota'
    }

    if (
      run.location ===
      'Box: 26.1,-82.8 to 27.9,-81.9'
    ) {
      discovery.searchArea.value = 'florida'
    }

    openDiscovery()
  }

  // --------------------------------------------------
  // Run competitor discovery
  // --------------------------------------------------

  const runDiscovery = async () => {
    if (isBusy.value) return

    showNewOnly.value = false
    latestCompetitors.value = []
    selectedIds.value = new Set()

    const result = await discovery.runDiscovery()

    // Keep the modal open so the user can review
    // the error and try another search.
    if (!result) return

    showDiscoveryModal.value = false

    if (result.found > 0) {
      await loadCompetitors()
    }

    if (result.failed > 0) {
      showToast(
        `Discovery completed with ${result.failed} failed requests`,
        'info',
      )

      return
    }

    if (result.found > 0) {
      showToast(
        `${result.found} new competitor${result.found === 1 ? '' : 's'
        } discovered`,
        'success',
      )
    } else {
      showToast(
        'Discovery complete. No new competitors added.',
        'info',
      )
    }
  }

  // --------------------------------------------------
  // Latest discovery filter
  // --------------------------------------------------

  const viewNewCompetitors = async () => {
    if (
      isBusy.value ||
      !discovery.newPlaceIds.value.size
    ) {
      return
    }

    loadingList.value = true

    try {
      const res = await $fetch<{
        competitors: CompetitorRow[]
      }>('/api/competitors', {
        query: {
          limit: 60,
          placeIds: [
            ...discovery.newPlaceIds.value,
          ].join(','),
        },
      })

      latestCompetitors.value =
        res.competitors ?? []

      search.value = ''
      statusFilter.value = 'all'
      selectedIds.value = new Set()

      showNewOnly.value = true
    } catch (e: any) {
      showToast(
        e?.data?.statusMessage ||
        'Failed to load new competitors',
        'error',
      )
    } finally {
      loadingList.value = false
    }
  }

  const clearNewFilter = () => {
    showNewOnly.value = false
    selectedIds.value = new Set()
  }

  const dismissDiscoveryResult = () => {
    clearNewFilter()
    latestCompetitors.value = []
    discovery.clearResult()
  }

  // --------------------------------------------------
  // Analyze selected competitors
  // --------------------------------------------------

  const runAnalyze = async () => {
    if (isBusy.value) return

    const ids = Array.from(selectedIds.value)

    if (!ids.length) {
      return showToast(
        'Select at least one competitor first',
        'error',
      )
    }

    loadingAnalyze.value = true
    activeIds.value = new Set(ids)

    try {
      const res = await $fetch<{
        results: AnalyzeResult[]
      }>('/api/competitors/analyze', {
        method: 'POST',
        body: {
          ids,
          useAi: useAi.value,
        },
      })

      await loadCompetitors()

      selectedIds.value = new Set()

      const failures = res.results.filter(
        result => !result.ok,
      )

      if (failures.length > 0) {
        showToast(
          `Failed to process ${failures.length} site(s). Reason: ${failures[0]?.reason}`,
          'error',
        )
      } else if (
        res.results.some(
          result => result.reason === 'partial',
        )
      ) {
        showToast(
          'Partial analysis saved; review coverage',
          'info',
        )
      } else {
        showToast(
          `Successfully processed ${res.results.length} competitors`,
          'success',
        )
      }
    } catch (e: any) {
      showToast(
        e?.data?.statusMessage || 'Analysis failed',
        'error',
      )
    } finally {
      loadingAnalyze.value = false
      activeIds.value = new Set()
    }
  }

  // --------------------------------------------------
  // Analyze a single competitor
  // --------------------------------------------------

  const analyzeOne = async (competitor: CompetitorRow) => {
    if (isBusy.value) return

    loadingAnalyze.value = true
    activeIds.value = new Set([competitor.id])

    const next = new Set(recentlyAnalyzedIds.value)
    next.delete(competitor.id)
    recentlyAnalyzedIds.value = next

    showToast(
      `Analyzing ${competitor.name}…`,
      'info',
    )

    try {
      const res = await $fetch<{
        results: AnalyzeResult[]
      }>('/api/competitors/analyze', {
        method: 'POST',
        body: {
          ids: [competitor.id],
          useAi: useAi.value,
        },
      })

      // Refresh only the affected competitor.
      await refreshCompetitor(competitor.id)

      const failure = res.results.find(
        result => !result.ok,
      )

      if (failure) {
        showToast(
          `Failed: ${failure.reason}`,
          'error',
        )
        return
      }

      if (!res.results.some(result => result.ok)) {
        showToast('No successful result returned', 'error')
        return
      }

      if (useAi.value) {
        markRecentlyAnalyzed(competitor.id)
      }

      if (
        res.results.some(
          result => result.reason === 'partial',
        )
      ) {
        showToast(
          'Partial analysis saved; review coverage',
          'info',
        )
      } else {
        showToast(
          `Successfully ${useAi.value ? 'analyzed' : 'scraped'
          } ${competitor.name}`,
          'success',
        )
      }
    } catch (e: any) {
      showToast(
        e?.data?.statusMessage ||
        'Analysis or record refresh failed',
        'error',
      )
    } finally {
      loadingAnalyze.value = false
      activeIds.value = new Set()
    }
  }
  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredCompetitors = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    const rows = showNewOnly.value
      ? latestCompetitors.value
      : competitors.value

    return rows.filter(competitor => {
      if (
        statusFilter.value !== 'all' &&
        competitor.status !== statusFilter.value
      ) {
        return false
      }

      if (!keyword) return true

      return (
        competitor.name.toLowerCase().includes(keyword) ||
        (competitor.website ?? '')
          .toLowerCase()
          .includes(keyword) ||
        (competitor.address ?? '')
          .toLowerCase()
          .includes(keyword)
      )
    })
  })

  const internalRows = computed(() =>
    filteredCompetitors.value.filter(
      competitor => competitor.is_internal,
    ),
  )

  const externalRows = computed(() =>
    filteredCompetitors.value.filter(
      competitor => !competitor.is_internal,
    ),
  )

  const toggleSelect = (id: string) => {
    if (isBusy.value) return

    const next = new Set(selectedIds.value)

    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }

    selectedIds.value = next
  }

  const allVisibleSelected = computed(
    () =>
      filteredCompetitors.value.length > 0 &&
      filteredCompetitors.value.every(
        competitor => selectedIds.value.has(competitor.id),
      ),
  )

  const toggleSelectAll = () => {
    if (isBusy.value) return

    const next = new Set(selectedIds.value)

    for (const competitor of filteredCompetitors.value) {
      if (allVisibleSelected.value) {
        next.delete(competitor.id)
      } else {
        next.add(competitor.id)
      }
    }

    selectedIds.value = next
  }

  // --------------------------------------------------
  // Dashboard statistics
  // --------------------------------------------------

  const stats = computed(() => [
    {
      label: 'Our websites',
      value: competitors.value.filter(
        competitor => competitor.is_internal,
      ).length,
    },
    {
      label: 'Competitors',
      value: competitors.value.filter(
        competitor => !competitor.is_internal,
      ).length,
    },
    {
      label: 'Analyzed',
      value: competitors.value.filter(
        competitor => competitor.status === 'analyzed',
      ).length,
    },
    {
      label: 'Needs analysis',
      value: competitors.value.filter(
        competitor => competitor.status !== 'analyzed',
      ).length,
    },
  ])

  return {
    ...discovery,

    useAi,
    isBusy,

    loadingList,
    loadingAnalyze,

    showDiscoveryModal,
    showNewOnly,

    statusFilter,
    search,

    selectedIds,
    activeIds,

    filteredCompetitors,
    internalRows,
    externalRows,

    stats,
    allVisibleSelected,

    loadCompetitors,

    openDiscovery,
    closeDiscovery,
    reuseSearch,
    runDiscovery,

    viewNewCompetitors,
    clearNewFilter,
    dismissDiscoveryResult,

    runAnalyze,
    analyzeOne,
    recentlyAnalyzedIds,
    refreshCompetitor,

    toggleSelect,
    toggleSelectAll,
  }
}