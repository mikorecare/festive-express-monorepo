<template>
  <div class="space-y-4">
    <!-- Calendars Container (Single Row on Desktop) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
      <!-- Installation Dates -->
      <div class="flex flex-col">
        <label class="block text-sm font-bold text-[#1C2D5B] mb-3">
          Preferred Installation Dates
          <span class="text-slate-400 font-normal">(Up to 3) *</span>
        </label>

        <div class="flex-1">
          <InlineCalendar
            :selected="modelValue.install_dates.filter(Boolean)"
            :min-date="minDate"
            :max-select="3"
            @update:selected="onInstallDatesChange"
            @blur="$emit('validate', 'install_dates')"
            :class="{
              'ring-2 ring-red-500 rounded-xl': errors.install_dates,
            }"
          />
        </div>

        <p
          v-if="errors.install_dates"
          class="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ errors.install_dates }}
        </p>
        <p
          class="text-xs text-slate-500 mt-2 font-medium flex items-start gap-1"
        >
          <i class="fas fa-info-circle mt-0.5 text-[#F49321]"></i>
          Earliest date is 3 days from today.
        </p>
      </div>

      <!-- Removal Dates -->
      <div class="flex flex-col">
        <label class="block text-sm font-bold text-[#1C2D5B] mb-3">
          Preferred Removal Dates
          <span class="text-slate-400 font-normal">(Up to 3, Optional)</span>
        </label>

        <div class="flex-1">
          <InlineCalendar
            :selected="modelValue.removal_dates.filter(Boolean)"
            :min-date="minDate"
            :max-select="3"
            @update:selected="onRemovalDatesChange"
          />
        </div>

        <p
          class="text-xs text-slate-500 mt-2 font-medium flex items-start gap-1"
        >
          <i class="fas fa-info-circle mt-0.5 text-slate-400"></i>
          Select 1–3 preferred removal dates
        </p>
      </div>
    </div>

    <!-- Selected Dates Summary -->
    <div v-if="hasSelectedDates" class="pt-4 border-t border-slate-200">
      <div
        class="flex flex-col sm:flex-row gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl"
      >
        <div class="flex-1">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            >Selected Install:</span
          >
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(date, index) in sortedInstallDates"
              :key="'install-' + index"
              class="text-xs font-bold bg-[#F49321]/10 text-[#1C2D5B] px-2 py-1 rounded-md border border-[#F49321]/20"
            >
              {{ formatDate(date) }}
            </span>
            <span
              v-if="!sortedInstallDates.length"
              class="text-xs text-slate-400 italic"
              >None</span
            >
          </div>
        </div>
        <div class="hidden sm:block w-px bg-slate-200"></div>
        <div class="flex-1">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            >Selected Removal:</span
          >
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(date, index) in sortedRemovalDates"
              :key="'removal-' + index"
              class="text-xs font-bold bg-[#1C2D5B]/5 text-[#1C2D5B] px-2 py-1 rounded-md border border-[#1C2D5B]/10"
            >
              {{ formatDate(date) }}
            </span>
            <span
              v-if="!sortedRemovalDates.length"
              class="text-xs text-slate-400 italic"
              >None</span
            >
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

const props = defineProps<{
  modelValue: FormData;
  errors: Record<string, string>;
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
  });
};

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
