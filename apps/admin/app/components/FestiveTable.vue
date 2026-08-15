<template>
  <div class="space-y-4">
    <!-- Toolbar: Search + Filters -->
    <div
      v-if="showToolbar"
      class="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200"
    >
      <!-- Search -->
      <div v-if="enableSearch" class="relative flex-1 w-full">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          :placeholder="searchPlaceholder"
          v-model="searchQuery"
          @input="onSearch"
          class="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all text-sm"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Filters -->
      <slot name="filters" />

      <!-- Action Button -->
      <slot name="actions" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-slate-500 mt-3">Loading...</p>
    </div>

    <!-- Table -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-navy text-white">
              <th
                v-for="(col, index) in columns"
                :key="col.key"
                :class="[
                  'text-left py-3.5 px-4 text-xs font-semibold uppercase tracking-wider',
                  col.sortable ? 'cursor-pointer hover:bg-navy-light' : '',
                  col.align === 'right' ? 'text-right' : '',
                  col.align === 'center' ? 'text-center' : '',
                  index === 0 ? 'rounded-tl-lg' : '',
                  index === columns.length - 1 ? 'rounded-tr-lg' : '',
                ]"
                @click="col.sortable ? sort(col.key) : null"
              >
                <div
                  class="flex items-center gap-1"
                  :class="
                    col.align === 'right'
                      ? 'justify-end'
                      : col.align === 'center'
                        ? 'justify-center'
                        : ''
                  "
                >
                  {{ col.label }}
                  <span v-if="col.sortable" class="text-white/50">
                    <span v-if="sortKey === col.key">{{
                      sortDirection === "asc" ? "↑" : "↓"
                    }}</span>
                    <span v-else>↕</span>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="paginatedData.length === 0">
              <td
                :colspan="columns.length"
                class="py-12 text-center text-slate-500"
              >
                <p class="text-lg">No results found</p>
                <p class="text-sm mt-1">{{ emptyMessage }}</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, index) in paginatedData"
              :key="rowKey ? String(item[rowKey]) : index"
              class="hover:bg-slate-50 transition-colors"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'py-3 px-4 text-sm',
                  col.align === 'right' ? 'text-right' : '',
                  col.align === 'center' ? 'text-center' : '',
                  col.class || '',
                ]"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :item="item"
                  :value="item[col.key]"
                >
                  <template v-if="col.render">
                    <component
                      :is="col.render"
                      :item="item"
                      :value="item[col.key]"
                    />
                  </template>
                  <template v-else-if="col.type === 'image'">
                    <img
                      :src="item[col.key] || '/Images/placeholder.png'"
                      :alt="col.altKey ? item[col.altKey] || 'Image' : 'Image'"
                      class="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100"
                      @error="
                        (e) =>
                          ((e.target as HTMLImageElement).src =
                            '/Images/placeholder.png')
                      "
                    />
                  </template>
                  <template v-else-if="col.type === 'badge'">
                    <span
                      :class="
                        col.badgeClass
                          ? col.badgeClass(item)
                          : 'bg-slate-100 text-slate-600'
                      "
                    >
                      {{ item[col.key] || "-" }}
                    </span>
                  </template>
                  <template v-else-if="col.type === 'currency'">
                    ${{ Number(item[col.key] || 0).toFixed(2) }}
                  </template>
                  <template v-else-if="col.type === 'date'">
                    {{
                      new Date(item[col.key]).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  </template>
                  <template v-else>
                    {{ item[col.key] || "-" }}
                  </template>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
        >
          Previous
        </button>

        <span class="text-sm text-slate-600">
          Page
          <span class="font-semibold text-slate-800">{{ currentPage }}</span> of
          <span class="font-semibold text-slate-800">{{ totalPages }}</span>
        </span>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "image" | "badge" | "currency" | "date" | "custom";
  align?: "left" | "center" | "right";
  class?: string;
  render?: any;
  badgeClass?: (item: any) => string;
  altKey?: string;
}

const props = withDefaults(
  defineProps<{
    columns: Column[];
    data: any[];
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchFields?: string[];
    rowKey?: string;
    emptyMessage?: string;
    showToolbar?: boolean;
    enableSearch?: boolean;
    itemsPerPage?: number;
    totalItems?: number;
    serverPagination?: boolean;
    currentPage?: number;
  }>(),
  {
    loading: false,
    searchable: false,
    searchPlaceholder: "Search...",
    searchFields: () => [],
    rowKey: "id",
    emptyMessage: "Try adjusting your search or filters",
    showToolbar: true,
    enableSearch: true,
    itemsPerPage: 10,
    totalItems: 0,
    serverPagination: false,
    currentPage: 1,
  },
);

const emit = defineEmits<{
  search: [query: string];
  sort: [key: string, direction: "asc" | "desc"];
  pageChange: [page: number];
}>();

const searchQuery = ref("");
const localPage = ref(1);
const sortKey = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

// Use prop or local state for current page
const currentPage = computed({
  get: () => (props.serverPagination ? props.currentPage : localPage.value),
  set: (val: number) => {
    if (props.serverPagination) {
      emit("pageChange", val);
    } else {
      localPage.value = val;
    }
  },
});

const itemsPerPage = computed(() => props.itemsPerPage || 10);

const filteredData = computed(() => {
  let result = [...props.data];

  if (
    searchQuery.value &&
    props.searchFields &&
    props.searchFields.length > 0
  ) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((item) =>
      props.searchFields!.some((field) =>
        String(item[field] || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }

  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value] ?? "";
      const bVal = b[sortKey.value] ?? "";
      if (aVal < bVal) return sortDirection.value === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection.value === "asc" ? 1 : -1;
      return 0;
    });
  }

  return result;
});

const totalPages = computed(() => {
  if (props.serverPagination) {
    return Math.max(1, Math.ceil((props.totalItems || 0) / itemsPerPage.value));
  }
  return Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage.value));
});

const paginatedData = computed(() => {
  if (props.serverPagination) {
    return props.data;
  }
  const start = (localPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const onSearch = () => {
  if (props.serverPagination) {
    emit("search", searchQuery.value);
  } else {
    localPage.value = 1;
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  if (props.serverPagination) {
    emit("search", "");
  } else {
    localPage.value = 1;
  }
};

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDirection.value = "asc";
  }
  emit("sort", key, sortDirection.value);
};

watch(
  () => props.data,
  () => {
    if (!props.serverPagination) {
      localPage.value = 1;
    }
  },
  { deep: true },
);
</script>
