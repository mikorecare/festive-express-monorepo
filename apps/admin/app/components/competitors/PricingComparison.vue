<template>
  <div class="space-y-5">
    <!-- Pricing Comparison -->
    <div v-if="comparisonData.pricingComparison?.length">
      <strong
        class="text-navy block mb-2 text-sm uppercase tracking-wide"
        >Pricing Comparison</strong
      >
      <div
        class="overflow-x-auto border border-slate-200 rounded-lg"
      >
        <table class="min-w-full text-sm">
          <thead
            class="bg-slate-50 text-[11px] uppercase text-slate-500"
          >
            <tr>
              <th class="text-left px-3 py-2">Item</th>
              <th class="text-left px-3 py-2">Ours</th>
              <th class="text-left px-3 py-2">Theirs</th>
              <th class="text-left px-3 py-2">Verdict</th>
              <th class="text-left px-3 py-2">Insight</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(row, i) in comparisonData.pricingComparison"
              :key="i"
              class="align-top"
            >
              <td class="px-3 py-2 font-medium text-navy">
                {{ row.item }}
              </td>
              <td class="px-3 py-2 text-slate-600">
                {{ row.ours }}
              </td>
              <td class="px-3 py-2 text-slate-600">
                {{ row.theirs }}
              </td>
              <td class="px-3 py-2">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase whitespace-nowrap"
                  :class="verdictClass(row.verdict)"
                >
                  {{ verdictLabel(row.verdict) }}
                </span>
              </td>
              <td class="px-3 py-2 text-slate-600 text-xs">
                {{ row.insight }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Package Gaps -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        class="border border-slate-200 rounded-lg p-4 bg-slate-50"
      >
        <strong
          class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
          >They Offer, We Lack</strong
        >
        <ul
          v-if="comparisonData.packageGaps?.theyOfferWeLack?.length"
          class="list-disc list-inside text-sm text-slate-600 space-y-1"
        >
          <li
            v-for="(x, i) in comparisonData.packageGaps
              .theyOfferWeLack"
            :key="i"
          >
            {{ x }}
          </li>
        </ul>
        <p v-else class="text-sm text-slate-400">None found</p>
      </div>
      <div
        class="border border-slate-200 rounded-lg p-4 bg-slate-50"
      >
        <strong
          class="text-emerald-600 block mb-2 text-sm uppercase tracking-wide"
          >We Offer, They Lack</strong
        >
        <ul
          v-if="comparisonData.packageGaps?.weOfferTheyLack?.length"
          class="list-disc list-inside text-sm text-slate-600 space-y-1"
        >
          <li
            v-for="(x, i) in comparisonData.packageGaps
              .weOfferTheyLack"
            :key="i"
          >
            {{ x }}
          </li>
        </ul>
        <p v-else class="text-sm text-slate-400">None found</p>
      </div>
    </div>

    <div
      v-if="
        comparisonData.packageGaps?.packageRecommendations?.length
      "
    >
      <strong
        class="text-navy block mb-2 text-sm uppercase tracking-wide"
        >Package Recommendations</strong
      >
      <ul
        class="list-disc list-inside text-sm text-slate-600 space-y-1"
      >
        <li
          v-for="(x, i) in comparisonData.packageGaps
            .packageRecommendations"
          :key="i"
        >
          {{ x }}
        </li>
      </ul>
    </div>

  </div>
</template>
<script setup lang="ts">
import type { Comparison } from '~/types/competitor-ui';
const props = defineProps<{ comparisonData: Comparison }>();
import { verdictClass, verdictLabel } from '~/utils/competitor-ui';
</script>
