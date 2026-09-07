<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Package Programs</h1>
        <p class="text-slate-500 text-sm">
          Joy, Jolly, Merry — base price, images, inclusions
        </p>
      </div>
    </div>

    <!-- FestiveTable -->
    <FestiveTable
      :columns="columns"
      :data="packages"
      :loading="loading"
      :server-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :searchable="false"
      row-key="id"
      :show-toolbar="false"
      @page-change="onPageChange"
    >
      <template #cell-image_url="{ item }">
        <div class="flex justify-center">
          <img
            v-if="item.image_url"
            :src="getImageUrl(item.image_url)"
            :alt="item.name"
            class="w-14 h-14 object-cover rounded-lg border border-slate-200"
          />
          <span
            v-else
            class="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400"
          >
            —
          </span>
        </div>
      </template>

      <template #cell-name="{ item }">
        <span class="font-semibold text-navy">{{ item.name }}</span>
      </template>

      <template #cell-price="{ item }">
        <span class="font-semibold text-slate-900">{{
          formatPrice(item.price)
        }}</span>
      </template>

      <template #cell-sale_price="{ item }">
        <span class="font-semibold text-slate-900">{{
          formatPrice(item.sale_price)
        }}</span>
      </template>

      <template #cell-is_popular="{ item }">
        <span
          :class="
            item.is_popular
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-500'
          "
          class="px-2.5 py-1 rounded-full text-xs font-medium"
        >
          {{ item.is_popular ? "Yes" : "No" }}
        </span>
      </template>

      <template #cell-is_active="{ item }">
        <span
          :class="
            item.is_active
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          "
          class="px-2.5 py-1 rounded-full text-xs font-medium"
        >
          {{ item.is_active ? "Active" : "Off" }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="text-right space-x-2">
          <NuxtLink
            :to="`/admin/products/packages/${item.id}`"
            class="inline-block px-3 py-1.5 bg-navy text-white rounded-md text-xs font-medium hover:bg-brand-orange hover:text-navy transition-colors no-underline"
          >
            Edit
          </NuxtLink>
          <NuxtLink
            :to="`/admin/products/package-skus?package_id=${item.id}`"
            class="inline-block px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:border-brand-orange transition-colors no-underline"
          >
            View SKUs
          </NuxtLink>
        </div>
      </template>
    </FestiveTable>
  </div>
</template>

<script setup lang="ts">
import type { Column } from "~/components/FestiveTable.vue";

type PackageRow = {
  id: string | number;
  name: string;
  slug: string;
  price?: number | string | null;
  sale_price?: number | string | null;
  sort_order?: number | null;
  is_popular?: boolean;
  is_active?: boolean;
  image_url?: string | null;
};

interface PackagesResponse {
  success: boolean;
  data: PackageRow[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const { showToast } = useToast();

const columns: Column[] = [
  { key: "sort_order", label: "Order", align: "center" },
  { key: "image_url", label: "Image", align: "center" },
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug" },
  { key: "price", label: "Base Price", align: "right" },
  { key: "sale_price", label: "Sale Price", align: "right" },
  { key: "is_popular", label: "Popular", align: "center" },
  { key: "is_active", label: "Active", align: "center" },
  { key: "actions", label: "Actions", align: "right" },
];

const loading = ref(true);
const packages = ref<PackageRow[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const formatPrice = (v: number | string | null | undefined) => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return url;
};

const loadPackages = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      limit: String(itemsPerPage.value),
    });

    const response = await $fetch<PackagesResponse>(
      `/api/packages?${params.toString()}`,
    );

    if (response.success) {
      packages.value = response.data || [];
      totalItems.value = response.pagination?.totalItems || 0;
    } else {
      throw new Error("Failed to load packages");
    }
  } catch (e) {
    console.error(e);
    packages.value = [];
    totalItems.value = 0;
    showToast(
      e instanceof Error ? e.message : "Failed to load packages",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadPackages();
};

onMounted(loadPackages);
</script>
