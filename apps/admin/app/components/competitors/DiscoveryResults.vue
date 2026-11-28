<template>
  <section
    class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    aria-live="polite"
  >
    <!-- Header -->
    <header class="flex items-start gap-3 p-5 border-b border-slate-100">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        :class="
          result.failed > 0
            ? 'bg-amber-50 text-amber-600'
            : 'bg-emerald-50 text-emerald-600'
        "
      >
        <ExclamationTriangleIcon v-if="result.failed > 0" class="w-6 h-6" />

        <CheckCircleIcon v-else class="w-6 h-6" />
      </div>

      <div class="flex-1">
        <h3 class="font-bold text-[#1C2D5B]">
          {{ headline }}
        </h3>

        <p class="text-sm text-slate-500 mt-1">
          {{ description }}
        </p>
      </div>

      <button
        type="button"
        aria-label="Dismiss discovery results"
        class="text-slate-400 hover:text-slate-600 p-1"
        @click="$emit('dismiss')"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </header>

    <div class="p-5 space-y-5">
      <!-- Statistics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
        >
          <p class="text-xs font-medium text-slate-500">
            {{ stat.label }}
          </p>

          <p class="text-2xl font-bold mt-1 tabular-nums" :class="stat.color">
            {{ stat.value }}
          </p>

          <p class="text-[11px] text-slate-400 mt-1">
            {{ stat.description }}
          </p>
        </div>
      </div>

      <!-- Distribution bar -->
      <div v-if="result.returned > 0" class="space-y-3">
        <div class="h-3 flex rounded-full overflow-hidden bg-slate-100">
          <div
            v-for="segment in visibleSegments"
            :key="segment.label"
            :class="segment.color"
            :style="{
              width: `${(segment.value / result.returned) * 100}%`,
            }"
            :title="`${segment.label}: ${segment.value}`"
          />
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <div
            v-for="segment in visibleSegments"
            :key="segment.label"
            class="flex items-center gap-1.5"
          >
            <span class="w-2.5 h-2.5 rounded-full" :class="segment.color" />

            <span class="text-xs text-slate-600">
              {{ segment.label }} ({{ segment.value }})
            </span>
          </div>
        </div>
      </div>

      <!-- Deferred records -->
      <div
        v-if="deferred > 0"
        class="p-3 rounded-xl border border-amber-100 bg-amber-50"
      >
        <p class="text-sm font-medium text-amber-800">
          {{ deferred }} additional candidates available
        </p>

        <p class="text-xs text-amber-700 mt-1">
          The new-competitor limit was reached. Run discovery again to find
          remaining candidates if Google returns them in subsequent results.
        </p>
      </div>

      <!-- Efficiency -->
      <div
        class="flex flex-wrap gap-x-6 gap-y-3 py-3 border-y border-slate-100"
      >
        <div>
          <p class="text-xs text-slate-500">Search pages</p>

          <p class="font-semibold text-[#1C2D5B]">
            {{ result.stats.pages }}
          </p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Place Details requests</p>

          <p class="font-semibold text-[#1C2D5B]">
            {{ result.stats.detailsRequested }}
          </p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Existing records overwritten</p>

          <p class="font-semibold text-emerald-600">0</p>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheckIcon class="w-5 h-5 text-emerald-600 shrink-0" />

        Existing competitor intelligence preserved.
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3">
        <button
          v-if="result.found > 0"
          type="button"
          :disabled="busy"
          class="flex-1 min-w-40 py-2.5 px-4 rounded-xl bg-[#1C2D5B] text-white font-medium text-sm hover:bg-[#263d73] disabled:opacity-50"
          @click="$emit('viewNew')"
        >
          View {{ result.found }} New
          {{ result.found === 1 ? "Competitor" : "Competitors" }}
        </button>

        <button
          type="button"
          :disabled="busy"
          class="flex-1 min-w-40 py-2.5 px-4 rounded-xl border border-slate-200 text-[#1C2D5B] font-medium text-sm hover:bg-slate-50 disabled:opacity-50"
          @click="$emit('searchAgain')"
        >
          {{ deferred > 0 ? "Continue Discovery" : "Try Another Search" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

import type { DiscoveryResponse } from "~/types/discovery";

const props = defineProps<{
  result: DiscoveryResponse;
  busy?: boolean;
}>();

defineEmits<{
  dismiss: [];
  viewNew: [];
  searchAgain: [];
}>();

const deferred = computed(() =>
  Math.max(
    0,
    props.result.stats.newCandidates - props.result.stats.detailsRequested,
  ),
);

const headline = computed(() => {
  const r = props.result;

  if (r.failed > 0) {
    return "Discovery completed with some errors";
  }

  if (r.found > 0) {
    return `${r.found} new ${
      r.found === 1 ? "competitor" : "competitors"
    } discovered`;
  }

  if (r.returned === 0) {
    return "No businesses found";
  }

  if (deferred.value > 0) {
    return "Additional candidates available";
  }

  if (r.skipped === r.returned) {
    return "All returned competitors are registered";
  }

  return "No new competitors added";
});

const description = computed(() => {
  const r = props.result;

  if (r.failed > 0) {
    return `${r.failed} business detail requests failed. Successfully retrieved new competitors have been saved.`;
  }

  if (r.found > 0) {
    return "New businesses were added to your competitor database.";
  }

  if (r.returned === 0) {
    return "Try another keyword or geographic search area.";
  }

  if (deferred.value > 0) {
    return "Some new candidates remain available for future discovery runs.";
  }

  if (r.skipped === r.returned) {
    return "All businesses returned by this search already exist in your database. No duplicates were created.";
  }

  return "This search did not add any new competitor records.";
});

const statistics = computed(() => [
  {
    label: "Total matches",
    value: props.result.returned,
    description: "Unique Place IDs",
    color: "text-[#1C2D5B]",
  },
  {
    label: "New competitors",
    value: props.result.found,
    description: "Successfully registered",
    color: "text-emerald-600",
  },
  {
    label: "Already registered",
    value: props.result.skipped,
    description: "Automatically skipped",
    color: "text-slate-600",
  },
  {
    label: "Failed requests",
    value: props.result.failed,
    description: "Business detail errors",
    color: props.result.failed > 0 ? "text-red-600" : "text-[#1C2D5B]",
  },
]);

const visibleSegments = computed(() =>
  [
    {
      label: "Existing",
      value: props.result.skipped,
      color: "bg-slate-400",
    },
    {
      label: "New",
      value: props.result.found,
      color: "bg-emerald-500",
    },
    {
      label: "Deferred",
      value: deferred.value,
      color: "bg-[#F49321]",
    },
    {
      label: "Failed",
      value: props.result.failed,
      color: "bg-red-500",
    },
  ].filter((segment) => segment.value > 0),
);
</script>
