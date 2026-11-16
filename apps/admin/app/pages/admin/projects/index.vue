<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Project Gallery</h1>
        <p class="text-slate-500 text-sm">
          Manage gallery projects, hero images & SEO metadata
        </p>
      </div>
      <div class="flex flex-row gap-2">
        <NuxtLink
          to="/admin/projects/create"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          <PlusIcon class="h-4 w-4" />
          Add New Project
        </NuxtLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
          :disabled="syncing"
          @click="syncCache"
        >
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': syncing }" />
          {{ syncing ? "Syncing…" : "Sync" }}
        </button>
      </div>
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
        <select v-model="statusFilter" class="field" @change="fetchProjects(1)">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          v-model="categoryFilter"
          class="field"
          @change="fetchProjects(1)"
        >
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
      v-else-if="projects.length === 0"
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
    >
      <PhotoIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">No projects yet</h3>
      <p class="text-sm text-slate-500 mb-4">
        Start by creating your first gallery project.
      </p>
      <NuxtLink
        to="/admin/projects/create"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        <PlusIcon class="h-4 w-4" />
        Create Project
      </NuxtLink>
    </div>

    <!-- 3-col card grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
      >
        <!-- Hero image -->
        <div class="relative h-44 bg-slate-100 overflow-hidden">
          <img
            v-if="project.hero_image_url"
            :src="project.hero_image_url"
            :alt="project.hero_image_alt || project.title"
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
            :class="statusBadgeClass(project.status)"
          >
            {{ project.status }}
          </span>

          <!-- Category badge -->
          <span
            v-if="project.project_categories"
            class="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-navy/90 text-white"
          >
            {{ project.project_categories.name }}
          </span>
        </div>

        <!-- Body -->
        <div class="p-4 flex-1 flex flex-col">
          <NuxtLink
            :to="`/admin/projects/${project.id}`"
            class="text-base font-bold text-navy line-clamp-2 hover:text-brand-orange transition-colors mb-1"
          >
            {{ project.title }}
          </NuxtLink>

          <p class="text-xs text-slate-500 line-clamp-2 mb-3">
            {{ project.summary || "No summary provided." }}
          </p>

          <!-- Location -->
          <div
            v-if="project.location_city || project.location_state"
            class="flex items-center gap-1 text-[11px] text-slate-500 mb-3"
          >
            <MapPinIcon class="h-3 w-3 shrink-0" />
            <span>
              {{ project.location_city }}
              <template v-if="project.location_city && project.location_state"
                >,</template
              >
              {{ project.location_state }}
            </span>
          </div>

          <!-- Meta -->
          <div
            class="mt-auto pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between"
          >
            <span>
              {{
                project.published_at
                  ? formatDate(project.published_at)
                  : formatDate(project.created_at)
              }}
            </span>
            <span>{{ project.published_at ? "Published" : "Created" }}</span>
          </div>

          <!-- Actions (2-column grid) -->
          <div class="grid grid-cols-2 gap-1.5 mt-3">
            <!-- Edit -->
            <NuxtLink
              :to="`/admin/projects/${project.id}`"
              title="Edit Project"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-navy text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium"
            >
              <PencilSquareIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Edit</span>
            </NuxtLink>

            <!-- Preview -->
            <NuxtLink
              :to="`/admin/gallery/${project.id}/view`"
              target="_blank"
              title="Preview Project"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium"
            >
              <EyeIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Preview</span>
            </NuxtLink>

            <!-- Publish / Unpublish -->
            <button
              v-if="project.status !== 'published'"
              type="button"
              title="Publish Project"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="actingId === project.id"
              @click="changeStatus(project, 'published')"
            >
              <CheckCircleIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Publish</span>
            </button>
            <button
              v-else
              type="button"
              title="Unpublish Project"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="actingId === project.id"
              @click="changeStatus(project, 'draft')"
            >
              <PauseCircleIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Draft</span>
            </button>

            <!-- Archive -->
            <button
              type="button"
              title="Archive Project"
              class="flex items-center justify-center gap-1.5 px-2 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors text-xs font-medium"
              :disabled="
                actingId === project.id || project.status === 'archived'
              "
              @click="archiveProject(project)"
            >
              <ArchiveBoxIcon class="w-3.5 h-3.5 shrink-0" />
              <span>Archive</span>
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
          @click="fetchProjects(pagination.currentPage - 1)"
        >
          Previous
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="fetchProjects(pagination.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  PhotoIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  PauseCircleIcon,
  ArchiveBoxIcon,
  MapPinIcon,
} from "@heroicons/vue/24/outline";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

type Category = { id: string; name: string; slug: string };

type ProjectCard = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: "draft" | "published" | "archived";
  hero_image_url: string | null;
  hero_image_alt: string | null;
  location_city: string | null;
  location_state: string | null;
  published_at: string | null;
  created_at: string;
  project_categories: Category | null;
};

type Pagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

const { showToast } = useToast();

const projects = ref<ProjectCard[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(false);
const actingId = ref<string | null>(null);

const search = ref("");
const statusFilter = ref("");
const categoryFilter = ref<string | null>(null);

const pagination = reactive<Pagination>({
  currentPage: 1,
  itemsPerPage: 9,
  totalItems: 0,
  totalPages: 0,
});

const syncing = ref(false);

const syncCache = async () => {
  syncing.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      "/api/gallery/projects/sync",
      { method: "POST" },
    );
    if (!res.success) throw new Error(res.error || "Sync failed");
    showToast("Gallery cache refreshed", "success");
  } catch (e: any) {
    showToast(e?.message || "Sync failed", "error");
  } finally {
    syncing.value = false;
  }
};

// --- Data fetching ---
const fetchProjects = async (page = 1) => {
  loading.value = true;
  try {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(pagination.itemsPerPage),
    };
    if (search.value.trim()) params.search = search.value.trim();
    if (statusFilter.value) params.status = statusFilter.value;
    if (categoryFilter.value != null) params.category_id = categoryFilter.value;

    const res = await $fetch<{
      success: boolean;
      data: ProjectCard[];
      pagination: Pagination;
    }>("/api/gallery/projects", { query: params });

    if (!res.success) throw new Error("Failed to load projects");
    projects.value = res.data || [];
    Object.assign(pagination, res.pagination);
  } catch (e: any) {
    showToast(e?.message || "Failed to load projects", "error");
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
  debounceTimer = setTimeout(() => fetchProjects(1), 350);
};

// --- Actions ---
const changeStatus = async (
  project: ProjectCard,
  status: ProjectCard["status"],
) => {
  actingId.value = project.id;
  try {
    const res = await $fetch<{ success: boolean; published_at?: string }>(
      `/api/gallery/projects/${project.id}/status`,
      { method: "PUT", body: { status } },
    );
    if (!res.success) throw new Error("Update failed");
    project.status = status;
    if (res.published_at) project.published_at = res.published_at;
    showToast(
      status === "published" ? "Project published" : "Project moved to draft",
      "success",
    );
  } catch (e: any) {
    showToast(e?.message || "Update failed", "error");
  } finally {
    actingId.value = null;
  }
};

const archiveProject = async (project: ProjectCard) => {
  actingId.value = project.id;
  try {
    const res = await $fetch<{ success: boolean }>(
      `/api/gallery/projects/${project.id}/status`,
      { method: "PUT", body: { status: "archived" } },
    );
    if (!res.success) throw new Error("Archive failed");
    project.status = "archived";
    showToast("Project archived", "success");
  } catch (e: any) {
    showToast(e?.message || "Archive failed", "error");
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

const statusBadgeClass = (status: ProjectCard["status"]) => {
  switch (status) {
    case "published":
      return "bg-emerald-500 text-white";
    case "draft":
      return "bg-amber-400 text-white";
    case "archived":
      return "bg-rose-500 text-white";
    default:
      return "bg-slate-400 text-white";
  }
};

onMounted(() => {
  fetchCategories();
  fetchProjects(1);
});
</script>
