<template>
  <div class="bg-white rounded-2xl shadow-md">
    <div
      class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
    >
      <h3
        class="text-lg font-extrabold text-white flex items-center tracking-wide"
      >
       <i class="fas fa-user-circle mr-3 text-[#F49321]"></i> Contact Information
      </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 px-6">
      <div>
        <label class="block text-sm font-bold text-[#1C2D5B] mb-1"
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
          class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F49321] focus:border-transparent transition-all"
          :class="{ 'border-red-500': errors.billing_first_name }"
          placeholder="John"
        />
        <p v-if="errors.billing_first_name" class="text-red-500 text-sm mt-1">
          {{ errors.billing_first_name }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-bold text-[#1C2D5B] mb-1"
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
          class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F49321] focus:border-transparent transition-all"
          :class="{ 'border-red-500': errors.billing_last_name }"
          placeholder="Doe"
        />
        <p v-if="errors.billing_last_name" class="text-red-500 text-sm mt-1">
          {{ errors.billing_last_name }}
        </p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-[#1C2D5B] mb-1"
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
          class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F49321] focus:border-transparent transition-all"
          :class="{ 'border-red-500': errors.billing_email }"
          placeholder="john@example.com"
        />
        <p v-if="errors.billing_email" class="text-red-500 text-sm mt-1">
          {{ errors.billing_email }}
        </p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-[#1C2D5B] mb-1">
          Customer Note
          <span class="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          :value="modelValue.customer_note"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              customer_note: ($event.target as HTMLTextAreaElement).value,
            })
          "
          class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F49321] focus:border-transparent transition-all"
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
  customer_note: string;
}

defineProps<{
  modelValue: FormData;
  errors: Record<string, string>;
}>();

defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();
</script>
