<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-user-circle mr-2"></i> Service Information
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >First Name *</label
        >
        <input
          :value="modelValue.billing_first_name"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              billing_first_name: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'billing_first_name')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.billing_first_name }"
          placeholder="John"
        />
        <p v-if="errors.billing_first_name" class="text-red-500 text-sm mt-1">
          {{ errors.billing_first_name }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Last Name *</label
        >
        <input
          :value="modelValue.billing_last_name"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              billing_last_name: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'billing_last_name')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.billing_last_name }"
          placeholder="Doe"
        />
        <p v-if="errors.billing_last_name" class="text-red-500 text-sm mt-1">
          {{ errors.billing_last_name }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Email Address *</label
        >
        <input
          :value="modelValue.billing_email"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              billing_email: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'billing_email')"
          type="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.billing_email }"
          placeholder="john@example.com"
        />
        <p v-if="errors.billing_email" class="text-red-500 text-sm mt-1">
          {{ errors.billing_email }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Phone Number *</label
        >
        <input
          :value="modelValue.billing_phone"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              billing_phone: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'billing_phone')"
          type="tel"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.billing_phone }"
          placeholder="(555) 123-4567"
        />
        <p v-if="errors.billing_phone" class="text-red-500 text-sm mt-1">
          {{ errors.billing_phone }}
        </p>
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Installation Address *</label
        >
        <input
          :value="modelValue.shipping_address_1"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              shipping_address_1: ($event.target as HTMLInputElement).value,
            })
          "
          @blur="$emit('validate', 'shipping_address_1')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.shipping_address_1 }"
          placeholder="123 Festive Lane, Sarasota, FL 34234"
        />
        <p v-if="errors.shipping_address_1" class="text-red-500 text-sm mt-1">
          {{ errors.shipping_address_1 }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >ZIP / Postcode *</label
        >
        <input
          :value="modelValue.billing_postcode"
          @input="
            (e) => {
              $emit('update:modelValue', {
                ...modelValue,
                billing_postcode: (e.target as HTMLInputElement).value,
              });
              $emit('validate', 'billing_postcode');
            }
          "
          @blur="$emit('validate', 'billing_postcode')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.billing_postcode }"
          maxlength="10"
          placeholder="e.g. 34236"
        />
        <small class="text-gray-500 text-xs block mt-1">
          Service area: Sarasota &amp; Manatee counties (incl. Lakewood Ranch)
        </small>
        <p v-if="errors.billing_postcode" class="text-red-500 text-sm mt-1">
          {{ errors.billing_postcode }}
        </p>
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          Customer Note <span class="text-gray-400">(optional)</span>
        </label>
        <textarea
          :value="modelValue.customer_note"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              customer_note: ($event.target as HTMLTextAreaElement).value,
            })
          "
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows="3"
          placeholder="Any special instructions? (gate code, pets, preferred side of house, etc.)"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  shipping_address_1: string;
  billing_postcode: string;
  customer_note: string;
}

interface ValidationErrors {
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  shipping_address_1: string;
  billing_postcode: string;
}

defineProps<{
  modelValue: FormData;
  errors: ValidationErrors;
}>();

defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();
</script>
