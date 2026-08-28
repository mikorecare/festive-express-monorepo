<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Package SKUs</h1>
        <p class="text-slate-500 text-sm">
          Sellable package products (Joy / Jolly / Merry × color)
        </p>
      </div>
      <NuxtLink
        to="/admin/products/package-skus/create"
        class="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-navy transition-colors no-underline gap-2"
      >
        <PlusIcon class="h-4 w-4" />
        Add Package SKU
      </NuxtLink>
    </div>

    <!-- FestiveTable -->
    <FestiveTable
      :columns="columns"
      :data="skus"
      :loading="loading"
      :server-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      search-placeholder="Search name or SKU..."
      :search-fields="['name', 'sku', 'color_label']"
      row-key="id"
      @page-change="onPageChange"
      @search="onSearch"
    >
      <template #filters>
        <select
          v-model="packageFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All packages</option>
          <option v-for="p in packages" :key="p.id" :value="String(p.id)">
            {{ p.name }}
          </option>
        </select>

        <select
          v-model="colorFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All colors</option>
          <option v-for="c in colorOptions" :key="c" :value="c">{{ c }}</option>
        </select>

        <button
          type="button"
          class="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          @click="clearFilters"
        >
          Clear
        </button>
      </template>

      <template #cell-image_url="{ item }">
        <img
          v-if="item.image_url"
          :src="getImageUrl(item.image_url)"
          :alt="item.name"
          class="w-12 h-12 object-contain rounded-lg border border-slate-100 bg-white"
          @error="onImgError"
        />
        <div
          v-else
          class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400"
        >
          N/A
        </div>
      </template>

      <template #cell-name="{ item }">
        <span class="font-semibold text-navy">{{ item.name }}</span>
      </template>

      <template #cell-sku="{ item }">
        <span class="text-slate-500 text-sm">{{ item.sku || "—" }}</span>
      </template>

      <template #cell-package_id="{ item }">
        <span class="text-slate-600 text-sm">{{
          packageName(item.package_id)
        }}</span>
      </template>

      <template #cell-color_label="{ item }">
        <span class="text-slate-600 text-sm">{{
          item.color_label || "—"
        }}</span>
      </template>

      <template #cell-price="{ item }">
        <span class="font-semibold text-slate-900">{{
          formatPrice(item.price)
        }}</span>
      </template>

      <template #cell-stock="{ item }">
        <span
          :class="
            Number(item.stock) <= 0
              ? 'text-rose-600 font-semibold'
              : 'text-slate-600'
          "
        >
          {{ item.stock ?? 0 }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="
            item.status === 'publish'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          "
          class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
        >
          {{ item.status || "draft" }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="text-right space-x-2 whitespace-nowrap">
          <NuxtLink
            :to="`/admin/products/package-skus/${item.id}`"
            class="inline-block px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-brand-orange hover:text-navy transition-colors no-underline"
          >
            Edit
          </NuxtLink>
          <button
            type="button"
            class="inline-block px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
            @click="confirmDelete(item)"
          >
            Delete
          </button>
        </div>
      </template>
    </FestiveTable>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <ExclamationTriangleIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-navy">Delete Package SKU?</h3>
        </div>
        <p class="text-slate-600 text-sm mb-4">
          Are you sure you want to delete
          <strong class="text-navy">{{ skuToDelete?.name }}</strong
          >?
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
            :disabled="deleting"
            @click="executeDelete"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import type { Column } from "~/components/FestiveTable.vue";
type PackageRow = { id: string | number; name: string };
type SkuRow = {
  id: string | number;
  name: string;
  sku?: string | null;
  price?: number | string | null;
  stock?: number | null;
  status?: string | null;
  image_url?: string | null;
  color_label?: string | null;
  package_id?: string | number | null;
};

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const supabase = useSupabaseClient();

const columns: Column[] = [
  { key: "image_url", label: "Image" },
  { key: "name", label: "Name", sortable: true },
  { key: "sku", label: "SKU" },
  { key: "package_id", label: "Package" },
  { key: "color_label", label: "Color" },
  { key: "price", label: "Price", align: "right" },
  { key: "stock", label: "Stock", align: "center" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

const colorOptions = [
  "Warm White",
  "Pure White",
  "Champagne",
  "Multi",
  "Cool White",
];

const loading = ref(true);
const skus = ref<SkuRow[]>([]);
const packages = ref<PackageRow[]>([]);
const packageFilter = ref(String(route.query.package_id || ""));
const colorFilter = ref("");
const searchQuery = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const showDeleteModal = ref(false);
const skuToDelete = ref<SkuRow | null>(null);
const deleting = ref(false);

const formatPrice = (v: number | string | null | undefined) => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const packageName = (id: string | number | null | undefined) => {
  if (id == null || id === "") return "—";
  const p = packages.value.find((x) => String(x.id) === String(id));
  return p?.name || "—";
};

const getImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("/"))
    return url;
  let path = url
    .replace(/^\//, "")
    .replace(/^Products\//i, "")
    .replace(/^products\//i, "");
  const bucket = (config.public.storageBucket as string) || "Products";
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || "";
};

const onImgError = (e: Event) => {
  const el = e.target as HTMLImageElement;
  el.style.opacity = "0.3";
};

const loadPackages = async () => {
  const { data, error } = await supabase
    .from("packages")
    .select("id, name")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  packages.value = data || [];
};

const loadSkus = async () => {
  loading.value = true;
  try {
    const query: Record<string, string> = {};
    if (packageFilter.value) query.package_id = packageFilter.value;
    router.replace({ query });

    let q = supabase
      .from("products")
      .select(
        "id, name, sku, price, stock, status, image_url, color_label, package_id",
        { count: "exact" },
      )
      .eq("is_package", true)
      .order("name", { ascending: true });

    if (packageFilter.value) {
      q = q.eq("package_id", packageFilter.value);
    }
    if (colorFilter.value) {
      q = q.eq("color_label", colorFilter.value);
    }
    if (searchQuery.value) {
      q = q.or(
        `name.ilike.%${searchQuery.value}%,sku.ilike.%${searchQuery.value}%,color_label.ilike.%${searchQuery.value}%`,
      );
    }

    // Pagination
    const from = (currentPage.value - 1) * itemsPerPage.value;
    const to = from + itemsPerPage.value - 1;
    q = q.range(from, to);

    const { data, error, count } = await q;
    if (error) throw error;
    skus.value = data || [];
    totalItems.value = count || 0;
  } catch (e: any) {
    console.error(e);
    skus.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

const onSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadSkus();
};

const applyFilters = () => {
  currentPage.value = 1;
  loadSkus();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadSkus();
};

const clearFilters = () => {
  packageFilter.value = "";
  colorFilter.value = "";
  searchQuery.value = "";
  currentPage.value = 1;
  router.replace({ query: {} });
  loadSkus();
};

const confirmDelete = (sku: SkuRow) => {
  skuToDelete.value = sku;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  skuToDelete.value = null;
};

const executeDelete = async () => {
  if (!skuToDelete.value) return;
  deleting.value = true;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", skuToDelete.value.id);
    if (error) throw error;
    showDeleteModal.value = false;
    skuToDelete.value = null;
    await loadSkus();
  } catch (e: any) {
    console.error(e);
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await loadPackages();
  await loadSkus();
});
</script>
