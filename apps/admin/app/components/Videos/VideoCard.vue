<template>
  <div
    class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
  >
    <!-- Video preview -->
    <div class="relative bg-black aspect-video">
      <video
        :src="video.public_url"
        class="w-full h-full object-contain"
        controls
        preload="metadata"
        playsinline
      />
    </div>

    <!-- Body -->
    <div class="p-4 flex flex-col flex-1">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="text-sm font-bold text-navy line-clamp-2 flex-1">
          {{ video.title || "(Untitled)" }}
        </h3>
        <span
          v-if="video.post_id"
          class="shrink-0 inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold"
        >
          Attached
        </span>
        <span
          v-else
          class="shrink-0 inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-semibold"
        >
          Unattached
        </span>
      </div>

      <p class="text-[11px] text-slate-400 font-mono truncate mb-3">
        {{ video.storage_path }}
      </p>

      <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
        <span>{{ formatBytes(video.size_bytes) }}</span>
        <span class="text-slate-300">•</span>
        <span>{{ formatDate(video.created_at) }}</span>
      </div>

      <!-- Actions -->
      <div class="mt-auto flex gap-2">
        <button
          type="button"
          class="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200"
          @click="$emit('copy', video)"
        >
          Copy URL
        </button>
        <button
          type="button"
          class="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-slate-800"
          @click="$emit('edit', video)"
        >
          Edit
        </button>
        <button
          type="button"
          class="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600"
          @click="$emit('delete', video)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from "~/types/video";
import { formatBytes } from "~/types/video";

defineProps<{ video: Video }>();
defineEmits<{
  (e: "copy", video: Video): void;
  (e: "edit", video: Video): void;
  (e: "delete", video: Video): void;
}>();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>
