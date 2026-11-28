<template>
  <details
    class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden group"
  >
    <summary
      class="flex items-center gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
    >
      <div
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-[#1C2D5B]"
      >
        <ClockIcon class="w-5 h-5" />
      </div>

      <div class="flex-1">
        <h3 class="font-semibold text-[#1C2D5B]">Discovery History</h3>

        <p class="text-xs text-slate-500">Review your recent searches</p>
      </div>

      <span class="text-xs text-slate-400"> {{ runs.length }} runs </span>

      <ChevronDownIcon
        class="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180"
      />
    </summary>

    <div class="border-t border-slate-100">
      <div class="flex justify-end px-4 pt-3">
        <button
          type="button"
          :disabled="loading"
          class="flex items-center gap-1.5 text-xs text-[#1C2D5B] hover:text-[#F49321] disabled:opacity-50"
          @click="$emit('refresh')"
        >
          <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />

          Refresh
        </button>
      </div>

      <div
        v-if="loading && !runs.length"
        class="p-5 text-center text-sm text-slate-500"
      >
        Loading discovery history…
      </div>

      <div
        v-else-if="error"
        class="m-4 p-3 rounded-lg bg-red-50 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div v-else-if="!runs.length" class="p-6 text-center">
        <ClockIcon class="w-8 h-8 mx-auto text-slate-300" />

        <p class="text-sm font-medium text-slate-600 mt-2">
          No discovery history
        </p>

        <p class="text-xs text-slate-400 mt-1">
          Your completed discovery runs will appear here.
        </p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <article
          v-for="run in runs"
          :key="run.id"
          class="flex items-start gap-3 px-4 py-4"
        >
          <div
            class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"
          >
            <MagnifyingGlassIcon class="w-4 h-4" />
          </div>

          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-semibold text-[#1C2D5B]">
              {{ run.query }}
            </h4>

            <p class="text-xs text-slate-500 mt-1 break-words">
              {{ formatLocation(run.location) }}
            </p>

            <p class="text-[11px] text-slate-400 mt-1">
              {{ formatDate(run.finished_at) }}
            </p>

            <p v-if="run.meta?.error" class="text-xs text-red-600 mt-2">
              {{ run.meta.error }}
            </p>

            <p
              v-else-if="(run.meta?.failed ?? 0) > 0"
              class="text-xs text-amber-600 mt-2"
            >
              {{ run.meta?.failed }} failed detail requests
            </p>
          </div>

          <div class="text-right shrink-0">
            <p
              v-if="run.meta?.error"
              class="text-sm font-semibold text-red-600"
            >
              Failed
            </p>

            <template v-else>
              <p
                class="text-sm font-bold"
                :class="
                  (run.meta?.inserted ?? run.found_count ?? 0) > 0
                    ? 'text-emerald-600'
                    : 'text-slate-500'
                "
              >
                <template v-if="run.meta?.inserted != null">
                  +{{ run.meta.inserted }} new
                </template>

                <template v-else> {{ run.found_count ?? 0 }} found </template>
              </p>

              <p
                v-if="run.meta?.skipped != null"
                class="text-xs text-slate-400 mt-1"
              >
                {{ run.meta.skipped }} skipped
              </p>
            </template>

            <button
              type="button"
              :disabled="busy"
              class="text-xs font-medium text-[#F49321] hover:underline mt-2 disabled:opacity-50"
              @click="$emit('reuse', run)"
            >
              Search again
            </button>
          </div>
        </article>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import {
  ClockIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";

import type { DiscoveryRun } from "~/types/discovery";

defineProps<{
  runs: DiscoveryRun[];
  loading: boolean;
  error?: string | null;
  busy?: boolean;
}>();

defineEmits<{
  refresh: [];
  reuse: [run: DiscoveryRun];
}>();

const formatLocation = (location: string) => {
  if (!location) return "Unknown search area";

  if (location === "Box: 26.9,-82.8 to 27.7,-82") {
    return "Sarasota Area";
  }

  if (location === "Box: 26.1,-82.8 to 27.9,-81.9") {
    return "Florida West Coast (Tampa to Naples)";
  }

  return location;
};

const formatDate = (value: string | null) => {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
</script>
