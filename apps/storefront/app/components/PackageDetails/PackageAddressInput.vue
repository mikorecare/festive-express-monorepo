<template>
  <div class="mb-2">
    <label
      for="estimator-address"
      class="block text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-navy mb-1.5"
    >
      Address *
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

      <!-- Animated Loading State -->
      <Transition name="loader-fade">
        <div
          v-if="validating"
          class="absolute inset-0 z-10 flex items-center px-3 lg:px-4 pointer-events-none"
        >
          <div class="flex items-center gap-2.5">
            <!-- Loading message -->
            <Transition name="message" mode="out-in">
              <span
                :key="currentMessage"
                class="text-[13px] sm:text-[14px] font-semibold text-brand-orange"
              >
                {{ currentMessage }}
              </span>
            </Transition>
            <!-- Animated dots -->
            <div class="flex items-center gap-1">
              <span
                v-for="dot in 3"
                :key="dot"
                class="loading-dot"
                :style="{ animationDelay: `${(dot - 1) * 0.2}s` }"
              ></span>
            </div>
          </div>
        </div>
      </Transition>

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
          <div class="text-xs text-gray-500 truncate">
            {{ s.secondary }}
          </div>
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

const loadingMessages = [
  "Locating your home",
  "Almost there...",
  "Finding your property details",
  "Measuring your roof area",
  "Almost there...",
  "Analyzing your roof layout",
  "Checking your property boundaries",
  "Validating your address",
  "Almost there...",
  "Checking the distance",
  "Calculating your service coverage",
  "Reviewing your location details",
  "Checking for overages",
  "Finalizing the details",
  "Just a few more seconds...",
  "Almost done!",
  "Thank you for your patience",
];

const currentMessageIndex = ref(0);

const currentMessage = computed(
  () => loadingMessages[currentMessageIndex.value],
);

let messageInterval: ReturnType<typeof setInterval> | null = null;

watch(
  () => props.validating,
  (isValidating) => {
    if (messageInterval) {
      clearInterval(messageInterval);
      messageInterval = null;
    }

    currentMessageIndex.value = 0;

    if (isValidating) {
      messageInterval = setInterval(() => {
        currentMessageIndex.value =
          (currentMessageIndex.value + 1) % loadingMessages.length;
      }, 3500);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval);
});

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

<style scoped>
/* Sequential bouncing dots */
.loading-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #f49321;
  animation: dot-bounce 0.8s ease-in-out infinite;
}

@keyframes dot-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }

  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

/* Message transitions */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.2s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
