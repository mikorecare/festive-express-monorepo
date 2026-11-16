<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">SEO Audit History</h1>
        <p class="text-slate-500 text-sm">
          Every saved scan from the AI SEO Site Auditor, newest first
        </p>
      </div>
      <NuxtLink
        to="/admin/seo"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        <PlusIcon class="h-4 w-4" />
        New Audit
      </NuxtLink>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <input
        v-model="search"
        type="text"
        class="field"
        placeholder="Search by URL…"
      />
    </div>

    <!-- Table -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
        Loading audit history…
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <DocumentMagnifyingGlassIcon
          class="h-12 w-12 text-slate-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-semibold text-navy mb-1">No saved scans yet</h3>
        <p class="text-sm text-slate-500 mb-4">
          {{
            search
              ? "No audits match your search."
              : "Run your first audit to see it appear here."
          }}
        </p>
        <NuxtLink
          v-if="!search"
          to="/admin/seo"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          <PlusIcon class="h-4 w-4" />
          Run Audit
        </NuxtLink>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
            <th class="px-6 py-3 font-semibold">Target</th>
            <th class="px-6 py-3 font-semibold">Scanned</th>
            <th class="px-6 py-3 font-semibold">Score</th>
            <th class="px-6 py-3 font-semibold">Pages</th>
            <th class="px-6 py-3 font-semibold">Issues</th>
            <th class="px-6 py-3 font-semibold">AI</th>
            <th class="px-6 py-3 font-semibold w-40 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="audit in filtered"
            :key="audit.id"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <td class="px-6 py-4 max-w-md">
              <a
                :href="audit.target_url"
                target="_blank"
                class="font-semibold text-navy hover:text-brand-orange line-clamp-1 break-all"
                :title="audit.target_url"
              >
                {{ audit.target_url }}
              </a>
              <p
                v-if="audit.executive_summary"
                class="text-xs text-slate-500 line-clamp-1 mt-0.5"
                :title="audit.executive_summary"
              >
                {{ audit.executive_summary }}
              </p>
            </td>
            <td class="px-6 py-4 text-slate-600 whitespace-nowrap">
              <div class="text-xs">
                {{ formatDate(audit.created_at) }}
              </div>
              <div class="text-[10px] text-slate-400">
                {{ formatTime(audit.created_at) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                :class="scoreBadgeClass(audit.overall_score)"
              >
                {{ audit.overall_score }}/100
              </span>
            </td>
            <td class="px-6 py-4 text-slate-600">
              {{ audit.pages_total }}
              <span v-if="audit.pages_failed" class="text-xs text-rose-500">
                ({{ audit.pages_failed }} failed)
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5 text-xs">
                <span
                  v-if="audit.critical_count"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500 text-white font-semibold"
                  :title="`${audit.critical_count} critical`"
                >
                  {{ audit.critical_count }}C
                </span>
                <span
                  v-if="audit.warning_count"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-400 text-white font-semibold"
                  :title="`${audit.warning_count} warnings`"
                >
                  {{ audit.warning_count }}W
                </span>
                <span
                  v-if="audit.info_count"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold"
                  :title="`${audit.info_count} info`"
                >
                  {{ audit.info_count }}I
                </span>
                <span
                  v-if="
                    !audit.critical_count &&
                    !audit.warning_count &&
                    !audit.info_count
                  "
                  class="text-slate-400"
                >
                  —
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                v-if="audit.use_ai"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-brand-orange"
              >
                <SparklesIcon class="w-3 h-3" />
                AI
              </span>
              <span v-else class="text-xs text-slate-400">—</span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  @click="openDetail(audit.id)"
                >
                  View
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600"
                  @click="confirmDelete(audit)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDetail"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div
          class="flex items-start justify-between gap-3 p-5 border-b border-slate-100"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <DocumentMagnifyingGlassIcon
                class="w-5 h-5 text-brand-orange shrink-0"
              />
              <h3 class="text-lg font-bold text-navy truncate">
                {{ detail?.target_url ?? "Loading…" }}
              </h3>
            </div>
            <p v-if="detail" class="text-xs text-slate-400">
              Scanned {{ formatDate(detail.created_at) }} at
              {{ formatTime(detail.created_at) }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="closeDetail"
          >
            Close
          </button>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto p-5 space-y-4">
          <div
            v-if="detailLoading"
            class="py-10 text-center text-sm text-slate-400"
          >
            Loading report…
          </div>

          <template v-else-if="detail">
            <!-- Metric cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="rounded-lg border border-slate-100 p-3">
                <div class="text-xs font-medium text-slate-500">Score</div>
                <div class="mt-1 text-xl font-bold text-navy">
                  {{ detail.overall_score }}/100
                </div>
              </div>
              <div class="rounded-lg border border-rose-100 bg-rose-50/50 p-3">
                <div class="text-xs font-medium text-rose-600">Critical</div>
                <div class="mt-1 text-xl font-bold text-rose-600">
                  {{ detail.critical_count }}
                </div>
              </div>
              <div
                class="rounded-lg border border-amber-100 bg-amber-50/50 p-3"
              >
                <div class="text-xs font-medium text-amber-600">Warnings</div>
                <div class="mt-1 text-xl font-bold text-amber-600">
                  {{ detail.warning_count }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-100 p-3">
                <div class="text-xs font-medium text-slate-500">Info</div>
                <div class="mt-1 text-xl font-bold text-navy">
                  {{ detail.info_count }}
                </div>
              </div>
            </div>

            <!-- AI completeness warning -->
            <div
              v-if="
                detail.report?.meta?.aiEnabled &&
                ((detail.report.meta.chunks?.failed ?? 0) > 0 ||
                  (detail.report.meta.chunks?.missing ?? 0) > 0 ||
                  (detail.report.meta.chunks?.dropped ?? 0) > 0 ||
                  (detail.report.meta.suggestionsLost ?? 0) > 0)
              "
              class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1"
            >
              <span class="inline-flex items-center gap-1 font-semibold">
                <ExclamationTriangleIcon class="w-3.5 h-3.5" />
                AI review was incomplete:
              </span>
              <span v-if="(detail.report.meta.chunks?.failed ?? 0) > 0">
                {{ detail.report.meta.chunks?.failed }} part(s) could not be
                analysed
              </span>
              <span v-if="(detail.report.meta.chunks?.missing ?? 0) > 0">
                {{ detail.report.meta.chunks?.missing }} part(s) omitted by the
                model
              </span>
              <span v-if="(detail.report.meta.chunks?.retriedOk ?? 0) > 0">
                {{ detail.report.meta.chunks?.retriedOk }} part(s) recovered on
                retry
              </span>
              <span v-if="(detail.report.meta.chunks?.dropped ?? 0) > 0">
                {{ detail.report.meta.chunks?.dropped }} AI finding(s) dropped
                by validation
              </span>
              <span v-if="(detail.report.meta.suggestionsLost ?? 0) > 0">
                {{ detail.report.meta.suggestionsLost }} page(s) had no final AI
                suggestion
              </span>
            </div>

            <!-- Executive summary -->
            <div
              v-if="detail.executive_summary"
              class="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div
                class="text-[11px] font-bold uppercase tracking-wide text-brand-orange mb-1"
              >
                Executive Summary
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">
                {{ detail.executive_summary }}
              </p>
            </div>

            <!-- Pages quick list -->
            <div>
              <div
                class="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2"
              >
                Pages ({{ detail.report?.pages?.length ?? 0 }})
              </div>
              <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <div
                  v-for="page in detail.report?.pages ?? []"
                  :key="page.url"
                  class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-100 hover:bg-slate-50"
                >
                  <div class="min-w-0 flex-1">
                    <a
                      :href="page.url"
                      target="_blank"
                      class="text-xs font-semibold text-navy hover:text-brand-orange line-clamp-1 break-all"
                      :title="page.url"
                    >
                      {{ page.url }}
                    </a>
                    <p
                      class="text-[10px] line-clamp-1 mt-0.5"
                      :class="
                        page.fetchError ? 'text-rose-500' : 'text-slate-400'
                      "
                    >
                      {{ page.fetchError || page.currentMeta?.title || "—" }}
                    </p>
                    <!-- Per-page completeness flags -->
                    <p
                      v-if="pageFlags(page)"
                      class="text-[10px] text-amber-600 mt-0.5 flex items-center gap-1"
                    >
                      <ExclamationTriangleIcon class="w-2.5 h-2.5 shrink-0" />
                      {{ pageFlags(page) }}
                    </p>
                  </div>
                  <span
                    class="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    :class="scoreBadgeClass(page.score)"
                  >
                    {{ page.fetchError ? "Failed" : `${page.score}/100` }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Jump to full report -->
            <div class="pt-2 border-t border-slate-100">
              <NuxtLink
                :to="`/admin/seo/history/${detail.id}`"
                class="text-xs font-semibold text-brand-orange hover:underline"
              >
                Open full report →
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <TrashIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-navy">Delete Audit</h3>
        </div>
        <p class="text-slate-600 text-sm mb-6">
          Delete the scan for
          <span class="font-semibold">"{{ deleteTarget.target_url }}"</span>?
          This cannot be undone.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="deleteTarget = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
            :disabled="deleting"
            @click="doDelete"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

type AuditListItem = {
  id: string;
  created_at: string;
  target_url: string;
  overall_score: number;
  pages_total: number;
  pages_failed: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  executive_summary: string | null;
  use_ai: boolean;
};

type AuditPage = {
  url: string;
  finalUrl: string;
  status: number;
  score: number;
  fetchError: string | null;
  currentMeta: { title: string };
  ai?: "ok" | "cached" | "skipped" | "failed" | "partial";
  aiParts?: { total: number; ok: number; truncated: boolean };
  contentTruncated?: boolean;
  suggestionsLost?: boolean;
};

type AuditDetail = AuditListItem & {
  report: {
    scannedAt: string;
    targetUrl: string;
    mode?: "site" | "page";
    overallScore: number;
    pagesFailed: number;
    counts: { critical: number; warning: number; info: number };
    executiveSummary: string;
    pages: AuditPage[];
    meta: {
      aiEnabled: boolean;
      modelsUsed: Record<string, number>;
      tokens: {
        input: number;
        output: number;
        thoughts: number;
        cached: number;
      };
      cachedPages: number;
      aiFailedPages: number;
      partialPages?: number;
      skippedPages: number;
      truncatedPages?: number;
      chunks?: {
        total: number;
        cached: number;
        failed: number;
        missing: number;
        retriedOk: number;
        dropped: number;
      };
      suggestionsLost?: number;
    };
  };
};

const { showToast } = useToast();

const audits = ref<AuditListItem[]>([]);
const loading = ref(false);
const search = ref("");

const detailOpen = ref(false);
const detailLoading = ref(false);
const detail = ref<AuditDetail | null>(null);

const deleteTarget = ref<AuditListItem | null>(null);
const deleting = ref(false);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return audits.value;
  return audits.value.filter((a) => a.target_url.toLowerCase().includes(q));
});

const fetchAudits = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{ audits: AuditListItem[] }>("/api/seo-audit");
    audits.value = res.audits ?? [];
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || e?.message || "Failed to load audits",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

const openDetail = async (id: string) => {
  detailOpen.value = true;
  detailLoading.value = true;
  detail.value = null;
  try {
    const res = await $fetch<AuditDetail>(`/api/seo-audit/${id}`);
    detail.value = res;
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || e?.message || "Failed to load audit",
      "error",
    );
    closeDetail();
  } finally {
    detailLoading.value = false;
  }
};

const closeDetail = () => {
  detailOpen.value = false;
  detail.value = null;
};

const confirmDelete = (audit: AuditListItem) => {
  deleteTarget.value = audit;
};

const doDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  deleting.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/seo-audit/${id}`,
      { method: "DELETE" },
    );
    if (!res.success) throw new Error(res.error || "Delete failed");

    audits.value = audits.value.filter((a) => a.id !== id);
    deleteTarget.value = null;
    showToast("Audit deleted", "success");
  } catch (e: any) {
    showToast(e?.data?.statusMessage || e?.message || "Delete failed", "error");
  } finally {
    deleting.value = false;
  }
};

/** Human-readable per-page completeness flags for the quick list. */
const pageFlags = (page: AuditPage): string => {
  return [
    page.contentTruncated ? "content truncated" : "",
    page.aiParts?.truncated ? "AI chunks truncated" : "",
    page.suggestionsLost ? "suggestions synthesized" : "",
    page.ai === "partial" ? "AI partial" : "",
    page.ai === "failed" ? "AI failed" : "",
  ]
    .filter(Boolean)
    .join(", ");
};

// --- Helpers ---
const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const scoreBadgeClass = (score: number) => {
  if (score >= 85) return "bg-emerald-500 text-white";
  if (score >= 60) return "bg-amber-400 text-white";
  return "bg-rose-500 text-white";
};

onMounted(fetchAudits);
</script>
