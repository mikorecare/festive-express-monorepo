<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Blog Posts</h1>
        <p class="text-slate-500 text-sm">
          Manage your blog content, categories & tags
        </p>
      </div>
      <NuxtLink
        to="/admin/blog/create"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        <PlusIcon class="h-4 w-4" />
        Add New Post
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          v-model="search"
          type="text"
          class="field"
          placeholder="Search by title…"
          @input="debouncedFetch"
        />
        <select v-model="statusFilter" class="field" @change="fetchPosts(1)">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select v-model="categoryFilter" class="field" @change="fetchPosts(1)">
          <option :value="null">All categories</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-pulse"
      >
        <div class="h-44 bg-slate-200" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-slate-200 rounded w-3/4" />
          <div class="h-3 bg-slate-200 rounded w-full" />
          <div class="h-3 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="posts.length === 0"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <DocumentTextIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">No posts yet</h3>
      <p class="text-sm text-slate-500 mb-4">
        Start by creating your first blog post.
      </p>
      <NuxtLink
        to="/admin/blog/create"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        <PlusIcon class="h-4 w-4" />
        Create Post
      </NuxtLink>
    </div>

    <!-- 3-col card grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
      >
        <!-- Featured image -->
        <div class="relative h-44 bg-slate-100 overflow-hidden">
          <img
            v-if="post.featured_image"
            :src="post.featured_image"
            :alt="post.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-slate-300"
          >
            <PhotoIcon class="h-12 w-12" />
          </div>

          <!-- Status badge -->
          <span
            class="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
            :class="statusBadgeClass(post.status)"
          >
            {{ post.status }}
          </span>

          <!-- Category badge -->
          <span
            v-if="post.category"
            class="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-navy/90 text-white"
          >
            {{ post.category.name }}
          </span>
        </div>

        <!-- Body -->
        <div class="p-4 flex-1 flex flex-col">
          <NuxtLink
            :to="`/admin/blog/${post.id}`"
            class="text-base font-bold text-navy line-clamp-2 hover:text-brand-orange transition-colors mb-1"
          >
            {{ post.title }}
          </NuxtLink>

          <p class="text-xs text-slate-500 line-clamp-2 mb-3">
            {{ post.summary || "No summary provided." }}
          </p>

          <!-- Tags -->
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="tag in post.tags.slice(0, 3)"
              :key="tag.id"
              class="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium"
            >
              #{{ tag.name }}
            </span>
            <span
              v-if="post.tags.length > 3"
              class="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium"
            >
              +{{ post.tags.length - 3 }}
            </span>
          </div>

          <!-- Meta -->
          <div
            class="mt-auto pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between"
          >
            <span>
              {{
                post.published_at
                  ? formatDate(post.published_at)
                  : formatDate(post.created_at)
              }}
            </span>
            <span>{{ post.published_at ? "Published" : "Created" }}</span>
          </div>

          <!-- Actions (2-column grid) -->
          <div class="grid grid-cols-2 gap-1.5 mt-3">
            <!-- Edit -->
            <NuxtLink
              :to="`/admin/blog/${post.id}`"
              title="Edit Post"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-navy text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium"
            >
              <PencilSquareIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Edit</span>
            </NuxtLink>

            <!-- Preview -->
            <NuxtLink
              :to="`/admin/blog/${post.id}/view`"
              target="_blank"
              title="Preview Post"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium"
            >
              <EyeIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Preview</span>
            </NuxtLink>

            <!-- Publish / Unpublish -->
            <button
              v-if="post.status !== 'published'"
              type="button"
              title="Publish Post"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="actingId === post.id"
              @click="changeStatus(post, 'published')"
            >
              <CheckCircleIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Publish</span>
            </button>
            <button
              v-else
              type="button"
              title="Unpublish Post"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="actingId === post.id"
              @click="changeStatus(post, 'draft')"
            >
              <PauseCircleIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Draft</span>
            </button>

            <!-- Delete -->
            <button
              type="button"
              title="Delete Post"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="actingId === post.id"
              @click="confirmDelete(post)"
            >
              <TrashIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages > 1"
      class="flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3"
    >
      <p class="text-xs text-slate-500">
        Showing
        <span class="font-semibold text-navy">
          {{ (pagination.currentPage - 1) * pagination.itemsPerPage + 1 }}–{{
            Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems,
            )
          }}
        </span>
        of
        <span class="font-semibold text-navy">{{ pagination.totalItems }}</span>
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
          :disabled="pagination.currentPage === 1"
          @click="fetchPosts(pagination.currentPage - 1)"
        >
          Previous
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="fetchPosts(pagination.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <TrashIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-navy">Delete Post</h3>
        </div>
        <p class="text-slate-600 text-sm mb-6">
          Delete <span class="font-semibold">"{{ deleteTarget.title }}"</span>?
          This cannot be undone.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="deleteTarget = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
            :disabled="actingId === deleteTarget.id"
            @click="doDelete"
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
  PlusIcon,
  PhotoIcon,
  DocumentTextIcon,
  TrashIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";

type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

type PostCard = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: "draft" | "published" | "archived";
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category: Category | null;
  tags: Tag[];
};

type Pagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

const { showToast } = useToast();

const posts = ref<PostCard[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(false);
const actingId = ref<string | null>(null);
const deleteTarget = ref<PostCard | null>(null);

const search = ref("");
const statusFilter = ref("");
const categoryFilter = ref<number | null>(null);

const pagination = reactive<Pagination>({
  currentPage: 1,
  itemsPerPage: 9,
  totalItems: 0,
  totalPages: 0,
});

// --- Data fetching ---
const fetchPosts = async (page = 1) => {
  loading.value = true;
  try {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(pagination.itemsPerPage),
    };
    if (search.value.trim()) params.search = search.value.trim();
    if (statusFilter.value) params.status = statusFilter.value;
    if (categoryFilter.value != null)
      params.category_id = String(categoryFilter.value);

    const res = await $fetch<{
      success: boolean;
      data: PostCard[];
      pagination: Pagination;
    }>("/api/blog/posts", { query: params });

    if (!res.success) throw new Error("Failed to load posts");
    posts.value = res.data || [];
    Object.assign(pagination, res.pagination);
  } catch (e: any) {
    showToast(e?.message || "Failed to load posts", "error");
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await $fetch<{ success: boolean; data: Category[] }>(
      "/api/blog/categories",
    );
    categories.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
};

// Debounced search
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedFetch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchPosts(1), 350);
};

// --- Actions ---
const changeStatus = async (post: PostCard, status: PostCard["status"]) => {
  actingId.value = post.id;
  try {
    const res = await $fetch<{ success: boolean; published_at?: string }>(
      `/api/blog/posts/${post.id}/status`,
      { method: "PUT", body: { status } },
    );
    if (!res.success) throw new Error("Update failed");
    post.status = status;
    if (res.published_at) post.published_at = res.published_at;
    showToast(
      status === "published" ? "Post published" : "Post unpublished",
      "success",
    );
  } catch (e: any) {
    showToast(e?.message || "Update failed", "error");
  } finally {
    actingId.value = null;
  }
};

const confirmDelete = (post: PostCard) => {
  deleteTarget.value = post;
};

const doDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  actingId.value = id;
  try {
    const res = await $fetch<{ success: boolean }>(`/api/blog/posts/${id}`, {
      method: "DELETE",
    });
    if (!res.success) throw new Error("Delete failed");
    posts.value = posts.value.filter((p) => p.id !== id);
    pagination.totalItems = Math.max(0, pagination.totalItems - 1);
    deleteTarget.value = null;
    showToast("Post deleted", "success");
  } catch (e: any) {
    showToast(e?.message || "Delete failed", "error");
  } finally {
    actingId.value = null;
  }
};

// --- Helpers ---
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusBadgeClass = (status: PostCard["status"]) => {
  switch (status) {
    case "published":
      return "bg-emerald-500 text-white";
    case "draft":
      return "bg-amber-400 text-white";
    case "archived":
      return "bg-slate-400 text-white";
    default:
      return "bg-slate-400 text-white";
  }
};

onMounted(() => {
  fetchCategories();
  fetchPosts(1);
});
</script>
