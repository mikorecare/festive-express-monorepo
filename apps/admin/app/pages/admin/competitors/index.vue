<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-6 max-w-7xl mx-auto space-y-6">
    <!-- Page header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#1C2D5B]">
          Competitor Intelligence
        </h1>

        <p class="text-sm text-slate-500 mt-1">
          Discover businesses, analyze websites and compare marketing
          strategies.
        </p>
      </div>

      <button
        type="button"
        :disabled="isBusy"
        class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F49321] hover:bg-orange-600 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        @click="openDiscovery"
      >
        <GlobeAltIcon class="w-5 h-5" />

        Discover Competitors
      </button>
    </header>

    <!-- Overview statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl border border-slate-200 p-4"
      >
        <p class="text-xs font-medium text-slate-500">
          {{ stat.label }}
        </p>

        <p class="text-3xl font-bold text-[#1C2D5B] mt-1 tabular-nums">
          {{ stat.value }}
        </p>
      </div>
    </div>

    <!-- Discovery results -->
    <DiscoveryResults
      v-if="discoveryResult"
      :result="discoveryResult"
      :busy="isBusy"
      @dismiss="dismissDiscoveryResult"
      @view-new="viewNewCompetitors"
      @search-again="openDiscovery"
    />

    <!-- Discovery history -->
    <DiscoveryHistory
      :runs="history"
      :loading="loadingHistory"
      :error="historyError"
      :busy="isBusy"
      @refresh="loadHistory"
      @reuse="reuseSearch"
    />

    <!-- Competitor management -->
    <section
      class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <header
        class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100"
      >
        <div>
          <h2 class="font-bold text-[#1C2D5B]">Competitor Directory</h2>

          <p class="text-xs text-slate-500 mt-1">
            Manage registered businesses and website analysis.
          </p>
        </div>

        <button
          type="button"
          :disabled="isBusy"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          @click="loadCompetitors"
        >
          <ArrowPathIcon
            class="w-4 h-4"
            :class="{ 'animate-spin': loadingList }"
          />

          Refresh
        </button>
      </header>

      <!-- Search and filter -->
      <div class="p-4 space-y-3">
        <div class="flex flex-col sm:flex-row items-stretch gap-3">
          <div class="relative flex-1">
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            />

            <input
              v-model="search"
              type="search"
              :disabled="isBusy"
              placeholder="Search by name, website or address…"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#F49321]"
            />
          </div>

          <select
            v-model="statusFilter"
            :disabled="isBusy"
            class="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none"
          >
            <option value="all">All statuses</option>

            <option value="discovered">Discovered</option>

            <option value="scraped">Scraped</option>

            <option value="analyzed">Analyzed</option>

            <option value="failed">Failed</option>
          </select>
        </div>

        <!-- Latest discovery filter -->
        <div
          v-if="showNewOnly"
          class="flex items-center justify-between gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100"
        >
          <div class="flex items-center gap-2">
            <SparklesIcon class="w-5 h-5 text-[#F49321] shrink-0" />

            <span class="text-sm font-medium text-[#1C2D5B]">
              Showing latest discovery results
            </span>
          </div>

          <button
            type="button"
            :disabled="isBusy"
            class="text-xs font-semibold text-[#F49321] hover:underline disabled:opacity-50"
            @click="clearNewFilter"
          >
            Clear filter
          </button>
        </div>
      </div>

      <!-- Bulk analysis controls -->
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-50/70 border-t border-slate-100"
      >
        <div class="flex flex-wrap items-center gap-4">
          <label class="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              :checked="allVisibleSelected"
              :disabled="isBusy || !filteredCompetitors.length"
              class="rounded border-slate-300 accent-[#1C2D5B]"
              @change="toggleSelectAll"
            />

            Select all visible
          </label>

          <span class="text-xs text-slate-400">
            {{ selectedIds.size }} selected
          </span>

          <label class="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              v-model="useAi"
              type="checkbox"
              :disabled="isBusy"
              class="rounded border-slate-300 accent-[#1C2D5B]"
            />

            Include AI marketing analysis
          </label>
        </div>

        <button
          type="button"
          :disabled="isBusy || selectedIds.size === 0"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C2D5B] hover:bg-[#263d73] text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          @click="runAnalyze"
        >
          <ArrowPathIcon v-if="loadingAnalyze" class="w-4 h-4 animate-spin" />

          <SparklesIcon v-else class="w-4 h-4" />

          {{
            loadingAnalyze
              ? "Processing websites…"
              : `${useAi ? "Analyze" : "Scrape"} Selected (${selectedIds.size})`
          }}
        </button>
      </div>
    </section>

    <!-- Loading state -->
    <div
      v-if="loadingList && !filteredCompetitors.length"
      role="status"
      class="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl"
    >
      <ArrowPathIcon class="w-5 h-5 text-[#F49321] animate-spin" />

      <p class="text-sm text-slate-600">
        {{
          loadingAnalyze
            ? "Processing selected websites…"
            : loadingDiscover
              ? "Searching for new competitors…"
              : "Loading competitors…"
        }}
      </p>
    </div>

    <!-- Empty state -->
    <div
      v-if="!filteredCompetitors.length && !loadingList"
      class="bg-white rounded-2xl border border-slate-200 p-10 text-center"
    >
      <div
        class="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center"
      >
        <MagnifyingGlassIcon class="w-6 h-6 text-slate-400" />
      </div>

      <h3 class="font-bold text-[#1C2D5B] mt-4">No matching competitors</h3>

      <p class="text-sm text-slate-500 mt-2">
        Try adjusting your filters or discover new businesses in your target
        market.
      </p>

      <button
        type="button"
        :disabled="isBusy"
        class="mt-4 px-4 py-2.5 rounded-lg bg-[#1C2D5B] text-white text-sm disabled:opacity-50"
        @click="openDiscovery"
      >
        Discover Competitors
      </button>
    </div>

    <!-- Our websites -->
    <section v-if="internalRows.length > 0" class="space-y-3">
      <header class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-[#1C2D5B]">Our Websites</h2>

        <span class="text-xs font-medium text-slate-500">
          {{ internalRows.length }} websites
        </span>
      </header>

      <CompetitorCard
        v-for="competitor in internalRows"
        :recently-analyzed="recentlyAnalyzedIds.has(competitor.id)"
        :key="competitor.id"
        :competitor="competitor"
        :selected="selectedIds.has(competitor.id)"
        :busy="activeIds.has(competitor.id)"
        :disabled="isBusy"
        @select="toggleSelect(competitor.id)"
        @analyze="analyzeOne(competitor)"
      />
    </section>

    <!-- Market competitors -->
    <section v-if="externalRows.length > 0" class="space-y-3">
      <header class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-[#1C2D5B]">
          {{
            showNewOnly ? "Newly Discovered Competitors" : "Market Competitors"
          }}
        </h2>

        <span class="text-xs font-medium text-slate-500">
          {{ externalRows.length }} competitors
        </span>
      </header>

      <CompetitorCard
        v-for="competitor in externalRows"
        :recently-analyzed="recentlyAnalyzedIds.has(competitor.id)"
        :key="competitor.id"
        :competitor="competitor"
        :selected="selectedIds.has(competitor.id)"
        :busy="activeIds.has(competitor.id)"
        :disabled="isBusy"
        @select="toggleSelect(competitor.id)"
        @analyze="analyzeOne(competitor)"
      />
    </section>

    <!-- Discovery modal -->
    <CompetitorDiscoveryModal
      v-model:query="query"
      v-model:search-area="searchArea"
      :open="showDiscoveryModal"
      :loading="loadingDiscover"
      :error="discoveryError"
      @close="closeDiscovery"
      @discover="runDiscovery"
    />
  </div>
</template>

<script setup lang="ts">
import {
  GlobeAltIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";

import CompetitorCard from "~/components/competitors/CompetitorCard.vue";
import CompetitorDiscoveryModal from "~/components/competitors/CompetitorDiscoveryModal.vue";
import DiscoveryResults from "~/components/competitors/DiscoveryResults.vue";
import DiscoveryHistory from "~/components/competitors/DiscoveryHistory.vue";
import { useCompetitorList } from "~/composables/useCompetitorList";

const {
  query,
  searchArea,
  useAi,

  isBusy,
  loadingDiscover,
  loadingAnalyze,
  loadingList,
  loadingHistory,

  discoveryResult,
  discoveryError,
  historyError,
  history,

  showDiscoveryModal,
  showNewOnly,

  statusFilter,
  search,

  selectedIds,
  activeIds,
  allVisibleSelected,

  filteredCompetitors,
  internalRows,
  externalRows,
  stats,

  loadCompetitors,
  loadHistory,

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

  toggleSelect,
  toggleSelectAll,
} = useCompetitorList();
</script>
