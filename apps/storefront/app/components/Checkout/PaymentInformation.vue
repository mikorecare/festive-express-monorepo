<template>
  <div class="bg-white rounded-2xl shadow-md">
    <div
      class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
    >
      <h3
        class="text-lg font-extrabold text-white flex items-center tracking-wide"
      >
        <i class="fas fa-credit-card mr-3 text-[#F49321]"></i> Payment & Contact
        Information
      </h3>
    </div>

    <div class="space-y-4 px-6 pb-6 pt-2">
      <!-- Contact Info Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >First Name *</label
          >
          <input
            :value="modelValue.billing_first_name"
            @input="
              updateField(
                'billing_first_name',
                ($event.target as HTMLInputElement).value,
              )
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
              updateField(
                'billing_last_name',
                ($event.target as HTMLInputElement).value,
              )
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
              updateField(
                'billing_email',
                ($event.target as HTMLInputElement).value,
              )
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
            >Billing Phone *</label
          >
          <input
            :value="modelValue.billing_phone"
            @input="
              updateField(
                'billing_phone',
                ($event.target as HTMLInputElement).value,
              )
            "
            @blur="$emit('validate', 'billing_phone')"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.billing_phone }"
            placeholder="(555) 123-4567"
            maxlength="14"
          />
          <p v-if="errors.billing_phone" class="text-red-500 text-sm mt-1">
            {{ errors.billing_phone }}
          </p>
        </div>
      </div>

      <!-- Cardholder Name -->
      <div class="border-t border-gray-200 pt-4 mt-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Cardholder Name *</label
        >
        <input
          :value="modelValue.card_name"
          @input="
            updateField('card_name', ($event.target as HTMLInputElement).value)
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

      <!-- Card Number -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Card Number *</label
        >
        <div class="flex">
          <span
            class="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-50 transition-colors duration-300"
            :style="{ borderColor: cardBorderColor }"
          >
            <i
              :class="cardIcon"
              class="text-xl w-7 h-5 flex items-center justify-center"
              :style="{ color: cardColor }"
            ></i>
          </span>
          <input
            :value="modelValue.card_number"
            @input="handleCardNumberInput"
            @blur="$emit('validate', 'card_number')"
            type="text"
            class="flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
            :style="{
              borderColor: errors.card_number ? '#EF4444' : cardBorderColor,
            }"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
          />
        </div>
        <div class="flex justify-between mt-1">
          <p v-if="errors.card_number" class="text-red-500 text-sm">
            {{ errors.card_number }}
          </p>
          <p
            v-else-if="cardType"
            class="text-sm font-semibold"
            :style="{ color: cardColor }"
          >
            {{ cardType }}
          </p>
          <p v-else class="text-sm text-gray-400">Enter card number</p>
          <span v-if="isValidCard" class="text-green-500 text-sm"
            ><i class="fas fa-check-circle"></i> Valid</span
          >
        </div>
      </div>

      <!-- Expiry & CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >Expiry Date *</label
          >
          <input
            :value="modelValue.card_expiry"
            @input="handleExpiryInput"
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
              updateField('card_cvv', ($event.target as HTMLInputElement).value)
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

      <!-- Billing Address Section -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-2"
          >Billing Address *</label
        >

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-4">
            <input
              :value="modelValue.billing_address"
              @input="
                updateField(
                  'billing_address',
                  ($event.target as HTMLInputElement).value,
                )
              "
              @blur="$emit('validate', 'billing_address')"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.billing_address }"
              placeholder="123 Main St"
            />
            <p v-if="errors.billing_address" class="text-red-500 text-sm mt-1">
              {{ errors.billing_address }}
            </p>
          </div>

          <div class="md:col-span-2">
            <input
              :value="modelValue.billing_city"
              @input="
                updateField(
                  'billing_city',
                  ($event.target as HTMLInputElement).value,
                )
              "
              @blur="$emit('validate', 'billing_city')"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.billing_city }"
              placeholder="City"
            />
            <p v-if="errors.billing_city" class="text-red-500 text-sm mt-1">
              {{ errors.billing_city }}
            </p>
          </div>

          <div>
            <input
              :value="modelValue.billing_state"
              @input="
                updateField(
                  'billing_state',
                  ($event.target as HTMLInputElement).value,
                )
              "
              @blur="$emit('validate', 'billing_state')"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.billing_state }"
              placeholder="FL"
              maxlength="2"
            />
            <p v-if="errors.billing_state" class="text-red-500 text-sm mt-1">
              {{ errors.billing_state }}
            </p>
          </div>

          <div>
            <input
              :value="modelValue.billing_postcode"
              @input="
                updateField(
                  'billing_postcode',
                  ($event.target as HTMLInputElement).value,
                )
              "
              @blur="$emit('validate', 'billing_postcode')"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.billing_postcode }"
              placeholder="ZIP"
              maxlength="5"
            />
            <p v-if="errors.billing_postcode" class="text-red-500 text-sm mt-1">
              {{ errors.billing_postcode }}
            </p>
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500 mt-2">
        <i class="fas fa-lock mr-1"></i> Your payment information is secure and
        encrypted.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface FormData {
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
}

const props = defineProps<{
  modelValue: FormData;
  errors: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();

// Card brand colors & icons
const cardBrandColors: Record<string, string> = {
  visa: "#1434CB",
  mastercard: "#252525",
  "american express": "#016FD0",
  discover: "#231F20",
  "diners club": "#0079BE",
  jcb: "#007940",
};

const cardIcons: Record<string, string> = {
  visa: "fab fa-cc-visa",
  mastercard: "fab fa-cc-mastercard",
  "american express": "fab fa-cc-amex",
  discover: "fab fa-cc-discover",
  "diners club": "fab fa-cc-diners-club",
  jcb: "fab fa-cc-jcb",
};

const cardType = computed(() => {
  const number = props.modelValue.card_number.replace(/\D/g, "");
  if (!number) return "";

  const targetPatterns = [
    { name: "Visa", regex: /^4/ },
    { name: "Mastercard", regex: /^(5[1-5]|2[2-7])/ },
    { name: "American Express", regex: /^3[47]/ },
    {
      name: "Discover",
      regex:
        /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]))/,
    },
    { name: "Diners Club", regex: /^3(0[0-5]|[689])/ },
    { name: "JCB", regex: /^(352[89]|35[3-8][0-9])/ },
  ];

  for (const card of targetPatterns) {
    if (card.regex.test(number)) return card.name;
  }
  return "";
});

const cardColor = computed(() => {
  const type = cardType.value.toLowerCase();
  return cardBrandColors[type] || "#6B7280";
});

const cardBorderColor = computed(() => {
  if (props.errors.card_number) return "#EF4444";
  const type = cardType.value.toLowerCase();
  return cardBrandColors[type] || "#D1D5DB";
});

const cardIcon = computed(() => {
  const type = cardType.value.toLowerCase();
  return cardIcons[type] || "fas fa-credit-card";
});

const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");
  if (!digits || digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

const isValidCard = computed(() => {
  const number = props.modelValue.card_number.replace(/\s/g, "");
  if (number.length < 13) return false;
  return validateLuhn(number);
});

const updateField = (field: keyof FormData, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

const handleCardNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  const maxLength = cardType.value === "American Express" ? 15 : 16;
  if (value.length > maxLength) value = value.slice(0, maxLength);

  let formatted = "";
  if (cardType.value === "American Express") {
    if (value.length > 0) formatted += value.slice(0, 4);
    if (value.length > 4) formatted += " " + value.slice(4, 10);
    if (value.length > 10) formatted += " " + value.slice(10, 15);
  } else {
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value.charAt(i);
    }
  }

  emit("update:modelValue", {
    ...props.modelValue,
    card_number: formatted,
  });
};

const handleExpiryInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");

  if (value.length > 4) value = value.slice(0, 4);

  if (value.length >= 2) {
    const month = parseInt(value.slice(0, 2));
    if (month > 12) value = "12" + value.slice(2);
    if (month < 1 && value.length >= 2) value = "01" + value.slice(2);
  }

  if (value.length >= 2) {
    const month = value.slice(0, 2);
    const year = value.slice(2);
    emit("update:modelValue", {
      ...props.modelValue,
      card_expiry: month + (year ? "/" + year : ""),
    });
  } else {
    emit("update:modelValue", {
      ...props.modelValue,
      card_expiry: value,
    });
  }
};
</script>
