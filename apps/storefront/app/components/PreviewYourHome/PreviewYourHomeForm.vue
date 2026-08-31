<!-- components/EstimatorForm.vue -->
<template>
  <div class="space-y-4">
    <!-- Photo Upload -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Photo of your home *
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
        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-orange hover:bg-orange-50 transition-colors text-sm text-gray-600"
        @click="fileInput?.click()"
      >
        <i class="fas fa-cloud-upload-alt mr-2"></i>
        {{ imagePreview ? "Change photo" : "Upload a photo of your home" }}
      </button>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Your uploaded home"
        class="w-full rounded-lg mt-3 max-h-64 object-cover"
      />
      <p class="text-xs text-gray-400 mt-1">
        <i class="fas fa-info-circle mr-1"></i>
        Front-of-house daytime photo works best. Straight-on, whole roofline
        visible.
      </p>
    </div>

    <!-- Address -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Property address
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <div class="relative">
        <input
          v-model="address"
          autocomplete="off"
          placeholder="Start typing your street address"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          @input="debouncedSearch"
          @focus="suggestionsOpen = true"
        />
        <div
          v-if="suggestions.length && suggestionsOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="s in suggestions"
            :key="s.placeId"
            class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            @click="selectAddress(s)"
          >
            <div class="text-sm font-medium text-gray-800">
              {{ s.main }}
            </div>
            <div class="text-xs text-gray-500">{{ s.secondary }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Price per foot -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Price per linear foot
      </label>
      <div class="relative">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold"
          >$</span
        >
        <input
          v-model.number="pricePerFoot"
          type="number"
          min="1"
          step="1"
          inputmode="decimal"
          placeholder="10"
          class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>
    </div>

    <!-- Color Options -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Select C-9 Light Color
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          v-for="color in colorOptions"
          :key="color.scheme"
          type="button"
          class="px-3 py-3 border rounded-lg text-sm transition-all flex flex-col items-center gap-2"
          :class="
            selectedScheme === color.scheme
              ? 'border-brand-orange bg-orange-50 text-brand-orange'
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
          <span class="text-xs">{{ color.label }}</span>
        </button>
      </div>

      <!-- Multi-color picker -->
      <div
        v-if="selectedScheme === 'multicolor'"
        class="mt-4 p-4 bg-gray-50 rounded-lg"
      >
        <p class="text-xs text-gray-600 mb-3">
          Pick 5 colors in order. Lights run 3 of each, then repeat: 3 of color
          1, 3 of color 2, and so on.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <label
            v-for="(color, index) in multiColors"
            :key="index"
            class="flex flex-col items-center gap-1"
          >
            <span class="text-xs text-gray-600">Color {{ index + 1 }}</span>
            <input
              type="color"
              :value="color.hex"
              class="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
              @input="updateMultiColor(index, $event)"
            />
          </label>
        </div>
        <div class="mt-3 flex flex-wrap gap-1">
          <span
            v-for="(color, index) in multiColorPreview"
            :key="index"
            class="w-6 h-6 rounded-sm inline-block border border-gray-200"
            :style="{ background: color }"
          ></span>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Your name *
        </label>
        <input
          v-model="name"
          autocomplete="name"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email *
        </label>
        <input
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Mobile
        <span class="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <input
        v-model="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
    >
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
    </div>

    <!-- Submit Buttons -->
    <div class="space-y-3">
      <button
        class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="submitRender(false)"
        :disabled="isLoading"
      >
        <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ isLoading ? "Lighting up..." : "Light up my home →" }}
      </button>
      <button
        class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        @click="submitRender(true)"
        :disabled="isLoading"
      >
        <i class="fas fa-search mr-2"></i>
        Check address only (no lights)
      </button>
    </div>

    <p class="text-xs text-gray-400 text-center">
      <i class="fas fa-shield-alt mr-1"></i>
      We only use your info to send your render and, if you want, book a free
      consultation.
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
} = useEstimator();
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
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
