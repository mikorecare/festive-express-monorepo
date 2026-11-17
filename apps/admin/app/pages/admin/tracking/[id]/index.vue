<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
    >
      <div>
        <NuxtLink
          to="/admin/tracking"
          class="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-1"
        >
          ← Back to all visitors
        </NuxtLink>
        <h1 class="text-2xl font-bold text-navy">Visitor Journey</h1>
        <p class="text-slate-500 text-sm mt-1">
          A complete story of what this person did on your site.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
        :disabled="loading"
        @click="load"
      >
        <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && !summary" class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-xl border border-slate-100 h-24 animate-pulse"
        />
      </div>
      <div
        class="bg-white rounded-xl border border-slate-100 h-40 animate-pulse"
      />
    </div>

    <template v-else-if="summary">
      <!-- Summary cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <RectangleStackIcon class="h-4 w-4 text-blue-600" />
            </div>
            <p class="text-xs text-slate-500 font-medium">Visits</p>
          </div>
          <p class="text-2xl font-bold text-navy">
            {{ summary.total_sessions }}
          </p>
          <p class="text-xs text-slate-400 mt-1">
            {{
              pluralize(
                summary.total_sessions,
                "separate visit",
                "separate visits",
              )
            }}
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
            >
              <BoltIcon class="h-4 w-4 text-purple-600" />
            </div>
            <p class="text-xs text-slate-500 font-medium">Actions taken</p>
          </div>
          <p class="text-2xl font-bold text-navy">{{ summary.total_events }}</p>
          <p class="text-xs text-slate-400 mt-1">
            {{ summary.total_clicks }}
            {{ pluralize(summary.total_clicks, "tap", "taps") }} ·
            {{ summary.total_events - summary.total_clicks }} page views
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <ClockIcon class="h-4 w-4 text-emerald-600" />
            </div>
            <p class="text-xs text-slate-500 font-medium">Time on site</p>
          </div>
          <p class="text-2xl font-bold text-navy">
            {{ formatDwell(summary.total_dwell_ms) }}
          </p>
          <p class="text-xs text-slate-400 mt-1">
            Total time browsing your pages
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"
            >
              <PhoneIcon class="h-4 w-4 text-orange-600" />
            </div>
            <p class="text-xs text-slate-500 font-medium">Phone taps</p>
          </div>
          <p class="text-2xl font-bold text-navy">{{ summary.phone_taps }}</p>
          <p class="text-xs text-slate-400 mt-1">
            {{
              summary.phone_taps > 0
                ? "They tried to call you!"
                : "No calls attempted yet"
            }}
          </p>
        </div>
      </div>

      <!-- Visitor details -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 class="text-sm font-semibold text-navy mb-4">About this visitor</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p class="text-xs text-slate-500 font-medium mb-1">
              First time on your site
            </p>
            <p class="text-slate-800 font-medium">
              {{ formatDate(summary.first_seen) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium mb-1">
              Most recent activity
            </p>
            <p class="text-slate-800 font-medium">
              {{ formatDate(summary.last_seen) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium mb-2">
              How they found you
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="src in summary.sources"
                :key="src"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="sourceBadgeClass(src)"
              >
                {{ sourceLabel(src) }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="summary.top_pages && summary.top_pages.length > 0"
          class="mt-5 pt-5 border-t border-slate-100"
        >
          <p class="text-xs text-slate-500 font-medium mb-2">
            Pages they visited most
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="page in summary.top_pages.slice(0, 5)"
              :key="page"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs font-mono text-slate-700"
            >
              <GlobeAltIcon class="h-3 w-3" />
              {{ page }}
            </span>
          </div>
        </div>
      </div>

      <!-- Event timeline -->
      <div
        class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
        >
          <div>
            <h2 class="text-sm font-semibold text-navy">
              What they did, step by step
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ events.length }}
              {{ pluralize(events.length, "action", "actions") }} in this view
            </p>
          </div>
          <button
            type="button"
            class="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-50"
            @click="toggleOrder"
          >
            <ArrowsUpDownIcon class="h-3.5 w-3.5" />
            {{ order === "desc" ? "Newest first" : "Oldest first" }}
          </button>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
          Loading…
        </div>

        <div
          v-else-if="events.length === 0"
          class="p-12 text-center text-slate-400 text-sm"
        >
          No activity recorded for this visitor.
        </div>

        <ol v-else class="divide-y divide-slate-100">
          <li
            v-for="(ev, idx) in events"
            :key="ev.id"
            class="px-6 py-4 flex gap-4 items-start hover:bg-slate-50/60"
          >
            <!-- Icon column -->
            <div class="shrink-0 pt-0.5">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center"
                :class="
                  ev.event_type === 'click' ? 'bg-orange-100' : 'bg-blue-100'
                "
              >
                <CircleStackIcon
                  v-if="ev.event_type === 'click'"
                  class="h-4 w-4 text-orange-600"
                />
                <EyeIcon v-else class="h-4 w-4 text-blue-600" />
              </div>
            </div>

            <!-- Content column -->
            <div class="flex-1 min-w-0">
              <!-- Human-readable headline -->
              <p class="text-sm text-navy font-medium">
                {{ humanizeEvent(ev) }}
              </p>

              <!-- Page + destination chips (for clicks) -->
              <div
                v-if="ev.event_type === 'click' && getClickDestination(ev)"
                class="mt-1.5 inline-flex items-center gap-1.5 text-xs"
              >
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono"
                >
                  {{ ev.page_path }}
                </span>
                <span class="text-slate-400">→</span>
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono"
                >
                  {{ getClickDestination(ev) }}
                </span>
              </div>

              <!-- Secondary details -->
              <div
                class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500"
              >
                <span class="inline-flex items-center gap-1">
                  <ClockIcon class="h-3 w-3" />
                  {{ formatDate(ev.timestamp) }}
                </span>
                <span
                  v-if="ev.source"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  :class="sourceBadgeClass(ev.source)"
                >
                  {{ sourceLabel(ev.source) }}
                  <span v-if="ev.source_detail">· {{ ev.source_detail }}</span>
                </span>
                <span
                  v-if="ev.duration_ms > 0"
                  class="inline-flex items-center gap-1 text-emerald-600 font-medium"
                >
                  <ClockIcon class="h-3 w-3" />
                  {{ formatDwell(ev.duration_ms) }} on page
                </span>
              </div>
            </div>

            <!-- Step number -->
            <div class="shrink-0 text-xs text-slate-300 font-mono pt-1">
              #{{ order === "desc" ? events.length - idx : idx + 1 }}
            </div>
          </li>
        </ol>
      </div>
    </template>

    <!-- Error state -->
    <div
      v-else
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <ExclamationTriangleIcon class="h-12 w-12 text-amber-400 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">
        We couldn't load this visitor
      </h3>
      <p class="text-sm text-slate-500 mb-4">
        The visitor ID may be invalid, or the data is unavailable right now.
      </p>
      <NuxtLink
        to="/admin/tracking"
        class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800"
      >
        ← Go back to visitors
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowPathIcon,
  RectangleStackIcon,
  BoltIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const visitorId = computed(() => String(route.params.id || ""));

const { showToast } = useToast();

const summary = ref<any>(null);
const events = ref<any[]>([]);
const loading = ref(false);
const order = ref<"asc" | "desc">("desc");
const pagination = ref<any>(null);

const load = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      summary: any;
      data: any[];
      pagination: any;
      error?: string;
    }>(`/api/tracking/visitor/${encodeURIComponent(visitorId.value)}`, {
      query: { limit: 200, order: order.value },
    });
    if (!res.success) throw new Error(res.error || "Failed to load visitor");
    summary.value = res.summary;
    events.value = res.data || [];
    pagination.value = res.pagination;
  } catch (e: any) {
    showToast(e?.message || "Failed to load visitor", "error");
  } finally {
    loading.value = false;
  }
};

const toggleOrder = () => {
  order.value = order.value === "desc" ? "asc" : "desc";
  load();
};

// ---------------------------------------------------------------------------
// Click destination extraction
// ---------------------------------------------------------------------------

/** Extract the best-known destination for a click event, or null. */
const getClickDestination = (ev: any): string | null => {
  const info = ev.element_info || {};
  // Priority: explicit `to` (router) > `href` (anchor) > `route_name`
  const dest = info.to || info.href || null;
  if (!dest) return null;
  // Normalize tel: links for readability
  if (dest.startsWith("tel:")) return dest.replace("tel:", "📞 ");
  return dest;
};

// ---------------------------------------------------------------------------
// Human-readable helpers
// ---------------------------------------------------------------------------

/**
 * Turn an event row into a clear one-liner.
 * For clicks: show button label + source page (destination is shown as chips below).
 * For pageviews: show path + dwell time.
 */
const humanizeEvent = (ev: any): string => {
  if (ev.event_type === "click") {
    const info = ev.element_info || {};
    const action = info.action as string | undefined;
    const label = (info.label || info.text || "").trim();
    const surface = info.surface as string | undefined;

    // Named actions we instrument explicitly
    if (action === "phone_click") {
      return `Tapped the "Call us" button${surface === "mobile" ? " (mobile)" : ""}`;
    }
    if (action === "nav_click") {
      return `Opened the "${label || "menu item"}" page from the ${
        surface === "mobile" ? "mobile menu" : "top menu"
      }`;
    }
    if (action === "nav_click_active") {
      return `Tapped the "${label || "current"}" tab again (already on that page)`;
    }
    if (action === "menu_open") return `Opened the mobile menu`;
    if (action === "menu_close") return `Closed the mobile menu`;
    if (action === "rage_click") {
      return `Kept tapping "${truncate(label || "a button", 60)}" (${info.click_count}× in a row)`;
    }

    if (label) {
      return `Tapped "${truncate(label, 60)}"`;
    }
    return `Tapped a button`;
  }

  // Page views
  if (ev.duration_ms > 0) {
    return `Spent ${formatDwell(ev.duration_ms)} on ${prettyPath(ev.page_path)}`;
  }
  return `Opened ${prettyPath(ev.page_path)}`;
};

/** Turn "/" into "the Home page", "/packages" into "the Packages page". */
const prettyPath = (path: string): string => {
  if (!path || path === "/") return "the Home page";
  const clean = path.replace(/^\//, "").replace(/\//g, " › ");
  return `the ${titleCase(clean)} page`;
};

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1) + "…" : s;

const pluralize = (n: number, one: string, many: string) =>
  n === 1 ? one : many;

const sourceLabel = (src: string): string => {
  switch (src) {
    case "qr":
      return "QR code";
    case "meta_ads":
      return "Meta ad";
    case "organic":
      return "Search / referral";
    case "direct":
      return "Direct visit";
    default:
      return src;
  }
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

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
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
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
};

onMounted(load);
</script>
