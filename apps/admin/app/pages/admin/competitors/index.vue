<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen max-w-7xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-navy">Competitor Intelligence</h1>
      <p class="text-slate-500 text-sm">
        Discover local competitors, scrape their sites, and extract marketing
        intelligence. Open a competitor to compare it against your site and
        build a sales battlecard.
      </p>
    </div>

    <!-- Controls -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3"
    >
      <form
        class="grid grid-cols-1 sm:grid-cols-12 gap-3"
        @submit.prevent="runDiscovery"
      >
        <div class="sm:col-span-6">
          <input
            v-model="query"
            type="text"
            class="field w-full"
            placeholder="Search query (e.g. holiday lighting Florida)…"
            required
          />
        </div>
        <div class="sm:col-span-3">
          <select v-model="searchArea" class="field w-full">
            <option value="sarasota">Sarasota Area (50km)</option>
            <option value="florida">
              Florida West Coast (Tampa to Naples)
            </option>
            <option value="custom">Custom Bounding Box</option>
          </select>
        </div>
        <div class="sm:col-span-3">
          <button
            type="submit"
            :disabled="loadingDiscover"
            class="w-full h-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            <GlobeAltIcon class="h-4 w-4 shrink-0" />
            <span>{{
              loadingDiscover ? "Discovering…" : "Discover Competitors"
            }}</span>
          </button>
        </div>
      </form>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
        <label
          class="inline-flex items-center gap-2 text-xs font-medium text-slate-600"
        >
          <input
            v-model="useAi"
            type="checkbox"
            class="rounded border-slate-300"
          />
          Use Gemini for analysis
        </label>
        <div class="flex-1" />
        <button
          type="button"
          :disabled="loadingAnalyze || selectedIds.size === 0"
          class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
          @click="runAnalyze"
        >
          <SparklesIcon class="h-4 w-4 shrink-0" />
          <span>{{
            loadingAnalyze
              ? "Analyzing…"
              : `Analyze Selected (${selectedIds.size})`
          }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingDiscover || loadingAnalyze" class="space-y-4">
      <div
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse"
      >
        <div class="h-4 bg-slate-200 rounded w-1/4" />
        <div class="h-3 bg-slate-200 rounded w-1/2" />
        <div class="h-24 bg-slate-100 rounded-lg" />
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!competitors.length"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <BuildingStorefrontIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">
        No competitors loaded
      </h3>
      <p class="text-sm text-slate-500 max-w-md mx-auto">
        Run a discovery above to pull businesses from Google Places.
      </p>
    </div>

    <!-- Results -->
    <template v-else>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            v-model="search"
            type="text"
            class="field sm:col-span-2"
            placeholder="Filter by name, website or address…"
          />
          <select v-model="statusFilter" class="field">
            <option value="all">All statuses ({{ competitors.length }})</option>
            <option value="discovered">Discovered</option>
            <option value="scraped">Scraped</option>
            <option value="analyzed">Analyzed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="c in filteredCompetitors"
          :key="c.id"
          class="rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all"
          :class="
            c.is_internal
              ? 'bg-orange-50/30 border-brand-orange/30 ring-1 ring-brand-orange/20'
              : 'bg-white border-slate-100'
          "
        >
          <!-- Header Row -->
          <div
            class="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center gap-4"
            :class="
              c.is_internal ? 'border-brand-orange/20' : 'border-slate-100'
            "
          >
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-slate-300 shrink-0 mt-1 sm:mt-0"
              :checked="selectedIds.has(c.id)"
              @change="toggleSelect(c.id)"
            />

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <a
                  v-if="c.website"
                  :href="c.website"
                  target="_blank"
                  class="text-base font-bold text-navy hover:text-brand-orange transition-colors truncate"
                  :title="c.website"
                >
                  {{ c.name }}
                </a>
                <span v-else class="text-base font-bold text-navy truncate">
                  {{ c.name }}
                </span>

                <!-- Internal Site Badge -->
                <span
                  v-if="c.is_internal"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-brand-orange text-white"
                >
                  Internal Site
                </span>

                <NuxtLink
                  :to="`/admin/competitors/${c.id}`"
                  class="text-xs text-brand-orange font-medium hover:underline ml-2"
                >
                  {{ c.is_internal ? "View Details →" : "Details & Compare →" }}
                </NuxtLink>

                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                  :class="statusBadgeClass(c.status)"
                >
                  {{ c.status }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ c.address || "No address" }}
              </p>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy bg-slate-100 hover:bg-brand-orange hover:text-white transition-colors disabled:opacity-60"
                :disabled="loadingAnalyze"
                @click="analyzeOne(c)"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                <span>Analyze</span>
              </button>
            </div>
          </div>

          <!-- Body Grid -->
          <div class="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-4 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div
                  class="rounded-lg p-3 border"
                  :class="
                    c.is_internal
                      ? 'bg-white/60 border-brand-orange/10'
                      : 'bg-slate-50 border-slate-100'
                  "
                >
                  <div
                    class="text-[10px] uppercase tracking-wide text-slate-400 font-semibold"
                  >
                    Rating
                  </div>
                  <div class="font-semibold text-navy text-sm mt-0.5">
                    {{ c.rating != null ? `${c.rating} ★` : "—" }}
                    <span
                      v-if="c.review_count"
                      class="text-[11px] font-normal text-slate-400"
                    >
                      ({{ c.review_count }})
                    </span>
                  </div>
                </div>
                <div
                  class="rounded-lg p-3 border"
                  :class="
                    c.is_internal
                      ? 'bg-white/60 border-brand-orange/10'
                      : 'bg-slate-50 border-slate-100'
                  "
                >
                  <div
                    class="text-[10px] uppercase tracking-wide text-slate-400 font-semibold"
                  >
                    Phone
                  </div>
                  <div class="font-semibold text-navy text-sm mt-0.5">
                    {{ c.phone || "—" }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Intelligence Snippet -->
            <div class="lg:col-span-8">
              <template v-if="c.intelligence">
                <!-- Quick facts -->
                <div class="flex flex-wrap items-center gap-1.5 mb-4">
                  <span
                    v-if="c.intelligence.tone"
                    class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {{ c.intelligence.tone }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    :class="
                      c.intelligence.pricingSignals?.hasPricing
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    "
                  >
                    {{
                      c.intelligence.pricingSignals?.hasPricing
                        ? "Public pricing"
                        : "No public pricing"
                    }}
                  </span>
                  <span
                    v-if="c.intelligence.pricingSignals?.financingMentioned"
                    class="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
                  >
                    Financing
                  </span>
                  <span
                    v-if="c.intelligence.packages?.length"
                    class="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-semibold uppercase tracking-wide text-blue-700"
                  >
                    {{ c.intelligence.packages.length }} package{{
                      c.intelligence.packages.length === 1 ? "" : "s"
                    }}
                  </span>
                  <span
                    v-else-if="!c.intelligence.packages"
                    class="px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-semibold uppercase tracking-wide text-amber-700"
                    title="Analysis predates packages and trust signals. Re-analyze to update."
                  >
                    Old analysis
                  </span>
                </div>

                <!-- Packages -->
                <div v-if="c.intelligence.packages?.length" class="mb-4">
                  <div
                    class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5"
                  >
                    Packages
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(p, i) in c.intelligence.packages.slice(0, 4)"
                      :key="i"
                      class="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-700"
                    >
                      {{ p.name }}
                      <span
                        :class="p.price ? 'text-emerald-600' : 'text-slate-400'"
                        >· {{ p.price || "no price" }}</span
                      >
                    </span>
                    <span
                      v-if="c.intelligence.packages.length > 4"
                      class="px-2 py-1 text-[11px] text-slate-400"
                    >
                      +{{ c.intelligence.packages.length - 4 }} more
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div v-if="c.intelligence.claimedAdvantages?.length">
                      <div
                        class="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5"
                      >
                        Claimed Advantages
                      </div>
                      <ul
                        class="text-sm text-slate-600 space-y-1 list-disc list-inside"
                      >
                        <li
                          v-for="(a, i) in c.intelligence.claimedAdvantages"
                          :key="i"
                          class="line-clamp-2"
                        >
                          {{ a }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div v-if="c.intelligence.detectableWeaknesses?.length">
                      <div
                        class="text-xs font-semibold uppercase tracking-wide text-rose-600 mb-1.5"
                      >
                        Weaknesses
                      </div>
                      <ul
                        class="text-sm text-slate-600 space-y-1 list-disc list-inside"
                      >
                        <li
                          v-for="(w, i) in c.intelligence.detectableWeaknesses"
                          :key="i"
                          class="line-clamp-2"
                        >
                          {{ w }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  SparklesIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  BuildingStorefrontIcon,
} from "@heroicons/vue/24/outline";

type CompetitorStatus = "discovered" | "scraped" | "analyzed" | "failed";
type CompetitorRow = {
  id: string;
  created_at: string;
  name: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  review_count: number | null;
  status: CompetitorStatus;
  intelligence: any | null;
  is_internal: boolean;
};

const { showToast } = useToast();

const query = ref("holiday lighting Florida");
const searchArea = ref("florida");
const useAi = ref(true);
const loadingDiscover = ref(false);
const loadingAnalyze = ref(false);

const competitors = ref<CompetitorRow[]>([]);
const statusFilter = ref("all");
const search = ref("");
const selectedIds = ref(new Set<string>());

const loadCompetitors = async () => {
  try {
    const res = await $fetch<{ competitors: CompetitorRow[] }>(
      "/api/competitors",
      { query: { limit: 200 } },
    );
    competitors.value = res.competitors;
  } catch (e: any) {
    showToast(e?.data?.statusMessage || "Failed to load competitors", "error");
  }
};

onMounted(loadCompetitors);

const runDiscovery = async () => {
  if (!query.value.trim()) return;
  loadingDiscover.value = true;
  try {
    const bounds =
      searchArea.value === "sarasota"
        ? { lowLat: 26.9, lowLng: -82.8, highLat: 27.7, highLng: -82.0 }
        : { lowLat: 26.1, lowLng: -82.8, highLat: 27.9, highLng: -81.9 };

    const res = await $fetch<{ found: number }>("/api/competitors/discover", {
      method: "POST",
      body: { query: query.value.trim(), ...bounds },
    });
    await loadCompetitors();
    showToast(
      `Discovered ${res.found} competitor${res.found === 1 ? "" : "s"}`,
      "success",
    );
  } catch (e: any) {
    showToast(e?.data?.statusMessage || "Discovery failed", "error");
  } finally {
    loadingDiscover.value = false;
  }
};

const runAnalyze = async () => {
  const ids = Array.from(selectedIds.value);
  if (ids.length === 0)
    return showToast("Select at least one competitor first", "error");

  loadingAnalyze.value = true;
  try {
    const res = await $fetch<{ results: any[] }>("/api/competitors/analyze", {
      method: "POST",
      body: { ids, useAi: useAi.value },
    });
    await loadCompetitors();
    selectedIds.value = new Set();

    const failures = res.results.filter((r: any) => !r.ok);
    if (failures.length > 0)
      showToast(
        `Failed to process ${failures.length} site(s). Reason: ${failures[0].reason}`,
        "error",
      );
    else
      showToast(
        `Successfully processed ${res.results.length} competitors`,
        "success",
      );
  } catch (e: any) {
    showToast(e?.data?.statusMessage || "Analysis failed", "error");
  } finally {
    loadingAnalyze.value = false;
  }
};

const analyzeOne = async (c: CompetitorRow) => {
  loadingAnalyze.value = true;
  showToast(`Analyzing ${c.name}...`, "info");
  try {
    const res = await $fetch<{ results: any[] }>("/api/competitors/analyze", {
      method: "POST",
      body: { ids: [c.id], useAi: useAi.value },
    });
    await new Promise((r) => setTimeout(r, 500)); // Let DB settle
    await loadCompetitors();

    const fail = res.results.find((r: any) => !r.ok);
    if (fail) showToast(`Failed: ${fail.reason}`, "error");
    else showToast(`Successfully analyzed ${c.name}`, "success");
  } catch (e: any) {
    showToast(e?.data?.statusMessage || "Analysis failed", "error");
  } finally {
    loadingAnalyze.value = false;
  }
};

const toggleSelect = (id: string) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
};

const filteredCompetitors = computed(() => {
  const q = search.value.trim().toLowerCase();
  return competitors.value.filter((c) => {
    if (statusFilter.value !== "all" && c.status !== statusFilter.value)
      return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.website ?? "").toLowerCase().includes(q) ||
      (c.address ?? "").toLowerCase().includes(q)
    );
  });
});

const statusBadgeClass = (status: CompetitorStatus) => {
  switch (status) {
    case "analyzed":
      return "bg-emerald-500 text-white";
    case "scraped":
      return "bg-blue-500 text-white";
    case "failed":
      return "bg-rose-500 text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};
</script>
