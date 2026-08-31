<!-- components/ErrorState.vue -->
<template>
  <div class="mt-6 border-t border-gray-200 pt-6">
    <div class="text-center py-8">
      <div
        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-navy mb-2">Hmm.</h3>
      <p class="text-sm text-gray-600 mb-4">{{ renderError }}</p>
      <button
        class="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
        @click="reset"
      >
        Try another address
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";

const { renderError, reset } = useEstimator();
</script>
