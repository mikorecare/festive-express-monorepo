<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <div
      v-if="fetchingProject"
      class="flex justify-center items-center min-h-[60vh]"
    >
      <div
        class="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
    <template v-else>
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-navy">
            {{ isEditing ? "Edit Project" : "New Project" }}
          </h1>
          <p class="text-slate-500 text-sm">
            Project details, hero image, gallery images & SEO
          </p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            v-if="isEditing && projectId"
            :to="`/admin/projects/${projectId}/view`"
            class="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
          >
            <i class="fas fa-eye text-[10px]"></i>
            View Project
          </NuxtLink>
          <button
            type="button"
            class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100"
            @click="goBack"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            :disabled="saving"
            @click="saveContent('draft')"
          >
            {{ saving ? "Saving..." : "Save Draft" }}
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
            :disabled="saving"
            @click="saveContent('published')"
          >
            {{ saving ? "Saving..." : "Publish" }}
          </button>
        </div>
      </div>

      <form class="space-y-6" @submit.prevent="saveContent('draft')">
        <!-- ── Project Details ─────────────────────────────────── -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5"
        >
          <h2 class="text-lg font-bold text-navy">Project Details</h2>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Title <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="field"
              placeholder="Holiday Lighting Florida, FL"
              @blur="autoSlug"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Slug <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              required
              class="field"
              placeholder="holiday-lighting-florida-fl"
            />
            <p class="text-xs text-slate-400 mt-1">
              URL path: /projects/{{ form.slug || "..." }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >Category</label
              >
              <select v-model="form.category_id" class="field">
                <option :value="null">— No category —</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >Status</label
              >
              <select v-model="form.status" class="field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Tags</label
            >
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tag in selectedTags"
                :key="tag.id"
                class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
              >
                {{ tag.name }}
                <button
                  type="button"
                  class="text-slate-400 hover:text-rose-500"
                  @click="removeTag(tag.id)"
                >
                  ✕
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <select v-model="tagToAdd" class="field flex-1">
                <option :value="null">— Add a tag —</option>
                <option v-for="t in availableTags" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
              <button
                type="button"
                class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                :disabled="!tagToAdd"
                @click="addTag"
              >
                Add
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >Client Name</label
              >
              <input
                v-model="form.client_name"
                type="text"
                class="field"
                placeholder="Nemeth Family Residence"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >City</label
              >
              <input v-model="form.location_city" type="text" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >State</label
              >
              <input
                v-model="form.location_state"
                type="text"
                class="field"
                maxlength="2"
                placeholder="FL"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Completion Date</label
            >
            <input v-model="form.completion_date" type="date" class="field" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Summary</label
            >
            <textarea
              v-model="form.summary"
              rows="2"
              class="field"
              placeholder="Short excerpt shown in listings"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Description</label
            >
            <RichTextEditor
              v-model="form.description"
              placeholder="Describe the project…"
            />
          </div>
        </div>

        <!-- ── Hero Image ──────────────────────────────────────── -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-navy">Hero Image</h2>
            <div v-if="form.hero_image_url" class="flex items-center gap-2">
              <label
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors"
                :class="{ 'opacity-60 pointer-events-none': heroUploading }"
              >
                <ArrowPathIcon
                  class="h-3.5 w-3.5"
                  :class="{ 'animate-spin': heroUploading }"
                />
                Replace
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  :disabled="heroUploading"
                  @change="onHeroUpload"
                />
              </label>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors disabled:opacity-60"
                :disabled="heroUploading"
                @click="removeHero"
              >
                <TrashIcon class="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>

          <div v-if="form.hero_image_url" class="space-y-3">
            <div
              class="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
            >
              <img
                :src="form.hero_image_url"
                alt="Hero"
                class="w-full h-56 object-cover"
              />
              <div
                v-if="heroUploading"
                class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 z-10"
              >
                <ArrowPathIcon class="h-8 w-8 text-brand-orange animate-spin" />
                <p class="text-sm font-medium text-slate-700">Uploading…</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                Alt text <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.hero_image_alt"
                type="text"
                class="field"
                placeholder="Front of a residential home lit for the holidays"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >Image Title</label
              >
              <input
                v-model="form.hero_image_title"
                type="text"
                class="field"
              />
            </div>
          </div>

          <label
            v-else
            class="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
            :class="
              heroUploading
                ? 'border-brand-orange bg-orange-50 cursor-wait'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-brand-orange'
            "
          >
            <div
              class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center"
            >
              <template v-if="heroUploading">
                <ArrowPathIcon
                  class="w-10 h-10 mb-3 text-brand-orange animate-spin"
                />
                <p class="text-sm font-semibold text-slate-700">Uploading…</p>
              </template>
              <template v-else>
                <PhotoIcon class="w-10 h-10 mb-3 text-slate-400" />
                <p class="text-sm font-semibold text-slate-700">
                  Click to upload hero image
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  PNG, JPG, WEBP up to 10 MB — auto-converted to WebP
                </p>
              </template>
            </div>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="heroUploading"
              @change="onHeroUpload"
            />
          </label>
        </div>

        <!-- ── Gallery Images ──────────────────────────────────── -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-navy">Gallery Images</h2>
              <p class="text-xs text-slate-500">
                Each image needs alt text — used for accessibility & SEO
              </p>
            </div>
            <label
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-orange text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-orange-600"
            >
              <PlusIcon class="h-3.5 w-3.5" />
              Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                :disabled="anyUploading"
                @change="onGalleryUpload"
              />
            </label>
          </div>

          <div
            v-if="draftImages.length === 0"
            class="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm"
          >
            No gallery images yet. Click "Add Image" to start.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(img, i) in draftImages"
              :key="img.tempId || img.id || i"
              class="border border-slate-200 rounded-xl p-4 space-y-3"
            >
              <div class="flex gap-3">
                <img
                  :src="img.image_url"
                  :alt="img.alt_text || 'Gallery image'"
                  class="w-28 h-20 object-cover rounded"
                />
                <div class="flex flex-col gap-2">
                  <label
                    class="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium cursor-pointer hover:bg-slate-200"
                  >
                    <ArrowPathIcon class="h-3 w-3" />
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      :disabled="anyUploading"
                      @change="(e) => onReplaceGallery(i, e)"
                    />
                  </label>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 text-rose-600 rounded text-xs font-medium hover:bg-rose-100"
                    @click="removeGalleryImage(i)"
                  >
                    <TrashIcon class="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Alt text <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="img.alt_text"
                  type="text"
                  class="field"
                  placeholder="Roofline lights over a two-story home"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1"
                    >Image Title</label
                  >
                  <input v-model="img.title" type="text" class="field" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1"
                    >Room / Area</label
                  >
                  <input
                    v-model="img.room_or_area"
                    type="text"
                    class="field"
                    placeholder="Front Yard"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1"
                  >Caption</label
                >
                <input v-model="img.caption" type="text" class="field" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1"
                  >Description (for schema)</label
                >
                <textarea v-model="img.description" rows="2" class="field" />
              </div>

              <div class="flex items-center gap-3 pt-1">
                <label class="inline-flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    :checked="img.is_featured"
                    @change="setFeatured(i)"
                  />
                  Featured
                </label>
                <button
                  type="button"
                  class="text-xs px-2 py-1 border border-slate-200 rounded disabled:opacity-40"
                  :disabled="i === 0"
                  @click="move(i, -1)"
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  class="text-xs px-2 py-1 border border-slate-200 rounded disabled:opacity-40"
                  :disabled="i === draftImages.length - 1"
                  @click="move(i, 1)"
                >
                  ↓ Down
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  PhotoIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";

type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

type GalleryImageDraft = {
  tempId: string;
  id?: string;
  image_url: string;
  alt_text: string;
  title: string;
  caption: string;
  description: string;
  room_or_area: string;
  is_featured: boolean;
};

type ProjectRow = {
  id?: string;
  category_id: number | null;
  title: string;
  slug: string;
  client_name: string | null;
  location_city: string | null;
  location_state: string | null;
  completion_date: string | null;
  summary: string | null;
  description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  hero_image_title: string | null;
  hero_seo: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  published_at: string | null;
};

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();

const projectId = computed(() => {
  const id = route.params.id as string | undefined;
  return id && id !== "create" ? id : null;
});
const isEditing = computed(() => !!projectId.value);

const emptyProject = (): ProjectRow => ({
  category_id: null,
  title: "",
  slug: "",
  client_name: "",
  location_city: "",
  location_state: "",
  completion_date: "",
  summary: "",
  description: "",
  hero_image_url: "",
  hero_image_alt: "",
  hero_image_title: "",
  hero_seo: {},
  status: "draft",
  published_at: null,
});

const form = ref<ProjectRow>(emptyProject());
const saving = ref(false);
const fetchingProject = ref(false);

const heroUploading = ref(false);
const galleryUploadingCount = ref(0);
const anyUploading = computed(
  () => heroUploading.value || galleryUploadingCount.value > 0,
);

const categories = ref<Category[]>([]);
const allTags = ref<Tag[]>([]);
const selectedTagIds = ref<number[]>([]);
const tagToAdd = ref<number | null>(null);

const selectedTags = computed(() =>
  allTags.value.filter((t) => selectedTagIds.value.includes(t.id)),
);
const availableTags = computed(() =>
  allTags.value.filter((t) => !selectedTagIds.value.includes(t.id)),
);

const draftImages = ref<GalleryImageDraft[]>([]);

// ── Slug helper ─────────────────────────────────────────────
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const autoSlug = () => {
  if (!isEditing.value && !form.value.slug) {
    form.value.slug = slugify(form.value.title);
  }
};

// ── Meta (categories + tags) ────────────────────────────────
const loadMeta = async () => {
  const [catRes, tagRes] = await Promise.all([
    $fetch<{ success: boolean; data: Category[] }>("/api/blog/categories"),
    $fetch<{ success: boolean; data: Tag[] }>("/api/blog/tags"),
  ]);
  categories.value = catRes.data || [];
  allTags.value = tagRes.data || [];
};

// ── Load existing project ───────────────────────────────────
interface ProjectResponse {
  success: boolean;
  data:
    | (ProjectRow & {
        post_categories?: Category | null;
        project_tags?: { tag_id: number; tags?: Tag | null }[];
        project_images?: any[];
      })
    | null;
}
const loadProject = async () => {
  if (!projectId.value) return;
  fetchingProject.value = true;
  try {
    const res = await $fetch<ProjectResponse>(
      `/api/gallery/projects/${projectId.value}`,
    );
    if (res.success && res.data) {
      const row = res.data;
      form.value = {
        category_id: row.category_id ?? null,
        title: row.title || "",
        slug: row.slug || "",
        client_name: row.client_name || "",
        location_city: row.location_city || "",
        location_state: row.location_state || "",
        completion_date: row.completion_date || "",
        summary: row.summary || "",
        description: row.description || "",
        hero_image_url: row.hero_image_url || "",
        hero_image_alt: row.hero_image_alt || "",
        hero_image_title: row.hero_image_title || "",
        hero_seo: row.hero_seo || {},
        status: row.status || "draft",
        published_at: row.published_at || null,
      };
      selectedTagIds.value = (row.project_tags || []).map((t) => t.tag_id);

      draftImages.value = (row.project_images || []).map((img: any) => ({
        tempId: crypto.randomUUID(),
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || "",
        title: img.title || "",
        caption: img.caption || "",
        description: img.description || "",
        room_or_area: img.room_or_area || "",
        is_featured: img.is_featured,
      }));
    }
  } catch (e: any) {
    console.error(e);
    showToast(e?.message || "Failed to load project", "error");
  } finally {
    fetchingProject.value = false;
  }
};

// ── Tag helpers ─────────────────────────────────────────────
const addTag = () => {
  if (tagToAdd.value == null) return;
  if (!selectedTagIds.value.includes(tagToAdd.value)) {
    selectedTagIds.value.push(tagToAdd.value);
  }
  tagToAdd.value = null;
};

const removeTag = (id: number) => {
  selectedTagIds.value = selectedTagIds.value.filter((t) => t !== id);
};

// ── Upload (WebP + bucket = project-gallery) ────────────────
const uploadImage = async (file: File, folder: string) => {
  const webp = await convertToWebP(file);
  const fd = new FormData();
  fd.append("file", webp);
  fd.append("bucket", "project-gallery");
  fd.append("folder", folder);

  const res = await $fetch<{
    success: boolean;
    url?: string;
    error?: string;
  }>("/api/upload", { method: "POST", body: fd });

  if (!res.success || !res.url) {
    throw new Error(res.error || "Upload failed");
  }
  return res.url;
};

const deleteStorageImage = async (url: string) => {
  const marker = "/storage/v1/object/public/project-gallery/";
  const i = url.indexOf(marker);
  if (i === -1) return;
  const path = url.substring(i + marker.length);
  try {
    await $fetch("/api/upload", {
      method: "DELETE",
      body: { path, bucket: "project-gallery" },
    });
  } catch (e) {
    console.error("Failed to delete storage object:", e);
  }
};

// ── Hero image ──────────────────────────────────────────────
const onHeroUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  input.value = "";

  heroUploading.value = true;
  const oldUrl = form.value.hero_image_url;
  try {
    const folder = `projects/${form.value.slug || projectId.value || "new"}/hero`;
    const url = await uploadImage(file, folder);
    form.value.hero_image_url = url;
    showToast("Hero image uploaded", "success");
    if (oldUrl) deleteStorageImage(oldUrl);
  } catch (err: any) {
    showToast(err?.message || "Hero upload failed", "error");
  } finally {
    heroUploading.value = false;
  }
};

const removeHero = async () => {
  const url = form.value.hero_image_url;
  form.value.hero_image_url = "";
  form.value.hero_image_alt = "";
  form.value.hero_image_title = "";
  showToast("Hero image removed", "success");
  if (url) deleteStorageImage(url);
};

// ── Gallery images ──────────────────────────────────────────
const makeDraft = (url: string): GalleryImageDraft => ({
  tempId: crypto.randomUUID(),
  image_url: url,
  alt_text: "",
  title: "",
  caption: "",
  description: "",
  room_or_area: "",
  is_featured: draftImages.value.length === 0,
});

const onGalleryUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = "";
  if (!files.length) return;

  galleryUploadingCount.value += files.length;
  try {
    const folder = `projects/${form.value.slug || projectId.value || "new"}/gallery`;
    for (const file of files) {
      try {
        const url = await uploadImage(file, folder);
        draftImages.value.push(makeDraft(url));
      } catch (err: any) {
        showToast(err?.message || "Gallery upload failed", "error");
      } finally {
        galleryUploadingCount.value = Math.max(
          0,
          galleryUploadingCount.value - 1,
        );
      }
    }
  } finally {
    galleryUploadingCount.value = 0;
  }
};

const onReplaceGallery = async (index: number, e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  const target = draftImages.value[index];
  if (!target) return;

  galleryUploadingCount.value++;
  const oldUrl = target.image_url;
  try {
    const folder = `projects/${form.value.slug || projectId.value || "new"}/gallery`;
    const url = await uploadImage(file, folder);
    target.image_url = url;
    showToast("Image replaced", "success");
    if (oldUrl) deleteStorageImage(oldUrl);
  } catch (err: any) {
    showToast(err?.message || "Replace failed", "error");
  } finally {
    galleryUploadingCount.value = Math.max(0, galleryUploadingCount.value - 1);
  }
};

const removeGalleryImage = (index: number) => {
  const img = draftImages.value[index];
  if (!img) return;

  draftImages.value.splice(index, 1);
  if (img.image_url) deleteStorageImage(img.image_url);

  if (img.is_featured && draftImages.value.length > 0) {
    const first = draftImages.value[0];
    if (first) first.is_featured = true;
  }
};

const setFeatured = (index: number) => {
  draftImages.value.forEach((img, i) => {
    img.is_featured = i === index;
  });
};

const move = (index: number, delta: number) => {
  const next = index + delta;
  if (next < 0 || next >= draftImages.value.length) return;
  const [item] = draftImages.value.splice(index, 1);
  if (!item) return;
  draftImages.value.splice(next, 0, item);
};

// ── Navigation ──────────────────────────────────────────────
const goBack = () => router.push("/admin/projects");

// ── Save ────────────────────────────────────────────────────
const saveContent = async (status: "draft" | "published") => {
  if (!form.value.title?.trim()) {
    showToast("Title is required", "error");
    return;
  }
  if (!form.value.slug?.trim()) {
    showToast("Slug is required", "error");
    return;
  }
  if (status === "published") {
    if (!form.value.hero_image_url) {
      showToast("Hero image is required to publish", "error");
      return;
    }
    if (!form.value.hero_image_alt?.trim()) {
      showToast("Hero image alt text is required to publish", "error");
      return;
    }
    const missingAlt = draftImages.value.find((img) => !img.alt_text.trim());
    if (missingAlt) {
      showToast(
        "Every gallery image needs alt text before publishing",
        "error",
      );
      return;
    }
  }

  const publishedAt =
    status === "published"
      ? form.value.published_at || new Date().toISOString()
      : form.value.published_at;

  const payload = {
    title: form.value.title.trim(),
    slug: form.value.slug.trim(),
    category_id: form.value.category_id,
    client_name: form.value.client_name || null,
    location_city: form.value.location_city || null,
    location_state: form.value.location_state || null,
    completion_date: form.value.completion_date || null,
    summary: form.value.summary || null,
    description: form.value.description || null,
    hero_image_url: form.value.hero_image_url || null,
    hero_image_alt: form.value.hero_image_alt || null,
    hero_image_title: form.value.hero_image_title || null,
    hero_seo: form.value.hero_seo || {},
    status,
    published_at: publishedAt,
    tag_ids: selectedTagIds.value,
  };

  saving.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      id?: string;
      error?: string;
    }>(
      isEditing.value
        ? `/api/gallery/projects/${projectId.value}`
        : "/api/gallery/projects",
      {
        method: isEditing.value ? "PUT" : "POST",
        body: payload,
      },
    );

    if (!response.success) throw new Error(response.error || "Save failed");

    const savedId = isEditing.value ? projectId.value! : response.id;
    if (!savedId) throw new Error("Project saved but id missing");

    // ── Sync Images ──────────────────────────────────────────
    const imgRes = await $fetch<{ success: boolean; error?: string }>(
      `/api/gallery/projects/${savedId}/images`,
      {
        method: "PUT",
        body: { images: draftImages.value },
      },
    );
    if (!imgRes.success)
      throw new Error(imgRes.error || "Failed to save gallery images");
    // ─────────────────────────────────────────────────────────

    if (status === "published") {
      showToast("Project published", "success");
      router.push("/admin/projects");
    } else {
      showToast("Draft saved", "success");
      if (!isEditing.value) {
        router.replace(`/admin/projects/${savedId}`);
      }
    }
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg.includes("duplicate key") && msg.includes("slug")) {
      showToast("That slug is already taken", "error");
    } else {
      showToast(msg || "Save failed", "error");
    }
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadMeta();
  await loadProject();
});
</script>
