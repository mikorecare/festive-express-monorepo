<template>
  <div v-if="items.length" class="mb-6">
    <div class="flex items-center gap-2 mb-3">
      <h3 class="text-sm font-extrabold text-[#1C2D5B] uppercase tracking-wide">
        What's Included
      </h3>
      <span
        class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full"
        >{{ items.length }} items</span
      >
    </div>
    <ul class="grid grid-cols-2 gap-x-3 gap-y-3 w-full">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="flex items-center gap-2 min-w-0"
      >
        <div
          class="w-[32px] h-[32px] rounded-full border border-slate-200 overflow-hidden shrink-0 bg-white flex items-center justify-center"
        >
          <NuxtImg
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.name"
            width="32"
            height="32"
            fit="cover"
            loading="lazy"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="min-w-0">
          <strong
            class="text-[0.75rem] text-[#1C2D5B] font-bold leading-tight block"
          >
            {{ item.name }}
            <span
              v-if="item.quantity > 1"
              class="text-[#F49321] font-extrabold ml-0.5"
              >×{{ item.quantity }}</span
            >
          </strong>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ name: string; quantity: number; image_url: string | null }>;
}>();
</script>
