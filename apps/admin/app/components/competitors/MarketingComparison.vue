<template>
  <div class="space-y-5">
    <!-- Website Comparison -->
    <div v-if="comparisonData.websiteComparison">
      <strong
        class="text-navy block mb-2 text-sm uppercase tracking-wide"
        >Website Comparison</strong
      >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="[label, key] in websiteSections"
          :key="key"
          class="border border-slate-200 rounded-lg p-4 bg-slate-50"
        >
          <div
            class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1"
          >
            {{ label }}
          </div>
          <p class="text-sm text-slate-600">
            {{ comparisonData.websiteComparison[key] }}
          </p>
        </div>
      </div>
      <div
        v-if="
          comparisonData.websiteComparison.whereTheyBeatUs?.length
        "
        class="mt-4"
      >
        <strong
          class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
          >Where the competitor is stronger</strong
        >
        <ul
          class="list-disc list-inside text-sm text-slate-600 space-y-1"
        >
          <li
            v-for="(x, i) in comparisonData.websiteComparison
              .whereTheyBeatUs"
            :key="i"
          >
            {{ x }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Weaknesses to Exploit -->
    <div>
      <strong
        class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
        >Marketing Opportunities</strong
      >
      <ul
        class="list-disc list-inside text-sm text-slate-600 space-y-1"
      >
        <li
          v-for="(
            w, i
          ) in comparisonData.marketingWeaknessesToExploit"
          :key="i"
        >
          {{ w }}
        </li>
      </ul>
    </div>

  </div>
</template>
<script setup lang="ts">
import type { Comparison } from '~/types/competitor-ui';
const props = defineProps<{ comparisonData: Comparison }>();
const websiteSections = [ ['Messaging & Claims','messagingAndClaims'], ['Trust & Credibility','trustSignals'], ['Call-to-Action Messaging','conversionFlow'], ['Content Quality','seoAndContent'] ] as const;
</script>
