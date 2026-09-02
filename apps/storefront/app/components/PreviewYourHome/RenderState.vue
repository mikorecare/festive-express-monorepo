<template>
  <div
    v-if="rendering"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl"
    >
      <div class="relative h-1.5 w-full">
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#f7931e] via-[#f7931e] to-[#1c2f5b]"
        ></div>
      </div>

      <div class="p-8 text-center">
        <div class="flex justify-center mb-6">
          <FLpLoadingLogo
            :animation-speed="300"
            :animate="true"
            width="120"
            height="122"
          />
        </div>

        <template v-if="isPreview">
          <p class="text-base text-gray-600 mb-3">
            Loading the house photo — no lighting yet.
          </p>
          <h3 class="text-2xl font-bold text-navy">Checking address…</h3>
          <p class="text-base text-gray-500 mt-3">Looking up address…</p>
        </template>

        <template v-else>
          <p class="text-base text-gray-600 mb-3">{{ currentFact }}</p>
          <h3 class="text-2xl font-bold text-navy">Lighting up your home…</h3>
          <p class="text-base text-gray-500 mt-3">{{ progressText }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";
import FLpLoadingLogo from "../Icons/FLpLoadingLogo.vue";

const { rendering, currentFact, progressText, isPreview } = useEstimator();
</script>
