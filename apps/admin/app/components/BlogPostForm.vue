<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <div
      v-if="fetchingPost"
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
            {{ isEditing ? "Edit Post" : "New Post" }}
          </h1>
          <p class="text-slate-500 text-sm">
            Title, category, tags, content & publishing
          </p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            v-if="isEditing && postId"
            :to="`/admin/blog/${postId}/view`"
            class="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
          >
            <i class="fas fa-eye text-[10px]"></i>
            View Post
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

      <form
        role="form"
        class="space-y-6"
        @submit.prevent="saveContent('draft')"
      >
        <!-- Main content -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5"
        >
          <h2 class="text-lg font-bold text-navy">Post Details</h2>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Title <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="field"
              placeholder="Write your post title here"
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
              placeholder="my-post-title"
            />
            <p class="text-xs text-slate-400 mt-1">
              URL path: /blog/{{ form.slug || "..." }}
            </p>
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
        </div>

        <!-- Featured image -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <h2 class="text-lg font-bold text-navy">Featured Image</h2>

          <!-- Image preview with overlay actions -->
          <div v-if="form.featured_image" class="space-y-2">
            <div
              class="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
            >
              <img
                :src="form.featured_image"
                alt="Featured"
                class="w-full h-56 object-cover"
              />
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              >
                <label
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-100"
                  :class="{ 'opacity-60 pointer-events-none': uploading }"
                >
                  <ArrowPathIcon
                    class="h-4 w-4"
                    :class="{ 'animate-spin': uploading }"
                  />
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="uploading"
                    @change="onUploadFeatured"
                  />
                </label>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 disabled:opacity-60"
                  :disabled="uploading"
                  @click="removeFeaturedImage"
                >
                  <TrashIcon class="h-4 w-4" />
                  Remove
                </button>
              </div>

              <!-- Uploading overlay -->
              <div
                v-if="uploading"
                class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2"
              >
                <ArrowPathIcon class="h-8 w-8 text-brand-orange animate-spin" />
                <p class="text-sm font-medium text-slate-700">Uploading…</p>
              </div>
            </div>
          </div>

          <!-- Dropzone (no image) -->
          <label
            v-else
            class="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
            :class="
              uploading
                ? 'border-brand-orange bg-orange-50 cursor-wait'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-brand-orange'
            "
          >
            <div
              class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center"
            >
              <template v-if="uploading">
                <ArrowPathIcon
                  class="w-10 h-10 mb-3 text-brand-orange animate-spin"
                />
                <p class="text-sm font-semibold text-slate-700">Uploading…</p>
                <p class="text-xs text-slate-500 mt-1">
                  Please wait while your image is being uploaded.
                </p>
              </template>
              <template v-else>
                <PhotoIcon class="w-10 h-10 mb-3 text-slate-400" />
                <p class="text-sm font-semibold text-slate-700">
                  Click to upload featured image
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  PNG, JPG, WEBP up to 10 MB
                </p>
              </template>
            </div>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="uploading"
              @change="onUploadFeatured"
            />
          </label>
        </div>

        <!-- Content -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <h2 class="text-lg font-bold text-navy">Content</h2>
          <RichTextEditor
            v-model="form.content"
            placeholder="Write your post content…"
          />
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PhotoIcon, TrashIcon, ArrowPathIcon } from "@heroicons/vue/24/outline";

type PostRow = {
  id?: string;
  author_id?: string;
  category_id: number | null;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featured_image: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
};

type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();

const postId = computed(() => (route.params.id as string) || null);
const isEditing = computed(() => !!postId.value);

const emptyForm = (): PostRow => ({
  category_id: null,
  title: "",
  slug: "",
  summary: "",
  content: "",
  featured_image: "",
  status: "draft",
  published_at: null,
});

const form = ref<PostRow>(emptyForm());
const saving = ref(false);
const uploading = ref(false);

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

// --- Slug helper ---
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

// --- Load categories & tags ---
const loadMeta = async () => {
  const [catRes, tagRes] = await Promise.all([
    $fetch<{ success: boolean; data: Category[] }>("/api/blog/categories"),
    $fetch<{ success: boolean; data: Tag[] }>("/api/blog/tags"),
  ]);
  categories.value = catRes.data || [];
  allTags.value = tagRes.data || [];
};

// --- Load existing post ---
interface PostResponse {
  success: boolean;
  data: (PostRow & { tags?: { tag_id: number }[] }) | null;
}
const fetchingPost = ref(false);
const loadPost = async () => {
  if (!postId.value) return;
  fetchingPost.value = true;
  try {
    const response = await $fetch<PostResponse>(
      `/api/blog/posts/${postId.value}`,
    );
    if (response.success && response.data) {
      const row = response.data;
      form.value = {
        category_id: row.category_id ?? null,
        title: row.title || "",
        slug: row.slug || "",
        summary: row.summary || "",
        content: row.content || "",
        featured_image: row.featured_image || "",
        status: row.status || "draft",
        published_at: row.published_at || null,
      };
      selectedTagIds.value = (row.tags || []).map((t) => t.tag_id);
    }
  } catch (e: any) {
    console.error(e);
    showToast(e?.message || "Failed to load post", "error");
  } finally {
    fetchingPost.value = false;
  }
};

// --- Tag helpers ---
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

// --- Image upload ---
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "blog/featured");

  const response = await $fetch<{
    success: boolean;
    url?: string;
    error?: string;
  }>("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.success || !response.url) {
    throw new Error(response.error || "Upload failed");
  }
  return response.url;
};

const removeFeaturedImage = async () => {
  const src = form.value.featured_image;
  if (!src) return;

  form.value.featured_image = "";
  showToast("Featured image removed", "success");

  const bucket = "about-us";
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = src.indexOf(marker);

  if (index !== -1) {
    const filePath = src.substring(index + marker.length);
    try {
      await $fetch("/api/upload", {
        method: "DELETE",
        body: { path: filePath, bucket },
      });
    } catch (error) {
      console.error("Failed to delete image from storage:", error);
    }
  }
};

const onUploadFeatured = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // Reset input so the same file can be re-selected later
  input.value = "";

  uploading.value = true;
  try {
    form.value.featured_image = await uploadImage(file);
    showToast("Featured image uploaded", "success");
  } catch (err: any) {
    showToast(err?.message || "Upload failed", "error");
  } finally {
    uploading.value = false;
  }
};

const removeFeatured = () => {
  form.value.featured_image = "";
};

// --- Navigation ---
const goBack = () => router.push("/admin/blog");

// --- Save ---
const saveContent = async (status: "draft" | "published") => {
  if (!form.value.title?.trim()) {
    showToast("Title is required", "error");
    return;
  }
  if (!form.value.slug?.trim()) {
    showToast("Slug is required", "error");
    return;
  }
  if (!form.value.content?.trim()) {
    showToast("Content is required", "error");
    return;
  }

  const publishedAt =
    status === "published"
      ? form.value.published_at || new Date().toISOString()
      : form.value.published_at;

  const payload = {
    category_id: form.value.category_id,
    title: form.value.title.trim(),
    slug: form.value.slug.trim(),
    summary: form.value.summary || null,
    content: form.value.content,
    featured_image: form.value.featured_image || null,
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
      isEditing.value ? `/api/blog/posts/${postId.value}` : "/api/blog/posts",
      {
        method: isEditing.value ? "PUT" : "POST",
        body: payload,
      },
    );

    if (!response.success) {
      throw new Error(response.error || "Save failed");
    }

    if (status === "published") {
      showToast("Post published", "success");
      router.push("/admin/blog");
    } else {
      showToast("Draft saved", "success");
      if (!isEditing.value && response.id) {
        router.replace(`/admin/blog/${response.id}`);
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
  await loadPost();
});
</script>
