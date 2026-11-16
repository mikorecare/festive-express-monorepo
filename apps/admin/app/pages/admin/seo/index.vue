<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">AI SEO Site Auditor</h1>
        <p class="text-slate-500 text-sm">
          Crawl sitemaps, flag missing SEO tags by severity, and generate Gemini AI improvements
        </p>
      </div>

      <button
        v-if="report"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        @click="exportMarkdownReport"
      >
        <ArrowDownTrayIcon class="h-4 w-4" />
        Export Report
      </button>
    </div>

    <!-- Audit Controls Card -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
      <!-- Mode + Saved Site row -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <!-- Scan mode segmented control -->
        <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden shrink-0">
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="scanMode === 'site'
              ? 'bg-brand-orange text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'"
            @click="scanMode = 'site'"
          >
            Whole site
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold transition-colors border-l border-slate-200"
            :class="scanMode === 'page'
              ? 'bg-brand-orange text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'"
            @click="scanMode = 'page'"
          >
            Single page
          </button>
        </div>

        <!-- Saved Sites Dropdown -->
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <GlobeAltIcon class="w-4 h-4 text-slate-400 shrink-0" />
          <label
            for="saved-site"
            class="text-xs font-medium text-slate-400 shrink-0"
          >
            Saved site:
          </label>
          <select
            id="saved-site"
            v-model="selectedSite"
            class="field flex-1 min-w-0"
            :class="selectedSite ? 'border-brand-orange ring-1 ring-brand-orange' : ''"
          >
            <option value="" disabled>
              {{ targetUrl.trim() ? "Custom URL (typed below)" : "Select a saved site…" }}
            </option>
            <option v-for="site in managedSites" :key="site" :value="site">
              {{ site.replace(/^https?:\/\//, "") }}
            </option>
          </select>
        </div>
      </div>

      <!-- URL Form -->
      <form
        class="grid grid-cols-1 sm:grid-cols-12 gap-3"
        @submit.prevent="runAudit"
      >
        <div :class="scanMode === 'site' ? 'sm:col-span-7' : 'sm:col-span-9'">
          <input
            v-model="targetUrl"
            type="text"
            class="field w-full"
            :placeholder="scanMode === 'page'
              ? 'Enter the exact page URL (e.g., https://example.com/about)…'
              : 'Enter website URL (e.g., https://example.com)…'"
            required
          />
        </div>

        <div v-if="scanMode === 'site'" class="sm:col-span-2">
          <select v-model.number="maxPages" class="field w-full">
            <option :value="10">Max 10 pages</option>
            <option :value="20">Max 20 pages</option>
            <option :value="35">Max 35 pages</option>
            <option :value="50">Max 50 pages</option>
          </select>
        </div>

        <div :class="scanMode === 'site' ? 'sm:col-span-3' : 'sm:col-span-3'">
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            <SparklesIcon class="h-4 w-4 shrink-0" />
            <span>
              {{ loading
                ? (scanMode === 'page' ? "Analyzing Page…" : "Analyzing Site…")
                : (scanMode === 'page' ? "Scan This Page" : "Run AI Audit") }}
            </span>
          </button>
        </div>
      </form>

      <!-- AI Options -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <label
          class="inline-flex items-center gap-2 text-xs font-medium text-slate-600 shrink-0"
        >
          <input
            v-model="useAi"
            type="checkbox"
            class="rounded border-slate-300"
          />
          Generate AI suggestions
        </label>
        <input
          v-model="siteContext"
          type="text"
          maxlength="500"
          :disabled="!useAi"
          class="field flex-1 disabled:opacity-60"
          placeholder="Optional: one line about the business (improves suggestions)…"
        />
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2 animate-pulse"
        >
          <div class="h-3 bg-slate-200 rounded w-1/2" />
          <div class="h-7 bg-slate-200 rounded w-1/3" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="i in (scanMode === 'page' ? 1 : 4)"
          :key="i"
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-3 animate-pulse"
        >
          <div class="h-4 bg-slate-200 rounded w-3/4" />
          <div class="h-3 bg-slate-200 rounded w-1/3" />
          <div class="h-16 bg-slate-100 rounded-lg" />
          <div class="h-20 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!report"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <DocumentMagnifyingGlassIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">
        {{ scanMode === 'page' ? 'Scan a single page' : 'No audit report yet' }}
      </h3>
      <p class="text-sm text-slate-500 max-w-md mx-auto">
        <template v-if="scanMode === 'page'">
          Paste an exact URL above to audit just that page — no sitemap crawl, no other pages. Faster and cheaper than a full site scan.
        </template>
        <template v-else>
          Enter a domain above to extract its sitemap pages, detect missing metadata or technical issues, and generate AI-powered SEO fixes.
        </template>
      </p>
    </div>

    <!-- Report Content -->
    <template v-else>
      <!-- Executive Summary Banner -->
      <div
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-brand-orange space-y-1.5"
      >
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-orange">
          <SparklesIcon class="w-4 h-4" />
          <span>{{ report.meta.aiEnabled ? "Gemini AI Executive Summary" : "Executive Summary" }}</span>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed">
          {{ report.executiveSummary }}
        </p>
      </div>

      <!-- AI Usage Line -->
      <div
        v-if="report.meta.aiEnabled"
        class="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 px-1"
      >
        <span>Models: {{ modelsUsedLabel }}</span>
        <span>
          Tokens: {{ report.meta.tokens.input }} in ·
          {{ report.meta.tokens.output }} out ·
          {{ report.meta.tokens.thoughts }} thinking
        </span>
        <span>
          {{ report.meta.cachedPages }} cached · {{ report.meta.skippedPages }} skipped
          <template v-if="report.meta.partialPages">
            · {{ report.meta.partialPages }} partial
          </template>
          <template v-if="report.meta.aiFailedPages">
            · {{ report.meta.aiFailedPages }} AI failed
          </template>
          <template v-if="report.meta.truncatedPages">
            · {{ report.meta.truncatedPages }} truncated
          </template>
        </span>
      </div>

      <!-- AI Completeness Warning -->
      <div
        v-if="report.meta.aiEnabled && (
          report.meta.chunks.failed > 0 ||
          report.meta.chunks.missing > 0 ||
          report.meta.chunks.dropped > 0 ||
          report.meta.suggestionsLost > 0
        )"
        class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1"
      >
        <span class="inline-flex items-center gap-1 font-semibold">
          <ExclamationTriangleIcon class="w-3.5 h-3.5" />
          AI review was incomplete:
        </span>
        <span v-if="report.meta.chunks.failed">
          {{ report.meta.chunks.failed }} part(s) could not be analysed
        </span>
        <span v-if="report.meta.chunks.missing">
          {{ report.meta.chunks.missing }} part(s) omitted by the model
        </span>
        <span v-if="report.meta.chunks.retriedOk">
          {{ report.meta.chunks.retriedOk }} part(s) recovered on retry
        </span>
        <span v-if="report.meta.chunks.dropped">
          {{ report.meta.chunks.dropped }} AI finding(s) dropped by validation
        </span>
        <span v-if="report.meta.suggestionsLost">
          {{ report.meta.suggestionsLost }} page(s) had no final AI suggestion
        </span>
      </div>

      <!-- Severity Metric Filter Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          class="bg-white rounded-xl border shadow-sm p-4 text-left transition-all"
          :class="
            severityFilter === 'all'
              ? 'border-navy ring-1 ring-navy'
              : 'border-slate-100 hover:border-slate-200'
          "
          @click="severityFilter = 'all'"
        >
          <div class="text-xs font-medium text-slate-500">Overall Health Score</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-bold text-navy">{{ report.overallScore }}/100</span>
            <span class="text-[11px] font-medium text-slate-400">
              {{ report.pages.length }} page{{ report.pages.length === 1 ? '' : 's' }}
              <template v-if="report.pagesFailed">
                ({{ report.pagesFailed }} failed)
              </template>
            </span>
          </div>
        </button>

        <button
          type="button"
          class="bg-white rounded-xl border shadow-sm p-4 text-left transition-all"
          :class="
            severityFilter === 'critical'
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-slate-100 hover:border-slate-200'
          "
          @click="severityFilter = 'critical'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Critical Issues</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-rose-500 text-white">
              Critical
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">
            {{ report.counts.critical }}
          </div>
        </button>

        <button
          type="button"
          class="bg-white rounded-xl border shadow-sm p-4 text-left transition-all"
          :class="
            severityFilter === 'warning'
              ? 'border-amber-400 ring-1 ring-amber-400'
              : 'border-slate-100 hover:border-slate-200'
          "
          @click="severityFilter = 'warning'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Warnings</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-400 text-white">
              Warning
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">
            {{ report.counts.warning }}
          </div>
        </button>

        <button
          type="button"
          class="bg-white rounded-xl border shadow-sm p-4 text-left transition-all"
          :class="
            severityFilter === 'info'
              ? 'border-emerald-500 ring-1 ring-emerald-500'
              : 'border-slate-100 hover:border-slate-200'
          "
          @click="severityFilter = 'info'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Optimizations</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-200 text-slate-700">
              Info
            </span>
          </div>
          <div class="mt-1 text-2xl font-bold text-navy">
            {{ report.counts.info }}
          </div>
        </button>
      </div>

      <!-- Filter Bar & Search -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            v-model="pageSearch"
            type="text"
            class="field sm:col-span-2"
            placeholder="Filter audited pages by URL or title…"
          />
          <select v-model="severityFilter" class="field">
            <option value="all">All severities ({{ report.pages.length }} pages)</option>
            <option value="critical">Critical issues only</option>
            <option value="warning">Warnings only</option>
            <option value="info">Info / optimizations only</option>
            <option value="ai-incomplete">AI incomplete / truncated pages</option>
          </select>
        </div>
      </div>

      <!-- Audited Pages Grid -->
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
          class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
        >
          <!-- Card Header -->
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
                    : page.currentMeta.title || "No <title> tag detected")
                }}
              </p>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                :class="scoreBadgeClass(page.score)"
              >
                {{ page.fetchError ? "Failed" : `${page.score}/100` }}
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-navy bg-slate-100 hover:bg-brand-orange hover:text-white transition-colors"
                title="Re-scan just this page"
                @click="rescanPage(page.url)"
              >
                <ArrowPathIcon class="w-3 h-3" />
                <span>Re-scan</span>
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 flex-1 flex flex-col space-y-4">
            <!-- Flagged Issues List -->
            <div v-if="page.issues.length" class="space-y-2">
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

                <!-- Exact location pins -->
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
                      <p
                        v-else
                        class="text-[10.5px] italic text-slate-400 m-0"
                      >
                        No snippet available for this location.
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

            <!-- AI Improvements Box -->
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

              <!-- Suggested Title -->
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

              <!-- Suggested Meta Description -->
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

            <!-- AI status note (only when there is no suggestion box) -->
            <p
              v-else-if="page.ai === 'failed' || page.ai === 'partial' || page.aiParts.truncated || page.contentTruncated"
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

            <!-- Card Footer Meta -->
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
                {{ page.currentMeta.wordCount }} words · {{ page.currentMeta.h1s.length }} H1
                <template v-if="page.aiParts.total > 1">
                  · {{ page.aiParts.ok }}/{{ page.aiParts.total }} parts
                </template>
                <template v-if="page.contentTruncated || page.aiParts.truncated">
                  · <span class="text-amber-600 font-medium">truncated</span>
                </template>
              </span>
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
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
  MapPinIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

type Severity = "critical" | "warning" | "info";
type ScanMode = "site" | "page";

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

type SeoAuditResponse = {
  scannedAt: string;
  targetUrl: string;
  mode?: ScanMode;
  overallScore: number;
  pagesFailed: number;
  counts: { critical: number; warning: number; info: number };
  executiveSummary: string;
  pages: PageAuditReport[];
  meta: SeoAuditMeta;
};

type SeverityFilter = "all" | Severity | "ai-incomplete";

const { showToast } = useToast();

const targetUrl = ref("");
const maxPages = ref(20);
const useAi = ref(true);
const siteContext = ref("");
const loading = ref(false);
const report = ref<SeoAuditResponse | null>(null);

const scanMode = ref<ScanMode>("site");
const severityFilter = ref<SeverityFilter>("all");
const pageSearch = ref("");

// Add your websites here for 1-click scanning
const managedSites = [
  "https://festivelightingpros.com",
  "https://festive.express",
];

// --- Actions ---
const runAudit = async () => {
  if (!targetUrl.value.trim()) return;
  loading.value = true;
  report.value = null;
  severityFilter.value = "all";
  pageSearch.value = "";

  try {
    const res = await $fetch<SeoAuditResponse>("/api/seo-audit", {
      method: "POST",
      body: {
        url: targetUrl.value.trim(),
        mode: scanMode.value,
        maxPages: maxPages.value,
        useAi: useAi.value,
        siteContext: siteContext.value.trim() || undefined,
      },
    });
    report.value = res;
    const noun = res.pages.length === 1 ? "page" : "pages";
    const warn =
      res.meta.chunks.failed > 0 ||
      res.meta.chunks.missing > 0 ||
      res.meta.suggestionsLost > 0;
    showToast(
      `Audited ${res.pages.length} ${noun}${warn ? " (some AI parts incomplete)" : ""}`,
      warn ? "error" : "success",
    );
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || e?.message || "Failed to run SEO audit",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

/**
 * Re-scan a single URL from a page card.
 * Switches into single-page mode, prefills the URL, and runs the audit.
 */
const rescanPage = async (url: string) => {
  scanMode.value = "page";
  targetUrl.value = url;
  await runAudit();
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
  if (!report.value) return;
  const r = report.value;

  const completeness = r.meta.aiEnabled
    ? [
        `\n## AI Review Completeness`,
        `- Chunks: ${r.meta.chunks.total} total · ${r.meta.chunks.cached} cached · ${r.meta.chunks.failed} failed · ${r.meta.chunks.missing} missing · ${r.meta.chunks.retriedOk} retried OK · ${r.meta.chunks.dropped} dropped`,
        `- Pages: ${r.meta.partialPages} partial · ${r.meta.aiFailedPages} failed · ${r.meta.truncatedPages} truncated`,
        `- Suggestions lost (last part failed): ${r.meta.suggestionsLost}`,
      ].join("\n")
    : "";

  const lines = [
    `# SEO Audit Report: ${r.targetUrl}`,
    `Generated: ${new Date(r.scannedAt).toLocaleString()}`,
    `Mode: ${r.mode === "page" ? "Single page" : "Whole site"}`,
    `Overall Score: ${r.overallScore}/100${r.pagesFailed ? ` (${r.pagesFailed} pages could not be fetched)` : ""}`,
    `Critical: ${r.counts.critical} | Warnings: ${r.counts.warning} | Info: ${r.counts.info}`,
    r.meta.aiEnabled
      ? `AI tokens: ${r.meta.tokens.input} in / ${r.meta.tokens.output} out / ${r.meta.tokens.thoughts} thinking`
      : "",
    completeness,
    `\n## Executive Summary\n${r.executiveSummary}\n`,
    `## Page Breakdown`,
    ...r.pages.map((p) => {
      const flags = [
        p.contentTruncated ? "content truncated" : "",
        p.aiParts.truncated ? "AI chunks truncated" : "",
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
                  ].filter(Boolean).join(" ");
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
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-audit-${new URL(r.targetUrl.startsWith("http") ? r.targetUrl : `https://${r.targetUrl}`).hostname}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Markdown report exported", "success");
};

// --- Computed ---
const selectedSite = computed({
  get: () => {
    const current = targetUrl.value.trim();
    return managedSites.includes(current) ? current : "";
  },
  set: (site: string) => {
    if (site) targetUrl.value = site;
  },
});

const modelsUsedLabel = computed(
  () =>
    Object.entries(report.value?.meta.modelsUsed ?? {})
      .map(([model, calls]) => `${model} ×${calls}`)
      .join(", ") || "none",
);

const filteredPages = computed(() => {
  if (!report.value) return [];
  const q = pageSearch.value.trim().toLowerCase();

  // Dedicated completeness filter
  if (severityFilter.value === "ai-incomplete") {
    return report.value.pages.filter(
      (p) =>
        p.ai === "partial" ||
        p.ai === "failed" ||
        p.contentTruncated ||
        p.aiParts.truncated ||
        p.suggestionsLost,
    );
  }

  return report.value.pages
    .map((page) => {
      const matchingIssues =
        severityFilter.value === "all"
          ? page.issues
          : page.issues.filter((i) => i.severity === severityFilter.value);

      return {
        ...page,
        issues: matchingIssues,
      };
    })
    .filter((page) => {
      const matchesSeverity =
        severityFilter.value === "all" || page.issues.length > 0;
      const matchesQuery =
        !q ||
        page.url.toLowerCase().includes(q) ||
        page.currentMeta.title.toLowerCase().includes(q);
      return matchesSeverity && matchesQuery;
    });
});

// --- Helpers ---
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
</script>