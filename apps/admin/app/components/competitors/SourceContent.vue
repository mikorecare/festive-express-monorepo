<template>
  <div class="space-y-5">
    <!-- Scraped Content -->
    <div
      v-if="competitor.seo_raw"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-6"
    >
      <h2
        class="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-2"
      >
        <DocumentTextIcon class="w-4 h-4 text-slate-400" /> Source
        Content
      </h2>

      <div
        class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 mb-2"
      >
        <div v-if="competitor.seo_raw.pagesScraped">
          <strong>Pages scraped:</strong>
          {{ competitor.seo_raw.pagesScraped }}
        </div>
        <div>
          <strong>Total text blocks found:</strong>
          {{ competitor.seo_raw.blocks?.length || 0 }}
        </div>
        <span class="text-xs text-slate-400 block mt-1"
          >Captured text; not all blocks may have been reviewed by AI.</span
        >
      </div>

      <!-- Content Blocks (Pure Text) -->
      <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <p
          v-for="(block, i) in competitor.seo_raw.blocks"
          :key="i"
          class="leading-relaxed"
          :class="
            block.text?.startsWith('PAGE: ')
              ? 'text-xs font-bold uppercase tracking-wide text-brand-orange pt-3 border-t border-slate-100'
              : block.text?.startsWith('PRICE: ')
                ? 'text-sm font-semibold text-emerald-700'
                : block.text?.startsWith('PROMO: ')
                  ? 'text-sm font-semibold text-amber-600'
                  : 'text-sm text-slate-700'
          "
        >
          {{ block.text }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <DocumentTextIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">
        No content data yet
      </h3>
      <p class="text-sm text-slate-500">
        Click "Re-Analyze" to scrape the website.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DocumentTextIcon } from '@heroicons/vue/24/outline';
import type { CompetitorRow } from '~/types/competitor-ui';
defineProps<{ competitor: CompetitorRow }>();
</script>
