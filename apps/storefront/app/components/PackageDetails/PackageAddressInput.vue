<template>
  <div class="mb-2">
    <label
      for="estimator-address"
      class="block text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-navy mb-1.5"
    >
      Installation Address *
    </label>
    <div class="relative">
      <input
        id="estimator-address"
        v-model="local"
        autocomplete="off"
        placeholder="Start typing your street address"
        class="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px] form-input transition-all duration-200"
        :class="[
          { 'border-red-500': errors?.address },
          validating
            ? 'text-transparent bg-gray-50 select-none'
            : 'text-slate-800',
        ]"
        :disabled="validating"
        @input="onInput"
        @focus="onFocus"
      />

      <!-- Skeleton Loader -->
      <div
        v-if="validating"
        class="absolute inset-y-0 left-3 lg:left-4 right-3 flex items-center pointer-events-none"
      >
        <div class="h-3.5 bg-gray-300 rounded-md animate-pulse w-[65%]"></div>
      </div>

      <!-- Suggestions Dropdown -->
      <div
        v-if="suggestions.length && suggestionsOpen && !validating"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[14px] shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="s in suggestions"
          :key="s.placeId"
          class="px-3.5 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
          @mousedown.prevent="selectSuggestion(s)"
        >
          <div
            class="text-[14px] sm:text-[15px] font-medium text-gray-800 truncate"
          >
            {{ s.main }}
          </div>
          <div class="text-xs text-gray-500 truncate">{{ s.secondary }}</div>
        </div>
      </div>

      <p v-if="addressError" class="text-red-500 text-xs mt-1">
        {{ addressError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  address: string;
  suggestions: any[];
  suggestionsOpen: boolean;
  errors?: Record<string, any>;
  addressError?: string | null;
  validating?: boolean;
}>();

const emit = defineEmits<{
  input: [Event];
  focus: [];
  select: [any];
  close: [];
  "update:address": [string];
}>();

const local = ref(props.address);

watch(
  () => props.address,
  (v) => {
    if (v !== local.value) local.value = v;
  },
);

watch(local, (v) => {
  emit("update:address", v);
});

const onInput = (e: Event) => {
  local.value = (e.target as HTMLInputElement).value;
  emit("input", e);
};

const onFocus = (e: Event) => {
  emit("focus");
  if (local.value.trim().length > 0) {
    emit("input", e);
  }
};

const selectSuggestion = (s: any) => {
  emit("select", s);
  emit("close");
};
</script>
