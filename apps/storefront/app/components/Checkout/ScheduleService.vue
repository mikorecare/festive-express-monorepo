<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-calendar-alt mr-2"></i> Schedule Your Service
    </h3>

    <div class="space-y-4">
      <!-- Installation Dates -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Installation Dates (Select up to 3) *
        </label>

        <InlineCalendar
          :selected="modelValue.install_dates.filter(Boolean)"
          :min-date="minDate"
          :max-select="3"
          @update:selected="onInstallDatesChange"
          @blur="$emit('validate', 'install_dates')"
          :class="{ 'ring-1 ring-red-500 rounded-lg': errors.install_dates }"
        />

        <p v-if="errors.install_dates" class="text-red-500 text-sm mt-1">
          {{ errors.install_dates }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Earliest date is 3 days from today. Select 1–3 preferred dates.
        </p>
      </div>

      <!-- Removal Dates -->
      <div class="pt-4 border-t border-gray-200">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Removal Dates (Select up to 3)
          <span class="text-xs font-normal text-gray-400">(Optional)</span>
        </label>

        <InlineCalendar
          :selected="modelValue.removal_dates.filter(Boolean)"
          :min-date="minDate"
          :max-select="3"
          @update:selected="onRemovalDatesChange"
        />

        <p class="text-xs text-gray-400 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Select 1–3 preferred removal dates
        </p>
      </div>

      <!-- Selected Dates Summary -->
      <div v-if="hasSelectedDates" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-semibold text-navy mb-2">
          Selected Dates Summary
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1">
              Installation Dates
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(date, index) in sortedInstallDates"
                :key="'install-summary-' + index"
                class="text-xs bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full"
              >
                {{ formatDate(date) }}
              </span>
              <span
                v-if="!sortedInstallDates.length"
                class="text-xs text-gray-400"
              >
                No dates selected
              </span>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1">
              Removal Dates
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(date, index) in sortedRemovalDates"
                :key="'removal-summary-' + index"
                class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {{ formatDate(date) }}
              </span>
              <span
                v-if="!sortedRemovalDates.length"
                class="text-xs text-gray-400"
              >
                No dates selected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InlineCalendar from "./InlineCalendar.vue";

interface FormData {
  install_dates: string[];
  removal_dates: string[];
}

interface ValidationErrors {
  install_dates: string;
}

const props = defineProps<{
  modelValue: FormData;
  errors: ValidationErrors;
  minDate: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Always keep the arrays length 3 (matches parent contract)
const toFixedArray = (arr: string[]) => {
  const cleaned = arr.filter(Boolean);
  const out = cleaned.slice(0, 3);
  while (out.length < 3) out.push("");
  return out;
};

const sortedInstallDates = computed(() =>
  props.modelValue.install_dates.filter(Boolean).slice().sort(),
);
const sortedRemovalDates = computed(() =>
  props.modelValue.removal_dates.filter(Boolean).slice().sort(),
);

const hasSelectedDates = computed(
  () =>
    sortedInstallDates.value.length > 0 || sortedRemovalDates.value.length > 0,
);

const onInstallDatesChange = (dates: string[]) => {
  emit("update:modelValue", {
    ...props.modelValue,
    install_dates: toFixedArray(dates),
  });
  emit("validate", "install_dates");
};

const onRemovalDatesChange = (dates: string[]) => {
  emit("update:modelValue", {
    ...props.modelValue,
    removal_dates: toFixedArray(dates),
  });
};
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
