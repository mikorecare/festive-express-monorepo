<template>
  <div class="relative">
    <div
      class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <div
        class="relative w-full h-48 sm:h-auto sm:aspect-[4/3] bg-slate-100 overflow-hidden"
      >
        <NuxtImg
          :src="imageSrc || undefined"
          :alt="alt"
          format="webp"
          quality="85"
          fit="cover"
          loading="eager"
          fetchpriority="high"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        v-if="description"
        class="px-4 sm:px-5 py-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100"
        v-html="description"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ imageSrc?: string | null; alt: string; description?: string }>();
</script>
