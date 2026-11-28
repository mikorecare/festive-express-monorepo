<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[#1C2D5B]/60 backdrop-blur-sm"
          @click="close"
        />

        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="discovery-title"
          class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- Header -->
          <header class="flex items-start gap-3 p-5 border-b border-slate-100">
            <div
              class="w-12 h-12 rounded-xl bg-[#1C2D5B] text-white flex items-center justify-center shrink-0"
            >
              <GlobeAltIcon class="w-6 h-6" />
            </div>

            <div class="flex-1">
              <h2 id="discovery-title" class="text-lg font-bold text-[#1C2D5B]">
                Discover Competitors
              </h2>

              <p class="text-sm text-slate-500">
                Find new businesses in your target market.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close discovery"
              :disabled="loading"
              class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              @click="close"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </header>

          <form class="p-5 space-y-5" @submit.prevent="submit">
            <!-- Keyword -->
            <div class="space-y-2">
              <label
                for="discovery-query"
                class="block text-sm font-semibold text-[#1C2D5B]"
              >
                Search keyword
              </label>

              <div class="relative">
                <MagnifyingGlassIcon
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />

                <input
                  id="discovery-query"
                  v-model="query"
                  type="text"
                  required
                  :disabled="loading"
                  placeholder="e.g. Christmas light installation"
                  class="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#F49321] focus:ring-2 focus:ring-[#F49321]/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            <!-- Suggested keywords -->
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-500">
                Suggested searches
              </p>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="keyword in keywords"
                  :key="keyword"
                  type="button"
                  :disabled="loading"
                  class="px-3 py-1.5 text-xs font-medium border rounded-full transition-colors disabled:opacity-50"
                  :class="
                    query.toLowerCase() === keyword.toLowerCase()
                      ? 'bg-[#1C2D5B] text-white border-[#1C2D5B]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#F49321] hover:text-[#F49321]'
                  "
                  @click="query = keyword"
                >
                  {{ keyword }}
                </button>
              </div>
            </div>

            <!-- Target market -->
            <div class="space-y-2">
              <label
                for="discovery-area"
                class="block text-sm font-semibold text-[#1C2D5B]"
              >
                Target market
              </label>

              <div class="relative">
                <MapPinIcon
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                />

                <select
                  id="discovery-area"
                  v-model="searchArea"
                  :disabled="loading"
                  class="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm bg-white outline-none focus:border-[#F49321]"
                >
                  <option value="sarasota">Sarasota Area</option>

                  <option value="florida">
                    Florida West Coast (Tampa to Naples)
                  </option>
                </select>
              </div>
            </div>

            <!-- Smart discovery -->
            <div
              class="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50"
            >
              <ShieldCheckIcon class="w-6 h-6 text-[#1C2D5B] shrink-0" />

              <div>
                <p class="text-sm font-semibold text-[#1C2D5B]">
                  Smart discovery enabled
                </p>

                <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                  Previously registered competitors are automatically skipped.
                  Existing website analysis and marketing intelligence remain
                  unchanged.
                </p>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              role="alert"
              class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
            >
              {{ error }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading || !query.trim()"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1C2D5B] hover:bg-[#263d73] text-white font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />

              <GlobeAltIcon v-else class="w-5 h-5" />

              {{
                loading
                  ? "Discovering new competitors…"
                  : "Discover New Competitors"
              }}
            </button>

            <p class="text-center text-xs text-slate-400">
              Searches up to 60 Place IDs and adds up to 20 new competitors per
              run.
            </p>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  GlobeAltIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";

import type { DiscoveryArea } from "~/types/discovery";

const props = defineProps<{
  open: boolean;
  loading: boolean;
  error?: string | null;
}>();

const query = defineModel<string>("query", {
  required: true,
});

const searchArea = defineModel<DiscoveryArea>("searchArea", {
  required: true,
});

const emit = defineEmits<{
  close: [];
  discover: [];
}>();

const keywords = [
  "Holiday lighting",
  "Christmas light installation",
  "Permanent outdoor lighting",
  "Landscape lighting",
  "Outdoor LED lighting",
  "Commercial holiday decorating",
  "Residential Christmas lighting",
  "Architectural lighting",
];

const close = () => {
  if (!props.loading) {
    emit("close");
  }
};

const submit = () => {
  if (!props.loading && query.value.trim()) {
    emit("discover");
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
