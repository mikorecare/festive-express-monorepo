<template>
  <section
    class="py-[70px] bg-white scroll-mt-[110px] bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover"
    id="packages"
  >
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-10">
        <h2
          class="text-center font-black text-navy tracking-wide sm:tracking-wider uppercase text-[1.05rem] sm:text-3xl lg:text-4xl leading-tight"
        >
          Festive Express makes<br />professional
          <span class="text-brand-orange">holiday lighting</span> simple.
        </h2>
        <p
          class="text-center text-navy font-bold tracking-[0.4px] text-[0.72rem] sm:text-[1.15rem] leading-tight mt-2 max-w-[80%] mx-auto"
        >
          Choose one of three fixed rental packages*.<br />
          Pay online. Pick your install and take-down dates. We handle the rest.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10 text-navy font-semibold">
        Loading holiday packages...
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-10 text-red-500 font-semibold"
      >
        {{ error }}
      </div>

      <!-- Package Cards Row -->
      <div
        v-else
        class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-sm:grid-cols-1 gap-8 max-sm:gap-12 justify-items-center mb-12"
      >
        <ClientOnly>
          <HomeFestivoAnimation
            ref="festivoRef"
            :targetRect="activeCardRect"
            :config="festivoConfig"
            initialState="talk"
            :useJump="false"
            :disableShrink="true"
          />
        </ClientOnly>

        <div
          v-for="pkg in packageProducts"
          :key="pkg.id"
          class="w-full max-w-[340px] rounded-[28px] overflow-visible shadow-[0_14px_36px_rgba(28,45,91,0.28)]"
          @mouseenter="handleCardHover"
        >
          <!-- Card Top -->
          <div class="relative p-3 pb-0">
            <!-- One title; only left offset changes -->
            <img
              class="absolute z-[2] pointer-events-none w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] -bottom-[28px] h-[60px] md:-bottom-[34px] md:h-[68px] lg:-bottom-[38px] lg:h-[72px] left-6 md:left-[58px] lg:left-[20px]"
              :src="getPackageTitleImage(pkg)"
              :alt="pkg.name"
            />

            <div
              class="rounded-[22px] border-4 border-brand-orange overflow-hidden relative leading-none"
            >
              <img
                :ref="(el) => setImageRef(el, pkg.id)"
                :src="getImageUrl(pkg.image_url)"
                :alt="pkg.name"
                class="w-full h-[200px] object-cover block"
              />
              <div
                class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              />
            </div>

            <!-- Icon always left when on sale; right when not -->
            <div
              class="absolute z-[1] rounded-full bg-brand-orange flex items-center justify-center shadow-[0_6px_16px_rgba(244,147,33,0.45)] right-[30px] max-sm:right-3 -bottom-[30px] max-sm:-bottom-[24px] w-[64px] h-[64px] max-sm:w-[64px] max-sm:h-[64px]"
              aria-hidden="true"
            >
              <img
                class="object-contain w-[64px] h-[64px] max-sm:w-[64px] max-sm:h-[64px]"
                :src="getPackageIcon(pkg)"
                alt=""
              />
            </div>

            <!-- <img
              v-if="showSale(pkg.sale_price)"
              :src="EarlyBirdSpecialRibbonSrc"
              alt="Early Bird Special"
              class="absolute z-[3] pointer-events-none w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] right-2 -bottom-[55px] h-[120px] md:right-2 md:-bottom-[55px] md:h-[120px] lg:right-[18px] lg:-bottom-[75px] lg:h-[120px]"
            /> -->
          </div>

          <!-- Card Panel -->
          <div
            class="flex items-end justify-between gap-2 pb-[22px] pt-[140px] max-sm:pt-[100px] -mt-[90px] max-sm:-mt-[70px] rounded-[28px] bg-navy max-sm:flex-wrap max-sm:gap-2.5 px-[18px] max-sm:px-[14px]"
          >
            <div class="relative">
              <button
                type="button"
                class="btn-inclusions flex flex-col items-center justify-center gap-1.5 bg-transparent border-2 border-white/90 rounded-xl text-white text-[0.72rem] max-sm:text-[0.72rem] font-semibold leading-[1.25] text-center py-2.5 px-3 max-sm:py-2.5 max-sm:px-3 cursor-pointer transition-colors duration-200"
                @click.stop="handleExploreClick(pkg.id, $event)"
              >
                <GiftIcon
                  class="w-6 h-6 text-brand-orange"
                  aria-hidden="true"
                />
                <span class="block text-center"
                  >Explore Package<br />Details</span
                >
              </button>

              <div
                class="absolute top-full left-0 bg-white border border-gray-300 rounded-xl p-3.5 w-[280px] max-w-[90vw] shadow-[0_10px_25px_rgba(28,45,91,0.15)] opacity-0 invisible transition-all duration-250 z-30 mt-2 text-left text-navy"
                :class="{ '!opacity-100 !visible': openTooltipId === pkg.id }"
                @click.stop
              >
                <template
                  v-if="inclusionsFor(pkg).filter((r) => r.is_included).length"
                >
                  <div
                    v-for="(row, i) in inclusionsFor(pkg).filter(
                      (r) => r.is_included,
                    )"
                    :key="i"
                    class="flex items-center gap-2.5 py-1.5 border-b border-gray-300 text-sm last:border-b-0"
                  >
                    <img
                      v-if="row.image_url"
                      :src="getImageUrl(row.image_url)"
                      class="w-8 h-8 object-contain flex-shrink-0"
                      alt=""
                    />
                    <span>{{ row.name }}</span>
                  </div>
                </template>
                <p v-else class="mb-0">No inclusions listed.</p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div
                v-if="showSale(pkg.sale_price)"
                class="relative flex justify-end"
              >
                <img
                  class="absolute pointer-events-none object-contain z-[1] w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 -top-4 -right-[19px] md:-top-5 md:-right-[22px] lg:-top-6 lg:-right-[25px]"
                  :src="starburstSrc"
                  alt=""
                />
                <img
                  :src="EarlyBirdSpecialRibbonSrc"
                  alt="Early Bird Special"
                  class="relative z-0 h-8 md:h-9 w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                />
              </div>

              <template v-if="showSale(pkg.sale_price)">
                <div class="text-center leading-tight text-white">
                  <span
                    class="block text-[0.9rem] max-sm:text-[0.75rem] font-bold text-white"
                  >
                    was
                    <span
                      class="line-through decoration-brand-orange decoration-2"
                    >
                      ${{ Math.round(Number(pkg.price) || 0) }}
                    </span>
                  </span>
                  <span
                    class="block text-[1.3rem] max-sm:text-[1.3rem] font-extrabold text-white"
                  >
                    <span
                      class="text-[0.9rem] max-sm:text-[0.75rem] font-bold text-white"
                    >
                      now
                    </span>
                    <span class="text-brand-orange">
                      ${{
                        Math.round(effectivePrice(pkg.price, pkg.sale_price))
                      }}
                    </span>
                    <span class="text-[0.85rem] font-semibold text-white/90"
                      >/ Season</span
                    >
                  </span>
                </div>
              </template>
              <template v-else>
                <div
                  class="text-[1rem] max-sm:text-[1rem] font-extrabold text-white"
                >
                  <span
                    class="text-brand-orange text-[1.3rem] max-sm:text-[1.3rem]"
                  >
                    ${{ Math.round(Number(pkg.price) || 0) }}
                  </span>
                  <span class="text-[0.85rem] font-semibold text-white/90"
                    >/ Season</span
                  >
                </div>
              </template>

              <button
                type="button"
                class="w-12 h-12 border-none rounded-xl bg-brand-orange text-white cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-[#F49321] hover:animate-[festive-express-animation-pulse-grow_0.3s_linear_infinite_alternate]"
                :aria-label="`Select ${pkg.name}`"
                @click="selectPackage(pkg)"
              >
                <ShoppingCartIcon class="w-7 h-7" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center my-5">
        <EarlyBirdEndsBanner />
      </div>

      <!-- Footer Note -->
      <div class="text-center mt-6 mb-4">
        <h4
          class="text-navy font-medium leading-[1.3] max-w-[80%] mx-auto mb-5 text-sm sm:text-base md:text-lg text-center"
        >
          Every package is professionally installed, maintained through the
          season, and taken down when you’re ready.<br />You simply enjoy the
          holidays.
        </h4>

        <div
          class="relative isolate my-8 max-lg:my-6 flex flex-col items-center justify-center gap-2 text-center"
        >
          <!-- Button 1 -->
          <PreviewYourHomeButton />

          <!-- Button 2 -->
          <NuxtLink
            to="/packages"
            class="relative z-10 overflow-hidden inline-block font-semibold px-6 py-3 rounded-full bg-brand-orange text-white animate-[festive-express-animation-pulse-grow_1.4s_ease-in-out_infinite_alternate] after:content-[''] after:absolute after:-top-1/2 after:-left-[150%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] after:rotate-[25deg] after:pointer-events-none"
          >
            Which Package Fits Your Home?
          </NuxtLink>
        </div>

        <p class="text-navy">*Each package is a rental for one season.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
import { ref, onMounted, computed, nextTick } from "vue";
import HomeFestivoAnimation from "./FestivoAnimation.vue";
import type { FestivoConfig, FestivoState } from "./Festivo";

import { ShoppingCartIcon, GiftIcon } from "@heroicons/vue/24/outline";

interface PackageRow {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  sale_price: number | string;
  description?: string | null;
  max_roofline_ft?: number | null;
  features?: string[] | null;
  is_popular?: boolean;
  color?: string | null;
  image_url?: string | null;
  title_image_url?: string | null;
  icon_url?: string | null;
  sort_order?: number | null;
  created_at?: string;
}

const packages = ref<PackageRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const openTooltipId = ref<number | null>(null);
const activeCardRect = ref<DOMRect | null>(null);
const isAnimating = ref(false);
const cardImageRefs = ref<Map<number, HTMLImageElement>>(new Map());
const festivoRef = ref<InstanceType<typeof HomeFestivoAnimation> | null>(null);

const festivoConfig = computed<FestivoConfig>(() => {
  const isMobile = window.innerWidth < 768;

  return {
    imagePath: (state: string, frame: number) =>
      `/Images/Festivo/${state}-3d-${frame}.png`,
    moveOffsetX: isMobile ? -50 : -100,
    moveOffsetY: 100,
    joyOffsetX: 120,
    joyOffsetY: 120,
    jollyOffsetX: 120,
    jollyOffsetY: 120,
    merryOffsetX: 120,
    merryOffsetY: 120,
    jumpPeakHeight: 80,
  };
});

const BASE = "/Images/Holiday-Lighting-Package";
const starburstSrc = "/Images/Holiday-Lighting-Package/starburst.png";
// const EarlyBirdSpecialRibbonSrc = "/Images/Artboard-1ribbon.svg";
const EarlyBirdSpecialRibbonSrc = "/Images/earlybird.png";

interface InclusionItem {
  id?: number;
  name?: string;
  image_url?: string | null;
}

interface PackageInclusionRow {
  id?: number;
  package_id?: number;
  is_included?: boolean;
  inclusion_item_id?: number;
  inclusion_items?: InclusionItem | InclusionItem[] | null;
  inclusion_item?: InclusionItem | null;
}

interface PackageRow {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  sale_price: number | string;
  image_url?: string | null;
  title_image_url?: string | null;
  icon_url?: string | null;
  features?: string[] | null;
  package_inclusions?: PackageInclusionRow[] | null;
  inclusions?: PackageInclusionRow[] | null;
}

const fetchPackages = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: sbError } = await (supabase.from("packages") as any)
      .select(
        `
        *,
        package_inclusions (
          id,
          is_included,
          inclusion_items (
            id,
            name,
            image_url
          )
        )
      `,
      )
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (sbError) throw sbError;
    packages.value = (data as PackageRow[]) || [];
  } catch (err: any) {
    console.error(err);
    error.value = err.message || "Failed to load packages.";
  } finally {
    loading.value = false;
  }
};

type InclusionDisplay = {
  name: string;
  image_url: string | null;
  is_included: boolean;
};

const inclusionsFor = (pkg: PackageRow): InclusionDisplay[] => {
  const rows = pkg.package_inclusions || pkg.inclusions || [];
  const mapped: InclusionDisplay[] = [];

  for (const row of rows) {
    const item = Array.isArray(row.inclusion_items)
      ? row.inclusion_items[0]
      : row.inclusion_items || row.inclusion_item;

    if (!item?.name) continue;

    mapped.push({
      name: item.name,
      image_url: item.image_url ?? null,
      is_included: row.is_included === true,
    });
  }

  return mapped;
};

const setImageRef = (
  el: Element | ComponentPublicInstance | null,
  packageId: number,
) => {
  if (el instanceof HTMLImageElement) {
    cardImageRefs.value.set(packageId, el);
  } else {
    cardImageRefs.value.delete(packageId);
  }
};

const { loadEarlyBird, showSale, effectivePrice } = useEarlyBirdSpecial();

onMounted(async () => {
  await Promise.all([fetchPackages(), loadEarlyBird()]);

  if (import.meta.client) {
    window.addEventListener("click", () => {
      openTooltipId.value = null;
    });
  }
});

const handleCardHover = (event: MouseEvent) => {
  if (isAnimating.value) return;

  const target = event.currentTarget as HTMLElement;
  if (target) {
    activeCardRect.value = target.getBoundingClientRect();
  }
};

const getStateByIndex = (index: number): FestivoState => {
  const states: FestivoState[] = ["joy", "jolly", "merry"];
  return states[index] || "joy";
};

const handleExploreClick = async (packageId: number, event: MouseEvent) => {
  const isOpening = openTooltipId.value !== packageId;

  if (isOpening) {
    const imageElement = cardImageRefs.value.get(packageId);

    if (imageElement) {
      const imageRect = imageElement.getBoundingClientRect();

      const targetRect = new DOMRect(
        imageRect.left + imageRect.width / 2 - 55,
        imageRect.bottom + 10,
        110,
        110,
      );

      isAnimating.value = true;
      await nextTick();

      if (festivoRef.value) {
        const pkgIndex = packageProducts.value.findIndex(
          (p) => p.id === packageId,
        );

        if (pkgIndex === 0) {
          festivoRef.value.joyToPosition(targetRect);
        } else if (pkgIndex === 1) {
          festivoRef.value.jollyToPosition(targetRect);
        } else if (pkgIndex === 2) {
          festivoRef.value.merryToPosition(targetRect);
        } else {
          festivoRef.value.joyToPosition(targetRect); // fallback
        }
      }

      openTooltipId.value = packageId;

      setTimeout(() => {
        isAnimating.value = false;
      }, 2200);
    }
  } else {
    openTooltipId.value = null;
  }
};

const packageProducts = computed(() => packages.value);

const selectPackage = (pkg: PackageRow) => {
  navigateTo(`/packages?package=${pkg.slug}`);
};

const getImageUrl = (url: string | null | undefined) => {
  if (url == null || String(url).trim() === "") {
    return "/Images/placeholder.png";
  }

  const raw = String(url).trim();

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/Images/") || raw.startsWith("/images/")) return raw;

  const path = raw.replace(/^\/+/, "").replace(/^products\//i, "");

  const supabaseUrl =
    (config.public as any).supabaseUrl ||
    (config.public as any).supabase?.url ||
    "";

  const bucket = ((config.public as any).storageBucket as string) || "Products";

  if (!supabaseUrl) return "/Images/placeholder.png";

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const getPackageTitleImage = (pkg: PackageRow) => {
  if (pkg.title_image_url) return getImageUrl(pkg.title_image_url);
  const n = pkg.name.toLowerCase();
  if (n.includes("jolly")) return `${BASE}/Jolly.png`;
  if (n.includes("merry")) return `${BASE}/Merry.png`;
  return `${BASE}/Joy.png`;
};

const getPackageIcon = (pkg: PackageRow) => {
  if (pkg.icon_url) return getImageUrl(pkg.icon_url);
  const n = pkg.name.toLowerCase();
  if (n.includes("jolly")) return `${BASE}/Icon2.png`;
  if (n.includes("merry")) return `${BASE}/Icon3.png`;
  return `${BASE}/Icon1.png`;
};

type FeatureItem = { name: string; image_url?: string | null };

const getFeatures = (pkg: PackageRow): FeatureItem[] => {
  const f = pkg.features as unknown;
  if (!f) return [];

  let list: unknown = f;
  if (typeof f === "string") {
    try {
      list = JSON.parse(f);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];

  return list.map((item) => {
    if (typeof item === "string") return { name: item, image_url: null };
    if (item && typeof item === "object" && "name" in item) {
      const o = item as FeatureItem;
      return { name: String(o.name), image_url: o.image_url ?? null };
    }
    return { name: String(item), image_url: null };
  });
};
</script>

<style scoped>
.btn-inclusions:hover {
  border-color: var(--orange, #ff7a00) !important;
  background: rgba(244, 147, 33, 0.15) !important;
}

@keyframes festive-express-animation-pulse-grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.03);
  }
}
</style>
