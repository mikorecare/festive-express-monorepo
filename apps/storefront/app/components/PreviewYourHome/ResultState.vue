<template>
  <div v-if="result">
    <p class="text-sm text-gray-700 mb-4">
      <i class="fas fa-info-circle mr-1"></i>
      This is a computer-generated preview at how your home could glow with our
      Christmas lights. It's meant to give you a good sense of the overall
      effect, not a perfect, pixel-for-pixel match.
    </p>

    <!-- Success message -->
    <div v-if="isBooked" class="message-success animate-fadeIn">
      <div class="success-card">
        <div class="success-icon-wrapper">
          <svg
            class="success-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 class="success-title">You're all set!</h3>

        <p class="success-message">
          We've sent your preview to your inbox.
          <br class="hidden sm:block" />
          We'll get back to you in a
          <strong
            class="text-[#F49321] font-extrabold text-lg tracking-wide [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            Festive Express
          </strong>
        </p>

        <div class="success-divider"></div>

        <div class="success-timer">
          <svg
            class="timer-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
            />
            <polyline
              points="12 6 12 12 16 14"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <span
            >Redirecting to your package in
            <strong>{{ countdown }}</strong></span
          >
        </div>

        <div class="success-progress">
          <div
            class="success-progress-bar"
            :style="{ width: `${((3 - countdown) / 3) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Preview card (hidden when booked) -->
    <div v-else class="relative">
      <div
        class="result-card bg-white rounded-xl shadow-lg p-3 md:p-6 space-y-2 md:space-y-4"
      >
        <!-- Desktop: Image left 4/5, Info right 1/5 -->
        <div class="flex flex-col md:flex-row gap-2 md:gap-4">
          <div
            class="relative md:w-4/5 rounded-xl border !border-brand-orange border-2 md:border-4 overflow-hidden max-h-max"
          >
            <div class="w-full" style="padding-bottom: 96.5%">
              <img
                class="absolute top-0 left-0 w-full h-full rounded-lg object-cover object-top"
                :src="result.imageUrl"
                alt="Your home with holiday lighting"
              />
            </div>
            <img
              :src="getPackageTitle()"
              class="absolute bottom-1 left-1 max-h-[20px] md:max-h-[85px] w-auto object-contain"
            />
            <NuxtImg
              v-if="earlyBirdIconUrl && isEarlyBirdLive"
              :src="earlyBirdIconUrl"
              alt="Early Bird Special"
              class="h-[12px] md:h-[28px] w-auto absolute bottom-2 right-1 md:bottom-4 md:right-2"
              loading="lazy"
            />
          </div>

          <div class="md:w-1/5 space-y-1">
            <div class="bg-gray-50 rounded-lg p-1.5 md:p-3">
              <p class="text-[8px] md:text-xs text-gray-500">
                Estimated footage
              </p>
              <p class="text-xs md:text-xl font-bold text-navy">
                {{ Math.round(getTotalFeet(result.stats)) || "—" }} ft
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-1.5 md:p-3">
              <p class="text-[8px] md:text-xs text-gray-500">Package Price</p>
              <p class="text-xs md:text-xl font-bold text-brand-orange">
                {{ getPackagePrice() }}
              </p>
            </div>
            <div
              v-if="calculatedOverageFt > 0"
              class="bg-gray-50 rounded-lg p-1.5 md:p-3"
            >
              <p class="text-[8px] md:text-xs text-gray-500">Extra footage</p>
              <p class="text-xs md:text-xl font-bold text-navy text-orange-600">
                +{{ Math.round(calculatedOverageFt) }} ft
              </p>
            </div>
            <div
              v-if="calculatedOveragePrice"
              class="bg-gray-50 rounded-lg p-1.5 md:p-3"
            >
              <p class="text-[8px] md:text-xs text-gray-500">Extra to add</p>
              <p class="text-xs md:text-xl font-bold text-navy text-orange-600">
                {{ formatMoney(calculatedOveragePrice) }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="calculatedOverageFt > 0"
          class="bg-gray-50 rounded-lg p-1.5 md:p-4"
        >
          <div class="flex items-center justify-between">
            <span class="text-[8px] md:text-sm text-gray-700"
              >Price per linear foot</span
            >
            <span class="text-xs md:text-lg font-bold text-navy"
              >${{ OVERAGE_RATE }}</span
            >
          </div>
          <p class="text-[7px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Your home is over {{ PACKAGE_TOTAL_FT }} ft — extra footage is
            priced per linear foot.
          </p>
        </div>

        <div
          v-if="showOffer"
          class="bg-amber-50 border border-amber-200 rounded-lg p-1.5 md:p-4"
        >
          <h4
            class="text-[8px] md:text-sm font-semibold text-amber-800 mb-0.5 md:mb-1"
          >
            Your home needs a bit more than {{ PACKAGE_TOTAL_FT }} ft
          </h4>
          <p class="text-[7px] md:text-sm text-amber-700">
            The {{ getPackageName() || "Jolly" }} package covers up to
            {{ PACKAGE_TOTAL_FT }} ft. Add
            {{ Math.round(calculatedOverageFt) }} extra ft at ${{
              OVERAGE_RATE
            }}/ft = {{ formatMoney(calculatedOveragePrice || 0) }}.
          </p>
        </div>

        <div
          v-else-if="isWithinPackage && result.stats"
          class="bg-green-50 border border-green-200 rounded-lg p-1.5 md:p-4"
        >
          <h4
            class="text-[8px] md:text-sm font-semibold text-green-800 mb-0.5 md:mb-1"
          >
            ✓ Your home is covered by the package
          </h4>
          <p class="text-[7px] md:text-sm text-green-700">
            Your home needs {{ Math.round(getTotalFeet(result.stats)) }} ft
            total, which is within the {{ PACKAGE_TOTAL_FT }} ft package limit.
          </p>
        </div>

        <!-- Turnstile Widget -->
        <div
          v-if="!isPreview && !isBooked"
          class="scale-75 md:scale-100 origin-top"
        >
          <TurnstileWidget
            ref="turnstileRef"
            :site-key="siteKey"
            :errors="turnstileErrors"
            :status="turnstileStatus"
            :status-type="turnstileStatusType"
            :status-class="turnstileStatusClass"
            :status-icon="turnstileStatusIcon"
            @success="onTurnstileSuccess"
            @error="onTurnstileError"
            @expired="onTurnstileExpired"
          />
        </div>

        <template v-if="!isPreview">
          <div class="space-y-1.5 md:space-y-3">
            <button
              class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-1.5 md:py-3 px-3 md:px-4 rounded-lg transition-colors text-[10px] md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleBookConsultation"
              :disabled="booking || isBooked || !turnstileVerified"
            >
              <i v-if="booking" class="fas fa-spinner fa-spin mr-1 md:mr-2"></i>
              {{
                isBooked
                  ? "✓ Request sent"
                  : booking
                    ? "Sending..."
                    : "Order your early bird package →"
              }}
            </button>
            <button
              class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 md:py-3 px-3 md:px-4 rounded-lg transition-colors text-[10px] md:text-base"
              @click="reset"
              :disabled="booking"
            >
              <i class="fas fa-arrow-left mr-1 md:mr-2"></i>
              Try another look
            </button>
          </div>
        </template>

        <template v-else>
          <div class="space-y-1.5 md:space-y-3">
            <button
              class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 md:py-3 px-3 md:px-4 rounded-lg transition-colors text-[10px] md:text-base"
              @click="reset"
            >
              <i class="fas fa-arrow-left mr-1 md:mr-2"></i>
              Try another look
            </button>
          </div>
        </template>

        <p class="text-[7px] md:text-xs text-gray-400 text-center">
          Estimate for {{ result.address || "your home" }}.
        </p>
      </div>

      <!-- Loading overlay while sending -->
      <Transition name="fade">
        <div
          v-if="booking"
          class="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/85 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center gap-3 text-center px-4">
            <div class="loading-spinner"></div>
            <p class="text-sm md:text-base font-semibold text-navy">
              Sending your preview...
            </p>
            <p class="text-[11px] md:text-sm text-gray-500">
              Hang tight — this only takes a moment.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEstimator } from "~/composables/useEstimator";
import TurnstileWidget from "../Checkout/TurnstileWidget.vue";
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

const { loadEarlyBird, earlyBirdIconUrl, isEarlyBirdLive } =
  useEarlyBirdSpecial();

const countdown = ref(3);
let countdownInterval: NodeJS.Timeout | null = null;

const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null);
const turnstileToken = ref<string>("");
const turnstileVerified = ref(false);
const turnstileStatus = ref("");
const turnstileStatusType = ref("");
const turnstileErrors = ref({ turnstile: "" });
const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const turnstileStatusClass = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-gray-500";
  }
});

const turnstileStatusIcon = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "fas fa-check-circle";
    case "error":
      return "fas fa-exclamation-circle";
    case "warning":
      return "fas fa-exclamation-triangle";
    default:
      return "fas fa-info-circle";
  }
});

const onTurnstileSuccess = (token: string) => {
  turnstileToken.value = token;
  turnstileVerified.value = true;
  turnstileStatus.value = "Verification successful!";
  turnstileStatusType.value = "success";
  turnstileErrors.value.turnstile = "";
};

const onTurnstileError = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  turnstileErrors.value.turnstile = "Please complete the security verification";
};

const onTurnstileExpired = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  turnstileErrors.value.turnstile = "Verification expired. Please try again.";

  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
};

const isBooked = ref(false);

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

const getPackageTitle = () => {
  const pkg = packageOptions.value.find(
    (p: IPackageOption) => p.id === selectedPackage.value,
  );
  return pkg?.title || "Jolly";
};

const goToPackage = () => {
  const packageId = selectedPackage.value || "joy";
  router.push(`/packages?package=${packageId}`);
};

const startCountdown = () => {
  countdown.value = 5;
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      goToPackage();
    }
  }, 1000);
};

const handleBookConsultation = async () => {
  if (isBooked.value || booking.value) return;

  await originalBookConsultation(turnstileToken.value);

  if (
    resultNote.value ===
    "Thanks — we received your design and contact info. We'll be in touch."
  ) {
    isBooked.value = true;
    startCountdown();
  }
};

onMounted(() => {
  loadEarlyBird();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
});
</script>

<style scoped>
/* ---- Result card ---- */
.result-card {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  z-index: 10;
}

@media (max-width: 640px) {
  .result-card {
    padding: 0.5rem !important;
  }
}

/* ---- Loading spinner ---- */
.loading-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(28, 45, 91, 0.15);
  border-top-color: #f49321;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@media (max-width: 640px) {
  .loading-spinner {
    width: 44px;
    height: 44px;
    border-width: 3px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ---- Fade transition for overlay ---- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- Success card ---- */
.message-success {
  position: relative;
  width: 100%;
  text-align: center;
  z-index: 50;
  padding: 0 1rem;
}

.success-card {
  max-width: 480px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.15);
  position: relative;
  overflow: hidden;
}

.success-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #34d399, #10b981);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.success-icon-wrapper {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon {
  width: 36px;
  height: 36px;
  color: #059669;
  stroke-width: 3;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.success-divider {
  width: 60px;
  height: 2px;
  margin: 0 auto 1.25rem;
  background: linear-gradient(90deg, transparent, #f49321, transparent);
  border-radius: 2px;
}

.success-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.timer-icon {
  width: 18px;
  height: 18px;
  color: #f49321;
  animation: spin 2s linear infinite;
}

.success-timer strong {
  color: #065f46;
  font-size: 1.125rem;
}

.success-progress {
  width: 100%;
  height: 4px;
  margin-top: 0.75rem;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.success-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f49321, #fbbf24);
  border-radius: 4px;
  transition: width 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

@media (max-width: 640px) {
  .success-card {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }

  .success-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .success-icon {
    width: 28px;
    height: 28px;
  }

  .success-title {
    font-size: 1.25rem;
  }

  .success-message {
    font-size: 0.875rem;
  }

  .success-timer {
    font-size: 0.75rem;
  }

  .success-timer strong {
    font-size: 1rem;
  }
}

@media (max-width: 380px) {
  .success-card {
    padding: 1rem 0.75rem;
  }

  .success-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .success-icon {
    width: 22px;
    height: 22px;
  }

  .success-title {
    font-size: 1rem;
  }

  .success-message {
    font-size: 0.75rem;
  }
}
</style>
