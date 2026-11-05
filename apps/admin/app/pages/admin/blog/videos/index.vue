<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Videos</h1>
        <p class="text-slate-500 text-sm">Upload and manage videos</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        @click="showUploadModal = true"
      >
        <VideoCameraIcon class="h-4 w-4" />
        Upload Video
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <input
        v-model="search"
        type="text"
        class="field"
        placeholder="Search videos by title or path…"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-24">
      <div
        class="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="filtered.length === 0"
      class="text-center py-20 bg-white rounded-xl border border-slate-100"
    >
      <VideoCameraIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-navy mb-1">No videos yet</h3>
      <p class="text-sm text-slate-500 mb-4">
        {{
          search
            ? "No videos match your search."
            : "Upload your first video to get started."
        }}
      </p>
      <button
        v-if="!search"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        @click="showUploadModal = true"
      >
        <VideoCameraIcon class="h-4 w-4" />
        Upload Video
      </button>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <VideoCard
        v-for="video in filtered"
        :key="video.id"
        :video="video"
        @copy="copyUrl"
        @edit="editTarget = $event"
        @delete="deleteTarget = $event"
      />
    </div>

    <!-- Modals -->
    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="onUploaded"
    />
    <EditVideoModal
      v-if="editTarget"
      :video="editTarget"
      @close="editTarget = null"
      @updated="onUpdated"
    />
    <DeleteVideoModal
      v-if="deleteTarget"
      :video="deleteTarget"
      @close="deleteTarget = null"
      @deleted="onDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoCameraIcon } from "@heroicons/vue/24/outline";
import DeleteVideoModal from "~/components/Videos/DeleteVideoModal.vue";
import UploadModal from "~/components/Videos/UploadModal.vue";
import VideoCard from "~/components/Videos/VideoCard.vue";
import type { Video } from "~/types/video";

const { showToast } = useToast();

const videos = ref<Video[]>([]);
const loading = ref(false);
const search = ref("");

const showUploadModal = ref(false);
const editTarget = ref<Video | null>(null);
const deleteTarget = ref<Video | null>(null);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return videos.value;
  return videos.value.filter(
    (v) =>
      (v.title || "").toLowerCase().includes(q) ||
      v.storage_path.toLowerCase().includes(q),
  );
});

const fetchVideos = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data?: Video[];
      error?: string;
    }>("/api/blog/videos");
    if (!res.success) throw new Error(res.error || "Failed to load videos");
    videos.value = res.data || [];
  } catch (e: any) {
    showToast(e?.message || "Failed to load videos", "error");
  } finally {
    loading.value = false;
  }
};

const onUploaded = (video: Video) => {
  videos.value.unshift(video);
};

const onUpdated = (video: Video) => {
  const idx = videos.value.findIndex((v) => v.id === video.id);
  if (idx !== -1) videos.value[idx] = video;
};

const onDeleted = (id: string) => {
  videos.value = videos.value.filter((v) => v.id !== id);
};

const copyUrl = async (video: Video) => {
  try {
    await navigator.clipboard.writeText(video.public_url);
    showToast("URL copied", "success");
  } catch {
    showToast("Failed to copy URL", "error");
  }
};

onMounted(fetchVideos);
</script>
