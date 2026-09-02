<template>
  <div v-if="result" class="mt-6 border-t border-gray-200 pt-6">
    <p class="text-sm text-gray-700 mb-4">
      <i class="fas fa-info-circle mr-1"></i>
      This is a computer-generated preview at how your home could glow with our
      Christmas lights. It's meant to give you a good sense of the overall
      effect, not a perfect, pixel-for-pixel match.
    </p>

    <!-- Desktop: Image left 4/5, Info right 1/5 -->
    <div class="flex flex-col md:flex-row gap-6 mb-4">
      <div class="md:w-4/5">
        <img
          class="w-full rounded-lg"
          :src="result.imageUrl"
          alt="Your home with holiday lighting"
        />
      </div>

      <div class="md:w-1/5 space-y-1">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Estimated footage</p>
          <p class="text-xl font-bold text-navy">
            {{ Math.round(getTotalFeet(result.stats)) || "—" }} ft
          </p>
        </div>

        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">
            {{ getPackageName() || "Package" }}
          </p>
          <p class="text-xl font-bold text-navy">{{ getPackagePrice() }}</p>
        </div>

        <div v-if="calculatedOverageFt > 0" class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Extra footage</p>
          <p class="text-xl font-bold text-navy text-orange-600">
            +{{ Math.round(calculatedOverageFt) }} ft
          </p>
        </div>

        <div v-if="calculatedOveragePrice" class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Extra to add</p>
          <p class="text-xl font-bold text-navy text-orange-600">
            {{ formatMoney(calculatedOveragePrice) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="calculatedOverageFt > 0" class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700">Price per linear foot</span>
        <span class="text-lg font-bold text-navy">${{ OVERAGE_RATE }}</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Your home is over {{ PACKAGE_TOTAL_FT }} ft — extra footage is priced
        per linear foot.
      </p>
    </div>

    <div
      v-if="showOffer"
      class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
    >
      <h4 class="text-sm font-semibold text-amber-800 mb-1">
        Your home needs a bit more than {{ PACKAGE_TOTAL_FT }} ft
      </h4>
      <p class="text-sm text-amber-700">
        The {{ getPackageName() || "Jolly" }} package covers up to
        {{ PACKAGE_TOTAL_FT }} ft. Add
        {{ Math.round(calculatedOverageFt) }} extra ft at ${{ OVERAGE_RATE }}/ft
        = {{ formatMoney(calculatedOveragePrice || 0) }}.
      </p>
    </div>

    <div
      v-else-if="isWithinPackage && result.stats"
      class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
    >
      <h4 class="text-sm font-semibold text-green-800 mb-1">
        ✓ Your home is covered by the package
      </h4>
      <p class="text-sm text-green-700">
        Your home needs {{ Math.round(getTotalFeet(result.stats)) }} ft total,
        which is within the {{ PACKAGE_TOTAL_FT }} ft package limit.
      </p>
    </div>

    <template v-if="!isPreview">
      <div class="space-y-3">
        <button
          class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleBookConsultation"
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
    </template>

    <template v-else>
      <div class="space-y-3">
        <button
          class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          @click="reset"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Try another look
        </button>
      </div>
    </template>

    <p class="text-xs text-gray-400 text-center mt-3">
      Estimate for {{ result.address || "your home" }}.
    </p>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-check text-green-500 text-2xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-navy mb-2">Email Sent!</h3>
        <p class="text-sm text-gray-600">
          We sent your preview and estimate to your inbox. Taking you to your
          package next…
        </p>
        <button
          class="mt-4 bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          @click="goToPackage"
        >
          Continue to package →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useEstimator } from "~/composables/useEstimator";
import type { IPackageOption } from "~/components/PreviewYourHome/types";

const router = useRouter();

const {
  isPreview,
  result,
  showOffer,
  booking,
  resultNote,
  formatMoney,
  bookConsultation: originalBookConsultation,
  reset,
  packageOptions,
  selectedPackage,
  calculatedOverageFt,
  calculatedOveragePrice,
  totalEstimate,
  isWithinPackage,
  getTotalFeet,
  getRooflineFeet,
  getGroundFeet,
  PACKAGE_TOTAL_FT,
  MAX_ROOFLINE_FT,
  MAX_GROUND_FT,
  OVERAGE_RATE,
} = useEstimator();

const isBooked = ref(false);
const showSuccessModal = ref(false);
let redirectTimer: NodeJS.Timeout | null = null;

const getPackageName = () => {
  const pkg = packageOptions.value.find(
    (p: IPackageOption) => p.id === selectedPackage.value,
  );
  return pkg?.name || "Jolly";
};

const getPackagePrice = () => {
  const pkg = packageOptions.value.find(
    (p: IPackageOption) => p.id === selectedPackage.value,
  );
  return pkg ? formatMoney(pkg.price) : formatMoney(1999);
};

const handleBookConsultation = async () => {
  if (isBooked.value) return;
  await originalBookConsultation();
  if (
    resultNote.value ===
    "Thanks — we received your design and contact info. We'll be in touch."
  ) {
    isBooked.value = true;
    showSuccessModal.value = true;

    redirectTimer = setTimeout(() => {
      goToPackage();
    }, 3000);
  }
};

const goToPackage = () => {
  const packageId = selectedPackage.value || "joy";
  router.push(`/packages?package=${packageId}`);
};

const closeModal = () => {
  showSuccessModal.value = false;
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
};

onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});
</script>
