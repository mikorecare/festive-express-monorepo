<template>
  <div
    v-if="rendering"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-sm text-gray-600 mb-2">{{ currentFact }}</p>
        <h3 class="text-lg font-bold text-navy">Lighting up your home…</h3>
        <p class="text-sm text-gray-500 mt-2">{{ progressText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";

const { rendering, currentFact, progressText } = useEstimator();
</script>
