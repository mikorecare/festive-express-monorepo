<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-calendar-alt mr-2"></i> Schedule Your Service
    </h3>

    <div class="space-y-4">
      <!-- Installation Dates -->
      <div>
        <label
          class="block text-sm font-semibold text-gray-700 mb-2 "
        >
          Preferred Installation Dates (Select up to 3) *
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-for="i in 3" :key="'install-' + i" class="relative">
            <label class=" block text-xs text-gray-500 mb-1">
              Option {{ i }}
              <span v-if="i === 1" class="text-red-500">*</span>
            </label>
            <input
              :value="modelValue.install_dates[i - 1]"
              @input="
                updateInstallDate(
                  i - 1,
                  ($event.target as HTMLInputElement).value,
                )
              "
              @blur="$emit('validate', 'install_dates')"
              type="date"
              class="w-full  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              :class="{ 'border-red-500': errors.install_dates }"
              :min="minDate"
            />
            <button
              v-if="modelValue.install_dates[i - 1]"
              type="button"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              @click="clearInstallDate(i - 1)"
            >
              ×
            </button>
          </div>
        </div>
        <p
          v-if="errors.install_dates"
          class=" text-red-500 text-sm mt-1"
        >
          {{ errors.install_dates }}
        </p>
        <p class="text-xs  text-gray-400 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Earliest date is 3 days from today. Select 1-3 preferred dates.
        </p>
      </div>

      <!-- Removal Dates -->
      <div class="pt-4 border-t border-gray-200">
        <label
          class="block text-sm font-semibold text-gray-700 mb-2 "
        >
          Preferred Removal Dates (Select up to 3)
          <span class="text-xs font-normal text-gray-400">(Optional)</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-for="i in 3" :key="'removal-' + i" class="relative">
            <label class=" block text-xs text-gray-500 mb-1">
              Option {{ i }}
            </label>
            <input
              :value="modelValue.removal_dates[i - 1]"
              @input="
                updateRemovalDate(
                  i - 1,
                  ($event.target as HTMLInputElement).value,
                )
              "
              type="date"
              class="w-full  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              :min="minDate"
            />
            <button
              v-if="modelValue.removal_dates[i - 1]"
              type="button"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              @click="clearRemovalDate(i - 1)"
            >
              ×
            </button>
          </div>
        </div>
        <p class="text-xs  text-gray-400 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Select 1-3 preferred removal dates
        </p>
      </div>

      <!-- Selected Dates Summary -->
      <div v-if="hasSelectedDates" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-semibold text-navy mb-2 ">
          Selected Dates Summary
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1 ">
              Installation Dates
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(date, index) in modelValue.install_dates.filter(
                  (d) => d,
                )"
                :key="'install-summary-' + index"
                class="text-xs  bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full"
              >
                {{ formatDate(date) }}
              </span>
              <span
                v-if="!modelValue.install_dates.filter((d) => d).length"
                class="text-xs  text-gray-400"
              >
                No dates selected
              </span>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1 ">
              Removal Dates
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(date, index) in modelValue.removal_dates.filter(
                  (d) => d,
                )"
                :key="'removal-summary-' + index"
                class="text-xs  bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {{ formatDate(date) }}
              </span>
              <span
                v-if="!modelValue.removal_dates.filter((d) => d).length"
                class="text-xs  text-gray-400"
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

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Check if any dates are selected
const hasSelectedDates = computed(() => {
  return (
    props.modelValue.install_dates.some((d) => d) ||
    props.modelValue.removal_dates.some((d) => d)
  );
});

// Update installation date at specific index
const updateInstallDate = (index: number, value: string) => {
  const newDates = [...props.modelValue.install_dates];
  newDates[index] = value;

  emit("update:modelValue", {
    ...props.modelValue,
    install_dates: newDates,
  });
};

// Update removal date at specific index
const updateRemovalDate = (index: number, value: string) => {
  const newDates = [...props.modelValue.removal_dates];
  newDates[index] = value;

  emit("update:modelValue", {
    ...props.modelValue,
    removal_dates: newDates,
  });
};

// Clear installation date at specific index
const clearInstallDate = (index: number) => {
  const newDates = [...props.modelValue.install_dates];
  newDates[index] = "";

  emit("update:modelValue", {
    ...props.modelValue,
    install_dates: newDates,
  });
};

// Clear removal date at specific index
const clearRemovalDate = (index: number) => {
  const newDates = [...props.modelValue.removal_dates];
  newDates[index] = "";

  emit("update:modelValue", {
    ...props.modelValue,
    removal_dates: newDates,
  });
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  padding: 4px;
}

input[type="date"]:hover::-webkit-calendar-picker-indicator {
  opacity: 1;
}

button {
  transition: all 0.2s ease;
}
</style>
