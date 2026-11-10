<template>
  <section
    class="relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed py-12 md:py-16 z-[1] border-b-[18px] md:border-b-[27px] border-[#F49321]"
    id="holiday-packages"
  >
    <div class="absolute inset-0 z-[-1] pointer-events-none"></div>
    <div class="max-w-[1280px] mx-auto px-3 sm:px-5">
      <div v-fade class="text-center mb-6 md:mb-10">
        <p
          class="text-white font-extrabold text-[1.8rem] sm:text-4xl lg:text-[72px] tracking-wide uppercase sm:mb-1 md:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
        >
          CHOOSE YOUR
        </p>
        <h2
          class="text-[#F49321] font-extrabold text-[1.8rem] sm:text-4xl lg:text-[72px] tracking-wide uppercase [-webkit-text-stroke:1.5px_#fff] md:[-webkit-text-stroke:2px_#fff] [paint-order:stroke_fill] drop-shadow-[0_4px_10px_rgba(28,45,91,0.45)]"
        >
          HOLIDAY PACKAGE
        </h2>
      </div>

      <p
        v-fade
        class="text-center text-white font-bold tracking-[0.4px] text-[1.5rem] leading-snug mt-4 mb-4 sm:mt-6 sm:mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[95%] sm:max-w-none mx-auto"
      >
        INCLUDED IN EVERY PACKAGE
        <span class="block text-[1.1rem] font-semibold text-white/90 mt-1">
          (Each package is a rental for one season)
        </span>
      </p>

      <!-- NEW PILLS ADDED HERE -->
      <div
        v-fade
        class="flex flex-nowrap justify-center gap-3 sm:gap-10 mb-8 sm:mb-12"
      >
        <!-- Installation -->
        <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <div
            class="w-[56px] h-[56px] sm:w-[84px] sm:h-[84px] shrink-0 flex items-center justify-center"
          >
            <AssetsInstallation
              class="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]"
              aria-hidden="true"
              glow
            />
          </div>
          <span
            class="text-sm sm:text-lg font-bold uppercase tracking-wider text-white text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          >
            Installation
          </span>
        </div>

        <!-- Maintenance -->
        <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <div
            class="w-[56px] h-[56px] sm:w-[84px] sm:h-[84px] shrink-0 flex items-center justify-center"
          >
            <AssetsMaintenance
              class="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]"
              aria-hidden="true"
            />
          </div>
          <span
            class="text-sm sm:text-lg font-bold uppercase tracking-wider text-white text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          >
            Maintenance
          </span>
        </div>

        <!-- Removal -->
        <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <div
            class="w-[56px] h-[56px] sm:w-[84px] sm:h-[84px] shrink-0 flex items-center justify-center"
          >
            <AssetsRemoval
              class="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]"
              aria-hidden="true"
            />
          </div>
          <span
            class="text-sm sm:text-lg font-bold uppercase tracking-wider text-white text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          >
            Removal
          </span>
        </div>
      </div>

      <div v-if="pending" class="text-center py-10 text-white font-semibold">
        Loading holiday packages...
      </div>
      <div
        v-else-if="error"
        class="text-center py-10 text-red-400 font-semibold"
      >
        {{ error }}
      </div>

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-[30px] items-stretch max-w-[380px] sm:max-w-[420px] lg:max-w-none mx-auto"
      >
        <div
          v-for="(pkg, index) in packageProducts"
          :key="pkg.id"
          class="w-full max-w-[408px] mx-auto rounded-[28px] bg-brand-orange flex flex-col relative isolate"
          @mouseenter="handleCardHover"
        >
          <!-- ============================== -->
          <!-- Card Top: hero image (z-20)   -->
          <!-- ============================== -->
          <div class="relative p-2.5 sm:p-3 pb-0 z-20">
            <h3 class="sr-only">{{ pkg.name }}</h3>

            <div
              class="rounded-[22px] overflow-hidden relative leading-none w-full max-w-[400px] mx-auto"
            >
              <NuxtImg
                :src="pkg.image_url || '/Images/placeholder.png'"
                sizes="sm:100vw md:50vw lg:400px"
                height="200"
                custom
              >
                <template #default="{ imgAttrs, src }">
                  <img
                    v-bind="imgAttrs"
                    :src="src"
                    :alt="pkg.name"
                    class="w-full h-[180px] sm:h-[200px] object-cover block"
                    loading="lazy"
                  />
                </template>
              </NuxtImg>
              <div
                class="absolute -top-1/3 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              />
            </div>
          </div>

          <!-- ============================== -->
          <!-- Navy header (z-10)             -->
          <!-- ============================== -->
          <div
            class="relative -mt-[18px] sm:-mt-[20px] px-2 sm:px-4 pt-[24px] sm:pt-[32px] pb-3 sm:pb-4 flex items-center justify-between gap-1 sm:gap-3 bg-[#1C2D5B] z-10"
          >
            <!-- LEFT: Early Bird badge + Icon Circle -->
            <div class="flex items-center gap-1 sm:gap-3 shrink-0 z-10">
              <!-- Early Bird Badge -->
              <div
                v-if="showSale(pkg.sale_price)"
                class="flex flex-col items-center shrink-0 hidden sm:flex"
              >
                <div class="relative h-7 sm:h-8 md:h-9">
                  <NuxtImg
                    :src="earlyBirdIconUrl"
                    alt="Early Bird Special"
                    loading="eager"
                    decoding="sync"
                    class="relative z-0 h-7 sm:h-8 md:h-9 w-auto origin-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>

              <!-- Icon Circle -->
              <div
                class="rounded-full bg-brand-orange flex items-center justify-center shadow-[0_6px_16px_rgba(244,147,33,0.45)] w-[72px] h-[72px] shrink-0"
                aria-hidden="true"
              >
                <NuxtImg
                  class="object-contain w-[72px] h-[72px]"
                  :src="pkg.icon_url || '/Images/placeholder.png'"
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>

            <!-- CENTER: Title Image (Flex-1, Centered in remaining space) -->
            <div
              class="flex-1 flex items-center justify-start pl-3 sm:pl-5 lg:pl-4 min-w-0"
            >
              <NuxtImg
                class="w-auto max-w-full h-[72px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                :src="pkg.title_image_url || '/Images/placeholder.png'"
                :alt="pkg.name"
                loading="lazy"
              />
            </div>

            <!-- RIGHT: Pricing details -->
            <div
              class="flex flex-col items-end shrink-0 text-right leading-tight z-10"
            >
              <template v-if="showSale(pkg.sale_price)">
                <!-- Reduced text sizes slightly on mobile so the image has more room -->
                <span
                  class="text-[0.7rem] sm:text-[1rem] font-bold text-white leading-none mb-0.5"
                >
                  was
                  <span class="line-through decoration-[#EC008C] decoration-2">
                    ${{ Math.round(Number(pkg.price) || 0) }}
                  </span>
                </span>
                <span
                  class="text-[0.6rem] sm:text-[0.75rem] font-bold text-white leading-none"
                  >now</span
                >
                <span
                  class="text-[1.4rem] sm:text-[2.1rem] md:text-[2.5rem] font-black text-[#F49321] leading-none"
                >
                  ${{ Math.round(effectivePrice(pkg.price, pkg.sale_price)) }}
                </span>
                <span
                  class="text-[0.55rem] sm:text-[0.7rem] md:text-[0.8rem] font-semibold text-white/90"
                >
                  Per Season</span
                >
              </template>
              <template v-else>
                <span class="inline-flex items-baseline">
                  <!-- Same text size, scaled down visually, pushed up slightly to look like a superscript -->
                  <span
                    class="text-[2.3rem] sm:text-[2.1rem] md:text-[2.8rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 sm:-mr-2 translate-y-[-0.1em]"
                  >
                    $&nbsp;
                  </span>

                  <!-- The Numbers -->
                  <span
                    class="text-[2.4rem] sm:text-[2.1rem] md:text-[2.8rem] font-extrabold text-[#F49321] leading-none price-text -tracking-[0.04em]"
                  >
                    {{ Number(pkg.price || 0).toLocaleString() }}
                  </span>
                </span>
                <span
                  class="text-[1.1rem] sm:text-[0.7rem] md:text-[0.9rem] font-semibold text-white/90"
                >
                  Per Season</span
                >
              </template>
            </div>
          </div>

          <!-- ============================== -->
          <!-- White body: inclusions         -->
          <!-- ============================== -->
          <div
            class="bg-white rounded-b-[50px] sm:rounded-b-[70px] pt-[16px] sm:pt-[18px] px-3 sm:px-[14px] pb-[44px] sm:pb-[50px] flex-1 bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover relative z-10"
          >
            <div
              v-if="firstParagraph(pkg.description)"
              class="text-[0.75rem] sm:text-[0.78rem] md:text-[0.82rem] text-[#1C2D5B] text-start font-medium leading-snug mb-3 line-clamp-3 [&_p]:m-0 [&_strong]:font-bold [&_p]:line-clamp-3"
              v-html="firstParagraph(pkg.description)"
            ></div>
            <div
              v-if="includedRows(pkg).length"
              class="grid grid-cols-2 gap-x-3 gap-y-3 w-full"
            >
              <div
                v-for="(row, i) in includedRows(pkg)"
                :key="i"
                class="flex items-center gap-2 sm:gap-[10px] w-full min-w-0"
              >
                <div
                  class="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] md:w-[48px] md:h-[48px] rounded-full border-2 border-brand-orange overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                >
                  <NuxtImg
                    v-if="row.image_url"
                    :src="row.image_url"
                    :alt="row.name"
                    width="48"
                    height="48"
                    fit="cover"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="min-w-0">
                  <strong
                    class="text-[0.7rem] sm:text-[0.72rem] md:text-[0.78rem] text-[#1C2D5B] font-extrabold leading-[1.2] block"
                  >
                    {{ row.name }}
                  </strong>
                </div>
              </div>
            </div>
            <p v-else class="text-center text-gray-500 py-4 mb-0">
              No inclusions listed.
            </p>
          </div>

          <!-- ============================== -->
          <!-- Footer: Select button          -->
          <!-- ============================== -->
          <div
            class="bg-transparent px-[16px] pb-[16px] flex justify-center items-center relative z-20"
          >
            <button
              type="button"
              class="pkg-select-btn btn-gloss group relative overflow-hidden w-[85%] bg-brand-orange border-2 border-white rounded-[50px] py-[12px] sm:py-[14px] px-[16px] text-[1.4rem] uppercase font-bold tracking-[0.5px] cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out hover:bg-[#1C2D5B] -mt-[26px] sm:-mt-[30px]"
              @click="selectPackage(pkg)"
            >
              <span
                class="pkg-select-label relative z-10 inline-flex items-center justify-center gap-2"
              >
                <span class="pkg-select-prefix">{{
                  getPackageButtonPrefix(pkg)
                }}</span>
                <span class="pkg-select-name">{{
                  getPackageButtonName(pkg)
                }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <EarlyBirdEndsBanner />
    </div>

    <div v-fade class="flex justify-center mt-8 md:mt-12 relative z-20">
      <a
        href="#preview"
        class="pkg-select-btn group relative w-[85%] max-w-[408px] inline-block cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
      >
        <img
          src="/New/Packages/see-it-button.png"
          alt="See it on your home"
          class="w-full h-auto"
        />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import AssetsInstallation from "../Icons/AssetsInstallation.vue";
import AssetsMaintenance from "../Icons/AssetsMaintenance.vue";
import AssetsRemoval from "../Icons/AssetsRemoval.vue";

interface InclusionDisplay {
  name: string;
  image_url: string | null;
  is_included: boolean;
}

interface PackageOption {
  name: string;
  image_url?: string | null;
}

interface PackageVariation {
  name?: string;
  options?: PackageOption[];
}

interface PackageRow {
  id: string | number;
  name: string;
  slug: string;
  price: number | string;
  sale_price: number | string;
  is_popular?: boolean;
  is_package?: boolean;
  package_data?: string | null;
  image_url?: string | null;
  icon_url?: string | null;
  variations?: PackageVariation[];
  package_inclusions?: any[];
  inclusions?: any[];
  title_image_url: string;
  description?: string;
}

const { data, pending, error } = await useFetch("/api/packages");

const packages = ref<PackageRow[]>([]);

if (data.value?.packages) {
  packages.value = data.value.packages as any;
}

const packageProducts = computed(() => packages.value);

const includedRows = (pkg: PackageRow) => {
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

  return mapped.filter((r) => r.is_included);
};

const selectPackage = (pkg: PackageRow) => {
  navigateTo(`/packages/${pkg.slug}#package`);
};

const handleCardHover = () => {
  // intentionally empty
};

const getPackageButtonPrefix = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "Order";
  if (name.includes("jolly")) return "Order";
  if (name.includes("merry")) return "Order";
  return "Choose";
};

const firstParagraph = (text?: string | null) => {
  if (!text) return "";
  const parts = text
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[0] || "";
};

const getPackageButtonName = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "Joy  NOW";
  if (name.includes("jolly")) return "Jolly NOW";
  if (name.includes("merry")) return "Merry NOW";
  return pkg.name.toUpperCase();
};

const { loadEarlyBird, showSale, effectivePrice, earlyBirdIconUrl } =
  await useEarlyBirdSpecial();

const starburstSrc = "/Images/Holiday-Lighting-Package/starburst-small.png";

onMounted(async () => {
  await loadEarlyBird();
});
</script>

<style scoped>
.pkg-select-btn {
  color: #fff;
}

.pkg-select-label {
  color: #fff;
  gap: 0.5rem; /* Added more space between Order and the package name */
}

/* Always show "Order" */
.pkg-select-prefix {
  display: inline-block;
  color: #fff !important;
}

.pkg-select-name {
  color: #fff !important;
}

@keyframes glossyShineContinuous {
  0% {
    transform: rotate(25deg) translateX(-100%);
  }
  100% {
    transform: rotate(25deg) translateX(100%);
  }
}

@media (hover: none), (pointer: coarse) {
  .pkg-select-btn {
    background-color: #1c2d5b;
  }

  .pkg-select-btn:active {
    background-color: #f49321;
  }
}

.price-text {
  /* Keeps your tight spacing */
  letter-spacing: -0.05em;
}
</style>
