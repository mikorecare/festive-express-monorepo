<template>
  <div v-if="skus.length" class="mb-6">
    <p class="text-sm font-bold text-slate-900 mb-3">
      Light color:
      <span class="font-semibold text-slate-600">
        {{
          selected?.color_label ||
          byKey(selected?.color_key)?.color_label ||
          selected?.color_key
        }}
      </span>
    </p>
    <div
      class="flex flex-wrap gap-2.5"
      role="radiogroup"
      aria-label="Light color"
    >
      <button
        v-for="sku in skus"
        :key="sku.id"
        type="button"
        role="radio"
        :aria-checked="String(selected?.id) === String(sku.id)"
        :aria-label="
          sku.color_label || byKey(sku.color_key)?.color_label || sku.color_key
        "
        class="relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer"
        :class="
          String(selected?.id) === String(sku.id)
            ? 'border-[#F49321] scale-105 shadow-md'
            : 'border-slate-200 hover:border-slate-300'
        "
        @click="$emit('select', sku.id)"
      >
        <span
          class="absolute inset-1 rounded-full border border-slate-200"
          :style="swatchStyle(sku.color_key)"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  skus: any[];
  selected: any;
  swatchStyle: (key: string) => any;
  byKey: (key: string) => any;
}>();
defineEmits<{ select: [string | number] }>();
</script>
