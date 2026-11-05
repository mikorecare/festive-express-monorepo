<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="!uploading && $emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
      <div class="flex items-center gap-3 mb-5">
        <div
          class="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center"
        >
          <VideoCameraIcon class="h-5 w-5 text-brand-orange" />
        </div>
        <h3 class="text-lg font-bold text-navy">Upload Video</h3>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5"
            >Title</label
          >
          <input
            v-model="title"
            type="text"
            class="field"
            placeholder="e.g. The Busy CEO"
            :disabled="uploading"
          />
        </div>

        <!-- Dropzone -->
        <div v-if="!selectedFile">
          <label
            class="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-colors relative"
            :class="[
              uploading
                ? 'border-brand-orange bg-orange-50 cursor-wait'
                : isDragging
                  ? 'border-brand-orange bg-orange-50'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-brand-orange',
            ]"
            @dragover.prevent="onDragOver"
            @dragenter.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
          >
            <div
              class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center pointer-events-none"
            >
              <CloudArrowUpIcon
                class="w-10 h-10 mb-2 transition-colors"
                :class="isDragging ? 'text-brand-orange' : 'text-slate-400'"
              />
              <p class="text-sm font-semibold text-slate-700">
                {{ isDragging ? "Drop it!" : "Drag & drop or click to select" }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                MP4, MOV, WebM up to 500 MB
              </p>
            </div>
            <input
              type="file"
              accept="video/*,.mov"
              class="hidden"
              :disabled="uploading"
              @change="onFileSelected"
            />
          </label>
        </div>

        <!-- Selected file / progress -->
        <div v-else class="space-y-3">
          <div
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
          >
            <VideoCameraIcon class="h-8 w-8 text-slate-400 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-navy truncate">
                {{ selectedFile.name }}
              </p>
              <p class="text-xs text-slate-500">
                {{ formatBytes(selectedFile.size) }}
              </p>
            </div>
            <button
              v-if="!uploading"
              type="button"
              class="text-slate-400 hover:text-rose-500"
              @click="selectedFile = null"
            >
              ✕
            </button>
          </div>

          <div v-if="uploading || progress > 0" class="space-y-1">
            <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                class="bg-brand-orange h-full transition-all duration-200"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <p class="text-xs text-slate-500 text-right">
              {{ progress.toFixed(0) }}%
              <span
                v-if="status === 'success'"
                class="text-emerald-600 font-semibold"
                >· Done</span
              >
              <span
                v-else-if="status === 'error'"
                class="text-rose-600 font-semibold"
                >· Failed</span
              >
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          :disabled="uploading"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
          :disabled="!selectedFile || uploading"
          @click="submit"
        >
          {{ uploading ? "Uploading…" : "Upload" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoCameraIcon, CloudArrowUpIcon } from "@heroicons/vue/24/outline";
import type { Video } from "~/types/video";
import { formatBytes } from "~/types/video";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "uploaded", video: Video): void;
}>();

const { showToast } = useToast();
const { upload, uploading, progress, status } = useVideoUpload();

const title = ref("");
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);

// --- Drag & drop ---
const onDragOver = (e: DragEvent) => {
  if (uploading.value) return;
  // Only show "drop" state if dragging files
  if (e.dataTransfer?.types?.includes("Files")) {
    isDragging.value = true;
  }
};

const onDragLeave = (e: DragEvent) => {
  // Only clear if leaving the dropzone (not just moving over a child)
  const related = e.relatedTarget as Node | null;
  const target = e.currentTarget as Node;
  if (!related || !target.contains(related)) {
    isDragging.value = false;
  }
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (uploading.value) return;

  const files = Array.from(e.dataTransfer?.files || []);
  if (!files.length) return;

  // Filter to video files only
  const videoFile = files.find(
    (f) =>
      f.type.startsWith("video/") || /\.(mp4|mov|webm|ogg|avi)$/i.test(f.name),
  );

  if (!videoFile) {
    showToast("Please drop a video file (MP4, MOV, WebM)", "error");
    return;
  }

  applyFile(videoFile);
};

// --- Picker ---
const onFileSelected = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) applyFile(file);
};

const applyFile = (file: File) => {
  selectedFile.value = file;
  if (!title.value) title.value = file.name.replace(/\.[^/.]+$/, "");
};

const submit = async () => {
  if (!selectedFile.value) return;
  try {
    const video = await upload(selectedFile.value, title.value || null, null);
    showToast("Video uploaded", "success");
    emit("uploaded", video);
    emit("close");
  } catch (e: any) {
    showToast(e?.message || "Upload failed", "error");
  }
};
</script>
