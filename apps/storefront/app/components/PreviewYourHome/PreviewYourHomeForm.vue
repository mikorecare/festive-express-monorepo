<!-- components/EstimatorForm.vue -->
<template>
  <div class="space-y-4 lg:space-y-5">
    <!-- Address -->
    <div>
      <label
        class="block text-[15px] lg:text-[16px] font-semibold text-gray-700 mb-1.5"
      >
        Property address *
      </label>
      <div class="relative">
        <input
          v-model="address"
          autocomplete="off"
          placeholder="Start typing your street address"
          class="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px] form-input"
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
            class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            @click="selectAddress(s)"
          >
            <div class="text-[15px] font-medium text-gray-800">
              {{ s.main }}
            </div>
            <div class="text-xs text-gray-500">{{ s.secondary }}</div>
          </div>
        </div>
        <p v-if="errors.address" class="text-red-500 text-xs mt-1">
          {{ errors.address }}
        </p>
      </div>
    </div>

    <!-- Photo Upload -->
    <div>
      <label
        class="block text-[15px] lg:text-[16px] font-semibold text-gray-700 mb-1.5"
      >
        Photo of your home
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        class="hidden"
        @change="handleFileUpload"
      />
      <button
        type="button"
        class="w-full px-3 py-2.5 lg:px-4 lg:py-3 border-2 border-dashed border-gray-300 rounded-[14px] hover:border-brand-orange hover:bg-orange-50 transition-colors text-[15px] lg:text-[16px] text-gray-600 flex items-center justify-between gap-2"
        @click="fileInput?.click()"
      >
        <span class="truncate text-left">{{
          imagePreview ? "Change photo" : "Upload a photo (optional)"
        }}</span>
        <svg
          width="26"
          height="26"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="flex-shrink-0"
        >
          <rect width="34" height="34" fill="url(#pattern0_367_3)" />
          <defs>
            <pattern
              id="pattern0_367_3"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlink:href="#image0_367_3" transform="scale(0.0111111)" />
            </pattern>
            <image
              id="image0_367_3"
              width="90"
              height="90"
              preserveAspectRatio="none"
              xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFLUlEQVR4nO2cTWhdVRDHj4laxYX4rSimeTOJoQs3rhQhKIpxUazInfMSC0WQWkQ3oiaustJWQYqiRQRxoW6yEoRAKRKbO/NqbLRYqi3UhUhVqKLgd/3Ik7kvqWle3lfMu3PvzfnDQMgj4T+/N2/uuefMfc4FBQUFBQUFBQUFBQUFBQUFBQUFBQXlVX3R3LXg+T708hx4PoCej4LnU+j5NyD+E0l+QM8ngWQ/EL80EMmo/o2171yoFM1fCsQPA8ksel5AL9XOgz8C4seHts1dYZ1P5rQlqlwOJC9ota4Nbn0A8S/gee9AVLnebXQND8+cP+D5KfTy43oBXg04Ej99y875C9xG1OYx6UPP3C3AdcC9HOn3s4NuIwkp3trNKm4C+6dSuXK/2wgqkZSTVUPKkJfF3xjxLldkIclDSaJ2kJdX905XRJXKcid4+csa8PLKBpJtrmgXPvByOgNwV1b1z4OjMuQKoclqD3ies4baEDbxJ4VY+mHEu6xhtlHZT7qsSd99IL6jdicnMZB8kdyFJXdicgI8fwDEe8DLbaXtcjV4/t4aZDstZOjBg9e5LOjm7fsvAc9PoOdv20+Az1hDbDtIXrRm7KBcGekEMOYw9BNptxGlFzLi3WvfSZNcBfj4MQPK1fOAZJ918pgqaJ5LHTOSPGudOKYevKAX8PQgR5XhjdIusL6qfSqQb4gqF+sRkXXCaAd6byqgkeRR62TRMkimU7oA8ufmyXrL4JNdxwwR32qfqJiG3sl2HTR6GbdOFM1Byx/dB03yrlVy6GVc5zI09OfF31lU9Jnu0J2s9gxQ5S4gfs9iSQe6H0Lx1pW2gOQeJPndprL10LgSuWiqd10Y6w6bTgDZJCNJJZd8fG8jf/qaVWUvAj+q1601A94SHbsQiV9B4n+yCjkzsGuMXlZmrhPdOBZfhiQzdlUiDdtFI9m2kbPAZXB05sq2DOs2oPU6Gdqs5MxVdgJbjun4WsuTESR+P0+VnMXKTgYwR6Y3NTO5L4+VnMXKBs+vrm4uim+33I2D/1nJ2atsXtAVW93EpvaWvFdy5iqb+NNz1tlI/IDdOy8a462AreW1JDcvE5a5nTPpZL2U62vyuMNSC2j4eouW018+dI0paM8HEiM3+UObrU9KhhrMSyz/6Dep2KatR/+3ZW7KVsfdlqY3q8Yx0QxyK9DNYAPFz1jnV4riHfrRfNPaCNSGaCa0+hYrcGLlRawV6CXY9f/HfkAHPL+hRuetjWAb0Q7ozAbJYW0dX5kb8UUHzV+69XycLICWBsG/1pZH5kak0KCTo688jMxi/kGf1hOUI9ZGsOCgdcHhgPidDBipFhk0eHkrN1NHLsegB6jyiK46wPoWHAsNmhd0m2PJbMXekBQUtMTLzFbGMmCoWkTQEMX0n9toqleflrI2hQUDDV4+qxuwwXJ8t7UxLBhofeS6kenXrc1hQUDrQXfzSX6Sw9YmMeeggeTDvh0zFzUEnRiPZq/KYr92OQENxMfbnlZS2PpNWtamMWegtZKVnetE2kbA82vW5jEnoLUnt2wXzbQ4F33cOhGXUdC6hGu4uuhY0VSvfgtibfja5nbdZQp0wiBOnjecrPa4bmgwOtivmyTg5W30/LHuZ6dxeOCMQGtuQPKdbnVqzpr72b2LIgo7fAOC1qgAOiVhAJ2OMIBORxhApyMMoNMRBtDpCAPodIQBdDrCADodYQCdjjCATkdA8s0qGz6nrH0VTuDl+TrQxLutfRVOODK9SWEDyde14D0df22Dof4FIt3t8oYupXsAAAAASUVORK5CYII="
            />
          </defs>
        </svg>
      </button>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Your uploaded home"
        class="w-max mx-auto rounded-[14px] mt-2 max-h-40 object-contain"
        style="border: 1px solid #b2b2b2"
      />
    </div>

    <!-- Package + Color: compact popup triggers -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
      <!-- Package trigger -->
      <div class="min-w-0">
        <label
          class="block text-[15px] lg:text-[16px] font-semibold text-gray-700 mb-1.5"
        >
          Your package
        </label>
        <button
          type="button"
          class="w-full min-w-0 px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] bg-[#f8f9fa] hover:border-brand-orange transition-colors text-[15px] lg:text-[16px] flex items-center justify-between gap-2 text-left"
          @click="showPackageModal = true"
        >
          <span class="flex items-baseline gap-2 min-w-0 flex-1">
            <span class="font-bold text-[#F7931E] truncate">
              {{ selectedPackageData?.name || "Select" }}
            </span>
            <span
              v-if="selectedPackageData"
              class="text-[13px] text-gray-500 truncate shrink-0"
            >
              ${{ selectedPackageData.price.toLocaleString() }}
            </span>
          </span>
          <i class="fas fa-chevron-down text-gray-400 shrink-0 text-xs"></i>
        </button>
      </div>

      <!-- Color trigger -->
      <div class="min-w-0">
        <label
          class="block text-[15px] lg:text-[16px] font-semibold text-gray-700 mb-1.5"
        >
          Light color
        </label>
        <button
          type="button"
          class="w-full min-w-0 px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] bg-[#f8f9fa] hover:border-brand-orange transition-colors text-[15px] lg:text-[16px] flex items-center justify-between gap-2 text-left"
          @click="showColorModal = true"
        >
          <span class="flex items-center gap-2 min-w-0 flex-1">
            <span
              class="color-dot w-5 h-5 rounded-full shrink-0"
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
            <span class="font-semibold text-[#1C2F5B] truncate">
              {{ selectedColorData?.label || "Select color" }}
            </span>
          </span>
          <i class="fas fa-chevron-down text-gray-400 shrink-0 text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label
          class="block text-[15px] lg:text-[16px] font-semibold !text-[#1C2F5B] mb-1.5"
        >
          Your name *
        </label>
        <input
          v-model="name"
          autocomplete="name"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px] form-input"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <label
          class="block text-[15px] lg:text-[16px] font-semibold !text-[#1C2F5B] mb-1.5"
        >
          Email *
        </label>
        <input
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px] form-input"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div>
      <label
        class="block text-[15px] lg:text-[16px] font-semibold !text-[#1C2F5B] mb-1.5"
      >
        Mobile
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        v-model="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px] form-input"
      />
    </div>

    <!-- Turnstile -->
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

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-[14px] text-[14px]"
    >
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
    </div>

    <!-- Submit Buttons -->
    <div class="space-y-2">
      <button
        class="w-full bg-brand-orange text-[16px] lg:text-[18px] tracking-wide text-white font-semibold py-3 px-4 rounded-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        @click="submitRender(false)"
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
        class="w-full border border-gray-300 hover:bg-gray-50 text-[15px] lg:text-[16px] text-gray-700 font-semibold py-2.5 px-4 rounded-[14px] transition-colors"
        @click="submitRender(true)"
        :disabled="isLoading || !turnstileVerified"
      >
        <i class="fas fa-search mr-2"></i>
        Check address only (no lights)
      </button>
    </div>

    <p class="text-[11px] text-gray-400 text-center">
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
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          @click.self="showPackageModal = false"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10"
            >
              <h3 class="text-[16px] lg:text-[17px] font-bold text-[#1C2F5B]">
                Select your package
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-700 text-lg leading-none p-1"
                @click="showPackageModal = false"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="p-4">
              <div
                v-if="loadingPackages"
                class="text-center py-6 text-gray-500 text-sm"
              >
                Loading packages...
              </div>
              <div v-else class="grid grid-cols-3 gap-2.5">
                <button
                  v-for="pkg in packageOptions"
                  :key="pkg.id"
                  type="button"
                  class="px-1.5 pt-2 pb-2.5 border-2 rounded-[14px] transition-all flex flex-col items-center relative bg-[#1C2F5B] overflow-visible text-center min-w-0"
                  :class="
                    selectedPackage === pkg.id
                      ? '!border-[#F7931E] !border-4'
                      : 'border-gray-600 hover:border-gray-400'
                  "
                  @click="
                    selectedPackage = pkg.id;
                    showPackageModal = false;
                  "
                >
                  <img
                    v-if="pkg.title"
                    :src="pkg.title"
                    :alt="pkg.name"
                    class="h-auto max-h-[42px] w-auto object-contain"
                    @error="
                      (e) => {
                        const img = e.target as HTMLImageElement;
                        if (img) img.style.display = 'none';
                      }
                    "
                  />
                  <span
                    v-else
                    class="font-bold text-[16px] font-poppins leading-none text-white truncate max-w-full"
                  >
                    {{ pkg.name }}
                  </span>

                  <span
                    v-if="pkg.previousPrice && pkg.previousPrice !== pkg.price"
                    class="text-[9px] font-poppins font-semibold text-white mt-1.5 leading-none"
                  >
                    was
                    <span class="line-through decoration-[#F39124]"
                      >${{ pkg.previousPrice.toLocaleString() }}</span
                    >
                  </span>

                  <div
                    class="flex items-end mt-0.5 gap-0.5 font-semibold justify-center"
                  >
                    <span
                      v-if="
                        pkg.previousPrice && pkg.previousPrice !== pkg.price
                      "
                      class="text-[9px] font-poppins text-white self-start leading-none"
                    >
                      now
                    </span>
                    <span
                      class="text-[#F7931E] font-bold text-[16px] leading-none"
                    >
                      ${{ pkg.price.toLocaleString() }}
                    </span>
                  </div>
                  <span
                    class="text-white font-normal text-[8px] leading-none mt-0.5"
                  >
                    /season
                  </span>

                  <NuxtImg
                    v-if="earlyBirdIconUrl && isEarlyBirdLive"
                    :src="earlyBirdIconUrl"
                    alt="Early Bird Special"
                    class="h-[18px] w-auto mt-1"
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
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          @click.self="showColorModal = false"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10"
            >
              <h3 class="text-[16px] lg:text-[17px] font-bold text-[#1C2F5B]">
                Select C-9 Light Color
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-700 text-lg leading-none p-1"
                @click="showColorModal = false"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-3 gap-2.5">
                <button
                  v-for="color in colorOptions"
                  :key="color.scheme"
                  type="button"
                  class="px-1.5 py-2.5 border rounded-[12px] transition-all flex flex-col items-center gap-1.5 min-w-0"
                  :class="
                    selectedScheme === color.scheme
                      ? '!border-[#F7931E] border-4 bg-orange-50 text-brand-orange'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  "
                  @click="
                    selectedScheme = color.scheme;
                    showColorModal = false;
                  "
                >
                  <span
                    class="color-dot w-9 h-9 rounded-full inline-block flex-shrink-0"
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
                    class="text-[11px] text-[#1C2F5B] leading-tight text-center truncate max-w-full"
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
  useEarlyBirdSpecial();

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
  border-radius: 14px;
  border: 2px solid gray !important;
  height: 48px;
  background-color: #f8f9fa;
}

@media (min-width: 1024px) {
  .form-input {
    height: 52px;
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
