<template>
  <div class="space-y-5">
    <!-- Sales Scenarios -->
    <div>
      <strong
        class="text-navy block mb-3 text-sm uppercase tracking-wide"
        >Sales Battlecard (Scenarios)</strong
      >
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="(scenario, i) in comparisonData.salesBattlecard"
          :key="i"
          class="border border-slate-200 rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-sm"
        >
          <div
            class="bg-navy text-white p-4 sm:w-1/4 flex flex-col justify-center"
          >
            <span
              class="text-[10px] uppercase font-bold text-slate-400 mb-1"
              >Scenario</span
            >
            <span class="text-sm font-semibold">{{
              scenario.scenario
            }}</span>
          </div>
          <div
            class="p-4 sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-200"
          >
            <span
              class="text-[10px] uppercase font-bold text-rose-500 mb-1 block"
              >Their Pitch</span
            >
            <p class="text-xs text-slate-600">
              {{ scenario.theirPitch }}
            </p>
          </div>
          <div class="p-4 bg-emerald-50 flex-1">
            <span
              class="text-[10px] uppercase font-bold text-emerald-600 mb-1 block"
              >Recommended Sales Response</span
            >
            <p class="text-xs text-slate-700 font-medium">
              {{ scenario.ourWinningPitch }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import type { Comparison } from '~/types/competitor-ui';
const props = defineProps<{ comparisonData: Comparison }>();
</script>
