<template>
  <div>
    <!-- mobile -->
    <div
      class="lg:hidden px-2 pt-4 pb-2 flex items-center justify-between gap-4"
    >
      <div class="min-w-0">
        <NuxtImg
          v-if="titleImage"
          :src="titleImage"
          :alt="name"
          loading="eager"
          class="h-16 w-auto object-contain"
        />
        <h1 v-else class="text-xl font-extrabold text-[#1C2D5B]">{{ name }}</h1>
      </div>
      <PriceBlock :price="price" size="sm" />
    </div>

    <!-- desktop -->
    <div class="hidden lg:flex items-center justify-between gap-4 mb-6">
      <div>
        <NuxtImg
          v-if="titleImage"
          :src="titleImage"
          :alt="name"
          loading="eager"
          class="h-20 w-auto object-contain"
        />
        <h1 v-else class="text-3xl font-extrabold text-[#1C2D5B]">
          {{ name }}
        </h1>
      </div>
      <PriceBlock :price="price" size="lg" />
    </div>

    <ul
      class="flex flex-nowrap items-center gap-3 text-[0.7rem] sm:text-xs font-semibold text-slate-500 mb-6 overflow-x-auto"
      role="list"
    >
      <li
        v-for="label in ['Pro installation', 'Maintenance', 'Removal']"
        :key="label"
        class="flex items-center gap-1 whitespace-nowrap shrink-0"
      >
        <svg
          class="w-4 h-4 text-[#F49321] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import PriceBlock from './PriceBlock.vue';

defineProps<{ name: string; titleImage?: string | null; price: number }>();
</script>
