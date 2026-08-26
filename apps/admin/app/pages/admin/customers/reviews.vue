<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Reviews Management</h1>
        <p class="text-slate-500 text-sm">View and manage customer feedback</p>
      </div>
      <button
        class="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
        @click="exportReviews"
      >
        <ArrowDownTrayIcon class="h-4 w-4" />
        Export Reviews
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">Total Reviews</p>
        <p class="text-2xl font-bold text-navy">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-amber-600">{{ stats.pending }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">Completed</p>
        <p class="text-2xl font-bold text-emerald-600">{{ stats.completed }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">Expired</p>
        <p class="text-2xl font-bold text-rose-600">{{ stats.expired }}</p>
      </div>
    </div>

    <!-- FestiveTable -->
    <FestiveTable
      :columns="columns"
      :data="reviews"
      :loading="isLoading"
      :server-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      search-placeholder="Search by customer name or order number..."
      :search-fields="['customer_name', 'order_number', 'customer_email']"
      row-key="id"
      @page-change="onPageChange"
      @search="onSearch"
    >
      <template #filters>
        <select
          v-model="statusFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
        <select
          v-model="ratingFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars ★★★★★</option>
          <option value="4">4 Stars ★★★★</option>
          <option value="3">3 Stars ★★★</option>
          <option value="2">2 Stars ★★</option>
          <option value="1">1 Star ★</option>
        </select>
      </template>

      <template #cell-customer="{ item }">
        <div>
          <div class="font-medium text-slate-900">{{ item.customer_name }}</div>
          <div class="text-xs text-slate-400">{{ item.customer_email }}</div>
        </div>
      </template>

      <template #cell-order_number="{ item }">
        <span class="font-semibold text-navy">#{{ item.order_number }}</span>
      </template>

      <template #cell-rating_overall="{ item }">
        <div class="flex items-center gap-1">
          <span class="text-sm font-semibold text-gray-700"
            >{{ item.rating_overall }}/5</span
          >
          <div class="flex">
            <span
              v-for="star in 5"
              :key="star"
              class="text-sm"
              :class="
                star <= item.rating_overall ? 'text-[#F49321]' : 'text-gray-300'
              "
            >
              ★
            </span>
          </div>
        </div>
      </template>

      <template #cell-ratings="{ item }">
        <div class="text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">Install:</span>
            <span class="font-medium"
              >{{ item.rating_installation || "—" }}/5</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">Team:</span>
            <span class="font-medium"
              >{{ item.rating_technicians || "—" }}/5</span
            >
          </div>
        </div>
      </template>

      <template #cell-would_recommend="{ item }">
        <span
          v-if="item.would_recommend === true"
          class="text-emerald-600 font-medium"
        >
          <i class="fas fa-check-circle mr-1"></i> Yes
        </span>
        <span
          v-else-if="item.would_recommend === false"
          class="text-rose-600 font-medium"
        >
          <i class="fas fa-times-circle mr-1"></i> No
        </span>
        <span v-else class="text-gray-400">—</span>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="{
            'bg-amber-100 text-amber-700': item.status === 'pending',
            'bg-emerald-100 text-emerald-700': item.status === 'completed',
            'bg-rose-100 text-rose-700': item.status === 'expired',
          }"
          class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell-created_at="{ item }">
        <span class="text-sm text-slate-600">
          {{ formatDate(item.created_at) }}
        </span>
      </template>

      <template #cell-token_expires_at="{ item }">
        <span
          class="text-sm"
          :class="
            isExpiringSoon(item.token_expires_at)
              ? 'text-amber-600'
              : 'text-slate-600'
          "
        >
          {{ formatDate(item.token_expires_at) }}
          <span
            v-if="isExpiringSoon(item.token_expires_at)"
            class="text-xs text-amber-600 block"
          >
            Expiring soon
          </span>
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="space-x-2">
          <button
            @click="viewReview(item.id)"
            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors"
          >
            View
          </button>
          <button
            v-if="isSuperAdmin && item.status === 'pending'"
            @click="sendReminder(item)"
            class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-md text-xs font-medium transition-colors"
          >
            <i class="fas fa-envelope mr-1"></i> Remind
          </button>
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

    <!-- View Review Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeViewModal"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Review Details</h3>
            <p class="text-sm text-gray-500">
              Order #{{ selectedReview?.order_number }}
            </p>
          </div>
          <button
            @click="closeViewModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div v-if="selectedReview" class="space-y-6">
          <!-- Customer Info -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-xs text-gray-500">Customer</p>
              <p class="font-medium text-navy">
                {{ selectedReview?.customer_name || "—" }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="font-medium text-navy">
                {{ selectedReview?.customer_email || "—" }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Order</p>
              <p class="font-medium text-navy">
                #{{ selectedReview?.order_number || "—" }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Status</p>
              <span
                :class="{
                  'bg-amber-100 text-amber-700':
                    selectedReview?.status === 'pending',
                  'bg-emerald-100 text-emerald-700':
                    selectedReview?.status === 'completed',
                  'bg-rose-100 text-rose-700':
                    selectedReview?.status === 'expired',
                }"
                class="px-2.5 py-1 rounded-full text-xs font-medium capitalize inline-block"
              >
                {{ selectedReview?.status || "—" }}
              </span>
            </div>
          </div>
          <!-- Ratings -->
          <div>
            <h4 class="font-semibold text-navy mb-3">Ratings</h4>
            <div class="space-y-2">
              <div
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-sm text-gray-600">Overall Satisfaction</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-navy"
                    >{{ selectedReview.rating_overall }}/5</span
                  >
                  <div class="flex">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-sm"
                      :class="
                        star <= selectedReview.rating_overall
                          ? 'text-[#F49321]'
                          : 'text-gray-300'
                      "
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-sm text-gray-600">Installation Process</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-navy"
                    >{{ selectedReview.rating_installation || "—" }}/5</span
                  >
                  <div class="flex">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-sm"
                      :class="
                        star <= (selectedReview.rating_installation || 0)
                          ? 'text-[#F49321]'
                          : 'text-gray-300'
                      "
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-sm text-gray-600"
                  >Technicians & Carpenters</span
                >
                <div class="flex items-center gap-2">
                  <span class="font-bold text-navy"
                    >{{ selectedReview.rating_technicians || "—" }}/5</span
                  >
                  <div class="flex">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-sm"
                      :class="
                        star <= (selectedReview.rating_technicians || 0)
                          ? 'text-[#F49321]'
                          : 'text-gray-300'
                      "
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div>
            <h4 class="font-semibold text-navy mb-3">Comments</h4>
            <div class="space-y-3">
              <div
                v-if="selectedReview.comments_installation"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <p class="text-xs text-gray-500 mb-1">Installation Comments</p>
                <p class="text-sm text-gray-700">
                  {{ selectedReview.comments_installation }}
                </p>
              </div>
              <div
                v-if="selectedReview.comments_technicians"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <p class="text-xs text-gray-500 mb-1">Team Comments</p>
                <p class="text-sm text-gray-700">
                  {{ selectedReview.comments_technicians }}
                </p>
              </div>
              <div
                v-if="selectedReview.comments_additional"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <p class="text-xs text-gray-500 mb-1">Additional Comments</p>
                <p class="text-sm text-gray-700">
                  {{ selectedReview.comments_additional }}
                </p>
              </div>
            </div>
          </div>

          <!-- Would Recommend -->
          <div
            v-if="selectedReview.would_recommend !== null"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <p class="text-sm font-medium text-navy">Would Recommend?</p>
            <p class="text-sm text-gray-700">
              {{
                selectedReview.would_recommend
                  ? "Yes, they would recommend Festive Express"
                  : "No, they would not recommend"
              }}
            </p>
          </div>

          <!-- Meta -->
          <div class="text-xs text-gray-400 border-t border-gray-100 pt-4">
            <p>Created: {{ formatDate(selectedReview.created_at) }}</p>
            <p v-if="selectedReview.completed_at">
              Completed: {{ formatDate(selectedReview.completed_at) }}
            </p>
            <p>
              Token Expires: {{ formatDate(selectedReview.token_expires_at) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              v-if="selectedReview.status === 'pending'"
              @click="sendReminder(selectedReview)"
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i class="fas fa-envelope mr-2"></i> Send Reminder
            </button>
            <button
              @click="closeViewModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
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
        <p class="text-sm text-slate-600 mb-2">
          Are you sure you want to delete this review?
        </p>
        <p class="text-sm text-rose-600 mb-4">This action cannot be undone.</p>

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
            @click="cancelDeleteReview"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeDeleteReview"
            :disabled="deleteConfirmText !== 'DELETE'"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import type { Column } from "~/components/FestiveTable.vue";

interface Review {
  id: string;
  order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  rating_overall: number;
  rating_installation: number | null;
  rating_technicians: number | null;
  comments_installation: string | null;
  comments_technicians: string | null;
  comments_additional: string | null;
  would_recommend: boolean | null;
  status: "pending" | "completed" | "expired";
  survey_token: string;
  token_expires_at: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

const supabase = useSupabaseClient();
const { showToast } = useToast();

const columns: Column[] = [
  { key: "customer", label: "Customer", sortable: true },
  { key: "order_number", label: "Order", sortable: true },
  { key: "rating_overall", label: "Rating", sortable: true },
  { key: "ratings", label: "Details" },
  { key: "would_recommend", label: "Recommend" },
  { key: "status", label: "Status", sortable: true },
  { key: "created_at", label: "Created", type: "date", sortable: true },
  { key: "token_expires_at", label: "Expires", sortable: true },
  { key: "actions", label: "Actions", align: "right" },
];

const reviews = ref<Review[]>([]);
const isLoading = ref(true);
const statusFilter = ref("");
const ratingFilter = ref("");
const searchQuery = ref("");
const currentUser = ref<{ role?: string } | null>(null);
const isSuperAdmin = computed(() => currentUser.value?.role === "super_admin");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Stats
const stats = ref({
  total: 0,
  pending: 0,
  completed: 0,
  expired: 0,
});

const showViewModal = ref(false);
const selectedReview = ref<Review | null>(null);
const showDeleteModal = ref(false);
const reviewToDelete = ref<any>(null);
const deleteConfirmText = ref("");

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const loadReviews = async () => {
  isLoading.value = true;
  try {
    const { data: statsData, error: statsError } = await supabase
      .from("reviews")
      .select("status");

    if (!statsError && statsData) {
      stats.value.total = statsData.length;
      stats.value.pending = statsData.filter(
        (r: Review) => r.status === "pending",
      ).length;
      stats.value.completed = statsData.filter(
        (r: Review) => r.status === "completed",
      ).length;
      stats.value.expired = statsData.filter(
        (r: Review) => r.status === "expired",
      ).length;
    }

    let query = supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Status filter
    if (statusFilter.value) {
      query = query.eq("status", statusFilter.value);
    }

    // Rating filter
    if (ratingFilter.value) {
      query = query.eq("rating_overall", parseInt(ratingFilter.value));
    }

    // Search
    if (searchQuery.value) {
      query = query.or(
        `customer_name.ilike.%${searchQuery.value}%,` +
          `order_number.ilike.%${searchQuery.value}%,` +
          `customer_email.ilike.%${searchQuery.value}%`,
      );
    }

    // Pagination
    const from = (currentPage.value - 1) * itemsPerPage.value;
    const to = from + itemsPerPage.value - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    reviews.value = data || [];
    totalItems.value = count || 0;
  } catch (error) {
    console.error("Failed to load reviews:", error);
    reviews.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const onSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    loadReviews();
  }, 500);
};

const applyFilters = () => {
  currentPage.value = 1;
  loadReviews();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadReviews();
};

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isExpiringSoon = (date: string) => {
  if (!date) return false;
  const expiry = new Date(date);
  const now = new Date();
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursLeft < 24 && hoursLeft > 0;
};

const viewReview = (id: string) => {
  const review = reviews.value.find((r) => r.id === id);
  if (review) {
    selectedReview.value = review;
    showViewModal.value = true;
  }
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedReview.value = null;
};

const sendReminder = async (review: any) => {
  try {
    await $fetch("/api/reviews/send-reminder", {
      method: "POST",
      body: {
        review_id: review.id,
      },
    });
    showToast("Reminder sent successfully!", "success");
  } catch (error: any) {
    console.error("Failed to send reminder:", error);
    showToast(error.data?.message || "Failed to send reminder", "error");
  }
};

const showDeleteConfirm = (review: any) => {
  if (!isSuperAdmin.value) return;
  reviewToDelete.value = review;
  deleteConfirmText.value = "";
  showDeleteModal.value = true;
};

const cancelDeleteReview = () => {
  showDeleteModal.value = false;
  reviewToDelete.value = null;
  deleteConfirmText.value = "";
};

const executeDeleteReview = async () => {
  if (!reviewToDelete.value || !isSuperAdmin.value) return;
  if (deleteConfirmText.value !== "DELETE") return;

  try {
    // Delete the review
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewToDelete.value.id);

    if (error) throw error;

    showToast("Review deleted successfully!", "success");
    showDeleteModal.value = false;
    reviewToDelete.value = null;
    await loadReviews();
  } catch (error: any) {
    console.error(error);
    showToast(error?.message || "Failed to delete review", "error");
  }
};

const exportReviews = async () => {
  try {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      showToast("No reviews to export", "error");
      return;
    }

    const headers = [
      "Order Number",
      "Customer",
      "Email",
      "Overall Rating",
      "Installation Rating",
      "Technicians Rating",
      "Would Recommend",
      "Status",
      "Created At",
      "Completed At",
    ];

    const csvRows = [
      headers.join(","),
      ...data.map((r: Review) =>
        [
          r.order_number,
          `"${r.customer_name}"`,
          r.customer_email,
          r.rating_overall || "",
          r.rating_installation || "",
          r.rating_technicians || "",
          r.would_recommend ? "Yes" : r.would_recommend === false ? "No" : "",
          r.status,
          r.created_at,
          r.completed_at || "",
        ].join(","),
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast("Reviews exported successfully!", "success");
  } catch (error) {
    console.error("Failed to export reviews:", error);
    showToast("Failed to export reviews", "error");
  }
};

onMounted(async () => {
  try {
    const saved = localStorage.getItem("user");
    if (saved) currentUser.value = JSON.parse(saved);
  } catch {
    currentUser.value = null;
  }
  await loadReviews();
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
