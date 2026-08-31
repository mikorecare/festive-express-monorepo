<template>
  <div v-if="result" class="mt-6 border-t border-gray-200 pt-6">
    <p class="text-xs text-gray-400 mb-4">
      <i class="fas fa-info-circle mr-1"></i>
      This preview and footage estimate are not 100% accurate. Final design and
      measurement are confirmed on site.
    </p>

    <img
      class="w-full rounded-lg mb-4"
      :src="result.imageUrl"
      alt="Your home with permanent lighting"
    />

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div
        v-for="stat in statsCards"
        :key="stat.label"
        class="bg-gray-50 rounded-lg p-3 text-center"
      >
        <p class="text-xs text-gray-500">{{ stat.label }}</p>
        <p class="text-lg font-bold text-navy">{{ stat.value }}</p>
      </div>
    </div>

    <div
      v-if="showOffer"
      class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
    >
      <h4 class="text-sm font-semibold text-amber-800 mb-1">
        Your home needs a bit more
      </h4>
      <p class="text-sm text-amber-700">
        The package covers 175 ft. This home goes over, so we can add the extra
        footage.
        <span v-if="result.stats?.overagePrice">
          Add {{ Math.round(result.stats.packageOverageFt || 0) }} extra ft for
          {{ formatMoney(result.stats.overagePrice) }}.
        </span>
        <span v-else>
          Add {{ Math.round(result.stats?.packageOverageFt || 0) }} extra ft —
          we'll price it at your consultation.
        </span>
      </p>
    </div>

    <div class="space-y-3">
      <button
        class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="bookConsultation"
        :disabled="booking"
      >
        <i v-if="booking" class="fas fa-spinner fa-spin mr-2"></i>
        {{ booking ? "Sending..." : "Book free consultation →" }}
      </button>
      <button
        class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        @click="reset"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Try another look
      </button>
    </div>

    <p class="text-xs text-gray-400 text-center mt-3">{{ resultNote }}</p>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";

const {
  result,
  statsCards,
  showOffer,
  booking,
  resultNote,
  formatMoney,
  bookConsultation,
  reset,
} = useEstimator();
</script>
