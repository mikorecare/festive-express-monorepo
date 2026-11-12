<template>
  <div class="space-y-3.5 lg:space-y-5">
    <!-- Address -->
    <div>
      <label
        for="estimator-address"
        class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-navy mb-1.5"
      >
        Property address *
      </label>
      <div class="relative">
        <input
          id="estimator-address"
          v-model="address"
          autocomplete="off"
          placeholder="Start typing your street address"
          class="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[16px] lg:text-[18px] form-input"
          :class="{ 'border-red-500': errors.address }"
          @input="debouncedSearch"
          @focus="suggestionsOpen = true"
        />
        <div
          v-if="suggestions.length && suggestionsOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[14px] shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="s in suggestions"
            :key="s.placeId"
            class="px-3.5 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            @click="selectAddress(s)"
          >
            <div class="text-[15px] sm:text-[16px] font-medium text-gray-800">
              {{ s.main }}
            </div>
            <div class="text-[13px] sm:text-[14px] text-gray-500">
              {{ s.secondary }}
            </div>
          </div>
        </div>
        <p
          v-if="errors.address"
          class="text-red-500 text-[13px] sm:text-sm mt-1"
        >
          {{ errors.address }}
        </p>
      </div>
    </div>

    <!-- Photo Upload -->
    <div>
      <label
        for="estimator-photo"
        class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-navy mb-1.5"
      >
        Photo of your home
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        id="estimator-photo"
        type="file"
        accept="image/*"
        ref="fileInput"
        class="hidden"
        @change="handleFileUpload"
      />
      <button
        type="button"
        class="w-full px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-[14px] text-[15px] sm:text-[16px] flex items-center gap-3"
        @click="fileInput?.click()"
      >
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Your uploaded home"
          class="h-9 w-12 rounded-md object-cover"
        />
        <span class="truncate text-left flex-1">{{
          imagePreview ? "Change photo" : "Add a photo (optional)"
        }}</span>
        <i
          class="fa-solid fa-upload text-[20px] sm:text-[22px] text-[#1C2D5B]"
          aria-hidden="true"
        ></i>
      </button>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Your uploaded home"
        class="w-max mx-auto rounded-[14px] mt-2 max-h-40 object-contain border border-gray-300"
      />
    </div>

    <!-- Package + Color: compact popup triggers -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
      <!-- Package trigger -->
      <div class="min-w-0">
        <span
          id="estimator-package-label"
          class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-navy mb-1.5"
        >
          Your package
        </span>
        <button
          type="button"
          aria-labelledby="estimator-package-label"
          class="w-full min-w-0 px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] bg-[#f8f9fa] hover:border-brand-orange transition-colors text-[15px] sm:text-[16px] lg:text-[18px] flex items-center justify-between gap-2 text-left"
          @click="showPackageModal = true"
        >
          <span class="flex items-baseline gap-2 min-w-0 flex-1">
            <span class="font-bold text-[#F7931E] truncate">
              {{ selectedPackageData?.name || "Select" }}
            </span>
            <span
              v-if="selectedPackageData"
              class="text-[13px] sm:text-[14px] text-black font-bold truncate shrink-0"
            >
              ${{ selectedPackageData.previousPrice.toLocaleString() }}
            </span>
          </span>
          <i class="fas fa-chevron-down text-gray-400 shrink-0 text-sm"></i>
        </button>
      </div>

      <!-- Color trigger -->
      <div class="min-w-0">
        <span
          id="estimator-color-label"
          class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-navy mb-1.5"
        >
          Light color
        </span>
        <button
          type="button"
          aria-labelledby="estimator-color-label"
          class="w-full min-w-0 px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] bg-[#f8f9fa] hover:border-brand-orange transition-colors text-[15px] sm:text-[16px] lg:text-[18px] flex items-center justify-between gap-2 text-left"
          @click="showColorModal = true"
        >
          <span class="flex items-center gap-2 min-w-0 flex-1">
            <span
              class="color-dot w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0"
              :class="{
                'border-2 border-gray-300':
                  selectedColorData?.scheme !== 'candy-cane' &&
                  selectedColorData?.scheme !== 'multicolor',
                'candy-dot': selectedColorData?.scheme === 'candy-cane',
                'multi-dot': selectedColorData?.scheme === 'multicolor',
              }"
              :style="
                selectedColorData?.sw
                  ? `background:${selectedColorData.sw}`
                  : ''
              "
            ></span>
            <span class="font-bold text-[12px] text-black truncate">
              {{ selectedColorData?.label || "Select color" }}
            </span>
          </span>
          <i class="fas fa-chevron-down text-gray-400 shrink-0 text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label
          for="estimator-name"
          class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold !text-[#1C2F5B] mb-1.5"
        >
          Your name *
        </label>
        <input
          id="estimator-name"
          v-model="name"
          autocomplete="name"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[16px] lg:text-[18px] form-input"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-[13px] sm:text-sm mt-1">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <label
          for="estimator-email"
          class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold !text-[#1C2F5B] mb-1.5"
        >
          Email *
        </label>
        <input
          id="estimator-email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[16px] lg:text-[18px] form-input"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-[13px] sm:text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div>
      <label
        for="estimator-phone"
        class="block text-[15px] sm:text-[16px] lg:text-[18px] font-semibold !text-[#1C2F5B] mb-1.5"
      >
        Mobile
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        id="estimator-phone"
        v-model="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[16px] lg:text-[18px] form-input"
      />
    </div>

    <!-- Turnstile -->
    <div class="origin-center scale-[0.8] -mb-3 h-[52px]">
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

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-[14px] text-[14px] sm:text-[15px]"
      role="alert"
      aria-live="polite"
    >
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
    </div>

    <!-- Submit Buttons -->
    <div class="space-y-2 pt-1">
      <button
        class="w-full btn-gloss bg-brand-orange text-[16px] sm:text-[17px] lg:text-[20px] tracking-wide text-white font-semibold py-3.5 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        @click="
          async () => {
            if (isLoading || !turnstileVerified) return;
            await submitRender(false);
            $fbq('track', 'Lead', {
              content_name: 'Light up my home',
              content_category: 'render_request',
            });
          }
        "
        :disabled="isLoading || !turnstileVerified"
      >
        <span
          class="absolute inset-0 bg-[#1c2d5b] w-0 group-hover:w-full transition-all duration-500 ease-in-out origin-left"
        ></span>

        <span class="relative z-10 flex items-center justify-center gap-2">
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          {{ isLoading ? "Lighting up..." : "Light up my home →" }}
        </span>
      </button>

      <button
        class="w-full border border-gray-300 hover:bg-gray-50 text-[15px] sm:text-[16px] lg:text-[18px] text-navy font-semibold py-3 px-4 rounded-[14px] transition-colors"
        @click="
          async () => {
            if (isLoading || !turnstileVerified) return;
            await submitRender(true);
            $fbq('track', 'Lead', {
              content_name: 'Address-only check',
              content_category: 'render_request',
            });
          }
        "
        :disabled="isLoading || !turnstileVerified"
      >
        <i class="fas fa-search mr-2"></i>
        Check address only (no lights)
      </button>
    </div>

    <p class="text-[12px] sm:text-[13px] text-gray-400 text-center">
      <i class="fas fa-shield-alt mr-1"></i>
      We only use your info to send your preview.
    </p>

    <!-- ============================ -->
    <!-- PACKAGE MODAL                -->
    <!-- ============================ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showPackageModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="package-modal-heading"
          @click.self="showPackageModal = false"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden"
          >
            <div
              class="sticky btn-gloss bg-[#1C2F5B] top-0 border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10"
            >
              <h3
                id="package-modal-heading"
                class="tracking-wide text-[17px] sm:text-[18px] lg:text-[20px] font-bold text-brand-orange"
              >
                Select your package
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-navy text-xl leading-none p-1"
                @click="showPackageModal = false"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="p-3.5 sm:p-4">
              <div
                v-if="loadingPackages"
                class="text-center py-6 text-gray-500 text-sm"
              >
                Loading packages...
              </div>
              <div v-else class="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  v-for="pkg in packageOptions"
                  :key="pkg.id"
                  type="button"
                  class="px-1.5 btn-gloss pt-2 pb-2.5 border-2 rounded-[14px] transition-all flex flex-col items-center relative bg-[#1C2F5B] overflow-visible text-center min-w-0"
                  :class="
                    selectedPackage === pkg.id
                      ? '!border-[#F7931E] !border-4'
                      : 'border-gray-600 hover:border-gray-400'
                  "
                  :aria-pressed="selectedPackage === pkg.id"
                  @click="
                    selectedPackage = pkg.id;
                    showPackageModal = false;
                  "
                >
                  <img
                    v-if="pkg.title"
                    :src="pkg.title"
                    :alt="pkg.name"
                    class="h-auto max-h-[38px] sm:max-h-[42px] w-auto object-contain z-[99999999]"
                    @error="
                      (e) => {
                        const img = e.target as HTMLImageElement;
                        if (img) img.style.display = 'none';
                      }
                    "
                  />
                  <span
                    v-else
                    class="font-bold text-[16px] sm:text-[18px] font-poppins leading-none text-white truncate max-w-full"
                  >
                    {{ pkg.name }}
                  </span>

                  <div
                    class="flex items-end mt-0.5 gap-0.5 font-semibold justify-center"
                  >
                    <span
                      class="text-[#F7931E] font-bold text-xl sm:text-2xl leading-none"
                    >
                      ${{ pkg.previousPrice.toLocaleString() }}
                    </span>
                  </div>
                  <span
                    class="text-white font-normal text-[13px] sm:text-base leading-none mt-0.5"
                  >
                    Per Season
                  </span>

                  <NuxtImg
                    v-if="earlyBirdIconUrl && isEarlyBirdLive"
                    :src="earlyBirdIconUrl"
                    alt="Early Bird Special"
                    class="h-[16px] sm:h-[18px] w-auto mt-1"
                    loading="lazy"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================ -->
    <!-- COLOR MODAL                  -->
    <!-- ============================ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showColorModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="color-modal-heading"
          @click.self="showColorModal = false"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10"
            >
              <h3
                id="color-modal-heading"
                class="text-[17px] sm:text-[18px] lg:text-[20px] font-bold text-[#1C2F5B]"
              >
                Select C-9 Light Color
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-navy text-xl leading-none p-1"
                @click="showColorModal = false"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="p-3.5 sm:p-4">
              <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  v-for="color in colorOptions"
                  :key="color.scheme"
                  type="button"
                  class="px-1.5 py-2.5 border rounded-[12px] transition-all flex flex-col items-center gap-1.5 min-w-0"
                  :class="
                    selectedScheme === color.scheme
                      ? '!border-[#F7931E] border-4 bg-orange-50 text-brand-orange'
                      : 'border-gray-300 hover:border-gray-400 text-navy'
                  "
                  :aria-pressed="selectedScheme === color.scheme"
                  :aria-label="color.label"
                  @click="
                    selectedScheme = color.scheme;
                    showColorModal = false;
                  "
                >
                  <span
                    class="color-dot w-10 h-10 sm:w-11 sm:h-11 rounded-full inline-block flex-shrink-0"
                    :class="{
                      'border-2 border-gray-300':
                        color.scheme !== 'candy-cane' &&
                        color.scheme !== 'multicolor',
                      'candy-dot': color.scheme === 'candy-cane',
                      'multi-dot': color.scheme === 'multicolor',
                    }"
                    :style="color.sw ? `background:${color.sw}` : ''"
                  ></span>
                  <span
                    class="text-[12px] sm:text-[13px] text-[#1C2F5B] leading-tight text-center truncate max-w-full"
                    :class="
                      selectedScheme === color.scheme ? 'font-semibold' : ''
                    "
                  >
                    {{ color.label }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";
import TurnstileWidget from "../Checkout/TurnstileWidget.vue";

const {
  fileInput,
  imagePreview,
  address,
  suggestions,
  suggestionsOpen,
  pricePerFoot,
  selectedScheme,
  selectedPackage,
  packageOptions,
  multiColors,
  name,
  email,
  phone,
  error,
  errors,
  isLoading,
  colorOptions,
  multiColorPreview,
  handleFileUpload,
  debouncedSearch,
  selectAddress,
  updateMultiColor,
  submitRender: originalSubmitRender,
  fetchPackages,
  loadingPackages,
} = useEstimator();

const { loadEarlyBird, earlyBirdIconUrl, isEarlyBirdLive } =
  await useEarlyBirdSpecial();

const showPackageModal = ref(false);
const showColorModal = ref(false);

const selectedPackageData = computed(() =>
  packageOptions.value.find((p: any) => p.id === selectedPackage.value),
);
const selectedColorData = computed(() =>
  colorOptions.find((c: any) => c.scheme === selectedScheme.value),
);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    showPackageModal.value = false;
    showColorModal.value = false;
  }
};

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
  error.value = "";
};

const onTurnstileError = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  turnstileErrors.value.turnstile = "Please complete the security verification";
  error.value = "Security verification failed. Please try again.";
};

const onTurnstileExpired = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  turnstileErrors.value.turnstile = "Verification expired. Please try again.";
  error.value = "Security verification expired. Please try again.";

  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
};

const resetTurnstile = () => {
  if (!turnstileVerified.value) {
    if (turnstileRef.value) {
      turnstileRef.value.reset();
    }
  }
  turnstileStatus.value = "";
  turnstileStatusType.value = "";
  turnstileErrors.value.turnstile = "";
};

const submitRender = async (previewOnly: boolean) => {
  if (!turnstileVerified.value || !turnstileToken.value) {
    error.value = "Please complete the security verification first.";
    return;
  }

  await originalSubmitRender(previewOnly, turnstileToken.value);
};

defineExpose({
  resetTurnstile,
});

onMounted(() => {
  fetchPackages();
  loadEarlyBird();
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.form-input {
  border-radius: 12px;
  border: 1px solid #9ca3af !important;
  height: 46px;
  font-size: 16px; /* keeps iOS Safari from zooming in on focus */
  background-color: #f8f9fa;
}

@media (min-width: 1024px) {
  .form-input {
    height: 56px;
    font-size: 18px;
    border: 2px solid gray !important;
    border-radius: 14px;
  }
}

.form-input:focus {
  border-color: #f7931e !important;
  outline: none;
  box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.2);
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.color-dot.candy-dot {
  background-image: repeating-linear-gradient(
    45deg,
    rgb(255, 255, 255) 0px,
    rgb(255, 255, 255) 4px,
    rgb(225, 29, 72) 4px,
    rgb(225, 29, 72) 8px
  );
}

.color-dot.multi-dot {
  border-color: transparent;
  background-image: conic-gradient(
    rgb(239, 68, 68),
    rgb(234, 179, 8),
    rgb(34, 197, 94),
    rgb(59, 130, 246),
    rgb(168, 85, 247),
    rgb(239, 68, 68)
  );

  border-radius: 50% !important;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
