<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-credit-card mr-2"></i> Payment Information
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Cardholder Name *</label
        >
        <input
          :value="modelValue.card_name"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              card_name: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'card_name')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.card_name }"
          placeholder="John Doe"
        />
        <p v-if="errors.card_name" class="text-red-500 text-sm mt-1">
          {{ errors.card_name }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Card Number *</label
        >
        <div class="flex">
          <span
            class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50"
          >
            <i class="fas fa-credit-card"></i>
          </span>
          <input
            :value="modelValue.card_number"
            @input="$emit('formatCardNumber')"
            @blur="$emit('validate', 'card_number')"
            type="text"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.card_number }"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
          />
        </div>
        <p v-if="errors.card_number" class="text-red-500 text-sm mt-1">
          {{ errors.card_number }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >Expiry Date *</label
          >
          <input
            :value="modelValue.card_expiry"
            @input="$emit('formatExpiry')"
            @blur="$emit('validate', 'card_expiry')"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.card_expiry }"
            placeholder="MM/YY"
            maxlength="5"
          />
          <p v-if="errors.card_expiry" class="text-red-500 text-sm mt-1">
            {{ errors.card_expiry }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >CVV *</label
          >
          <input
            :value="modelValue.card_cvv"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                card_cvv: ($event.target as HTMLInputElement).value,
              })
            "
            @blur="$emit('validate', 'card_cvv')"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.card_cvv }"
            placeholder="•••"
            maxlength="4"
          />
          <p v-if="errors.card_cvv" class="text-red-500 text-sm mt-1">
            {{ errors.card_cvv }}
          </p>
        </div>
      </div>
      <div class="flex items-center">
        <input
          :checked="modelValue.billing_same"
          @change="
            $emit('update:modelValue', {
              ...modelValue,
              billing_same: ($event.target as HTMLInputElement).checked,
            })
          "
          type="checkbox"
          id="billingSame"
          class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <label for="billingSame" class="ml-2 text-sm text-gray-700">
          Billing address is same as installation address
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  billing_same: boolean;
}

interface ValidationErrors {
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
}

defineProps<{
  modelValue: FormData;
  errors: ValidationErrors;
}>();

defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
  (e: "formatCardNumber"): void;
  (e: "formatExpiry"): void;
}>();
</script>
