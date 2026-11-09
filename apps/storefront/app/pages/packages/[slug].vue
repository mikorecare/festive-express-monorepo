<template>
  <div
    class="min-h-screen relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed font-sans text-slate-800 lg:pb-0 overflow-hidden"
  >
    <!-- Loading -->
    <div
      v-if="pending"
      class="flex items-center justify-center min-h-[60vh] text-slate-500"
    >
      Loading package…
    </div>

    <!-- Not found -->
    <div
      v-else-if="!pkg"
      class="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center"
    >
      <p class="text-lg font-semibold text-[#1C2D5B]">Package not found.</p>
      <NuxtLink
        to="/packages"
        class="inline-flex btn-gloss items-center justify-center text-white font-bold px-6 py-3 rounded-full"
      >
        Browse for More
      </NuxtLink>
    </div>

    <!-- Product -->
    <div
      v-else
      class="max-w-6xl mx-auto pt-6 pb-8 lg:py-8 px-4 sm:px-6 lg:px-6"
    >
      <!-- TOP BANNER -->
      <div
        class="relative section-gloss mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C2D5B] p-2 rounded-2xl shadow-lg border-b-4 border-[#F49321] overflow-hidden"
      >
        <NuxtLink
          to="/packages"
          class="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shrink-0 shadow-sm group"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Browse for More
        </NuxtLink>

        <p
          class="relative z-10 text-sm font-semibold text-white italic tracking-wide text-left sm:text-right [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]"
        >
          <span class="text-[#F49321]">"</span>
          Brighten your holidays and wrap your home in festive magic—the perfect
          gift for you and your loved ones.
          <span class="text-[#F49321]">"</span>
        </p>
      </div>

      <!-- Main Grid -->
      <div class="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10">
        <!-- LEFT -->
        <div class="relative">
          <div
            class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div
              class="relative w-full h-48 sm:h-auto sm:aspect-[4/3] bg-slate-100 overflow-hidden"
            >
              <NuxtImg
                :src="
                  selectedSku?.image_url || pkg.title_image_url || undefined
                "
                :alt="pkg.name"
                format="webp"
                quality="85"
                fit="cover"
                loading="eager"
                fetchpriority="high"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div
              v-if="shortDescription"
              class="px-4 sm:px-5 py-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100"
              v-html="shortDescription"
            />
          </div>
        </div>

        <!-- RIGHT -->
        <div
          id="package"
          class="px-4 bg-white pb-4 pt-2 lg:flex lg:flex-col rounded-2xl"
        >
          <!-- Title image + price (mobile) -->
          <div
            class="lg:hidden px-2 pt-4 pb-2 flex items-center justify-between gap-4"
          >
            <div class="min-w-0">
              <NuxtImg
                v-if="pkg.title_image_url"
                :src="pkg.title_image_url"
                :alt="pkg.name"
                loading="eager"
                class="h-16 w-auto object-contain"
              />
              <h1 v-else class="text-xl font-extrabold text-[#1C2D5B]">
                {{ pkg.name }}
              </h1>
            </div>
            <div class="flex flex-col items-end shrink-0 leading-tight">
              <span class="inline-flex items-baseline">
                <span
                  class="text-[2.25rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 sm:-mr-2 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="text-4xl font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em]"
                >
                  {{ Math.round(Number(selectedPrice) || 0).toLocaleString() }}
                </span>
              </span>
              <span class="text-xs font-semibold text-slate-500"
                >Per Season</span
              >
            </div>
          </div>

          <!-- Title image + price (desktop) -->
          <div class="hidden lg:flex items-center justify-between gap-4 mb-6">
            <div>
              <NuxtImg
                v-if="pkg.title_image_url"
                :src="pkg.title_image_url"
                :alt="pkg.name"
                loading="eager"
                class="h-20 w-auto object-contain"
              />
              <h1 v-else class="text-3xl font-extrabold text-[#1C2D5B]">
                {{ pkg.name }}
              </h1>
            </div>
            <div class="flex flex-col items-end shrink-0 leading-tight">
              <span class="inline-flex items-baseline">
                <span
                  class="text-[2.25rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 sm:-mr-2 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="text-4xl font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em]"
                >
                  {{ Math.round(Number(selectedPrice) || 0).toLocaleString() }}
                </span>
              </span>
              <span class="text-sm font-semibold text-slate-500"
                >Per Season</span
              >
            </div>
          </div>

          <!-- Trust badges -->
          <ul
            class="flex flex-nowrap items-center gap-3 text-[0.7rem] sm:text-xs font-semibold text-slate-500 mb-6 overflow-x-auto"
            role="list"
          >
            <li class="flex items-center gap-1 whitespace-nowrap shrink-0">
              <svg
                class="w-4 h-4 text-[#F49321] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Pro installation
            </li>
            <li class="flex items-center gap-1 whitespace-nowrap shrink-0">
              <svg
                class="w-4 h-4 text-[#F49321] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Maintenance
            </li>
            <li class="flex items-center gap-1 whitespace-nowrap shrink-0">
              <svg
                class="w-4 h-4 text-[#F49321] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Removal
            </li>
          </ul>

          <!-- Color selection -->
          <div v-if="skusForPkg.length" class="mb-6">
            <p class="text-sm font-bold text-slate-900 mb-3">
              Light color:
              <span class="font-semibold text-slate-600">
                {{
                  selectedSku?.color_label ||
                  byKey(selectedSku?.color_key)?.color_label ||
                  selectedSku?.color_key
                }}
              </span>
            </p>
            <div
              class="flex flex-wrap gap-2.5"
              role="radiogroup"
              aria-label="Light color"
            >
              <button
                v-for="sku in skusForPkg"
                :key="sku.id"
                type="button"
                role="radio"
                :aria-checked="String(selectedSku?.id) === String(sku.id)"
                :aria-label="`${sku.color_label || byKey(sku.color_key)?.color_label || sku.color_key}`"
                class="relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer"
                :class="
                  String(selectedSku?.id) === String(sku.id)
                    ? 'border-[#F49321] scale-105 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                "
                @click="selectSku(sku.id)"
              >
                <span
                  class="absolute inset-1 rounded-full border border-slate-200"
                  :style="swatchStyle(sku.color_key)"
                />
              </button>
            </div>
          </div>

          <!-- What's Included -->
          <div v-if="inclusions.length" class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <h3
                class="text-sm font-extrabold text-[#1C2D5B] uppercase tracking-wide"
              >
                What's Included
              </h3>
              <span
                class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                {{ inclusions.length }} items
              </span>
            </div>

            <ul class="grid grid-cols-2 gap-x-3 gap-y-3 w-full">
              <li
                v-for="(item, i) in inclusions"
                :key="i"
                class="flex items-center gap-2 min-w-0"
              >
                <div
                  class="w-[32px] h-[32px] rounded-full border border-slate-200 overflow-hidden shrink-0 bg-white flex items-center justify-center"
                >
                  <NuxtImg
                    v-if="item.image_url"
                    :src="item.image_url"
                    :alt="item.name"
                    width="32"
                    height="32"
                    fit="cover"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="min-w-0">
                  <strong
                    class="text-[0.75rem] text-[#1C2D5B] font-bold leading-tight block"
                  >
                    {{ item.name }}
                    <span
                      v-if="item.quantity > 1"
                      class="text-[#F49321] font-extrabold ml-0.5"
                    >
                      ×{{ item.quantity }}
                    </span>
                  </strong>
                </div>
              </li>
            </ul>
          </div>

          <!-- Customize package trigger -->
          <button
            type="button"
            class="group w-full mb-6 flex items-center justify-between gap-3 px-3 py-2 rounded-xl border-2 border-[#F49321] bg-[#fff9f2] hover:bg-[#ffefdb] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out text-left shadow-sm hover:shadow-md"
            @click="extrasOpen = true"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 shrink-0 rounded-full bg-[#F49321] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
              >
                <i class="fa-solid fa-plus text-lg"></i>
              </div>

              <div class="min-w-0 flex items-center gap-1">
                <div class="min-w-0 flex flex-col items-start gap-0.5">
                  <p
                    class="text-sm font-extrabold text-[#1C2D5B] uppercase tracking-wide"
                  >
                    Customize package
                  </p>
                  <span
                    v-if="addonSubtotal > 0 || overagePrice > 0"
                    class="text-[#F49321] font-bold text-[0.7rem] leading-none"
                  >
                    +${{ (addonSubtotal + overagePrice).toFixed(2) }} in add-ons
                  </span>
                </div>
              </div>
            </div>
          </button>

          <!-- Subtotal card -->
          <div
            v-if="addonSubtotal > 0 || overagePrice > 0"
            class="mt-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <!-- Base Price -->
            <div
              class="flex items-center justify-between text-sm text-slate-600 mb-1.5"
            >
              <span>{{ pkg.name }} (Base)</span>

              <span class="inline-flex items-baseline">
                <span
                  class="text-[1rem] sm:text-[1.1rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 sm:-mr-1.5 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="text-[1.1rem] sm:text-[1.2rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em]"
                >
                  {{ Math.round(Number(selectedPrice || 0)).toLocaleString() }}
                </span>
              </span>
            </div>

            <!-- Add-ons -->
            <div
              v-for="[id, qty] in Object.entries(addonQty).filter(
                ([_, q]) => q > 0,
              )"
              :key="id"
              class="flex items-center justify-between text-sm text-slate-600 mb-1.5"
            >
              <span class="truncate pr-2">
                {{ addonProducts.find((x) => x.id === id)?.name || "Add-on" }}
                <span class="text-slate-400">× {{ qty }}</span>
              </span>

              <span class="font-semibold inline-flex items-baseline">
                <span
                  class="text-[0.75rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="font-extrabold leading-none price-text -tracking-[0.04em]"
                >
                  {{
                    (
                      Number(
                        addonProducts.find((x) => x.id === id)?.price || 0,
                      ) * qty
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </span>
            </div>

            <!-- Overage -->
            <div
              v-if="overagePrice > 0"
              class="flex items-center justify-between text-sm text-slate-600 mb-1.5"
            >
              <span class="truncate pr-2">
                Overage
                <span class="text-slate-400">({{ overageFt }} ft extra)</span>
              </span>
              <span class="font-semibold inline-flex items-baseline">
                <span
                  class="text-[0.75rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="font-extrabold leading-none price-text -tracking-[0.04em]"
                >
                  {{
                    overagePrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </span>
            </div>

            <!-- Total -->
            <div
              class="flex items-center justify-between text-sm font-extrabold text-[#1C2D5B] border-t border-slate-200 pt-1.5 mt-1.5"
            >
              <span>Total</span>

              <span class="inline-flex items-baseline">
                <span
                  class="text-[0.8rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                >
                  $&nbsp;
                </span>
                <span
                  class="font-extrabold leading-none price-text -tracking-[0.04em]"
                >
                  {{
                    (
                      Number(selectedPrice ?? 0) +
                      (addonSubtotal ?? 0) +
                      (overagePrice ?? 0)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </span>
            </div>
          </div>

          <!-- Desktop add-to-cart -->
          <button
            type="button"
            class="btn-3d-glossy relative overflow-hidden hidden lg:inline-flex lg:self-end items-center justify-center w-full text-white font-extrabold uppercase tracking-wide text-sm sm:text-base py-3 sm:py-4 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedSku?.id || adding"
            @click="addToCart"
          >
            <span
              class="relative z-10 inline-flex items-center justify-center gap-2 text-[1.4rem]"
            >
              <template v-if="adding">
                <svg
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Adding…
              </template>
              <template v-else> ADD TO CART </template>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Extras Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="extrasOpen"
        class="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="extras-title"
        @click.self="extrasOpen = false"
      >
        <div
          class="w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div
            class="flex section-gloss items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 shrink-0 bg-[#1C2D5B]"
          >
            <h2
              id="extras-title"
              class="text-base font-extrabold text-white uppercase tracking-wider"
            >
              Add-ons
            </h2>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Close"
              @click="extrasOpen = false"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-2">
            <div v-if="addonCategories.length">
              <div
                v-for="cat in addonCategories"
                :key="cat.key"
                class="mb-4 last:mb-0"
              >
                <div class="flex items-center gap-2 mb-2 mt-2 px-1">
                  <NuxtImg
                    v-if="cat.image_url"
                    :src="cat.image_url"
                    :alt="cat.image_alt || cat.label"
                    width="24"
                    height="24"
                    fit="contain"
                    loading="lazy"
                    class="w-6 h-6 object-contain opacity-70"
                  />
                  <p
                    class="text-xs font-black text-slate-400 uppercase tracking-widest"
                  >
                    {{ cat.label }}
                  </p>
                </div>

                <ul class="space-y-1" role="list">
                  <li
                    v-for="p in productsByCategory(cat.key)"
                    :key="p.id"
                    class="flex items-center justify-between gap-3 px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-800 leading-tight">
                        {{ p.name }}
                        <span
                          v-if="
                            p.category === 'wreath' && bundledRibbonFor(p.id)
                          "
                          class="text-[0.65rem] font-medium text-slate-400 block mt-0.5"
                        >
                          + {{ bundledRibbonFor(p.id)!.name }}
                        </span>
                      </p>
                      <p class="text-xs font-semibold text-[#F49321] mt-0.5">
                        ${{ Number(p.price).toFixed(2) }}
                      </p>
                    </div>

                    <div
                      class="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full p-0.5 shadow-sm"
                    >
                      <button
                        type="button"
                        class="w-7 h-7 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="(addonQty[p.id] || 0) <= 0"
                        @click="decrementAddon(p.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <span
                        class="w-6 text-center text-xs font-bold text-[#1C2D5B] tabular-nums"
                      >
                        {{ addonQty[p.id] || 0 }}
                      </span>
                      <button
                        type="button"
                        class="w-7 h-7 rounded-full text-white flex items-center justify-center active:scale-95 shadow-sm transition-colors"
                        :class="
                          (addonQty[p.id] || 0) > 0
                            ? 'bg-[#F49321] hover:bg-[#e0851a]'
                            : 'bg-[#1C2D5B] hover:bg-[#F49321]'
                        "
                        @click="incrementAddon(p.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </li>
                  <li
                    v-if="!productsByCategory(cat.key).length"
                    class="px-3 py-2 text-xs text-slate-400 italic"
                  >
                    No options available
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div
              v-if="addonSubtotal > 0"
              class="flex items-center justify-between text-sm font-bold text-[#1C2D5B] mb-2 px-1"
            >
              <span>Add-ons subtotal</span>
              <span>${{ addonSubtotal.toFixed(2) }}</span>
            </div>
            <button
              type="button"
              class="w-full btn-3d-glossy relative overflow-hidden inline-flex items-center justify-center bg-[#1C2D5B] hover:bg-[#F49321] text-white font-extrabold text-sm uppercase tracking-wide py-2.5 rounded-full transition-colors"
              @click="extrasOpen = false"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAddons } from "~/composables/useAddons";
import { useEstimator } from "~/composables/useEstimator";
import { useEstimateHandoff } from "~/composables/useEstimateHandoff";
import type { ApiResponse, PackageRow, SkuRow } from "./types";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const extrasOpen = ref(false);
const showInclusions = ref(true);

// ---------- Overage (live from estimator, or session handoff on refresh) ----------
const { calculatedOveragePrice, calculatedOverageFt } = useEstimator();
const { load: loadEstimateHandoff } = useEstimateHandoff();

const overagePrice = ref(0);
const overageFt = ref(0);

onMounted(() => {
  const livePrice = Number(calculatedOveragePrice.value) || 0;
  const liveFt = Number(calculatedOverageFt.value) || 0;

  if (livePrice > 0) {
    overagePrice.value = livePrice;
    overageFt.value = liveFt;
    return;
  }

  if (route.query.estimate === "true") {
    const snap = loadEstimateHandoff();
    if (snap) {
      overagePrice.value = snap.overagePrice;
      overageFt.value = snap.overageFt;
    }
  }
});

// ---------- Package data ----------
const { data, pending } = await useAsyncData(
  `package-${slug.value}`,
  async () => {
    const [packagesRes, skusRes] = await Promise.all([
      $fetch<ApiResponse<PackageRow[]>>("/api/packages/main-list"),
      $fetch<ApiResponse<SkuRow[]>>("/api/packages/skus"),
    ]);
    return {
      packages: packagesRes.success ? packagesRes.data || [] : [],
      skus: skusRes.success ? skusRes.data || [] : [],
    };
  },
  { watch: [slug] },
);

const pkg = computed<PackageRow | null>(
  () => data.value?.packages.find((p) => p.slug === slug.value) || null,
);

const inclusions = computed(() => {
  if (!pkg.value) return [];
  return (pkg.value.package_inclusions || [])
    .filter((r) => r.is_included && r.inclusion_items?.name)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => {
      const item = Array.isArray(r.inclusion_items)
        ? r.inclusion_items[0]
        : r.inclusion_items;
      return {
        name: r.label_override || item?.name,
        quantity: r.quantity ?? 1,
        image_url: item?.image_url || null,
      };
    });
});

const skusForPkg = computed<SkuRow[]>(() => {
  if (!pkg.value) return [];
  return (data.value?.skus || [])
    .filter((s) => String(s.package_id) === String(pkg.value!.id))
    .sort((a, b) => {
      const orderOf = (key?: string | null) => {
        const i = colors.value.findIndex((c) => c.color_key === key);
        return i === -1 ? 999 : i;
      };
      return orderOf(a.color_key) - orderOf(b.color_key);
    });
});

const selectedSkuId = ref<string | number | null>(null);

const selectedSku = computed<SkuRow | null>(() => {
  if (!skusForPkg.value.length) return null;
  if (selectedSkuId.value != null) {
    return (
      skusForPkg.value.find(
        (s) => String(s.id) === String(selectedSkuId.value),
      ) ?? null
    );
  }
  return skusForPkg.value[0] ?? null;
});

const selectedPrice = computed(() => {
  const sku = selectedSku.value;
  return Number(sku?.price ?? pkg.value?.price ?? 0);
});

const shortDescription = computed(() => {
  const raw = pkg.value?.description;
  if (!raw) return "";
  const first = raw.split(/\n\s*\n/)[0]?.trim() || "";
  return first;
});

const selectSku = (id: string | number) => {
  selectedSkuId.value = id;
};

const { colors, loadColors, swatchStyle, byKey } = useProductColors();

// ---------- Ala carte add-ons ----------
const {
  categories: addonCategories,
  loadAddons,
  productsByCategory,
  bundledRibbonFor,
  products: addonProducts,
} = useAddons();

const addonQty = reactive<Record<string, number>>({});

const incrementAddon = (id: string) => {
  addonQty[id] = (addonQty[id] || 0) + 1;
};

const decrementAddon = (id: string) => {
  const next = (addonQty[id] || 0) - 1;
  if (next <= 0) delete addonQty[id];
  else addonQty[id] = next;
};

const addonSubtotal = computed(() => {
  let sum = 0;
  for (const [id, qty] of Object.entries(addonQty)) {
    const p = addonProducts.value.find((x) => x.id === id);
    if (p) sum += Number(p.price) * qty;
  }
  return sum;
});

const cart = useCart();
const adding = ref(false);
const cartModal = reactive({
  open: false,
  type: "success" as "success" | "error",
  title: "",
  message: "",
});

const openCartModal = (
  type: "success" | "error",
  title: string,
  message: string,
) => {
  cartModal.type = type;
  cartModal.title = title;
  cartModal.message = message;
  cartModal.open = true;
};

const addToCart = async () => {
  const sku = selectedSku.value;
  if (!sku?.id || adding.value) return;

  adding.value = true;
  try {
    const selectedAddons = Object.entries(addonQty)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = addonProducts.value.find((x) => x.id === id);
        return {
          product_id: id,
          name: p?.name || "Add-on",
          price: Number(p?.price || 0),
          quantity: qty,
        };
      });

    const options = {
      addons: selectedAddons.length > 0 ? selectedAddons : undefined,
      overage:
        overagePrice.value > 0
          ? { amount: overagePrice.value, feet: overageFt.value }
          : undefined,
    };

    const ok = await cart.addToCart(sku.id, 1, options);

    if (ok !== false) {
      if (typeof cart.loadCart === "function") await cart.loadCart();

      Object.keys(addonQty).forEach((key) => delete addonQty[key]);
      extrasOpen.value = false;

      openCartModal(
        "success",
        "Added to cart",
        `${pkg.value?.name} was added.`,
      );
    } else {
      openCartModal(
        "error",
        "Could not add",
        "Something went wrong. Please try again.",
      );
    }
  } catch (e: any) {
    openCartModal(
      "error",
      "Could not add",
      e?.message || "Something went wrong.",
    );
  } finally {
    adding.value = false;
  }
};

onMounted(async () => {
  await loadColors();
  await loadAddons();
});

useHead(() => ({
  title: pkg.value
    ? `${pkg.value.name} | Festive Express`
    : "Package | Festive Express",
}));
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
