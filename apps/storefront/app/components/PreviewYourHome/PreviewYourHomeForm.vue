<!-- components/EstimatorForm.vue -->
<template>
  <div class="space-y-8">
    <!-- Address - Now Required -->
    <div>
      <label class="block !text-md font-semibold text-gray-700 mb-2 form-label">
        Property address *
      </label>
      <div class="relative">
        <input
          v-model="address"
          autocomplete="off"
          placeholder="Start typing your street address"
          class="w-full px-4 py-4 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-md form-input"
          :class="{ 'border-red-500': errors.address }"
          @input="debouncedSearch"
          @focus="suggestionsOpen = true"
        />
        <div
          v-if="suggestions.length && suggestionsOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[16px] shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="s in suggestions"
            :key="s.placeId"
            class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            @click="selectAddress(s)"
          >
            <div class="!text-md font-medium text-gray-800">
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

    <!-- Photo Upload - Now Optional -->
    <div>
      <label class="block !text-md font-semibold text-gray-700 mb-2 form-label">
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
        class="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-[16px] hover:border-brand-orange hover:bg-orange-50 transition-colors !text-md text-gray-600 flex items-center justify-between"
        @click="fileInput?.click()"
      >
        <span>{{
          imagePreview
            ? "Change photo"
            : "Upload a photo of your home (optional)"
        }}</span>

        <!-- SVG Icon on the right -->
        <div
          data-svg-wrapper
          data-layer="Upload to Cloud"
          class="UploadToCloud flex-shrink-0"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
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
        </div>
      </button>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Your uploaded home"
        class="w-max mx-auto rounded-[16px] mt-3 max-h-64 object-contain"
        style="border: 1px solid #b2b2b2"
      />
      <p class="text-xs text-gray-400 mt-3">
        <i class="fas fa-info-circle mr-1"></i>
        Front-of-house daytime photo works best. Straight-on, whole roofline
        visible. <span class="text-gray-500">(Optional)</span>
      </p>
    </div>

    <!-- Price per foot (commented out) -->
    <!-- <div>
      <label class="block !text-md font-semibold text-gray-700 mb-2 form-label">
        Price per linear foot
      </label>
      <div class="relative">
        <span
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold"
          >$</span
        >
        <input
          v-model.number="pricePerFoot"
          type="number"
          min="1"
          step="1"
          inputmode="decimal"
          placeholder="10"
          class="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-md form-input"
        />
      </div>
    </div> -->

    <!-- Package Options -->
    <div>
      <label class="block !text-md font-semibold text-gray-700 mb-4 form-label">
        Select your package
      </label>

      <!-- Loading State -->
      <div v-if="loadingPackages" class="text-center py-4 text-gray-500">
        Loading packages...
      </div>

      <!-- Package Options -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          v-for="pkg in packageOptions"
          :key="pkg.id"
          type="button"
          class="px-3 pt-0 border-2 pb-2 rounded-[16px] min-h-[167px] !text-md transition-all flex flex-col items-center relative bg-[#1C2F5B] overflow-visible"
          :class="
            selectedPackage === pkg.id
              ? '!border-[#F7931E] border-4'
              : 'border-gray-600 hover:border-gray-400'
          "
          @click="selectedPackage = pkg.id"
        >
          <!-- Package Title Image -->
          <img
            v-if="pkg.title"
            :src="pkg.title"
            :alt="pkg.name"
            class="h-auto max-h-[80px] w-auto object-contain -mt-3"
            @error="
              (e) => {
                const img = e.target as HTMLImageElement;
                if (img) img.style.display = 'none';
              }
            "
          />
          <span
            v-else
            class="font-bold text-[40px] font-poppins leading-none text-white -mt-2"
          >
            {{ pkg.name }}
          </span>

          <span
            v-if="pkg.previousPrice && pkg.previousPrice !== pkg.price"
            class="text-[14px] font-poppins font-semibold text-white mt-3"
          >
            was
            <span class="line-through decoration-[#F39124]"
              >${{ pkg.previousPrice.toLocaleString() }}</span
            >
          </span>

          <!-- Current Price with "now" aligned to top of price -->
          <div class="flex items-end mt-0.5 gap-1 font-semibold">
            <!-- "now" - aligned to top of price -->
            <span
              v-if="pkg.previousPrice && pkg.previousPrice !== pkg.price"
              class="text-[14px] font-poppins text-white self-start"
            >
              now
            </span>
            <!-- Price -->
            <span class="text-[#F7931E] font-bold text-[32px] leading-none">
              ${{ pkg.price.toLocaleString() }}
            </span>
            <!-- "/ season" - aligned to baseline of price -->
            <span class="text-white font-normal text-[12px] self-end">
              /season
            </span>
          </div>

          <!-- Early Bird Ribbon - inside the card, below price -->
          <img
            src="/Images/earlybird2.png"
            alt="Early Bird Special"
            class="h-[28px] w-auto mt-2"
          />
        </button>
      </div>
    </div>

    <!-- Color Options -->
    <div class="pt-4">
      <label class="block !text-md font-semibold text-gray-700 mb-2 form-label">
        Select C-9 Light Color
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          v-for="color in colorOptions"
          :key="color.scheme"
          type="button"
          class="px-3 py-4 border rounded-[16px] !text-md transition-all flex flex-col items-center gap-2"
          :class="
            selectedScheme === color.scheme
              ? '!border-[#F7931E] bg-orange-50 text-brand-orange'
              : 'border-gray-300 hover:border-gray-400 text-gray-700'
          "
          @click="selectedScheme = color.scheme"
        >
          <span
            class="color-dot w-12 h-12 rounded-full inline-block flex-shrink-0"
            :class="{
              'border-2 border-gray-300':
                color.scheme !== 'candy-cane' && color.scheme !== 'multicolor',
              'candy-dot': color.scheme === 'candy-cane',
              'multi-dot': color.scheme === 'multicolor',
            }"
            :style="color.sw ? `background:${color.sw}` : ''"
          ></span>
          <span
            class="!text-md text-[#1C2F5B]"
            :class="selectedScheme === color.scheme ? 'font-semibold' : ''"
            >{{ color.label }}</span
          >
        </button>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          class="block !text-md font-semibold !text-[#1C2F5B] mb-2 form-label"
        >
          Your name *
        </label>
        <input
          v-model="name"
          autocomplete="name"
          class="w-full px-4 py-4 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-md form-input"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <label
          class="block !text-md font-semibold !text-[#1C2F5B] mb-2 form-label"
        >
          Email *
        </label>
        <input
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          class="w-full px-4 py-4 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-md form-input"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div>
      <label
        class="block !text-md font-semibold !text-[#1C2F5B] mb-2 form-label"
      >
        Mobile
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        v-model="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="w-full px-4 py-4 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-md form-input"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[16px] !text-md"
    >
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
    </div>

    <!-- Submit Buttons -->
    <div class="space-y-3">
      <button
        class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-4 px-4 rounded-[16px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="submitRender(false)"
        :disabled="isLoading"
      >
        <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ isLoading ? "Lighting up..." : "Light up my home →" }}
      </button>
      <button
        class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-4 rounded-[16px] transition-colors"
        @click="submitRender(true)"
        :disabled="isLoading"
      >
        <i class="fas fa-search mr-2"></i>
        Check address only (no lights)
      </button>
    </div>

    <p class="text-xs text-gray-400 text-center">
      <i class="fas fa-shield-alt mr-1"></i>
      We only use your info to send your preview.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useEstimator } from "~/composables/useEstimator";

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
  submitRender,
  fetchPackages,
  loadingPackages,
} = useEstimator();

onMounted(() => {
  fetchPackages();
});
</script>

<style scoped>
.form-label {
  color: #f7931e;
  font-size: 20px;
  font-family: Poppins;
  font-weight: 700;
  line-height: 32.8px;
  word-wrap: break-word;
}

.form-input {
  border-radius: 16px;
  border: 2px solid gray !important;
  height: 56px;
  background-color: #f8f9fa;
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

.color-dot {
  width: 48px !important;
  height: 48px !important;
}

.color-dot.candy-dot {
  background: repeating-linear-gradient(
    -45deg,
    #e21d1d 0 5px,
    #ffffff 5px 10px
  );
}

.color-dot.multi-dot {
  border-color: transparent;
  background: conic-gradient(
    #e21d1d,
    #f2c14e 18%,
    #1ea832 36%,
    #1d6fe2 58%,
    #9b4dca 80%,
    #e21d1d
  );
  border-radius: 50% !important;
  overflow: hidden;
}
</style>
