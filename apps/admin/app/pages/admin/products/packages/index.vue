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
      <template #cell-name="{ item }">
        <span class="font-semibold text-navy">{{ item.name }}</span>
      </template>

      <template #cell-price="{ item }">
        <span class="font-semibold text-slate-900"
          >${{ formatPrice(item.price) }}</span
        >
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
  sort_order?: number | null;
  is_popular?: boolean;
  is_active?: boolean;
};

const supabase = useSupabaseClient();

const columns: Column[] = [
  { key: "sort_order", label: "Order", align: "center" },
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug" },
  { key: "price", label: "Base Price", align: "right" },
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
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

const loadPackages = async () => {
  loading.value = true;
  try {
    const from = (currentPage.value - 1) * itemsPerPage.value;
    const to = from + itemsPerPage.value - 1;

    const { data, error, count } = await supabase
      .from("packages")
      .select("id, name, slug, price, sort_order, is_popular, is_active", {
        count: "exact",
      })
      .order("sort_order", { ascending: true })
      .range(from, to);

    if (error) throw error;
    packages.value = data || [];
    totalItems.value = count || 0;
  } catch (e) {
    console.error(e);
    packages.value = [];
    totalItems.value = 0;
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
