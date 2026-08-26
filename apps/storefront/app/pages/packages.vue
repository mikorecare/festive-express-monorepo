<template>
  <div class="packages-page min-h-screen bg-white font-sans text-slate-800">
    <!-- Hero -->
    <section
      class="page-hero snow-bg relative bg-slate-900 py-16 text-white overflow-hidden"
    >
      <div class="hero-overlay absolute inset-0 bg-black/40 z-10 min-h-[200px]">
        <div
          class="container mx-auto px-4 h-full flex items-center justify-center min-h-[200px]"
        >
          <div class="hero-content text-center max-w-2xl mx-auto">
            <h1
              v-fade
              class="text-3xl md:text-5xl tracking-tight text-white mb-4"
            >
              <span class="text-brand-orange">Holiday Lighting</span> Package
            </h1>

            <p v-fade class="text-base md:text-lg text-slate-200">
              <template v-if="subtitleParts.length > 1">
                <span class="md:hidden">
                  {{ subtitleParts[0] }}<br />
                  {{ subtitleParts[1] }}
                </span>
                <span class="hidden md:inline">
                  {{ subtitleParts.join(" ") }}
                </span>
              </template>
              <template v-else>
                {{ subtitleParts[0] }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 md:py-16 bg-white relative">
      <ClientOnly>
        <FestivoAnimation
          ref="festivoRef"
          :targetRect="activeCardRect"
          :config="festivoConfig"
          initialState="talk"
          :useJump="true"
          :forceScaleX="1"
          :disableShrink="true"
        />
      </ClientOnly>

      <PreviewYourHomeButton />

      <div v-if="loading" class="text-center py-20 text-slate-500">
        Loading packages...
      </div>
      <div
        v-else-if="!packages.length"
        class="text-center py-20 text-slate-500"
      >
        No packages available.
      </div>

      <div
        v-for="pkg in packages"
        :id="`package-${pkg.slug}`"
        :key="pkg.id"
        class="container mx-auto px-4 max-w-7xl mb-16 last:mb-0 scroll-mt-48 mt-5"
        :ref="(el) => setPackageRef(el, pkg.id)"
        @mouseenter="handlePackageFocus(pkg.id)"
      >
        <!-- Header: title image + price (SKU) -->
        <div
          class="section-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b-2 border-slate-200 gap-4"
        >
          <div class="header-left relative flex items-center gap-4">
            <img
              v-if="pkg.title_image_url || pkg.icon_url"
              class="pkg-title-img h-16 md:h-24 w-auto object-contain drop-shadow-md"
              :src="getImageUrl(pkg.title_image_url || pkg.icon_url)"
              :alt="pkg.name"
            />
            <h2 v-else class="text-3xl font-bold text-[#1C2D5B]">
              {{ pkg.name }}
            </h2>
          </div>
          <!-- <div
            class="package-price text-3xl md:text-4xl font-extrabold text-[#f59e0b]"
          >
            ${{ Math.round(Number(selectedPrice(pkg)) || 0) }} / season
          </div> -->

          <div
            class="package-price flex items-center justify-between gap-4 text-[#f59e0b]"
          >
            <div class="text-left">
              <template
                v-if="
                  selectedSku(pkg)?.sale_price != null &&
                  Number(selectedSku(pkg)?.sale_price) > 0
                "
              >
                <div class="text-3xl md:text-4xl font-extrabold leading-none">
                  ${{ Math.round(Number(selectedPrice(pkg)) || 0) }}
                </div>
                <div
                  class="mt-1 text-base md:text-lg font-semibold text-slate-400 line-through"
                >
                  ${{ Math.round(Number(selectedSku(pkg)?.price) || 0) }}
                </div>
              </template>
              <template v-else>
                <div class="text-3xl md:text-4xl font-extrabold leading-none">
                  ${{ Math.round(Number(selectedPrice(pkg)) || 0) }}
                </div>
              </template>
            </div>
            <div
              class="text-sm md:text-base font-semibold text-slate-600 shrink-0 pb-1"
            >
              / season
            </div>
          </div>
        </div>

        <!-- Horizontal layout -->
        <div
          class="horizontal-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          <!-- Left: image + hotspots + colors -->
          <div
            class="media-column lg:col-span-7 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <div
              class="image-wrapper relative bg-slate-100 group"
              @click.stop="onPackageImageClick(pkg)"
            >
              <img
                :ref="(el) => setImageRef(el, pkg.id)"
                :src="selectedImage(pkg)"
                :alt="pkg.name"
                class="main-image w-full h-[320px] sm:h-[420px] object-cover block border-4 border-[#f59e0b] rounded-2xl"
                @error="onImgError"
              />

              <!-- Package icon badge -->
              <div
                class="lights-badge absolute right-0 -bottom-[30px] z-[3] w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg"
                aria-hidden="true"
              >
                <img
                  v-if="pkg.icon_url"
                  class="lights-icon-img w-100 h-100 object-contain"
                  :src="getImageUrl(pkg.icon_url)"
                  alt=""
                />
                <span v-else class="text-white text-xs font-bold">{{
                  pkg.name
                }}</span>
              </div>

              <!-- Hotspots -->
              <button
                v-for="spot in getHotspots(pkg)"
                :key="spot.key"
                type="button"
                class="hotspot group/spot absolute z-30 w-7 h-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                :style="{ top: spot.top, left: spot.left }"
                @click.stop="activateHotspot(pkg.id, spot.key)"
              >
                <span
                  class="hotspot-dot block w-4 h-4 mx-auto mt-1 rounded-full border-2 border-white shadow-md transition-all duration-200"
                  :class="
                    activeHotspot[String(pkg.id)] === spot.key
                      ? 'bg-[#f59e0b] scale-125'
                      : 'bg-slate-900 group-hover/spot:bg-[#f59e0b] group-hover/spot:scale-110'
                  "
                />
                <span
                  v-if="activeHotspot[String(pkg.id)] === spot.key"
                  class="hotspot-pulse absolute inset-0 rounded-full border-2 border-[#f59e0b] animate-ping opacity-75"
                />
              </button>

              <!-- Click outside to close -->
              <div
                v-if="getActiveSpot(pkg)"
                class="fixed inset-0 z-30"
                aria-hidden="true"
                @click.stop="activeHotspot[String(pkg.id)] = null"
              />

              <!-- Hotspot popup -->
              <div
                v-if="getActiveSpot(pkg)"
                class="hotspot-popup absolute z-40 w-44 rounded-xl shadow-2xl border border-slate-100 overflow-hidden -translate-x-1/2 -translate-y-[110%]"
                :style="{
                  top: getActiveSpot(pkg)?.top,
                  left: getActiveSpot(pkg)?.left,
                }"
                @click.stop
              >
                <!-- Glossy shine -->
                <div
                  class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
                  aria-hidden="true"
                >
                  <div
                    class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.45)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] animate-[glossyShineContinuous_3s_linear_infinite]"
                  />
                </div>

                <button
                  type="button"
                  class="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center opacity-80 hover:bg-[#f59e0b]"
                  @click.stop="activeHotspot[String(pkg.id)] = null"
                >
                  ×
                </button>
                <div
                  v-if="getActiveSpot(pkg)?.thumb"
                  class="w-full h-24 p-2 flex items-center justify-center"
                >
                  <img
                    :src="getActiveSpot(pkg)?.thumb"
                    :alt="getActiveSpot(pkg)?.label"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
                <div class="p-2.5 text-center">
                  <h4 class="text-xs font-bold text-white-900 leading-tight">
                    {{ getActiveSpot(pkg)?.label }}
                  </h4>
                </div>
              </div>
            </div>

            <!-- C-9 colors from SKUs -->
            <div
              class="color-overlay p-5 bg-white border-t border-slate-200 text-center"
            >
              <h4 class="text-sm font-bold text-slate-900 mb-3">
                Select C-9 Light Color
              </h4>
              <div class="flex justify-center flex-wrap gap-3">
                <button
                  v-for="sku in skusFor(pkg.id)"
                  :key="sku.id"
                  type="button"
                  class="flex flex-col items-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-xl border-2 transition-all"
                  :class="
                    String(selectedSkuId[String(pkg.id)]) === String(sku.id)
                      ? 'border-[#f59e0b] bg-orange-50'
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  "
                  @click="selectSku(pkg.id, sku.id)"
                >
                  <div
                    class="w-8 h-8 rounded-full border-2 border-slate-300 shadow-inner"
                    :style="swatchStyle(sku.color_key)"
                  />
                  <span class="text-xs font-semibold text-slate-700">
                    {{
                      sku.color_label ||
                      byKey(sku.color_key)?.color_label ||
                      sku.color_key
                    }}
                  </span>
                </button>
              </div>
              <p
                v-if="!skusFor(pkg.id).length"
                class="text-sm text-slate-400 mt-2"
              >
                No color options yet.
              </p>
            </div>
          </div>

          <!-- Right: details -->
          <div class="details-column lg:col-span-5 flex flex-col gap-6">
            <div
              v-if="pkg.description"
              class="text-base text-navy leading-relaxed whitespace-pre-line"
              v-html="pkg.description"
            />

            <div class="inclusions-block">
              <h3 class="text-lg font-bold text-slate-900 mb-3">
                Package Inclusions:
              </h3>
              <ul class="space-y-2 list-none p-0 m-0">
                <li
                  v-for="(row, i) in inclusionsFor(pkg).filter(
                    (r) => r.is_included,
                  )"
                  :key="i"
                  class="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-[#f59e0b] hover:bg-[#fff7ed] transition-colors"
                  @click="highlightInclusion(pkg, row)"
                >
                  <img
                    v-if="row.inclusion_items?.image_url"
                    :src="getImageUrl(row.inclusion_items.image_url)"
                    class="w-8 h-8 object-contain flex-shrink-0"
                    alt=""
                  />
                  <span v-else class="text-emerald-500 font-bold">✔</span>
                  <span class="text-xs font-semibold leading-snug text-navy">
                    {{ row.label_override || row.inclusion_items?.name }}
                    <!-- <template v-if="row.quantity > 1">
                      × {{ row.quantity }}</template
                    > -->
                  </span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 bg-transparent text-navy border-2 border-slate-900 px-6 py-3 text-sm font-semibold rounded-lg hover:bg-slate-900 hover:text-white transition-all"
              @click="scrollToSpecs"
            >
              For More Product Information
              <span>↓</span>
            </button>

            <div
              class="p-4 bg-blue-50 border border-dashed border-blue-200 rounded-xl"
            >
              <p
                class="m-0 text-xs sm:text-smtext-navy flex items-start gap-2.5 leading-relaxed"
              >
                <span class="flex-shrink-0">ℹ</span>
                Includes commercial-grade LEDs, custom fit sizing, professional
                installation, maintenance and removal.
              </p>
            </div>

            <button
              type="button"
              class="group relative overflow-hidden w-full bg-[#f59e0b] hover:bg-[#1C2D5B] text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:skew-x-[-20deg] before:transition-transform before:duration-1000 before:ease-out hover:before:translate-x-full"
              :disabled="
                !selectedSku(pkg)?.id || addingId === selectedSku(pkg)?.id
              "
              @click="addPackageSku(pkg)"
            >
              <span
                v-if="addingId === selectedSku(pkg)?.id"
                class="inline-flex items-center justify-center gap-2"
              >
                <svg
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
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
                Adding...
              </span>
              <span v-else>
                Add
                <span
                  class="text-navy font-bold uppercase group-hover:text-white transition-colors"
                >
                  {{ pkg.name }}
                </span>
                to Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Information Section -->
    <section id="package-specs" class="product-info-section py-20 bg-slate-50">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="section-header2 text-center mb-12">
          <h2 class="text-3xl font-extrabold text-navy mb-3">
            Product Specifications
          </h2>
          <p class="section-subtitle text-navy text-base max-w-2xl mx-auto">
            Discover the professional-grade materials and engineering behind
            every installation.
          </p>
        </div>

        <div v-if="specsLoading" class="text-center text-navy py-10">
          Loading specifications...
        </div>

        <div
          v-else-if="!inclusionItems.length"
          class="text-center text-navy py-10"
        >
          No product specifications available.
        </div>

        <div
          v-else
          class="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="item in inclusionItems"
            :key="item.id"
            class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div
              class="product-header bg-[#1C2D5B] text-white p-5 flex justify-between items-center gap-3"
            >
              <h3 class="text-lg font-bold text-white m-0">
                {{ item.name }}
              </h3>
              <!-- <span
                v-if="item.badge"
                class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md shrink-0"
              >
                {{ item.badge }}
              </span> -->
            </div>

            <div class="product-body p-6 flex flex-col flex-grow">
              <p
                v-if="item.description"
                class="description text-navy text-sm leading-relaxed mb-4"
              >
                {{ item.description }}
              </p>

              <div
                v-if="colorList(item).length"
                class="options-tag bg-[#f0f4f8] text-[#1C2D5B] px-3 py-2 rounded-[6px] text-[0.88rem] mb-5"
              >
                <strong>Color Options:</strong>
                {{ colorList(item).join(", ") }}
              </div>

              <div v-if="featureList(item).length" class="spec-block mb-4">
                <h4
                  class="text-base font-bold text-[#1C2D5B] mb-2.5 pb-0.75 border-b-2 border-[#f59e0b] inline-block"
                >
                  Features
                </h4>
                <ul
                  class="list-disc list-inside text-sm text-navy space-y-1.5 p-0 m-0"
                >
                  <li v-for="(f, i) in featureList(item)" :key="i">
                    {{ f }}
                  </li>
                </ul>
              </div>

              <div
                v-if="Object.keys(specMap(item)).length"
                class="spec-block mt-auto"
              >
                <h4
                  class="text-base font-bold text-[#1C2D5B] mb-2.5 pb-0.75 border-b-2 border-[#f59e0b] inline-block"
                >
                  Specifications
                </h4>
                <div
                  class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-sm text-slate-600"
                >
                  <div v-for="(val, key) in specMap(item)" :key="key">
                    <span class="font-bold text-navy">{{ key }}:</span>
                    {{ val }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <div
      v-if="activeLightboxImage"
      class="lightbox fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
      @click.self="closeLightbox"
    >
      <button
        class="lightbox-close absolute top-5 right-6 text-white text-4xl bg-transparent border-none cursor-pointer hover:text-amber-500 transition-colors"
        @click="closeLightbox"
      >
        ×
      </button>
      <img
        :src="activeLightboxImage"
        alt="Preview Fullscreen"
        class="lightbox-image max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Packages" });
import FestivoAnimation from "../components/Home/FestivoAnimation.vue";
import type { FestivoConfig } from "../components/Home/Festivo";

type InclusionItem = {
  id: string;
  name: string;
  slug?: string;
  image_url?: string | null;
};

type PackageInclusion = {
  quantity: number;
  is_included: boolean;
  label_override?: string | null;
  sort_order?: number;
  inclusion_items?: InclusionItem | null;
};

type PackageRow = {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  title_image_url?: string | null;
  icon_url?: string | null;
  is_popular?: boolean;
  sort_order?: number;
  package_inclusions?: PackageInclusion[];
};

type SkuRow = {
  id: string | number;
  name: string;
  price?: number | string | null;
  sale_price?: number | string | null;
  stock?: number | null;
  image_url?: string | null;
  package_id: string | number;
  color_key?: string | null;
  color_label?: string | null;
};

type Hotspot = {
  key: string;
  top: string;
  left: string;
  label: string;
  thumb?: string;
};

const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const db = supabase as any;

const cart = useCart();

const loading = ref(true);
const packages = ref<PackageRow[]>([]);
const skus = ref<SkuRow[]>([]);
const selectedSkuId = ref<Record<string, string | number>>({});
const activeHotspot = ref<Record<string, string | null>>({});
const addingId = ref<string | number | null>(null);

const festivoRef = ref<InstanceType<typeof FestivoAnimation> | null>(null);
const activeCardRect = ref<DOMRect | null>(null);
const activePackageId = ref<string | number | null>(null);
const packageRefs = ref<Map<string | number, HTMLElement>>(new Map());
const imageRefs = ref<Map<string | number, HTMLImageElement>>(new Map());
const isAnimating = ref(false);
const observerMap = new WeakMap<HTMLElement, IntersectionObserver>();

const inclusionItems = ref<any[]>([]);
const specsLoading = ref(true);

const settings = ref<{ hero_subtitle?: string } | null>(null);
const subtitleParts = computed(() => {
  const raw =
    settings.value?.hero_subtitle || "Choose the perfect package|for your home";

  return String(raw)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
});

const vIntersect = {
  mounted(el: HTMLElement, binding: any) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Call immediately
            binding.value(entry);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      },
    );
    observer.observe(el);
    observerMap.set(el, observer);
  },
  unmounted(el: HTMLElement) {
    const observer = observerMap.get(el);
    if (observer) {
      observer.disconnect();
      observerMap.delete(el);
    }
  },
};

const festivoConfig = computed<FestivoConfig>(() => {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return {
    imagePath: (state: string, frame: number) =>
      `/Images/Festivo/${state}-3d-${frame}.png`,
    moveOffsetX: isMobile ? -50 : -100,
    moveOffsetY: 100,
    jumpOffsetX: isMobile ? -200 : -350,
    jumpOffsetY: isMobile ? -500 : -650,
    jumpPeakHeight: isMobile ? 100 : 150,
  };
});

/** Default hotspot positions per package slug — tweak to match your photos */
const HOTSPOT_LAYOUT: Record<
  string,
  { top: string; left: string; match?: string }[]
> = {
  joy: [{ top: "32%", left: "72%", match: "c9" }],
  jolly: [
    { top: "32%", left: "72%", match: "c9" },
    { top: "33%", left: "55%", match: "wreath" },
    { top: "30%", left: "57%", match: "bow" },
    { top: "83%", left: "45%", match: "ground" },
  ],
  merry: [
    { top: "32%", left: "72%", match: "c9" },
    { top: "33%", left: "55%", match: "wreath" },
    { top: "30%", left: "57%", match: "bow" },
    { top: "83%", left: "45%", match: "ground" },
    { top: "62%", left: "88%", match: "minis" },
    { top: "71%", left: "66%", match: "bursts" },
  ],
};

const getImageUrl = (url?: string | null) => {
  if (!url) return "/Images/placeholder-package.jpg";
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("blob:"))
    return url;
  const path = url.replace(/^\//, "").replace(/^Products\//i, "");
  const bucket = (config.public.storageBucket as string) || "Products";
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

const selectedSku = (pkg: PackageRow): SkuRow | null => {
  const id = selectedSkuId.value[String(pkg.id)];
  if (id == null) return null;
  return skus.value.find((s) => String(s.id) === String(id)) || null;
};

const selectedPrice = (pkg: PackageRow) => {
  const sku = selectedSku(pkg);
  if (sku) {
    const sale = Number(sku.sale_price);
    if (
      sku.sale_price != null &&
      sku.sale_price !== "" &&
      !Number.isNaN(sale) &&
      sale > 0
    ) {
      return sale;
    }
    return Number(sku.price ?? 0);
  }
  // fallback: package-level
  const sale = Number(pkg.sale_price);
  if (
    pkg.sale_price != null &&
    pkg.sale_price !== "" &&
    !Number.isNaN(sale) &&
    sale > 0
  ) {
    return sale;
  }
  return Number(pkg.price ?? 0);
};

const selectedImage = (pkg: PackageRow) => {
  const sku = selectedSku(pkg);
  if (sku?.image_url) return getImageUrl(sku.image_url);
  if (pkg.title_image_url) return getImageUrl(pkg.title_image_url);
  return getImageUrl(null);
};

const inclusionsFor = (pkg: PackageRow) =>
  [...(pkg.package_inclusions || [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

/** Build hotspots from inclusions + position layout */
const getHotspots = (pkg: PackageRow): Hotspot[] => {
  const layout = HOTSPOT_LAYOUT[pkg.slug] || HOTSPOT_LAYOUT.joy || [];
  const included = inclusionsFor(pkg).filter((r) => r.is_included);
  return layout.map((pos, i) => {
    const row =
      included.find((r) =>
        (r.inclusion_items?.slug || r.inclusion_items?.name || "")
          .toLowerCase()
          .includes((pos.match || "").toLowerCase()),
      ) || included[i];
    return {
      key: String(row?.inclusion_items?.id || i),
      top: pos.top,
      left: pos.left,
      label: row?.label_override || row?.inclusion_items?.name || "Feature",
      thumb: row?.inclusion_items?.image_url
        ? getImageUrl(row.inclusion_items.image_url)
        : undefined,
    };
  });
};

const getActiveSpot = (pkg: PackageRow) => {
  const key = activeHotspot.value[String(pkg.id)];
  if (!key) return null;
  return getHotspots(pkg).find((s) => s.key === key) || null;
};

const activateHotspot = (packageId: string | number, key: string) => {
  const id = String(packageId);
  activeHotspot.value[id] = activeHotspot.value[id] === key ? null : key;
};

const highlightInclusion = (pkg: PackageRow, row: PackageInclusion) => {
  const spots = getHotspots(pkg);
  const match = spots.find(
    (s) =>
      s.label === (row.label_override || row.inclusion_items?.name) ||
      s.key === String(row.inclusion_items?.id),
  );
  if (match) activateHotspot(pkg.id, match.key);
};

const selectSku = (packageId: string | number, skuId: string | number) => {
  selectedSkuId.value = { ...selectedSkuId.value, [String(packageId)]: skuId };
};

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/Images/placeholder-package.png";
};

const scrollToSpecs = () => {
  document
    .getElementById("package-specs")
    ?.scrollIntoView({ behavior: "smooth" });
};

const setPackageRef = (
  el: Element | ComponentPublicInstance | null,
  packageId: string | number,
) => {
  if (el instanceof HTMLElement) {
    packageRefs.value.set(packageId, el);
  } else {
    packageRefs.value.delete(packageId);
  }
};

const setImageRef = (
  el: Element | ComponentPublicInstance | null,
  packageId: string | number,
) => {
  if (el instanceof HTMLImageElement) {
    imageRefs.value.set(packageId, el);
  } else {
    imageRefs.value.delete(packageId);
  }
};

const handlePackageFocus = async (packageId: string | number) => {
  if (isAnimating.value || activePackageId.value === packageId) {
    return;
  }

  const imageElement = imageRefs.value.get(packageId);
  if (!imageElement) return;

  if (festivoRef.value?.interrupt) {
    festivoRef.value.interrupt();
  }

  const imageRect = imageElement.getBoundingClientRect();

  const targetRect = new DOMRect(
    imageRect.left + imageRect.width / 2 - 55,
    imageRect.bottom - 110,
    110,
    110,
  );

  activePackageId.value = packageId;
  activeCardRect.value = targetRect;
  isAnimating.value = true;

  await nextTick();

  setTimeout(() => {
    isAnimating.value = false;
  }, 1000);
};

const updateActivePackage = () => {
  if (isAnimating.value) return;

  let found = false;

  for (const [packageId, imageElement] of imageRefs.value) {
    if (found) break;

    if (!imageElement) continue;

    const rect = imageElement.getBoundingClientRect();
    const isInView =
      rect.top < window.innerHeight / 2 &&
      rect.bottom > window.innerHeight / 2 &&
      rect.top > -100;

    if (isInView && activePackageId.value !== packageId) {
      handlePackageFocus(packageId);
      found = true;
    }
  }
};

const load = async () => {
  loading.value = true;
  try {
    const [pkgRes, skuRes] = await Promise.all([
      db
        .from("packages")
        .select(
          `
          id, name, slug, description, price, sale_price,
          title_image_url, icon_url, is_popular, sort_order,
          package_inclusions (
            quantity, is_included, label_override, sort_order,
            inclusion_items ( id, name, slug, image_url )
          )
        `,
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      db
        .from("products")
        .select(
          "id, name, price, sale_price, stock, image_url, package_id, color_key, color_label",
        )
        .eq("is_package", true)
        .eq("is_active", true),
    ]);

    if (pkgRes.error) throw pkgRes.error;
    if (skuRes.error) throw skuRes.error;

    packages.value = pkgRes.data || [];
    skus.value = skuRes.data || [];

    const map: Record<string, string | number> = {};
    for (const pkg of packages.value) {
      const first = skusFor(pkg.id)[0];
      if (first) map[String(pkg.id)] = first.id;
    }
    selectedSkuId.value = map;

    if (packages.value.length > 0 && !activePackageId.value) {
      const firstPkg = packages.value[0];
      activePackageId.value = firstPkg!.id;

      await nextTick();
      const packageElement = packageRefs.value.get(firstPkg!.id);
      if (packageElement) {
        const imageElement = packageElement.querySelector(
          ".main-image",
        ) as HTMLImageElement;
        if (imageElement) {
          const imageRect = imageElement.getBoundingClientRect();
          activeCardRect.value = new DOMRect(
            imageRect.left + imageRect.width / 2 - 55,
            imageRect.top + imageRect.height / 2 - 55,
            110,
            110,
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
    packages.value = [];
    skus.value = [];
  } finally {
    loading.value = false;
  }
};

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

/** Add selected package color/SKU to cart — no redirect */
// const addPackageSku = async (pkg: PackageRow) => {
//   const sku = selectedSku(pkg);
//   if (!sku?.id) {
//     openCartModal(
//       "error",
//       "Select an option",
//       "Please choose a color before adding to cart.",
//     );
//     return;
//   }

//   addingId.value = sku.id;
//   try {
//     // Match your useCart signature — usually (productId, qty) only
//     const ok = await cart.addToCart(sku.id, 1);

//     if (ok !== false) {
//       if (typeof cart.loadCart === "function") {
//         await cart.loadCart();
//       }
//       openCartModal(
//         "success",
//         "Added to cart",
//         `${pkg.name || "Package"} was added to your cart.`,
//       );
//     } else {
//       openCartModal(
//         "error",
//         "Could not add",
//         "Something went wrong. Please try again.",
//       );
//     }
//   } catch (e: any) {
//     console.error("addPackageSku", e);
//     openCartModal(
//       "error",
//       "Could not add",
//       e?.message || "Something went wrong.",
//     );
//   } finally {
//     addingId.value = null;
//   }
// };
const addPackageSku = async (pkg: PackageRow) => {
  const sku = selectedSku(pkg);
  if (!sku?.id) {
    openCartModal(
      "error",
      "Select an option",
      "Please choose a color before adding to cart.",
    );
    return;
  }

  // Prefer sale_price when present and > 0
  const unitPrice =
    sku.sale_price != null && Number(sku.sale_price) > 0
      ? Number(sku.sale_price)
      : Number(sku.price ?? pkg.price ?? 0);

  addingId.value = sku.id;
  try {
    // If your useCart is (id, qty, isPackage?, options?)
    const ok = await cart.addToCart(sku.id, 1);

    // If signature is only (id, qty):
    // const ok = await cart.addToCart(sku.id, 1)

    if (ok !== false) {
      if (typeof cart.loadCart === "function") await cart.loadCart();
      openCartModal(
        "success",
        "Added to cart",
        `${pkg.name || "Package"} was added to your cart.`,
      );
    } else {
      openCartModal(
        "error",
        "Could not add",
        "Something went wrong. Please try again.",
      );
    }
  } catch (e: any) {
    console.error("addPackageSku", e);
    openCartModal(
      "error",
      "Could not add",
      e?.message || "Something went wrong.",
    );
  } finally {
    addingId.value = null;
  }
};

const { colors, loadColors, swatchStyle, byKey } = useProductColors();

const skusFor = (packageId: string | number) => {
  const list = skus.value.filter(
    (s) => String(s.package_id) === String(packageId),
  );

  return list.sort((a, b) => {
    const orderOf = (key?: string | null) => {
      const i = colors.value.findIndex((c) => c.color_key === key);
      return i === -1 ? 999 : i;
    };
    return orderOf(a.color_key) - orderOf(b.color_key);
  });
};

const activeLightboxImage = ref<string | null>(null);

const openLightbox = (pkg: PackageRow) => {
  activeLightboxImage.value = selectedImage(pkg);
  if (import.meta.client) document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  activeLightboxImage.value = null;
  if (import.meta.client) document.body.style.overflow = "";
};

const onPackageImageClick = (pkg: PackageRow) => {
  // Hotspot open → close it, do NOT open lightbox
  if (getActiveSpot(pkg)) {
    activeHotspot.value[String(pkg.id)] = null;
    return;
  }
  // No hotspot → open lightbox
  openLightbox(pkg);
};

const route = useRoute();

const scrollToPackage = async () => {
  const slug = route.query.package;
  if (!slug || typeof slug !== "string") return;

  await nextTick();
  // wait for list to render after fetch
  requestAnimationFrame(() => {
    const el = document.getElementById(`package-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

// Specs
const asArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const asObject = (val: unknown): Record<string, string> => {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      out[k] = String(v ?? "");
    }
    return out;
  }
  if (typeof val === "string") {
    try {
      return asObject(JSON.parse(val));
    } catch {
      return {};
    }
  }
  return {};
};

const colorList = (item: any) => asArray(item.color_options);
const featureList = (item: any) => asArray(item.features);
const specMap = (item: any) => asObject(item.specifications);

const loadInclusionSpecs = async () => {
  specsLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("inclusion_items")
      .select(
        "id, name, slug, description, color_options, features, specifications, sort_order",
      )
      .order("sort_order", { ascending: true });

    if (error) throw error;
    inclusionItems.value = data || [];
  } catch (e) {
    console.error(e);
    inclusionItems.value = [];
  } finally {
    specsLoading.value = false;
  }
};

onMounted(async () => {
  await loadColors();
  await load();
  await loadInclusionSpecs();

  if (!import.meta.client) return;

  await cart.loadCart();

  await scrollToPackage();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
  };
  window.addEventListener("keydown", onKey);
  onUnmounted(() => window.removeEventListener("keydown", onKey));
});
</script>
