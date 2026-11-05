<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
        >
          <TrashIcon class="h-5 w-5 text-rose-600" />
        </div>
        <h3 class="text-lg font-bold text-navy">Delete Video</h3>
      </div>
      <p class="text-slate-600 text-sm mb-6">
        Delete
        <span class="font-semibold"
          >"{{ video.title || video.storage_path }}"</span
        >? This removes the file from storage and unlinks it from all posts.
        <span class="block mt-2 text-rose-600 font-semibold"
          >This cannot be undone.</span
        >
      </p>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
          :disabled="deleting"
          @click="submit"
        >
          {{ deleting ? "Deleting…" : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/outline";
import type { Video } from "~/types/video";

const props = defineProps<{ video: Video }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "deleted", id: string): void;
}>();

const { showToast } = useToast();
const deleting = ref(false);

const submit = async () => {
  deleting.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/blog/videos/${props.video.id}`,
      { method: "DELETE" },
    );
    if (!res.success) throw new Error(res.error || "Delete failed");
    showToast("Video deleted", "success");
    emit("deleted", props.video.id);
    emit("close");
  } catch (e: any) {
    showToast(e?.message || "Delete failed", "error");
  } finally {
    deleting.value = false;
  }
};
</script>
