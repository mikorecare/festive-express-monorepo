<template>
  <div v-if="result" class="mt-6 border-t border-gray-200 pt-6">
    <p class="text-xs text-gray-400 mb-4">
      <i class="fas fa-info-circle mr-1"></i>
      This is a computer-generated preview at how your home could glow with our
      Christmas lights. It's meant to give you a good sense of the overall
      effect, not a perfect, pixel-for-pixel match.
    </p>

    <!-- Desktop: Image left 4/5, Info right 1/5 -->
    <div class="flex flex-col md:flex-row gap-6 mb-4">
      <!-- Image - 4/5 on desktop -->
      <div class="md:w-4/5">
        <img
          class="w-full rounded-lg"
          :src="result.imageUrl"
          alt="Your home with permanent lighting"
        />
      </div>

      <!-- Info - 1/5 on desktop -->
      <div class="md:w-1/5 space-y-1">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Estimated footage</p>
          <p class="text-xl font-bold text-navy">
            {{
              result.stats?.packageTotalFeet || result.stats?.frontFeet || "—"
            }}
            ft
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">
            {{ result.stats?.packageName || "Package" }}
          </p>
          <p class="text-xl font-bold text-navy">
            {{ getPackagePrice(result.stats?.package) }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Extra footage</p>
          <p class="text-xl font-bold text-navy">
            {{
              result.stats?.packageOverageFt &&
              result.stats.packageOverageFt > 0
                ? "+" + Math.round(result.stats.packageOverageFt) + " ft"
                : "0 ft"
            }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Extra to add</p>
          <p class="text-xl font-bold text-navy">
            {{
              result.stats?.overagePrice && result.stats.overagePrice > 0
                ? formatMoney(result.stats.overagePrice)
                : "$0"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Price per linear foot info -->
    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Price per linear foot</span>
        <span class="text-lg font-bold text-navy"
          >${{ result.stats?.pricePerFoot || 10 }}</span
        >
      </div>
      <p class="text-xs text-gray-400 mt-1">
        Your home is over {{ result.stats?.packageIncludedFt || 175 }} ft —
        extra footage is priced per linear foot.
      </p>
    </div>

    <!-- Offer Section -->
    <div
      v-if="showOffer"
      class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
    >
      <h4 class="text-sm font-semibold text-amber-800 mb-1">
        Your home needs a bit more than
        {{ result.stats?.packageIncludedFt || 175 }} ft
      </h4>
      <p class="text-sm text-amber-700">
        The {{ result.stats?.packageName || "Jolly" }} package covers up to 175
        ft. Add {{ Math.round(result.stats?.packageOverageFt || 0) }} extra ft
        at ${{ result.stats?.pricePerFoot || 10 }}/ft =
        {{ formatMoney(result.stats?.overagePrice || 0) }}.
      </p>
    </div>

    <div class="space-y-3">
      <button
        class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="bookConsultation"
        :disabled="booking || isBooked"
      >
        <i v-if="booking" class="fas fa-spinner fa-spin mr-2"></i>
        {{
          isBooked
            ? "✓ Request sent"
            : booking
              ? "Sending..."
              : "Order your early bird package →"
        }}
      </button>
      <button
        class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        @click="reset"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Try another look
      </button>
    </div>

    <p class="text-xs text-gray-400 text-center mt-3">
      Estimate for {{ result.address || "your home" }}.
    </p>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-check text-green-500 text-2xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-navy mb-2">Email Sent</h3>
        <p class="text-sm text-gray-600">
          We sent your preview and estimate to your inbox. Taking you to your
          package next…
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useEstimator } from "~/composables/useEstimator";

const router = useRouter();

const {
  result,
  showOffer,
  booking,
  resultNote,
  formatMoney,
  bookConsultation: originalBookConsultation,
  reset,
  packageOptions,
  selectedPackage,
} = useEstimator();

const isBooked = ref(false);
const showSuccessModal = ref(false);
let redirectTimer: NodeJS.Timeout | null = null;

const getPackagePrice = (packageId?: string | null) => {
  if (!packageId) return formatMoney(0);
  const pkg = packageOptions.find((p) => p.id === packageId);
  return pkg ? formatMoney(pkg.price) : formatMoney(0);
};

const bookConsultation = async () => {
  if (isBooked.value) return;
  await originalBookConsultation();
  if (
    resultNote.value ===
    "Thanks — we received your design and contact info. We'll be in touch."
  ) {
    isBooked.value = true;
    showSuccessModal.value = true;

    redirectTimer = setTimeout(() => {
      const packageId =
        result.value?.stats?.package || selectedPackage.value || "joy";
      router.push(`/packages?package=${packageId}`);
    }, 3000);
  }
};

import { onUnmounted } from "vue";
onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});
</script>
