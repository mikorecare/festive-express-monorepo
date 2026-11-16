<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <NuxtLink
            to="/admin/seo/history"
            class="hover:text-brand-orange font-medium"
          >
            ← SEO Audit History
          </NuxtLink>
        </div>
        <h1 class="text-2xl font-bold text-navy line-clamp-1 break-all">
          {{ audit?.target_url ?? "Loading…" }}
        </h1>
        <p v-if="audit" class="text-slate-500 text-sm">
          Scanned {{ formatDate(audit.created_at) }} at
          {{ formatTime(audit.created_at) }}
          <template v-if="audit.report?.mode">
            · {{ audit.report.mode === "page" ? "Single page" : "Whole site" }}
          </template>
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          @click="exportMarkdownReport"
          :disabled="!audit"
        >
          <ArrowDownTrayIcon class="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
          @click="deleteTarget = audit ?? null"
          :disabled="!audit"
        >
          <TrashIcon class="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 text-sm"
    >
      Loading audit report…
    </div>

    <!-- Not found -->
    <div
      v-else-if="!audit"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <DocumentMagnifyingGlassIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">Audit not found</h3>
      <p class="text-sm text-slate-500 mb-4">
        This audit may have been deleted, or you don't have access to it.
      </p>
      <NuxtLink
        to="/admin/seo/history"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        Back to History
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Executive summary -->
      <div
        v-if="audit.executive_summary"
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-brand-orange space-y-1.5"
      >
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-orange">
          <SparklesIcon class="w-4 h-4" />
          <span>{{ audit.use_ai ? "Gemini AI Executive Summary" : "Executive Summary" }}</span>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed">
          {{ audit.executive_summary }}
        </p>
      </div>

      <!-- Metric cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div class="text-xs font-medium text-slate-500">Overall Health Score</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-bold text-navy">{{ audit.overall_score }}/100</span>
            <span class="text-[11px] font-medium text-slate-400">
              {{ audit.pages_total }} page{{ audit.pages_total === 1 ? "" : "s" }}
              <template v-if="audit.pages_failed">
                ({{ audit.pages_failed }} failed)
              </template>
            </span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Critical</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-rose-500 text-white">
              Critical
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">{{ audit.critical_count }}</div>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Warnings</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-400 text-white">
              Warning
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">{{ audit.warning_count }}</div>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Optimizations</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-200 text-slate-700">
              Info
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">{{ audit.info_count }}</div>
        </div>
      </div>

      <!-- AI usage line -->
      <div
        v-if="audit.report?.meta?.aiEnabled"
        class="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 px-1"
      >
        <span>Models: {{ modelsUsedLabel }}</span>
        <span>
          Tokens: {{ audit.report.meta.tokens.input }} in ·
          {{ audit.report.meta.tokens.output }} out ·
          {{ audit.report.meta.tokens.thoughts }} thinking
        </span>
        <span>
          {{ audit.report.meta.cachedPages }} cached ·
          {{ audit.report.meta.skippedPages }} skipped
          <template v-if="audit.report.meta.partialPages">
            · {{ audit.report.meta.partialPages }} partial
          </template>
          <template v-if="audit.report.meta.aiFailedPages">
            · {{ audit.report.meta.aiFailedPages }} AI failed
          </template>
          <template v-if="audit.report.meta.truncatedPages">
            · {{ audit.report.meta.truncatedPages }} truncated
          </template>
        </span>
      </div>

      <!-- AI completeness warning -->
      <div
        v-if="audit.report?.meta?.aiEnabled && (
          audit.report.meta.chunks?.failed > 0 ||
          audit.report.meta.chunks?.missing > 0 ||
          audit.report.meta.chunks?.dropped > 0 ||
          audit.report.meta.suggestionsLost > 0
        )"
        class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1"
      >
        <span class="inline-flex items-center gap-1 font-semibold">
          <ExclamationTriangleIcon class="w-3.5 h-3.5" />
          AI review was incomplete:
        </span>
        <span v-if="audit.report.meta.chunks?.failed">
          {{ audit.report.meta.chunks.failed }} part(s) could not be analysed
        </span>
        <span v-if="audit.report.meta.chunks?.missing">
          {{ audit.report.meta.chunks.missing }} part(s) omitted by the model
        </span>
        <span v-if="audit.report.meta.chunks?.retriedOk">
          {{ audit.report.meta.chunks.retriedOk }} part(s) recovered on retry
        </span>
        <span v-if="audit.report.meta.chunks?.dropped">
          {{ audit.report.meta.chunks.dropped }} AI finding(s) dropped by validation
        </span>
        <span v-if="audit.report.meta.suggestionsLost">
          {{ audit.report.meta.suggestionsLost }} page(s) had no final AI suggestion
        </span>
      </div>

      <!-- Filter bar -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            v-model="pageSearch"
            type="text"
            class="field sm:col-span-2"
            placeholder="Filter pages by URL or title…"
          />
          <select v-model="severityFilter" class="field">
            <option value="all">All severities</option>
            <option value="critical">Critical issues only</option>
            <option value="warning">Warnings only</option>
            <option value="info">Info / optimizations only</option>
            <option value="ai-incomplete">AI incomplete / truncated pages</option>
          </select>
        </div>
      </div>

      <!-- Pages grid -->
      <div
        v-if="filteredPages.length === 0"
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-10 text-center"
      >
        <CheckCircleIcon class="h-10 w-10 text-emerald-500 mx-auto mb-2" />
        <p class="text-sm font-semibold text-navy">No pages match this filter</p>
        <button
          type="button"
          class="mt-2 text-xs text-brand-orange font-medium hover:underline"
          @click="severityFilter = 'all'; pageSearch = ''"
        >
          Reset filters
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="page in filteredPages"
          :key="page.url"
          class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
        >
          <!-- Card header -->
          <div class="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <a
                :href="page.url"
                target="_blank"
                class="text-sm font-bold text-navy hover:text-brand-orange transition-colors line-clamp-1 break-all"
                :title="page.url"
              >
                {{ page.url }}
              </a>
              <p
                class="text-xs line-clamp-1 mt-0.5"
                :class="page.fetchError ? 'text-rose-500' : 'text-slate-500'"
              >
                {{
                  page.fetchError ||
                  (page.status >= 400
                    ? `HTTP ${page.status}`
                    : page.currentMeta?.title || "No <title> tag detected")
                }}
              </p>
            </div>
            <span
              class="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
              :class="scoreBadgeClass(page.score)"
            >
              {{ page.fetchError ? "Failed" : `${page.score}/100` }}
            </span>
          </div>

          <!-- Card body -->
          <div class="p-4 flex-1 flex flex-col space-y-4">
            <!-- Issues -->
            <div v-if="page.issues?.length" class="space-y-2">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Missing & Flagged Items ({{ page.issues.length }})
              </div>

              <div
                v-for="(issue, idx) in page.issues"
                :key="idx"
                class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1"
              >
                <div class="flex items-start justify-between gap-2">
                  <span class="text-xs font-semibold text-navy">
                    <span
                      v-if="issue.source === 'ai'"
                      class="mr-1 px-1 py-0.5 rounded bg-orange-50 text-brand-orange text-[10px] font-semibold"
                    >AI</span>
                    {{ issue.message }}
                  </span>
                  <span
                    class="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    :class="severityBadgeClass(issue.severity)"
                  >
                    {{ issue.severity }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  {{ issue.recommendation }}
                </p>

                <!-- Location pins -->
                <div
                  v-if="issue.locations && issue.locations.length"
                  class="mt-2 space-y-1.5"
                >
                  <div
                    v-for="(loc, li) in issue.locations"
                    :key="li"
                    class="rounded-md border border-slate-200 bg-white overflow-hidden"
                  >
                    <div
                      class="flex items-center justify-between gap-2 px-2 py-1 bg-slate-100/70 border-b border-slate-200"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <MapPinIcon class="w-3.5 h-3.5 text-brand-orange shrink-0" />
                        <code
                          class="text-[11px] font-mono text-navy truncate"
                          :title="loc.selector"
                        >
                          {{ loc.selector || "(no selector)" }}
                        </code>
                        <span
                          v-if="loc.line > 0"
                          class="shrink-0 text-[10px] font-medium text-slate-400"
                        >
                          line {{ loc.line }}
                        </span>
                      </div>
                      <button
                        v-if="loc.selector"
                        type="button"
                        class="shrink-0 inline-flex items-center gap-1 text-[10px] text-navy hover:text-brand-orange font-medium"
                        title="Copy selector"
                        @click="copyText(loc.selector, 'Selector')"
                      >
                        <ClipboardDocumentIcon class="w-3 h-3" />
                      </button>
                    </div>
                    <div class="px-2 py-1.5 space-y-1">
                      <pre
                        v-if="loc.snippet"
                        class="text-[10.5px] font-mono text-slate-700 whitespace-pre-wrap break-all leading-snug m-0"
                      >{{ loc.snippet }}</pre>
                      <p
                        v-else-if="loc.text"
                        class="text-[11px] italic text-slate-600 leading-snug m-0"
                      >
                        “{{ loc.text }}”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-700 font-medium"
            >
              <CheckCircleIcon class="w-4 h-4 shrink-0 text-emerald-500" />
              <span>All technical SEO checks passed for this page.</span>
            </div>

            <!-- AI suggestions -->
            <div
              v-if="page.aiSuggestions?.suggestedTitle"
              class="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2.5"
            >
              <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-orange">
                <SparklesIcon class="w-3.5 h-3.5" />
                <span>AI Content & Meta Recommendations</span>
                <span
                  v-if="page.suggestionsLost"
                  class="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold normal-case tracking-normal"
                  title="The final AI part failed; these are synthesized from the page's current metadata."
                >fallback</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ page.aiSuggestions.contentFeedback }}
              </p>

              <div class="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div class="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Suggested Title ({{ page.aiSuggestions.suggestedTitle.length }} chars)</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-navy hover:text-brand-orange font-medium"
                    @click="copyText(page.aiSuggestions.suggestedTitle, 'Title')"
                  >
                    <ClipboardDocumentIcon class="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p class="text-xs font-semibold text-navy">
                  {{ page.aiSuggestions.suggestedTitle }}
                </p>
              </div>

              <div class="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div class="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Suggested Description ({{ page.aiSuggestions.suggestedDescription.length }} chars)</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-navy hover:text-brand-orange font-medium"
                    @click="copyText(page.aiSuggestions.suggestedDescription, 'Description')"
                  >
                    <ClipboardDocumentIcon class="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  {{ page.aiSuggestions.suggestedDescription }}
                </p>
              </div>
            </div>

            <!-- AI status note (only when the box is not shown) -->
            <p
              v-else-if="page.ai === 'failed' || page.ai === 'partial' || page.aiParts?.truncated || page.contentTruncated"
              class="text-[11px] text-amber-600 flex items-start gap-1.5"
            >
              <ExclamationTriangleIcon class="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                <template v-if="page.ai === 'failed'">
                  AI suggestions unavailable for this page (all models were busy). Run the audit again to retry.
                </template>
                <template v-else-if="page.ai === 'partial'">
                  Only {{ page.aiParts.ok }} of {{ page.aiParts.total }} page parts were analysed. AI suggestions reflect partial content.
                </template>
                <template v-else>
                  Content was truncated before AI review. Suggestions may not reflect the full page.
                </template>
              </span>
            </p>

            <!-- Card footer -->
            <div
              class="mt-auto pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between gap-2"
            >
              <span>
                {{
                  page.fetchError
                    ? "Not fetched"
                    : `HTTP ${page.status} · ${page.loadTimeMs}ms`
                }}
              </span>
              <span v-if="!page.fetchError && page.status < 400" class="text-right">
                {{ page.currentMeta?.wordCount }} words · {{ page.currentMeta?.h1s?.length ?? 0 }} H1
                <template v-if="page.aiParts && page.aiParts.total > 1">
                  · {{ page.aiParts.ok }}/{{ page.aiParts.total }} parts
                </template>
                <template v-if="page.contentTruncated || page.aiParts?.truncated">
                  · <span class="text-amber-600 font-medium">truncated</span>
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

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
  SparklesIcon,
  TrashIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

type Severity = "critical" | "warning" | "info";

type IssueLocation = {
  selector: string;
  line: number;
  snippet: string;
  text?: string;
};

type AuditIssue = {
  severity: Severity;
  category: "technical" | "content" | "metadata";
  message: string;
  recommendation: string;
  source?: "rule" | "ai";
  locations?: IssueLocation[];
};

type PageAuditReport = {
  url: string;
  finalUrl: string;
  status: number;
  score: number;
  loadTimeMs: number;
  fetchError: string | null;
  ai: "ok" | "cached" | "skipped" | "failed" | "partial";
  aiParts: { total: number; ok: number; truncated: boolean };
  contentTruncated: boolean;
  suggestionsLost: boolean;
  currentMeta: {
    title: string;
    description: string;
    h1s: string[];
    canonical: string | null;
    wordCount: number;
  };
  issues: AuditIssue[];
  aiSuggestions: {
    suggestedTitle: string;
    suggestedDescription: string;
    contentFeedback: string;
  };
};

type SeoAuditMeta = {
  aiEnabled: boolean;
  modelsUsed: Record<string, number>;
  tokens: { input: number; output: number; thoughts: number; cached: number };
  cachedPages: number;
  aiFailedPages: number;
  partialPages: number;
  skippedPages: number;
  truncatedPages: number;
  chunks: {
    total: number;
    cached: number;
    failed: number;
    missing: number;
    retriedOk: number;
    dropped: number;
  };
  suggestionsLost: number;
};

type AuditDetail = {
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
  report: {
    scannedAt: string;
    targetUrl: string;
    mode?: "site" | "page";
    overallScore: number;
    pagesFailed: number;
    counts: { critical: number; warning: number; info: number };
    executiveSummary: string;
    pages: PageAuditReport[];
    meta: SeoAuditMeta;
  };
};

type SeverityFilter = "all" | Severity | "ai-incomplete";

const { showToast } = useToast();
const route = useRoute();
const router = useRouter();

const auditId = computed(() => String(route.params.id ?? ""));
const audit = ref<AuditDetail | null>(null);
const loading = ref(false);

const severityFilter = ref<SeverityFilter>("all");
const pageSearch = ref("");

const deleteTarget = ref<AuditDetail | null>(null);
const deleting = ref(false);

const fetchAudit = async () => {
  loading.value = true;
  audit.value = null;
  try {
    const res = await $fetch<AuditDetail>(
      `/api/seo-audit/${auditId.value}`,
    );
    audit.value = res;
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || e?.message || "Failed to load audit",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

const copyText = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, "success");
  } catch {
    showToast("Failed to copy text", "error");
  }
};

const exportMarkdownReport = () => {
  if (!audit.value) return;
  const a = audit.value;
  const r = a.report;
  if (!r) return;

  const completeness = r.meta?.aiEnabled
    ? [
        `\n## AI Review Completeness`,
        `- Chunks: ${r.meta.chunks?.total ?? 0} total · ${r.meta.chunks?.cached ?? 0} cached · ${r.meta.chunks?.failed ?? 0} failed · ${r.meta.chunks?.missing ?? 0} missing · ${r.meta.chunks?.retriedOk ?? 0} retried OK · ${r.meta.chunks?.dropped ?? 0} dropped`,
        `- Pages: ${r.meta.partialPages ?? 0} partial · ${r.meta.aiFailedPages ?? 0} failed · ${r.meta.truncatedPages ?? 0} truncated`,
        `- Suggestions lost (last part failed): ${r.meta.suggestionsLost ?? 0}`,
      ].join("\n")
    : "";

  const lines = [
    `# SEO Audit Report: ${a.target_url}`,
    `Generated: ${new Date(a.created_at).toLocaleString()}`,
    `Mode: ${r.mode === "page" ? "Single page" : "Whole site"}`,
    `Overall Score: ${a.overall_score}/100${a.pages_failed ? ` (${a.pages_failed} pages could not be fetched)` : ""}`,
    `Critical: ${a.critical_count} | Warnings: ${a.warning_count} | Info: ${a.info_count}`,
    r.meta?.aiEnabled
      ? `AI tokens: ${r.meta.tokens.input} in / ${r.meta.tokens.output} out / ${r.meta.tokens.thoughts} thinking`
      : "",
    completeness,
    `\n## Executive Summary\n${a.executive_summary ?? r.executiveSummary}\n`,
    `## Page Breakdown`,
    ...r.pages.map((p) => {
      const flags = [
        p.contentTruncated ? "content truncated" : "",
        p.aiParts?.truncated ? "AI chunks truncated" : "",
        p.suggestionsLost ? "suggestions synthesized" : "",
        p.ai === "partial" ? "AI partial" : "",
        p.ai === "failed" ? "AI failed" : "",
      ]
        .filter(Boolean)
        .join(", ");
      const issueList = p.issues.length
        ? p.issues
            .map((i) => {
              const head = `- **[${i.severity.toUpperCase()}]**${i.source === "ai" ? " (AI)" : ""} ${i.message} — *${i.recommendation}*`;
              if (!i.locations?.length) return head;
              const locs = i.locations
                .map((loc) => {
                  const where = [
                    loc.selector ? `\`${loc.selector}\`` : "",
                    loc.line > 0 ? `line ${loc.line}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const body = loc.snippet
                    ? `\n    \`\`\`html\n    ${loc.snippet}\n    \`\`\``
                    : loc.text
                      ? `\n    > ${loc.text}`
                      : "";
                  return `\n  - 📍 ${where || "location"}${body}`;
                })
                .join("");
              return head + locs;
            })
            .join("\n")
        : "- No issues found";

      const suggestionsHeader = p.suggestionsLost
        ? `\n- **AI Suggested Title (fallback — final part failed):** ${p.aiSuggestions.suggestedTitle}`
        : p.aiSuggestions?.suggestedTitle
          ? `\n- **AI Suggested Title:** ${p.aiSuggestions.suggestedTitle}`
          : "";
      const suggestionsDesc = p.aiSuggestions?.suggestedDescription
        ? `\n- **AI Suggested Description:** ${p.aiSuggestions.suggestedDescription}`
        : "";

      return [
        `### ${p.url} (${p.fetchError ? "Not fetched" : `Score: ${p.score}/100`})${flags ? ` — _${flags}_` : ""}`,
        issueList,
        suggestionsHeader,
        suggestionsDesc,
      ].join("\n");
    }),
  ].join("\n");

  const blob = new Blob([lines], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seo-audit-${safeHostname(a.target_url)}.md`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Markdown report exported", "success");
};

const doDelete = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/seo-audit/${deleteTarget.value.id}`,
      { method: "DELETE" },
    );
    if (!res.success) throw new Error(res.error || "Delete failed");
    showToast("Audit deleted", "success");
    deleteTarget.value = null;
    await router.push("/admin/seo/history");
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || e?.message || "Delete failed",
      "error",
    );
  } finally {
    deleting.value = false;
  }
};

const filteredPages = computed<PageAuditReport[]>(() => {
  const pages = audit.value?.report?.pages ?? [];
  const q = pageSearch.value.trim().toLowerCase();

  if (severityFilter.value === "ai-incomplete") {
    return pages.filter(
      (p) =>
        p.ai === "partial" ||
        p.ai === "failed" ||
        p.contentTruncated ||
        p.aiParts?.truncated ||
        p.suggestionsLost,
    );
  }

  return pages
    .map((page) => {
      const matchingIssues =
        severityFilter.value === "all"
          ? page.issues
          : page.issues.filter((i) => i.severity === severityFilter.value);
      return { ...page, issues: matchingIssues };
    })
    .filter((page) => {
      const matchesSeverity =
        severityFilter.value === "all" || page.issues.length > 0;
      const matchesQuery =
        !q ||
        page.url.toLowerCase().includes(q) ||
        (page.currentMeta?.title ?? "").toLowerCase().includes(q);
      return matchesSeverity && matchesQuery;
    });
});

const modelsUsedLabel = computed(
  () =>
    Object.entries(audit.value?.report?.meta?.modelsUsed ?? {})
      .map(([model, calls]) => `${model} ×${calls}`)
      .join(", ") || "none",
);

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

const safeHostname = (url: string) => {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  } catch {
    return "site";
  }
};

const severityBadgeClass = (severity: Severity) => {
  switch (severity) {
    case "critical":
      return "bg-rose-500 text-white";
    case "warning":
      return "bg-amber-400 text-white";
    case "info":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-400 text-white";
  }
};

const scoreBadgeClass = (score: number) => {
  if (score >= 85) return "bg-emerald-500 text-white";
  if (score >= 60) return "bg-amber-400 text-white";
  return "bg-rose-500 text-white";
};

// --- Lifecycle ---
onMounted(fetchAudit);

// Re-fetch if the id changes (e.g. navigating between history items)
watch(auditId, (next, prev) => {
  if (next && next !== prev) fetchAudit();
});
</script>