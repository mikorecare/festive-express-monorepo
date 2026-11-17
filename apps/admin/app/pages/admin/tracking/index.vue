<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Visitors</h1>
        <p class="text-slate-500 text-sm">
          Unique visitors tracked on your storefront
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span v-if="pagination">
          {{ pagination.totalItems.toLocaleString() }} unique visitors
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
          :disabled="loading"
          @click="load"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div class="md:col-span-4">
          <input
            v-model="filters.search"
            type="text"
            class="field"
            placeholder="Search IP, device or visitor ID…"
          />
        </div>
        <div class="md:col-span-2">
          <select v-model="filters.source" class="field">
            <option value="">All sources</option>
            <option value="qr">QR</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="direct">Direct</option>
            <option value="organic">Organic</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <select v-model="filters.device_type" class="field">
            <option value="">All devices</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <input
            v-model="filters.from"
            type="date"
            class="field"
            placeholder="From"
          />
        </div>
        <div class="md:col-span-2">
          <input
            v-model="filters.to"
            type="date"
            class="field"
            placeholder="To"
          />
        </div>
      </div>
      <div class="flex justify-end mt-3">
        <button
          type="button"
          class="text-xs text-slate-500 hover:text-slate-700"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- Table -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
        Loading visitors…
      </div>

      <div v-else-if="visitors.length === 0" class="p-12 text-center">
        <UserGroupIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-navy mb-1">No visitors yet</h3>
        <p class="text-sm text-slate-500 mb-4">
          {{
            hasActiveFilters
              ? "No visitors match your filters."
              : "Once users start landing on your storefront, they'll show up here."
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr
              class="text-left text-xs uppercase tracking-wide text-slate-500"
            >
              <th class="px-6 py-3 font-semibold">Visitor</th>
              <th class="px-6 py-3 font-semibold">IP</th>
              <th class="px-6 py-3 font-semibold">Device</th>
              <th class="px-6 py-3 font-semibold">OS</th>
              <th class="px-6 py-3 font-semibold">Sessions</th>
              <th class="px-6 py-3 font-semibold">Events</th>
              <th class="px-6 py-3 font-semibold">Dwell</th>
              <th class="px-6 py-3 font-semibold">Sources</th>
              <th class="px-6 py-3 font-semibold">Last seen</th>
              <th class="px-6 py-3 font-semibold w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="v in visitors"
              :key="v.visitor_id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="font-mono text-xs text-navy" :title="v.visitor_id">
                  {{ v.visitor_id.slice(0, 10) }}…
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 font-mono text-xs">
                {{ v.ip_address || "—" }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                <span class="capitalize">{{ v.device_type || "—" }}</span>
                <span
                  v-if="v.device_model"
                  class="text-xs text-slate-400 block"
                >
                  {{ v.device_model }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ v.os_name || "—" }}
                <span v-if="v.os_version" class="text-slate-400">
                  {{ v.os_version }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ v.total_sessions }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ v.total_events }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ formatDwell(v.total_dwell_ms) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="src in v.sources"
                    :key="src"
                    class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                    :class="sourceBadgeClass(src)"
                  >
                    {{ src }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                {{ formatDate(v.last_seen) }}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  class="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  @click="openVisitor(v)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 text-sm"
      >
        <span class="text-slate-500">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }} ({{
            pagination.totalItems.toLocaleString()
          }}
          visitors)
        </span>
        <div class="inline-flex gap-2">
          <button
            type="button"
            class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="pagination.currentPage <= 1 || loading"
            @click="goToPage(pagination.currentPage - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="
              pagination.currentPage >= pagination.totalPages || loading
            "
            @click="goToPage(pagination.currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserGroupIcon } from "@heroicons/vue/24/outline";

type Visitor = {
  visitor_id: string;
  ip_address: string | null;
  device_fingerprint: string | null;
  os_name: string | null;
  os_version: string | null;
  device_type: string | null;
  device_model: string | null;
  device_vendor: string | null;
  browser_name: string | null;
  first_seen: string;
  last_seen: string;
  total_events: number;
  total_pageviews: number;
  total_clicks: number;
  total_sessions: number;
  total_dwell_ms: number;
  sources: string[];
  total_count: number;
};

const { showToast } = useToast();
const router = useRouter();

const visitors = ref<Visitor[]>([]);
const loading = ref(false);
const pagination = ref<{
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
} | null>(null);

const filters = reactive({
  search: "",
  source: "",
  device_type: "",
  from: "",
  to: "",
  page: 1,
  limit: 50,
});

const hasActiveFilters = computed(
  () =>
    !!filters.search ||
    !!filters.source ||
    !!filters.device_type ||
    !!filters.from ||
    !!filters.to,
);

const load = async () => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      page: filters.page,
      limit: filters.limit,
    };
    if (filters.search) params.search = filters.search;
    if (filters.source) params.source = filters.source;
    if (filters.device_type) params.device_type = filters.device_type;
    if (filters.from) params.from = `${filters.from}T00:00:00Z`;
    if (filters.to) params.to = `${filters.to}T23:59:59Z`;

    const res = await $fetch<{
      success: boolean;
      data: Visitor[];
      pagination: typeof pagination.value;
      error?: string;
    }>("/api/tracking/visitors", { query: params });

    if (!res.success) throw new Error(res.error || "Failed to load visitors");
    visitors.value = res.data || [];
    pagination.value = res.pagination;
  } catch (e: any) {
    showToast(e?.message || "Failed to load visitors", "error");
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.search = "";
  filters.source = "";
  filters.device_type = "";
  filters.from = "";
  filters.to = "";
  filters.page = 1;
  load();
};

const goToPage = (page: number) => {
  if (page < 1) return;
  if (pagination.value && page > pagination.value.totalPages) return;
  filters.page = page;
  load();
};

const openVisitor = (v: Visitor) => {
  router.push(`/admin/tracking/${v.visitor_id}`);
};

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDwell = (ms: number) => {
  if (!ms || ms <= 0) return "0s";
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
};

const sourceBadgeClass = (src: string) => {
  switch (src) {
    case "qr":
      return "bg-emerald-100 text-emerald-700";
    case "meta_ads":
      return "bg-blue-100 text-blue-700";
    case "organic":
      return "bg-amber-100 text-amber-700";
    case "direct":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

// Reload with debounce when search or filters change
let searchDebounce: ReturnType<typeof setTimeout> | null = null;
watch(
  () => [
    filters.search,
    filters.source,
    filters.device_type,
    filters.from,
    filters.to,
  ],
  () => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      filters.page = 1;
      load();
    }, 300);
  },
);

onMounted(load);
</script>
