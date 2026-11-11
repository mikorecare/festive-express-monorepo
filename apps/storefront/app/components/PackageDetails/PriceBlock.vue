<!-- components/package-detail/PriceBlock.vue -->
<template>
  <div class="flex flex-col items-end shrink-0 leading-tight">
    <span class="inline-flex items-baseline">
      <span
        class="text-[2.25rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 sm:-mr-2 translate-y-[-0.1em]"
        >$&nbsp;</span
      >
      <span
        class="text-4xl font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em]"
      >
        {{ Math.round(Number(price) || 0).toLocaleString() }}
      </span>
    </span>
    <span
      :class="size === 'sm' ? 'text-xs' : 'text-sm'"
      class="font-semibold text-slate-500"
      >Per Season</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{ price: number; size?: "sm" | "lg" }>();
</script>
