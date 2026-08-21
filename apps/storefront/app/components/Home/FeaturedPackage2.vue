<template>
  <section
    class="relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed py-20 z-[1] border-t-5 border-brand-orange"
  >
    <div class="absolute inset-0 z-[-1] pointer-events-none"></div>

    <div class="max-w-[1280px] mx-auto px-4 sm:px-5">
      <h2
        v-fade
        class="text-center font-black text-white tracking-wide sm:tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] uppercase whitespace-nowrap text-[1.05rem] sm:text-3xl lg:text-4xl leading-tight"
      >
        CHOOSE YOUR <span class="text-brand-orange">HOLIDAY</span> PACKAGE
      </h2>

      <p
        v-fade
        class="text-center text-white font-bold tracking-[0.4px] uppercase whitespace-nowrap text-[0.72rem] sm:text-[1.15rem] leading-tight mt-2 mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
      >
        COMPARE WHAT’S INCLUDED IN EACH PLAN
      </p>

      <p
        v-fade
        class="text-center text-white/95 font-semibold tracking-[0.3px] uppercase whitespace-nowrap text-[0.68rem] sm:text-[0.8rem] leading-tight mb-10 sm:mb-[50px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
      >
        (Each package is a rental for one season)
      </p>

      <div v-if="loading" class="text-center py-10 text-white font-semibold">
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
          v-for="pkg in packageProducts"
          :key="pkg.id"
          class="bg-brand-orange border-4 border-brand-orange rounded-[28px] flex flex-col relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          <!-- Header -->
          <div
            class="p-[20px] flex items-center justify-between bg-[#0c2340] min-h-[90px]"
          >
            <div class="flex items-center flex-1">
              <img
                class="h-[60px] w-auto max-w-[160px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                :src="getPackageTitleImage(pkg.name)"
                :alt="pkg.name"
              />
            </div>
            <div class="text-[1.5rem] font-black text-white ml-3">
              ${{ Math.round(Number(pkg.price) || 0) }} / season
            </div>
          </div>

          <!-- Body / Inclusions -->
          <div
            class="bg-white rounded-b-[70px] pt-[24px] px-[20px] pb-[60px] flex-1 bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover"
          >
            <div class="flex flex-col gap-[16px] w-full">
              <template v-if="includedRows(pkg).length">
                <div
                  v-for="(row, i) in includedRows(pkg)"
                  :key="i"
                  class="flex items-center gap-[16px] w-full"
                >
                  <div
                    class="w-[56px] h-[56px] rounded-full border-3 border-brand-orange overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                  >
                    <img
                      v-if="row.image_url"
                      :src="getImageUrl(row.image_url)"
                      :alt="row.name"
                      class="w-full h-full object-cover"
                      @error="handleImgError"
                    />
                  </div>
                  <div>
                    <strong
                      class="text-[0.95rem] text-[#0c2340] font-extrabold leading-[1.3] block"
                    >
                      {{ row.name }}
                    </strong>
                  </div>
                </div>
              </template>
              <p v-else class="text-center text-gray-500 py-4 mb-0">
                No inclusions listed.
              </p>
            </div>
          </div>

          <!-- CTA -->
          <div
            class="bg-transparent px-[16px] pb-[16px] flex justify-center items-center z-[2]"
          >
            <button
              type="button"
              class="group relative overflow-hidden w-[85%] bg-brand-orange text-white border-2 border-[#0c2340] rounded-[50px] py-[12px] px-[16px] text-[0.95rem] font-black tracking-[0.5px] cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out hover:bg-[#0c2340] hover:text-white hover:-translate-y-[2px] -mt-[30px] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:skew-x-[-20deg] before:transition-transform before:duration-1000 before:ease-out hover:before:translate-x-full"
              @click="selectPackage(pkg)"
            >
              <span>{{ getPackageButtonPrefix(pkg) }}</span>
              <span class="text-navy group-hover:text-white transition-colors">
                {{ getPackageButtonName(pkg) }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const supabase = useSupabaseClient();

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
  is_popular?: boolean;
  is_package?: boolean;
  package_data?: string | null;
  image_url?: string | null;
  variations?: PackageVariation[];
  package_inclusions?: any[];
  inclusions?: any[];
}

const packages = ref<PackageRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const packageProducts = computed(() => packages.value);

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
    error.value = err?.message || "Failed to load packages.";
    packages.value = [];
  } finally {
    loading.value = false;
  }
};

/** Prefer package_inclusions; fall back to variations options */
const inclusionsFor = (pkg: PackageRow): InclusionDisplay[] => {
  const rows = pkg.package_inclusions || pkg.inclusions || [];

  if (rows.length) {
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
  }

  // Fallback: variations → options as included rows
  const fromVariations: InclusionDisplay[] = [];
  for (const variation of pkg.variations || []) {
    for (const opt of variation.options || []) {
      if (!opt?.name) continue;
      fromVariations.push({
        name: opt.name,
        image_url: opt.image_url ?? null,
        is_included: true,
      });
    }
  }
  return fromVariations;
};

const includedRows = (pkg: PackageRow) =>
  inclusionsFor(pkg).filter((r) => r.is_included);

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return "/Images/placeholder.png";
  if (url.startsWith("http")) return url;

  const path = url
    .replace(/^\//, "")
    .replace(/^products\//i, "")
    .replace(/^Products\//i, "");

  const supabaseUrl =
    (config.public.supabaseUrl as string) ||
    (config.public.supabase as any)?.url ||
    "";

  const bucket = (config.public.storageBucket as string) || "Products";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img) img.src = "/Images/placeholder.png";
};

const selectPackage = (pkg: PackageRow) => {
  navigateTo(`/packages?package=${pkg.slug}`);
};

const TITLE_BASE = "/Images/Holiday-Lighting-Package";

const getPackageTitleImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("jolly")) return `${TITLE_BASE}/Jolly.png`;
  if (n.includes("merry")) return `${TITLE_BASE}/Merry.png`;
  return `${TITLE_BASE}/Joy.png`;
};

const getPackageButtonPrefix = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "Choose ";
  if (name.includes("jolly")) return "Get ";
  if (name.includes("merry")) return "Make It ";
  return "Choose ";
};

const getPackageButtonName = (pkg: { name: string }) => {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "JOY";
  if (name.includes("jolly")) return "JOLLY";
  if (name.includes("merry")) return "MERRY";
  return pkg.name.toUpperCase();
};

onMounted(fetchPackages);
</script>
