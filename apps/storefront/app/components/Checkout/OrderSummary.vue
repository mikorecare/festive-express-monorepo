<template>
  <div class="bg-white rounded-2xl shadow-md h-full">
    <div class="relative mb-2 mt-6">
      <div
        class="bg-[#1C2D5B] btn-gloss pl-20 pr-4 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl"
      >
        <i class="fas fa-credit-card mr-3 text-[#F49321]"></i>
        <h3 class="block text-lg font-bold text-white mb-1">
          Payment &amp; Order Summary
        </h3>
      </div>

      <span
        class="absolute left-4 -top-2 sm:-top-4 lg:-top-5 z-10 shrink-0 w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border border-navy bg-[#F49321] text-[#1C2D5B] font-black text-xl lg:text-2xl flex items-center justify-center shadow-[0_4px_10px_rgba(244,147,33,0.4)] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
        aria-hidden="true"
      >
        5
      </span>
    </div>

    <!-- Card + billing fields (provided by checkout.vue) -->
    <div class="mt-4 px-3">
      <slot name="payment"></slot>
    </div>

    <div
      v-for="item in cartItems"
      :key="item.id"
      class="flex justify-between py-2 border-b border-gray-100 px-6"
    >
      <div class="pr-2">
        <strong class="text-sm">{{ item.product?.name }} </strong>

        <small
          v-if="item.options?.c9_color"
          class="block text-gray-500 text-xs"
        >
          {{ item.options.c9_color }} LEDs
        </small>

        <!-- ADDRESS DETAIL -->
        <small
          v-if="item.options?.address"
          class="block text-gray-500 text-xs leading-tight mt-1 max-w-[200px]"
        >
          {{ item.options.address }}
        </small>

        <!-- ADD-ONS BREAKDOWN -->
        <div v-if="item.options?.addons?.length" class="mt-1">
          <small class="block text-gray-500 text-xs font-semibold"
            >Add-ons:</small
          >
          <ul class="text-xs text-gray-500">
            <li
              v-for="addon in item.options.addons"
              :key="addon.product_id"
              class="flex justify-between mt-0.5"
            >
              <span>{{ addon.quantity }}x {{ addon.name }}</span>
              <span v-if="Number(addon.price) > 0" class="ml-2"
                >${{ (Number(addon.price) * addon.quantity).toFixed(2) }}</span
              >
            </li>
          </ul>
        </div>

        <!-- OVERAGE BREAKDOWN -->
        <small
          v-if="Number(item.options?.overage?.amount || 0) > 0"
          class="block text-gray-500 text-xs mt-1"
        >
          + {{ item.options.overage.feet }} ft overage (${{
            Number(item.options.overage.amount).toFixed(2)
          }})
        </small>
      </div>

      <!-- Styled Item Price -->
      <span
        class="text-orange-500 font-bold text-sm inline-flex items-baseline shrink-0"
      >
        <span
          class="text-[0.9rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            Number(item.price || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <hr class="my-3" />

    <div class="flex justify-between text-sm py-1 px-6">
      <span class="text-gray-600">Subtotal</span>
      <span class="font-bold inline-flex items-baseline">
        <span
          class="text-[0.9rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            cartTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <div
      v-if="alacarteCartTotal > 0"
      class="flex justify-between text-sm py-1 px-6"
    >
      <span class="text-gray-600">A la carte</span>
      <span class="font-bold inline-flex items-baseline">
        <span
          class="text-[0.9rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            alacarteCartTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <div class="flex justify-between text-sm py-1 px-6" v-if="appliedPromo">
      <span class="text-gray-600">Discount ({{ appliedPromo.code }})</span>
      <span class="font-bold text-green-600 inline-flex items-baseline">
        <span class="mr-0.5">−</span>
        <span
          class="text-[0.9rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            discountAmount(cartTotal).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <!-- Customer Sales Tax Toggle -->
    <div class="flex items-center justify-between text-sm py-1.5 px-6">
      <div class="pr-2">
        <label
          for="customer-sales-tax-toggle"
          class="text-gray-700 font-medium cursor-pointer block"
        >
          Include Sales Tax
        </label>
        <span class="text-[11px] text-gray-500">
          {{ salesTaxEnabled ? "Applied to taxable total" : "Not charged" }}
        </span>
      </div>

      <button
        id="customer-sales-tax-toggle"
        type="button"
        role="switch"
        :aria-checked="salesTaxEnabled"
        @click="$emit('update:salesTaxEnabled', !salesTaxEnabled)"
        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
        :class="salesTaxEnabled ? 'bg-[#F49321]' : 'bg-gray-300'"
      >
        <span
          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
          :class="salesTaxEnabled ? 'translate-x-4' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Estimated Taxes Row -->
    <div
      v-if="salesTaxEnabled || estimatedTax > 0"
      class="flex justify-between text-sm py-1 px-6"
    >
      <span class="text-gray-600">Estimated Taxes</span>
      <span class="font-bold inline-flex items-baseline">
        <span
          class="text-[0.9rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            estimatedTax.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <div class="mt-3 px-6">
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
        <span v-if="appliedPromo.discount_type === 'percent'">
          {{ appliedPromo.discount_value }}% off
        </span>
        <span v-else> ${{ appliedPromo.discount_value }} off </span>
      </p>
    </div>

    <div
      class="flex justify-between items-center mt-3 pt-3 border-t-2 border-navy px-6"
    >
      <span class="text-lg font-bold text-navy">Grand Total</span>

      <!-- Styled Grand Total -->
      <span
        class="text-2xl font-bold text-orange-500 inline-flex items-baseline"
      >
        <span
          class="text-[1.2rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 translate-y-[-0.1em]"
        >
          $&nbsp;
        </span>
        <span class="font-extrabold leading-none price-text -tracking-[0.04em]">
          {{
            grandTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </span>
    </div>

    <div class="mt-4 px-6">
      <label
        class="block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition"
      >
        <input
          type="radio"
          :checked="paymentMethod === 'converge'"
          @change="$emit('update:paymentMethod', 'converge')"
          class="mr-2"
        />
        Credit / Debit Card
      </label>
    </div>

    <div class="pb-3 flex w-full">
      <button
        class="btn-3d-glossy btn-3d-glossy-orange w-full max-w-xl mx-auto min-h-[56px] mt-4 text-lg font-extrabold uppercase tracking-wide"
        :disabled="isPaying || !isFormValid"
        @click="handlePay"
      >
        <span class="relative z-10">
          {{ isPaying ? "Processing..." : "Confirm & Pay" }}
        </span>
      </button>
    </div>

    <slot name="turnstile"></slot>

    <!-- <ul class="space-y-2 mt-4 px-6">
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
    </ul> -->

    <!-- Legal Disclaimer & Terms Trigger -->
    <p
      class="text-[12px] sm:text-[10px] text-gray-700 mt-4 leading-relaxed text-center px-6 pb-2"
    >
      By submitting this order, you agree to our
      <button
        type="button"
        @click="showTerms = true"
        class="text-[#F49321] hover:text-[#e07e0e] underline font-bold transition-colors"
      >
        Terms and Conditions
      </button>
      and consent to be contacted. Promotional discounts are applied before
      taxes and fees. Offer valid on new installations only. Cannot be combined
      with other offers.
    </p>

    <div v-if="isEarlyBirdLive" class="bg-navy text-white rounded-xl p-4 mt-4">
      <strong class="block">{{ earlyBirdTitle }}</strong>
      <p class="text-sm opacity-90 mb-0">
        {{ earlyBirdDescription }}
        <template v-if="formatEndsLabel"> Ends {{ formatEndsLabel }}.</template>
      </p>
      <p
        v-if="countdown && countdown !== 'Ended'"
        class="mb-0 mt-1 text-sm font-semibold text-brand-orange"
      >
        {{ countdown }}
      </p>
    </div>
  </div>

  <!-- Terms & Conditions Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showTerms"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        @click.self="showTerms = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center bg-navy justify-between px-6 py-3 border-b border-gray-200 shrink-0"
          >
            <h2 id="terms-modal-title" class="text-xl font-bold text-white">
              {{ termsData?.title || "Terms and Conditions" }}
            </h2>
            <button
              type="button"
              @click="showTerms = false"
              class="text-gray-400 hover:text-gray-700 transition-colors p-1"
              aria-label="Close"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div
            class="overflow-y-auto px-6 py-5 text-sm text-gray-600 leading-relaxed space-y-4"
          >
            <div v-if="termsPending" class="text-center py-10">
              <div
                class="w-8 h-8 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin mx-auto mb-3"
              ></div>
              <p>Loading terms...</p>
            </div>

            <div v-else-if="termsError" class="text-center text-red-500 py-10">
              Failed to load terms. Please try again later.
            </div>

            <div
              v-else
              class="prose prose-sm max-w-none prose-headings:text-[#1C2D5B] prose-headings:font-bold prose-h2:border-b-2 prose-h2:border-[#F49321] prose-h2:pb-2 prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-[#F49321] prose-a:no-underline hover:prose-a:text-[#1C2D5B] prose-strong:text-[#1C2D5B] prose-li:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-[#F49321] prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:text-slate-600 prose-blockquote:italic"
              v-html="termsData?.description"
            />

            <p
              v-if="!termsPending && !termsError && !termsData?.description"
              class="text-center text-gray-500 py-10"
            >
              Terms and conditions content is currently unavailable.
            </p>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 shrink-0 flex justify-end"
          >
            <button
              type="button"
              @click="showTerms = false"
              class="px-6 btn-3d-glossy btn-3d-glossy-orange py-2 text-white text-sm font-bold rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

const props = defineProps<{
  selectedPrice: number;
  cartItems: any[];
  cartTotal: number;
  alacarteCartTotal: number;
  salesTaxEnabled: boolean;
  estimatedTax: number;
  grandTotal: number;
  paymentMethod: string;
  isPaying: boolean;
  isFormValid: boolean;
}>();

const emit = defineEmits<{
  (e: "update:salesTaxEnabled", value: boolean): void;
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

// NOTE: estimatedTax and grandTotal are handled by the props passed from checkout.vue.

const {
  loadEarlyBird,
  isEarlyBirdLive,
  earlyBirdTitle,
  earlyBirdDescription,
  formatEndsLabel,
  earlyBirdExpiresAt,
} = useEarlyBirdSpecial();

const countdown = ref("");

const tickCountdown = () => {
  if (!earlyBirdExpiresAt.value) {
    countdown.value = "";
    return;
  }
  const end = new Date(earlyBirdExpiresAt.value).getTime();
  const diff = end - Date.now();
  if (diff <= 0) {
    countdown.value = "Ended";
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.value = `${d}d ${h}h ${m}m ${s}s`;
};

let timer: ReturnType<typeof setInterval> | null = null;

const showTerms = ref(false);

const {
  data: termsResponse,
  pending: termsPending,
  error: termsError,
} = await useFetch<any>("/api/terms-of-use", {
  lazy: true,
  server: false,
});

const termsData = computed(() => termsResponse.value?.data || null);

onMounted(() => {
  loadSettings();
  loadPromo();
  loadEarlyBird();
  tickCountdown();
  timer = setInterval(tickCountdown, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-to {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
