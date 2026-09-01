<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <!-- Hide the entire card when rendering -->
    <div
      v-if="!rendering"
      class="bg-white rounded-2xl p-6 shadow-md max-w-4xl w-full mx-4 my-8"
    >
      <p class="text-[48px] text-[#f7931e] font-bold flex items-center">
        See Your Home Lit Up
      </p>
      <p class="text-xl text-black-200 mb-4">
        Enter your address, pick a package and a color, click on “Light Up My
        Home.” 
      </p>

      <PreviewYourHomeForm v-if="!result && !renderError" />

      <ResultState v-if="result && !rendering" />

      <ErrorState v-if="renderError && !rendering" />
    </div>

    <div v-else class="max-w-4xl w-full mx-4 my-8"></div>
  </div>

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
