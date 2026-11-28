<template>
  <div class="space-y-5">
    <!-- Basic Info -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4"
    >
      <h2 class="text-sm font-bold text-navy uppercase tracking-wide">
        Business Info
      </h2>
      <div class="space-y-3">
        <div>
          <div class="text-[11px] text-slate-400 font-semibold uppercase">
            Rating
          </div>
          <div class="text-sm font-medium text-navy">
            {{
              competitor.rating != null ? `${competitor.rating} ★` : "—"
            }}
            <span class="text-slate-400 font-normal"
              >({{ competitor.review_count ?? "unknown" }} reviews)</span
            >
          </div>
        </div>
        <div>
          <div class="text-[11px] text-slate-400 font-semibold uppercase">
            Phone
          </div>
          <div class="text-sm font-medium text-navy">
            {{ competitor.phone || "—" }}
          </div>
        </div>
        <div>
          <div class="text-[11px] text-slate-400 font-semibold uppercase">
            Price Level
          </div>
          <div class="text-sm font-medium text-navy">
            {{ formatPriceLevel(competitor.price_level) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Intelligence (Gemini) -->
    <div
      v-if="competitor.intelligence"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-5"
    >
      <div class="flex items-center justify-between gap-2">
        <h2
          class="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-2"
        >
          <SparklesIcon class="w-4 h-4 text-brand-orange" /> Website
          Intelligence
        </h2>
        <span
          v-if="competitor.intelligence.tone"
          class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
        >
          {{ competitor.intelligence.tone }}
        </span>
      </div>

      <div
        v-if="!competitor.intelligence.packages"
        class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5"
      >
        This analysis predates packages, trust signals and CTAs. Click
        Re-Analyze to update it.
      </div>

      <div v-if="competitor.intelligence.claimedAdvantages?.length">
        <div
          class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5"
        >
          Selling Points
        </div>
        <ul
          class="text-sm text-slate-600 space-y-1 list-disc list-inside"
        >
          <li
            v-for="(a, i) in competitor.intelligence.claimedAdvantages"
            :key="i"
          >
            {{ a }}
          </li>
        </ul>
      </div>

      <div v-if="competitor.intelligence.packages?.length">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Packages & Prices
        </div>
        <div class="space-y-2">
          <div
            v-for="(p, i) in competitor.intelligence.packages"
            :key="i"
            class="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-sm font-semibold text-navy">{{
                p.name
              }}</span>
              <span
                class="text-xs font-semibold shrink-0"
                :class="p.price ? 'text-emerald-600' : 'text-slate-400'"
                >{{ p.price || "No price shown" }}</span
              >
            </div>
            <ul
              v-if="p.includes?.length"
              class="mt-1 text-xs text-slate-500 list-disc list-inside space-y-0.5"
            >
              <li v-for="(inc, j) in p.includes" :key="j">{{ inc }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="competitor.intelligence.serviceHighlights?.length">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Services
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(s, i) in competitor.intelligence.serviceHighlights"
            :key="i"
            class="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-700"
            >{{ s }}</span
          >
        </div>
      </div>

      <div class="bg-slate-50 rounded-lg p-3 border border-slate-100">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Pricing & Payment Options
        </div>
        <div class="text-sm text-slate-600 space-y-1">
          <div class="flex justify-between">
            <span>Public Pricing:</span>
            <span
              :class="
                competitor.intelligence.pricingSignals?.hasPricing
                  ? 'text-emerald-600 font-semibold'
                  : 'text-rose-600 font-semibold'
              "
            >
              {{
                competitor.intelligence.pricingSignals?.hasPricing
                  ? "Yes"
                  : competitor.intelligence.pricingSignals ? "Not found" : "Unknown"
              }}
            </span>
          </div>
          <div
            v-if="competitor.intelligence.pricingSignals?.model"
            class="flex justify-between gap-3"
          >
            <span>Model:</span>
            <span class="font-medium text-right">{{
              competitor.intelligence.pricingSignals.model
            }}</span>
          </div>
          <div
            v-if="competitor.intelligence.pricingSignals?.priceRangeHint"
            class="flex justify-between gap-3"
          >
            <span>Hint:</span>
            <span class="font-medium text-right">{{
              competitor.intelligence.pricingSignals.priceRangeHint
            }}</span>
          </div>
          <div
            v-if="
              competitor.intelligence.pricingSignals?.financingMentioned
            "
            class="text-emerald-600 font-medium mt-1"
          >
            Financing mentioned
          </div>
        </div>
      </div>

      <div v-if="competitor.intelligence.promotions?.length">
        <div
          class="text-[11px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5"
        >
          Promotions & Discounts
        </div>
        <ul
          class="text-sm text-slate-600 space-y-1 list-disc list-inside"
        >
          <li
            v-for="(p, i) in competitor.intelligence.promotions"
            :key="i"
          >
            {{ p }}
          </li>
        </ul>
      </div>

      <div v-if="competitor.intelligence.trustSignals?.length">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Trust Signals
        </div>
        <ul
          class="text-sm text-slate-600 space-y-1 list-disc list-inside"
        >
          <li
            v-for="(t, i) in competitor.intelligence.trustSignals"
            :key="i"
          >
            {{ t }}
          </li>
        </ul>
      </div>

      <div v-if="competitor.intelligence.callsToAction?.length">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Calls to Action
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(c, i) in competitor.intelligence.callsToAction"
            :key="i"
            class="px-2 py-1 rounded bg-blue-50 text-[11px] font-medium text-blue-700"
            >{{ c }}</span
          >
        </div>
      </div>

      <div v-if="competitor.intelligence.serviceAreas?.length">
        <div
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
        >
          Service Areas
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(a, i) in competitor.intelligence.serviceAreas"
            :key="i"
            class="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-700"
            >{{ a }}</span
          >
        </div>
      </div>

      <div v-if="competitor.intelligence.detectableWeaknesses?.length">
        <div
          class="text-[11px] font-semibold text-rose-600 uppercase tracking-wide mb-1.5"
        >
          Competitive Opportunities
        </div>
        <ul
          class="text-sm text-slate-600 space-y-1 list-disc list-inside"
        >
          <li
            v-for="(w, i) in competitor.intelligence.detectableWeaknesses"
            :key="i"
          >
            {{ w }}
          </li>
        </ul>
      </div>

      <div
        v-if="competitor.intelligence.summary"
        class="pt-3 border-t border-slate-100"
      >
        <p class="text-xs text-slate-500 italic">
          "{{ competitor.intelligence.summary }}"
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/outline';
import type { CompetitorRow } from '~/types/competitor-ui';
import { formatPriceLevel } from '~/utils/competitor-ui';
defineProps<{ competitor: CompetitorRow }>();
</script>
