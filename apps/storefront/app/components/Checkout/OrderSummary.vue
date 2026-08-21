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
        <!-- <small class="block text-gray-500 text-xs"
          >Professional Installation</small
        > -->
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
      <span class="font-bold"
        >−${{ discountAmount(cartTotal).toFixed(2) }}</span
      >
    </div>

    <div
      class="flex justify-between items-center mt-3 pt-3 border-t-2 border-navy"
    >
      <span class="text-lg font-bold text-navy">Grand Total</span>
      <span class="text-2xl font-bold text-orange-500"
        >${{ grandTotal.toFixed(2) }}</span
      >
    </div>

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
      @click="$emit('pay')"
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
        <!-- <i class="fas fa-check-circle text-green-500 mr-2"></i> SSL Secure
        Connection -->
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
        <p class="text-sm opacity-90">
          Schedule an installation before Oct. 31st, get a free 24" Sequoia Fir
          Wreath and 12” nylon bow
        </p>
      </div>
      <i class="fas fa-home text-2xl opacity-80"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

const { settings, loadSettings, telHref } = useSettings();
const FL_TAX_RATE = computed(() => {
  // Object / map shape: { fl_tax_rate: '0.07', contact_email: '...', ... }
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

defineEmits<{
  (e: "update:paymentMethod", value: string): void;
  (e: "pay"): void;
}>();

const {
  promoCode,
  promoError,
  appliedPromo,
  discountAmount,
  applyPromo,
  removePromo,
  loadPromo,
} = usePromo();

const subtotal = computed(() => Number(props.cartTotal) || 0);

const estimatedTax = computed(
  () => Math.max(0, subtotal.value - promoDiscount.value) * FL_TAX_RATE.value,
);

const promoDiscount = computed(() => discountAmount(subtotal.value));

const grandTotal = computed(() =>
  Math.max(0, subtotal.value + estimatedTax.value - promoDiscount.value),
);

onMounted(() => {
  loadSettings();
});
</script>
