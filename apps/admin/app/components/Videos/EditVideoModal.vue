<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div class="flex items-center gap-3 mb-5">
        <div
          class="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center"
        >
          <PencilIcon class="h-5 w-5 text-navy" />
        </div>
        <h3 class="text-lg font-bold text-navy">Edit Video</h3>
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
            placeholder="Video title"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5"
            >Public URL</label
          >
          <input
            :value="video.public_url"
            type="text"
            class="field font-mono text-xs"
            readonly
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
          :disabled="saving"
          @click="submit"
        >
          {{ saving ? "Saving…" : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon } from "@heroicons/vue/24/outline";
import type { Video } from "~/types/video";

const props = defineProps<{ video: Video }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated", video: Video): void;
}>();

const { showToast } = useToast();
const title = ref(props.video.title || "");
const saving = ref(false);

const submit = async () => {
  saving.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/blog/videos/${props.video.id}`,
      { method: "PUT", body: { title: title.value || null } },
    );
    if (!res.success) throw new Error(res.error || "Save failed");
    showToast("Video updated", "success");
    emit("updated", { ...props.video, title: title.value || null });
    emit("close");
  } catch (e: any) {
    showToast(e?.message || "Save failed", "error");
  } finally {
    saving.value = false;
  }
};
</script>
