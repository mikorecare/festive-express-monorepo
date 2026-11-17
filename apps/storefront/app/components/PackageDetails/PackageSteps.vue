<template>
  <ol
    v-fade
    class="mt-3 grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-x-6 sm:gap-y-4 sm:mt-8 lg:mt-10 max-w-2xl pb-6"
  >
    <li
      v-for="(step, i) in steps"
      :key="i"
      class="flex items-center gap-1 sm:gap-2.5 lg:gap-3 justify-start min-w-0"
    >
      <!-- Number Circle -->
      <span
        class="shrink-0 flex items-center justify-center rounded-full bg-[#F49321] text-[#1C2D5B] font-black shadow-[0_2px_6px_rgba(244,147,33,0.3)] sm:shadow-[0_3px_8px_rgba(244,147,33,0.3)] sm:ring-4 sm:ring-white w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm lg:w-9 lg:h-9 lg:text-base [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
        aria-hidden="true"
      >
        {{ i + 1 }}
      </span>

      <!-- Step Text -->
      <span
        class="text-[11px] sm:text-sm lg:text-base font-bold text-black whitespace-nowrap leading-none sm:leading-tight"
      >
        {{ step }}
      </span>
    </li>
  </ol>
</template>

<script setup>
import { ref } from "vue";

const steps = [
  "Find Your Home",
  "Add Your Phone Number",
  "Choose Your Colors",
  "Make It Yours",
  "Add to Cart",
];
</script>
