<template>
  <button
    type="button"
    class="btn-3d-glossy relative overflow-hidden hidden lg:inline-flex lg:self-end items-center justify-center w-full text-white font-extrabold uppercase tracking-wide text-sm sm:text-base py-3 sm:py-4 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      class="relative z-10 inline-flex items-center justify-center gap-2 text-[1.4rem]"
    >
      <template v-if="loading">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {{ isEditing ? "Saving…" : "Adding…" }}
      </template>
      <template v-else>
        {{ isEditing ? "SAVE CHANGES" : "ADD TO CART" }}
      </template>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled: boolean;
  loading: boolean;
  isEditing?: boolean;
}>();
defineEmits<{ click: [] }>();
</script>
