<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Products</h1>
        <p class="text-slate-500 text-sm">Manage your product inventory</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="loadProducts"
          class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
        >
          <ArrowPathIcon class="h-4 w-4" />
          Refresh
        </button>
        <NuxtLink
          to="/admin/products/create"
          class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium no-underline flex items-center gap-2 shadow-sm"
        >
          <PlusIcon class="h-4 w-4" />
          Add New Product
        </NuxtLink>
      </div>
    </div>

    <FestiveTable
      :columns="columns"
      :data="products"
      :loading="isLoading"
      :server-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      search-placeholder="Search products by name or SKU..."
      :search-fields="['name', 'sku']"
      row-key="id"
      @page-change="onPageChange"
      @search="onSearch"
    >
      <template #filters>
        <select
          v-model="categoryFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select
          v-model="stockFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Stock</option>
          <option value="instock">In Stock</option>
          <option value="outofstock">Out of Stock</option>
          <option value="lowstock">Low Stock (&lt; 10)</option>
        </select>
        
        <select
          v-model="statusFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Status</option>
          <option value="publish">Published</option>
          <option value="draft">Draft</option>
        </select>
      </template>

      <template #cell-image_url="{ item }">
        <img
          :src="getImageUrl(item.image_url)"
          :alt="item.name"
          class="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100"
          @error="
            (e) =>
              ((e.target as HTMLImageElement).src = '/Images/placeholder.png')
          "
        />
      </template>

      <template #cell-stock="{ item }">
        <span
          :class="
            item.stock > 0
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          "
          class="px-2.5 py-1 rounded-full text-xs font-medium"
        >
          {{ item.stock > 0 ? item.stock : "Out of stock" }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="{
            'bg-amber-100 text-amber-700': item.status === 'draft',
            'bg-emerald-100 text-emerald-700':
              item.status === 'publish' || item.status === 'active',
            'bg-slate-100 text-slate-600': ![
              'draft',
              'publish',
              'active',
            ].includes(item.status),
          }"
          class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
        >
          {{ item.status || "draft" }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="text-right space-x-2">
          <NuxtLink
            :to="`/admin/products/edit/${item.id}`"
            class="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
            >Edit</NuxtLink
          >
          <button
            v-if="isSuperAdmin"
            @click="showDeleteConfirm(item)"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </template>
    </FestiveTable>

    <!-- Delete Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <ExclamationTriangleIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Confirm Delete</h3>
        </div>
        <p class="text-sm text-slate-600 mb-4">
          Are you sure you want to delete
          <strong class="text-slate-900">{{ productToDelete?.name }}</strong
          >?
        </p>
        <div class="space-y-2 mb-4">
          <label class="block text-xs font-medium text-slate-500"
            >Type <strong class="text-rose-600">DELETE</strong> to
            confirm:</label
          >
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="DELETE"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-center font-mono text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none focus:bg-white transition-all"
          />
        </div>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            :disabled="deleteConfirmText !== 'DELETE'"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowPathIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

const supabase = useSupabaseClient();

const columns = [
  { key: "image_url", label: "Image" },
  { key: "name", label: "Product", sortable: true },
  { key: "sku", label: "SKU" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const categoryFilter = ref("");
const stockFilter = ref("");
const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const isLoading = ref(true);
const isSuperAdmin = ref(true);
const showModal = ref(false);
const productToDelete = ref<any>(null);
const deleteConfirmText = ref("");

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const searchQuery = ref("");

const statusFilter = ref('');

const loadProducts = async () => {
  isLoading.value = true;
  try {
    let query = supabase
      .from("products")
      .select("*, categories(id, name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(
        (currentPage.value - 1) * itemsPerPage.value,
        currentPage.value * itemsPerPage.value - 1,
      );

    if (categoryFilter.value) {
      query = query.eq("category_id", categoryFilter.value);
    }
    if (stockFilter.value === "instock") {
      query = query.gt("stock", 0);
    } else if (stockFilter.value === "outofstock") {
      query = query.lte("stock", 0);
    } else if (stockFilter.value === "lowstock") {
      query = query.gt("stock", 0).lte("stock", 10);
    }

    if (statusFilter.value) {
      query = query.eq('status', statusFilter.value)
    }

    if (searchQuery.value) {
      query = query.or(
        `name.ilike.%${searchQuery.value}%,sku.ilike.%${searchQuery.value}%`,
      );
    }

    const from = (currentPage.value - 1) * itemsPerPage.value;
    const to = from + itemsPerPage.value - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    products.value = data || [];
    totalItems.value = count || 0;
  } catch (err) {
    console.error(err);
    products.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const loadCategories = async () => {
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  categories.value = data || [];
};

const applyFilters = () => {
  currentPage.value = 1;
  loadProducts();
};

const onSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadProducts();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadProducts();
};

const getImageUrl = (url: string | null | undefined) => {
  if (!url || url.startsWith("http")) return url || "/Images/placeholder.png";
  const { data } = supabase.storage
    .from("Products")
    .getPublicUrl(url.replace(/^products\//i, "").replace(/^Products\//i, ""));
  return data.publicUrl;
};

const showDeleteConfirm = (product: any) => {
  productToDelete.value = product;
  deleteConfirmText.value = "";
  showModal.value = true;
};

const cancelDelete = () => {
  showModal.value = false;
  productToDelete.value = null;
  deleteConfirmText.value = "";
};

const executeDelete = async () => {
  if (!productToDelete.value || deleteConfirmText.value !== "DELETE") return;
  await supabase.from("products").delete().eq("id", productToDelete.value.id);
  showModal.value = false;
  await loadProducts();
};

onMounted(async () => {
  await loadCategories();
  await loadProducts();
});
</script>
