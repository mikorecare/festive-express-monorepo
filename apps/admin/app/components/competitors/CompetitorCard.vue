<template>
  <article
    class="bg-white border rounded-xl p-4 space-y-3 transition-all duration-300"
    :class="[
      competitor.is_internal ? 'border-brand-orange/40' : 'border-slate-200',
      {
        'ring-2 ring-brand-orange/60': busy,
        'ring-2 ring-emerald-400': recentlyAnalyzed && !busy,
      },
    ]"
  >
    <!-- Competitor header -->
    <div class="flex flex-wrap items-center gap-3">
      <input
        type="checkbox"
        :checked="selected"
        :disabled="disabled"
        :aria-label="`Select ${competitor.name}`"
        class="accent-navy"
        @change="$emit('select')"
      />

      <div class="flex-1 min-w-40">
        <NuxtLink
          :to="`/admin/competitors/${competitor.id}`"
          class="font-bold text-navy hover:text-brand-orange"
        >
          {{ competitor.name }}
        </NuxtLink>

        <p class="text-xs text-slate-500">
          {{ competitor.address || "No address on file" }}
        </p>
      </div>

      <!-- Status badge -->
      <span
        class="rounded-full px-2 py-1 text-xs"
        :class="statusBadgeClass(competitor.status)"
      >
        {{ competitor.status }}
      </span>

      <!-- Recently analyzed badge -->
      <span
        v-if="recentlyAnalyzed && !busy"
        class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700"
      >
        <CheckCircleIcon class="w-3.5 h-3.5" />
        Just analyzed
      </span>

      <!-- Details link -->
      <NuxtLink
        :to="`/admin/competitors/${competitor.id}`"
        class="text-sm font-medium text-brand-orange"
      >
        {{ competitor.is_internal ? "View details" : "View & Compare" }}
      </NuxtLink>

      <!-- Analyze button -->
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        :class="
          busy
            ? 'border-brand-orange text-brand-orange bg-orange-50'
            : 'border-slate-200 text-navy hover:bg-slate-50'
        "
        :disabled="disabled || busy"
        @click.stop="$emit('analyze')"
      >
        <ArrowPathIcon v-if="busy" class="w-4 h-4 animate-spin" />

        {{
          busy
            ? "Analyzing…"
            : competitor.status === "analyzed"
              ? "Reanalyze"
              : "Analyze"
        }}
      </button>
    </div>

    <!-- Individual loading indicator -->
    <div
      v-if="busy"
      role="status"
      class="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-100 p-3"
    >
      <ArrowPathIcon class="w-4 h-4 text-brand-orange animate-spin shrink-0" />

      <p class="text-xs font-medium text-brand-orange">
        Processing website. Please wait…
      </p>
    </div>

    <!-- Competitor metadata -->
    <div class="flex flex-wrap gap-3 text-xs text-slate-600">
      <span>
        {{ competitor.rating ?? "—" }} ★ ({{
          competitor.review_count ?? "unknown"
        }}
        reviews)
      </span>

      <span>
        {{
          competitor.intelligence?.pricingSignals?.hasPricing
            ? "Public pricing found"
            : competitor.intelligence
              ? "Public pricing not found"
              : "Pricing unknown"
        }}
      </span>

      <span v-if="competitor.intelligence?.pricingSignals?.financingMentioned">
        Financing mentioned
      </span>

      <span v-if="competitor.intelligence?.packages?.length">
        {{ competitor.intelligence.packages.length }} packages
      </span>

      <span v-if="competitor.intelligence?.tone">
        {{ competitor.intelligence.tone }}
      </span>

      <a
        v-if="competitor.website"
        :href="competitor.website"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:text-brand-orange"
      >
        Visit website
      </a>
    </div>

    <!-- Last analyzed timestamp -->
    <div
      v-if="competitor.last_analyzed_at"
      class="flex items-center gap-1.5 text-xs text-slate-500"
      :title="formatFullDate(competitor.last_analyzed_at)"
    >
      <ClockIcon class="w-3.5 h-3.5 shrink-0" />

      <span>
        Last analyzed:
        {{ formatFullDate(competitor.last_analyzed_at) }}
      </span>
    </div>

    <!-- Error message -->
    <p v-if="competitor.error" class="text-xs text-amber-700">
      {{ competitor.error }}
    </p>

    <!-- Quick intelligence -->
    <details v-if="competitor.intelligence" class="text-sm text-slate-600">
      <summary class="cursor-pointer text-navy">Quick intelligence</summary>

      <div class="space-y-2 mt-2">
        <p>
          {{ competitor.intelligence.summary }}
        </p>

        <p v-if="competitor.phone">Phone: {{ competitor.phone }}</p>

        <div v-for="p in competitor.intelligence.packages ?? []" :key="p.name">
          {{ p.name }} · {{ p.price || "Price not found" }}
        </div>

        <p v-for="(p, i) in competitor.intelligence.promotions ?? []" :key="i">
          {{ p }}
        </p>

        <ul class="list-disc pl-5">
          <li
            v-for="(a, i) in competitor.intelligence.claimedAdvantages ?? []"
            :key="`a${i}`"
          >
            {{ a }}
          </li>

          <li
            v-for="(w, i) in competitor.intelligence.detectableWeaknesses ?? []"
            :key="`w${i}`"
          >
            {{ w }}
          </li>
        </ul>
      </div>
    </details>
  </article>
</template>

<script setup lang="ts">
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

import type { CompetitorRow } from "~/types/competitor-ui";
import { statusBadgeClass } from "~/utils/competitor-ui";

defineProps<{
  competitor: CompetitorRow;
  selected: boolean;
  busy: boolean;
  disabled: boolean;
  recentlyAnalyzed?: boolean;
}>();

defineEmits<{
  select: [];
  analyze: [];
}>();

const formatFullDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
</script>
