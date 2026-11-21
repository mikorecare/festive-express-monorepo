<template>
  <div class="bg-white rounded-2xl shadow-md">
    <div class="relative mb-2 mt-6">
      <div
        class="bg-[#1C2D5B] btn-gloss pl-20 pr-4 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl"
      >
        <h3
          class="text-lg font-extrabold text-white flex items-center tracking-wide"
        >
          <i class="fas fa-user mr-3 text-[#F49321]"></i> Contact Information
        </h3>
      </div>

      <span
        class="absolute left-4 -top-2 sm:-top-4 lg:-top-5 z-10 shrink-0 w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border border-navy bg-[#F49321] text-[#1C2D5B] font-black text-xl lg:text-2xl flex items-center justify-center shadow-[0_4px_10px_rgba(244,147,33,0.4)] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
        aria-hidden="true"
      >
        4
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6 pt-2">
      <div v-for="f in fields" :key="f.key">
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          {{ f.label }} *
        </label>
        <input
          :value="modelValue[f.key]"
          @input="update(f.key, ($event.target as HTMLInputElement).value)"
          @blur="$emit('validate', f.key)"
          :type="f.type"
          :maxlength="f.maxlength"
          :placeholder="f.placeholder"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors[f.key] }"
        />
        <p v-if="errors[f.key]" class="text-red-500 text-sm mt-1">
          {{ errors[f.key] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: Record<string, any>;
  errors: Record<string, string>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "validate", field: string): void;
}>();

const fields = [
  {
    key: "billing_first_name",
    label: "First Name",
    type: "text",
    placeholder: "John",
  },
  {
    key: "billing_last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Doe",
  },
  {
    key: "billing_email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    key: "billing_phone",
    label: "Phone",
    type: "tel",
    placeholder: "(555) 123-4567",
    maxlength: 14,
  },
];

const update = (field: string, value: string) =>
  emit("update:modelValue", { ...props.modelValue, [field]: value });
</script>
