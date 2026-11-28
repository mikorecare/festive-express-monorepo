<template>
  <div class="space-y-5">
    <!-- Prioritized Actions -->
    <div v-if="sortedActions.length">
      <strong
        class="text-navy block mb-2 text-sm uppercase tracking-wide"
        >Prioritized Actions</strong
      >
      <div class="space-y-2">
        <div
          v-for="(a, i) in sortedActions"
          :key="i"
          class="border border-slate-200 rounded-lg p-3 bg-white"
        >
          <div class="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold uppercase text-slate-600"
              >{{ a.area }}</span
            >
            <span
              class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
              :class="levelClass(a.impact, true)"
              >Impact: {{ a.impact }}</span
            >
            <span
              class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
              :class="levelClass(a.effort, false)"
              >Effort: {{ a.effort }}</span
            >
          </div>
          <p class="text-sm font-medium text-navy">
            {{ a.action }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            {{ a.evidence }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import type { Comparison } from '~/types/competitor-ui';
const props = defineProps<{ comparisonData: Comparison }>();
import { levelClass } from '~/utils/competitor-ui';
const rank = {high:0, medium:1, low:2};
const sortedActions = computed(() => [...(props.comparisonData.prioritizedActions ?? [])].sort((a,b) => rank[a.impact]-rank[b.impact] || rank[b.effort]-rank[a.effort]));
</script>
