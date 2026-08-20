<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-calendar-alt mr-2"></i> Schedule Your Service
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Preferred Installation Date *</label
        >
        <input
          :value="modelValue.preferred_install_date"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              preferred_install_date: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'preferred_install_date')"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.preferred_install_date }"
          :min="minDate"
        />
        <p
          v-if="errors.preferred_install_date"
          class="text-red-500 text-sm mt-1"
        >
          {{ errors.preferred_install_date }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Preferred Removal Date</label
        >
        <input
          :value="modelValue.removal_date"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              removal_date: ($event.target as HTMLInputElement).value,
            })
          "
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :min="modelValue.preferred_install_date || minDate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  preferred_install_date: string;
  removal_date: string;
}

interface ValidationErrors {
  preferred_install_date: string;
}

defineProps<{
  modelValue: FormData;
  errors: ValidationErrors;
  minDate: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();
</script>
