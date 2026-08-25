<template>
  <div class="bg-white rounded-2xl p-6 shadow-md sticky top-24">
    <h3 class="text-lg font-bold text-navy mb-4">Order Summary</h3>

    <div
      v-for="item in cartItems"
      :key="item.id"
      class="flex justify-between py-2 border-b border-gray-100"
    >
      <div>
        <strong class="text-sm">{{ item.product?.name }}</strong>
        <small
          v-if="item.options?.c9_color"
          class="block text-gray-500 text-xs"
        >
          {{ item.options.c9_color }} LEDs
        </small>
      </div>
      <span class="text-orange-500 font-bold text-sm">
        ${{ (Number(item.price || 0) * item.quantity).toFixed(2) }}
      </span>
    </div>

    <hr class="my-3" />

    <div class="flex justify-between text-sm py-1">
      <span class="text-gray-600">Subtotal</span>
      <span class="font-bold">${{ cartTotal.toFixed(2) }}</span>
    </div>
    <div v-if="alacarteCartTotal > 0" class="flex justify-between text-sm py-1">
      <span class="text-gray-600">A la carte</span>
      <span class="font-bold">${{ alacarteCartTotal.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between text-sm py-1">
      <span class="text-gray-600">Estimated Taxes</span>
      <span class="font-bold">${{ estimatedTax.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between text-sm py-1" v-if="appliedPromo">
      <span class="text-gray-600">Discount ({{ appliedPromo.code }})</span>
      <span class="font-bold text-green-600"
        >−${{ discountAmount(cartTotal).toFixed(2) }}</span
      >
    </div>

    <div class="mt-3">
      <div class="flex gap-2">
        <input
          v-model="promoCode"
          type="text"
          placeholder="Enter promo code"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :disabled="!!appliedPromo"
          @keyup.enter="handleApplyPromo"
        />
        <button
          v-if="!appliedPromo"
          type="button"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!promoCode || isChecking"
          @click="handleApplyPromo"
        >
          {{ isChecking ? "Checking..." : "Apply" }}
        </button>
        <button
          v-else
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
          @click="handleRemovePromo"
        >
          Remove
        </button>
      </div>
      <p v-if="promoError" class="text-red-500 text-xs mt-1">
        {{ promoError }}
      </p>
      <p v-else-if="appliedPromo" class="text-green-600 text-xs mt-1">
        {{ appliedPromo.code }} applied!
        <span v-if="appliedPromo.discount_type === 'percent'">
          {{ appliedPromo.discount_value }}% off
        </span>
        <span v-else> -${{ appliedPromo.discount_value }} off </span>
      </p>
    </div>

    <div
      class="flex justify-between items-center mt-3 pt-3 border-t-2 border-navy"
    >
      <span class="text-lg font-bold text-navy">Grand Total</span>
      <span class="text-2xl font-bold text-orange-500"
        >${{ grandTotal.toFixed(2) }}</span
      >
    </div>

    <p class="text-[10px] text-gray-400 mt-2 leading-relaxed">
      Promotional discounts are applied before taxes and fees. Offer valid on
      new installations only. Cannot be combined with other offers. Terms and
      conditions apply.
    </p>

    <div class="mt-4">
      <label
        class="block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition"
      >
        <input
          type="radio"
          :checked="paymentMethod === 'converge'"
          @change="$emit('update:paymentMethod', 'converge')"
          class="mr-2"
        />
        Credit / Debit Card (Converge Pay)
      </label>
    </div>

    <button
      class="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      :disabled="isPaying || !isFormValid"
      @click="handlePay"
    >
      {{ isPaying ? "Processing..." : "Confirm & Pay" }}
    </button>

    <slot name="turnstile"></slot>

    <ul class="space-y-2 mt-4">
      <li class="flex items-center text-sm text-gray-600">
        <CheckCircleIcon
          class="w-5 h-5 text-green-500 mr-2 inline-block"
          aria-hidden="true"
        />
        SSL Secure Connection
      </li>
      <li class="flex items-center text-sm text-gray-600">
        <CheckCircleIcon
          class="w-5 h-5 text-green-500 mr-2 inline-block"
          aria-hidden="true"
        />
        CLIPA Certified Installers
      </li>
      <li class="flex items-center text-sm text-gray-600">
        <CheckCircleIcon
          class="w-5 h-5 text-green-500 mr-2 inline-block"
          aria-hidden="true"
        />
        Guaranteed Maintenance
      </li>
    </ul>

    <div
      class="bg-navy text-white rounded-xl p-4 mt-4 flex justify-between items-center"
    >
      <div>
        <strong class="block">Early Bird Special</strong>
        <p class="text-sm opacity-100">
          Schedule an installation before October 31st, get 15% off.
        </p>
      </div>
      <!-- <i class="fas fa-home text-2xl opacity-80"></i> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

const { settings, loadSettings } = useSettings();
const {
  promoCode,
  promoError,
  appliedPromo,
  isChecking,
  discountAmount,
  applyPromo,
  removePromo,
  loadPromo,
} = usePromo();

const FL_TAX_RATE = computed(() => {
  const raw =
    settings.value?.fl_tax_rate ?? (settings.value as any)?.["fl_tax_rate"];
  const n = Number(raw);
  if (!Number.isNaN(n) && n >= 0) return n;
  return 0.07;
});

const props = defineProps<{
  cartItems: any[];
  cartTotal: number;
  alacarteCartTotal: number;
  estimatedTax: number;
  grandTotal: number;
  paymentMethod: string;
  isPaying: boolean;
  isFormValid: boolean;
}>();

const emit = defineEmits<{
  (e: "update:paymentMethod", value: string): void;
  (e: "pay", promoCodeId?: string): void;
}>();

const handleApplyPromo = async () => {
  await applyPromo(props.cartTotal);
};

const handleRemovePromo = () => {
  removePromo();
};

const handlePay = () => {
  emit("pay", appliedPromo.value?.id);
};

const estimatedTax = computed(() => {
  const subtotal = Number(props.cartTotal) || 0;
  const discount = discountAmount(subtotal);
  return Math.max(0, subtotal - discount) * FL_TAX_RATE.value;
});

const grandTotal = computed(() => {
  const subtotal = Number(props.cartTotal) || 0;
  const discount = discountAmount(subtotal);
  return Math.max(0, subtotal + estimatedTax.value - discount);
});

onMounted(() => {
  loadSettings();
  loadPromo();
});
</script>
