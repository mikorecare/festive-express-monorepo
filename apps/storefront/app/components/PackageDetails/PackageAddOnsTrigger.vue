<template>
  <button
    type="button"
    class="group w-full mb-6 flex items-center justify-between gap-3 px-3 py-2 rounded-xl border-2 border-[#F49321] bg-[#fff9f2] hover:bg-[#ffefdb] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out text-left shadow-sm hover:shadow-md"
    @click="$emit('open')"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="w-8 h-8 shrink-0 rounded-full bg-[#F49321] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
      >
        <i class="fa-solid fa-plus text-lg"></i>
      </div>
      <div class="min-w-0 flex flex-col items-start gap-0.5">
        <p
          class="text-sm font-extrabold text-[#1C2D5B] uppercase tracking-wide"
        >
          Customize package
        </p>
        <span
          v-if="extra > 0"
          class="text-[#F49321] font-bold text-[0.7rem] leading-none"
        >
          +${{ extra.toFixed(2) }} in add-ons
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{ extra: number }>();
defineEmits<{ open: [] }>();
</script>
