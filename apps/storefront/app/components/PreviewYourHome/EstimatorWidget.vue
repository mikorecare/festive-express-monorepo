<template>
  <div>
    <!-- Header (only when not rendering) -->
    <template v-if="!rendering && showHeader">
      <p class="text-[32px] text-[#f7931e] font-bold flex items-center">
        {{ title }}
      </p>
      <p v-if="subtitle" class="text-xl text-black-200 mb-4">
        {{ subtitle }}
      </p>
    </template>

    <!-- Real content -->
    <template v-if="!rendering">
      <PreviewYourHomeForm v-if="!result && !renderError" />
      <ResultState v-if="result && !renderError" />
      <ErrorState v-if="renderError" />
    </template>

    <!-- Skeleton -->
    <RenderState v-else />
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";
import PreviewYourHomeForm from "./PreviewYourHomeForm.vue";
import RenderState from "./RenderState.vue";
import ResultState from "./ResultState.vue";
import ErrorState from "./ErrorState.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    showHeader?: boolean;
  }>(),
  {
    title: "See Your Home All Glowed Up",
    subtitle:
      "Enter your address, pick a package and a color, click on “Light Up My Home.”",
    showHeader: true,
  },
);

const { result, renderError, rendering } = useEstimator();
</script>
