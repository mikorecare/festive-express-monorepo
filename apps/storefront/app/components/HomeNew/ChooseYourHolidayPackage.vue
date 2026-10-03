<template>
  <section
    class="relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed py-16 z-[1] border-b-[27px] border-[#F49321]"
  >
    <div class="absolute inset-0 z-[-1] pointer-events-none"></div>
    <div class="max-w-[1280px] mx-auto px-4 sm:px-5">
      <h2
        v-fade
        class="flex flex-col items-center text-center font-black text-white tracking-wide sm:tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] uppercase whitespace-nowrap text-[1.05rem] sm:text-3xl lg:text-[60px] leading-tight"
      >
        <span class="block mb-2">CHOOSE YOUR</span>
        <span
          class="block mt-2 sm:mt-3 lg:mt-5 text-brand-orange [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff]"
        >
          HOLIDAY PACKAGE
        </span>
      </h2>
      <p
        v-fade
        class="text-center text-white font-bold tracking-[0.4px] whitespace-nowrap text-[0.72rem] sm:text-[1.15rem] leading-tight my-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
      >
        COMPARE WHAT’S INCLUDED IN EACH PLAN (Each package is a rental for one
        season)
      </p>

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
        class="grid grid-cols-1 lg:grid-cols-3 gap-[30px] items-stretch max-lg:max-w-[420px] max-lg:mx-auto"
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
          <div class="relative p-3 pb-0 z-20 px-2 pt-2">
            <h3 class="sr-only">{{ pkg.name }}</h3>

            <NuxtImg
              class="absolute z-[3] pointer-events-none w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] -bottom-[28px] h-[60px] md:-bottom-[34px] md:h-[68px] lg:-bottom-[38px] lg:h-[72px] left-[85px] md:left-[58px] lg:left-[85px]"
              :src="pkg.title_image_url || '/Images/placeholder.png'"
              :alt="pkg.name"
              sizes="60px md:68px lg:72px"
              loading="lazy"
            />

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
                    class="w-full h-[200px] object-cover block"
                    loading="lazy"
                  />
                </template>
              </NuxtImg>
              <div
                class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              />
            </div>

            <div
              class="absolute z-[3] rounded-full bg-brand-orange flex items-center justify-center shadow-[0_6px_16px_rgba(244,147,33,0.45)] left-[20px] max-sm:right-3 -bottom-[30px] max-sm:-bottom-[24px] w-[64px] h-[64px]"
              aria-hidden="true"
            >
              <NuxtImg
                class="object-contain w-[64px] h-[64px]"
                :src="pkg.icon_url || '/Images/placeholder.png'"
                alt=""
                loading="lazy"
                width="64"
                height="64"
              />
            </div>
          </div>

          <!-- ============================== -->
          <!-- Navy header (z-10)             -->
          <!-- Early Bird LEFT, price RIGHT   -->
          <!-- ============================== -->
          <div
            class="relative -mt-[20px] px-4 pt-[50px] pb-3 flex items-center justify-between gap-3 bg-[#1C2D5B] z-10"
          >
            <!-- LEFT: Early Bird badge only -->
            <div
              v-if="showSale(pkg.sale_price)"
              class="flex flex-col items-center shrink-0"
            >
              <div class="relative">
                <NuxtImg
                  :src="earlyBirdIconUrl"
                  alt="Early Bird Special"
                  class="relative z-0 h-8 md:h-9 w-auto origin-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
                  loading="lazy"
                />
                <img
                  :src="starburstSrc"
                  alt=""
                  class="absolute z-[1] top-[-52%] right-[-19px] md:top-[-44%] md:right-[-23px] lg:top-[-58%] lg:right-[-28px] h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain pointer-events-none"
                />
              </div>
            </div>
            <div v-else class="flex-1 min-w-0">
              <h3 class="sr-only">{{ pkg.name }}</h3>
            </div>

            <!-- RIGHT: was / now / price / season -->
            <div
              class="flex flex-col items-end shrink-0 text-right leading-tight -mt-4"
            >
              <template v-if="showSale(pkg.sale_price)">
                <span class="text-[1rem] font-bold text-white">
                  was
                  <span class="line-through decoration-[#EC008C] decoration-2">
                    ${{ Math.round(Number(pkg.price) || 0) }}
                  </span>
                </span>
                <span class="text-[0.75rem] font-bold text-white">now</span>
                <span
                  class="text-[1.5rem] md:text-[1.8rem] font-black text-[#F49321] leading-none"
                >
                  ${{ Math.round(effectivePrice(pkg.price, pkg.sale_price)) }}
                </span>
                <span
                  class="text-[0.7rem] md:text-[0.8rem] font-semibold text-white/90"
                  >/ Season</span
                >
              </template>
              <template v-else>
                <span
                  class="text-[1.5rem] md:text-[1.8rem] font-black text-brand-orange leading-none"
                >
                  ${{ Math.round(Number(pkg.price) || 0) }}
                </span>
                <span
                  class="text-[0.7rem] md:text-[0.8rem] font-semibold text-white/90"
                  >/ Season</span
                >
              </template>
            </div>
          </div>

          <!-- ============================== -->
          <!-- White body: inclusions         -->
          <!-- ============================== -->
          <div
            class="bg-white rounded-b-[70px] pt-[18px] px-[14px] pb-[50px] flex-1 bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover relative z-10"
          >
            <div
              v-if="firstParagraph(pkg.description)"
              class="text-[0.78rem] md:text-[0.82rem] text-[#1C2D5B] text-start font-medium leading-snug mb-3 line-clamp-3 [&_p]:m-0 [&_strong]:font-bold [&_p]:line-clamp-3"
              v-html="firstParagraph(pkg.description)"
            ></div>
            <div
              v-if="includedRows(pkg).length"
              class="grid grid-cols-2 gap-x-3 gap-y-3 w-full"
            >
              <div
                v-for="(row, i) in includedRows(pkg)"
                :key="i"
                class="flex items-center gap-[10px] w-full min-w-0"
              >
                <div
                  class="w-[42px] h-[42px] md:w-[48px] md:h-[48px] rounded-full border-2 border-brand-orange overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
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
                    class="text-[0.72rem] md:text-[0.78rem] text-[#1C2D5B] font-extrabold leading-[1.2] block"
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
              class="pkg-select-btn group relative overflow-hidden w-[85%] bg-brand-orange border-2 border-white rounded-[50px] py-[12px] px-[16px] text-[0.95rem] font-black tracking-[0.5px] cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out hover:bg-[#1C2D5B] -mt-[30px] before:content-[''] before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:skew-x-[-20deg] before:transition-transform before:duration-1000 before:ease-out hover:before:translate-x-full"
              @click="selectPackage(pkg)"
            >
              <span
                class="pkg-select-label relative z-10 inline-flex items-center justify-center"
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
  </section>
</template>

<script setup lang="ts">
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
  navigateTo(`/packages?package=${pkg.slug}`);
};

const handleCardHover = () => {
  // intentionally empty — kept to preserve existing hover wiring
};

const getPackageButtonPrefix = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "Choose ";
  if (name.includes("jolly")) return "Get ";
  if (name.includes("merry")) return "Make It ";
  return "Choose ";
};

const firstParagraph = (text?: string | null) => {
  if (!text) return "";
  // Split on double-newline (real paragraph) OR single newline OR ". " boundary
  const parts = text
    .split(/\n\s*\n|\n/) // paragraph breaks by blank line or single newline
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[0] || "";
};

const getPackageButtonName = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return " Joy";
  if (name.includes("jolly")) return " Jolly";
  if (name.includes("merry")) return " Merry";
  return pkg.name.toUpperCase();
};

const { loadEarlyBird, showSale, effectivePrice, earlyBirdIconUrl } =
  useEarlyBirdSpecial();

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
}

.pkg-select-prefix {
  display: inline-block;
  max-width: 0;
  margin-right: 0;
  overflow: hidden;
  opacity: 0;
  white-space: nowrap;
  color: #fff !important;
  transition:
    max-width 0.3s ease,
    opacity 0.3s ease,
    margin 0.3s ease;
}

.pkg-select-name {
  color: #fff !important;
}

.pkg-select-btn:hover .pkg-select-prefix {
  max-width: 120px;
  margin-right: 6px;
  opacity: 1;
  color: #fff !important;
}

.pkg-select-btn:hover .pkg-select-name {
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
</style>
