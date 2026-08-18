<template>
  <section
    class="py-[70px] bg-white scroll-mt-[110px] bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover"
    id="packages"
  >
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-10">
        <h2
          class="text-navy uppercase font-bold text-2xl sm:text-3xl lg:text-4xl max-sm:text-[1.125rem] max-sm:leading-[1.3]"
        >
          Festive Express makes<br />professional
          <span class="text-brand-orange">holiday lighting</span> simple.
        </h2>
        <p
          class="text-black max-w-[80%] mx-auto leading-[1.3] text-xl max-sm:text-[0.95rem] mt-2"
        >
          Choose one of three fixed lease packages.<br />
          Pay once. Pick your install date and take-down date. We handle the
          rest.
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
            :disableShrink="false"
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
            <div
              class="rounded-[22px] border-4 border-brand-orange overflow-hidden relative leading-none"
            >
              <img
                :ref="(el) => setImageRef(el, pkg.id)"
                :src="getImageUrl(pkg.image_url)"
                :alt="pkg.name"
                class="w-full h-[200px] object-cover block"
              />
              <!-- Glossy Shine Overlay -->
              <div
                class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              ></div>
            </div>

            <img
              class="absolute left-[45px] max-sm:left-5 -bottom-[38px] max-sm:-bottom-[28px] h-[72px] max-sm:h-[56px] w-auto z-[2] pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
              :src="getPackageTitleImage(pkg)"
              :alt="pkg.name"
            />

            <div
              class="absolute right-[16px] max-sm:right-3 -bottom-[30px] max-sm:-bottom-[24px] w-[76px] h-[76px] max-sm:w-[64px] max-sm:h-[64px] rounded-full bg-brand-orange flex items-center justify-center z-[3] shadow-[0_6px_16px_rgba(244,147,33,0.45)]"
              aria-hidden="true"
            >
              <img
                class="absolute -left-[46px] top-[7px] w-[100px] h-[100px] object-contain -z-10"
                :src="starburstSrc"
                alt=""
              />
              <img
                class="w-[76px] h-[76px] max-sm:w-[64px] max-sm:h-[64px] object-contain"
                :src="getPackageIcon(pkg)"
                alt=""
              />
            </div>
          </div>

          <!-- Card Panel -->
          <div
            class="flex items-end justify-between gap-3 pb-[22px] pt-[140px] max-sm:pt-[100px] -mt-[90px] max-sm:-mt-[70px] rounded-[28px] bg-navy max-sm:flex-wrap max-sm:gap-2.5 px-[18px] max-sm:px-[14px]"
          >
            <!-- Tooltip Action Button -->
            <div class="relative">
              <button
                type="button"
                class="btn-inclusions flex flex-col items-center justify-center gap-1.5 bg-transparent border-2 border-white/90 rounded-xl text-white text-[0.75rem] max-sm:text-[0.72rem] font-semibold leading-[1.25] text-center py-3 px-4 max-sm:py-2.5 max-sm:px-3 cursor-pointer transition-colors duration-200"
                @click.stop="handleExploreClick(pkg.id, $event)"
              >
                <i class="fas fa-gift text-[1.4rem] text-brand-orange"></i>
                <span class="block text-center"
                  >Explore Package<br />Details</span
                >
              </button>

              <!-- Tooltip Content -->
              <!-- <div
                class="absolute top-full left-0 bg-white border border-gray-300 rounded-xl p-3.5 w-[280px] max-w-[90vw] shadow-[0_10px_25px_rgba(28,45,91,0.15)] opacity-0 invisible transition-all duration-250 z-30 mt-2 text-left text-navy"
                :class="{ '!opacity-100 !visible': openTooltipId === pkg.id }"
              >
                <template v-if="pkg.variations?.length">
                  <div
                    v-for="(variation, vIndex) in pkg.variations"
                    :key="vIndex"
                    class="mb-2 last:mb-0"
                  >
                    <strong class="block mb-1">{{ variation.name }}:</strong>
                    <div
                      v-for="(option, oIndex) in variation.options"
                      :key="oIndex"
                      class="flex items-center gap-2.5 py-1.5 border-b border-gray-300 text-sm last:border-b-0"
                    >
                      <img
                        v-if="option.image_url"
                        :src="getImageUrl(option.image_url)"
                        class="w-10 h-10 object-cover rounded-md"
                        alt=""
                      >
                      {{ option.name }}
                    </div>
                  </div>
                </template>
                <p v-else class="mb-0">No inclusions listed.</p>
              </div> -->

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

            <!-- Price & Cart Actions -->
            <div class="flex flex-col items-end gap-2.5">
              <!-- <div class="text-[1.45rem] max-sm:text-[1.4rem] font-extrabold text-white">${{ Math.round(Number(pkg.price) || 0) }} / season</div> -->
              <div
                class="text-[1rem] max-sm:text-[1rem] font-extrabold text-white"
              >
                ${{ Math.round(Number(pkg.price) || 0) }} / season
              </div>
              <button
                type="button"
                class="w-12 h-12 border-none rounded-xl bg-brand-orange text-white cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-[#ff890b] hover:animate-[festive-express-animation-pulse-grow_0.3s_linear_infinite_alternate]"
                :aria-label="`Select ${pkg.name}`"
                @click="selectPackage(pkg)"
              >
                <i class="fas fa-shopping-cart text-[1.2rem] text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="text-center mt-6 mb-4">
        <h4
          class="text-black font-medium leading-[1.3] max-w-[80%] mx-auto mb-5 text-lg"
        >
          Every package is professionally installed, maintained through the
          season, and taken down when you’re ready. You simply enjoy the
          holidays.
        </h4>
        <NuxtLink
          to="/packages"
          class="relative overflow-hidden border-2 border-navy inline-block font-semibold px-6 py-3 rounded-lg bg-brand-orange text-white animate-[festive-express-animation-pulse-grow_0.5s_linear_infinite_alternate] after:content-[''] after:absolute after:-top-1/2 after:-left-[150%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255)_80%)] after:rotate-[25deg] after:pointer-events-none after:animate-[glossyShineContinuous_3s_linear_infinite]"
        >
          Which Package Fits Your Home?
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
import { ref, onMounted, computed, nextTick } from "vue";
import HomeFestivoAnimation from "./FestivoAnimation.vue";
import type { FestivoConfig } from "./Festivo";

/** New packages table shape */
interface PackageRow {
  id: number;
  name: string;
  slug: string;
  price: number | string;
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
    jumpOffsetX: -100,
    jumpOffsetY: -120,
    jumpPeakHeight: 150,
  };
});

const BASE = "/Images/Holiday-Lighting-Package";
const starburstSrc = "/Images/Holiday-Lighting-Package/starburst.png";

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
  // if Supabase embeds as object or array depending on FK
  inclusion_items?: InclusionItem | InclusionItem[] | null;
  // sometimes named inclusion_item (singular)
  inclusion_item?: InclusionItem | null;
}

interface PackageRow {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  image_url?: string | null;
  title_image_url?: string | null;
  icon_url?: string | null;
  features?: string[] | null;
  package_inclusions?: PackageInclusionRow[] | null;
  // alternate relation name
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

/** All rows for a package (with is_included) */
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

onMounted(() => {
  fetchPackages();

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

const handleExploreClick = async (packageId: number, event: MouseEvent) => {
  const isOpening = openTooltipId.value !== packageId;

  if (isOpening) {
    const imageElement = cardImageRefs.value.get(packageId);

    if (imageElement) {
      const imageRect = imageElement.getBoundingClientRect();

      const targetRect = new DOMRect(
        imageRect.left + imageRect.width / 2 - 55,
        imageRect.bottom,
        110,
        110,
      );

      isAnimating.value = true;
      await nextTick();

      if (festivoRef.value) {
        festivoRef.value.jumpToButton(targetRect);
      } else {
        console.log("festivoRef is null!");
      }

      openTooltipId.value = packageId;

      setTimeout(() => {
        isAnimating.value = false;
      }, 2200);
    } else {
      const button = event.currentTarget as HTMLElement;
      const card = button?.closest(".package-card-v2") as HTMLElement;
      if (card) {
        const cardRect = card.getBoundingClientRect();
        activeCardRect.value = cardRect;
      }
    }
  } else {
    openTooltipId.value = null;
  }
};

/** Keep same name used in template */
const packageProducts = computed(() => packages.value);

/** Cart / detail: use slug (packages page) */
const selectPackage = (pkg: PackageRow) => {
  navigateTo(`/packages?package=${pkg.slug}`);
  // or: navigateTo(`/checkout?package=${pkg.slug}`)
};

// const getImageUrl = (url: string | null | undefined) => {

//   if (!url) return '/Images/placeholder.png'
//   if (url.startsWith('http') || url.startsWith('/')) return url

//   const path = url
//     .replace(/^\//, '')
//     .replace(/^products\//i, '')
//     .replace(/^Products\//i, '')
//     .replace(/^packages\//i, '')

//   const supabaseUrl =
//     (config.public as any).supabaseUrl ||
//     (config.public as any).supabase?.url ||
//     ''

//   const bucket = ((config.public as any).storageBucket as string) || 'Products'

//   return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
// }

const getImageUrl = (url: string | null | undefined) => {
  if (url == null || String(url).trim() === "") {
    return "/Images/placeholder.png";
  }

  const raw = String(url).trim();

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/Images/") || raw.startsWith("/images/")) return raw;

  // keep folder names: packages/Icon1.png → Products/packages/Icon1.png
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

/** features may be string[] or JSON string from DB */
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

@keyframes glossyShineContinuous {
  0% {
    transform: translateX(-100%) rotate(25deg);
  }
  100% {
    transform: translateX(200%) rotate(25deg);
  }
}

@keyframes festive-express-animation-pulse-grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.04);
  }
}
</style>
