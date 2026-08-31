<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-2xl p-6 shadow-md max-w-4xl w-full mx-4 my-8">
      <!-- Hide everything when rendering -->
      <template v-if="!rendering">
        <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
          <i class="fas fa-magic mr-2"></i> See Your Home Lit Up
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Upload a photo, pick your colors, and watch it light up. Instant
          design + estimate.
        </p>

        <!-- Form - Hidden when result or error shows -->
        <PreviewYourHomeForm v-if="!result && !renderError" />

        <!-- Result State -->
        <ResultState v-if="result && !rendering" />

        <!-- Error State -->
        <ErrorState v-if="renderError && !rendering" />
      </template>

      <!-- Show nothing when rendering - just empty card -->
      <div v-else class="min-h-[200px]"></div>
    </div>
  </div>

  <!-- RenderState - Outside the card for full overlay -->
  <RenderState />
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";
import PreviewYourHomeForm from "./PreviewYourHomeForm.vue";
import RenderState from "./RenderState.vue";
import ResultState from "./ResultState.vue";
import ErrorState from "./ErrorState.vue";

const { result, renderError, rendering } = useEstimator();
</script>
