<template>
  <div
    class="rich-editor border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm relative"
  >
    <!-- Toolbar -->
    <div
      class="flex flex-wrap items-center gap-1.5 p-2 border-b border-slate-200 bg-slate-50"
    >
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.bold }"
        title="Bold"
        @mousedown.prevent
        @click="cmd('bold')"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        class="rte-btn italic"
        :class="{ 'rte-active': state.italic }"
        title="Italic"
        @mousedown.prevent
        @click="cmd('italic')"
      >
        I
      </button>
      <button
        type="button"
        class="rte-btn underline"
        :class="{ 'rte-active': state.underline }"
        title="Underline"
        @mousedown.prevent
        @click="cmd('underline')"
      >
        U
      </button>

      <span class="rte-sep" />

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.align === 'left' }"
        title="Align left"
        @mousedown.prevent
        @click="cmd('justifyLeft')"
      >
        Left
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.align === 'center' }"
        title="Align center"
        @mousedown.prevent
        @click="cmd('justifyCenter')"
      >
        Center
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.align === 'right' }"
        title="Align right"
        @mousedown.prevent
        @click="cmd('justifyRight')"
      >
        Right
      </button>

      <span class="rte-sep" />

      <select
        class="rte-select w-auto shrink-0"
        title="Font size"
        :value="state.fontSize"
        @mousedown.stop
        @change="onSizeChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Font Size</option>
        <option value="2">Small</option>
        <option value="3">Normal</option>
        <option value="4">Large</option>
        <option value="5">XL</option>
      </select>

      <label class="rte-btn p-0 overflow-hidden relative" title="Text color">
        <span class="px-2 text-xs font-semibold">A</span>
        <input
          type="color"
          class="absolute inset-0 opacity-0 cursor-pointer"
          @input="setColor(($event.target as HTMLInputElement).value)"
        />
      </label>

      <span class="rte-sep" />

      <!-- MEDIA GROUP -->
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.link }"
        title="Add / edit link"
        @mousedown.prevent
        @click="applyLink"
      >
        Link
      </button>
      <button
        type="button"
        class="rte-btn"
        title="Remove link"
        @mousedown.prevent
        @click="cmd('unlink')"
      >
        Unlink
      </button>

      <button
        type="button"
        class="rte-btn"
        title="Insert Image"
        :disabled="isUploading"
        @mousedown.prevent
        @click="triggerImageUpload"
      >
        {{ isUploading ? "Uploading..." : "Image" }}
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />

      <button
        type="button"
        class="rte-btn"
        title="Insert Video"
        @mousedown.prevent
        @click="openVideoPicker"
      >
        Video
      </button>
      <!-- END MEDIA GROUP -->

      <span class="rte-sep" />

      <button
        type="button"
        class="rte-btn"
        title="Brand orange text"
        @mousedown.prevent
        @click="applyOrange"
      >
        Orange
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.quote }"
        title="Quote block"
        @mousedown.prevent
        @click="applyQuote"
      >
        Quote
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': state.list }"
        title="Bullet list"
        @mousedown.prevent
        @click="cmd('insertUnorderedList')"
      >
        • List
      </button>
      <button
        type="button"
        class="rte-btn"
        title="Clear formatting"
        @mousedown.prevent
        @click="cmd('removeFormat')"
      >
        Clear
      </button>
    </div>

    <!-- Uploading Overlay -->
    <div
      v-if="isUploading"
      class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-2">
        <div
          class="w-8 h-8 border-4 border-[#f49321] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm font-semibold text-[#1c2d5b]"
          >Processing & Uploading...</span
        >
      </div>
    </div>

    <!-- Editor Wrapper -->
    <div class="relative" @mouseleave="hoveredImage = null">
      <!-- Editor -->
      <div
        ref="editorEl"
        class="rte-content min-h-[180px] max-h-[680px] overflow-y-auto px-4 py-3 text-sm text-slate-700 focus:outline-none relative"
        contenteditable="true"
        :data-placeholder="placeholder"
        @input="onInput"
        @keyup="syncToolbar"
        @mouseup="syncToolbar"
        @focus="syncToolbar"
        @mouseover="handleMouseOver"
      />

      <!-- Floating Delete Button -->
      <button
        v-if="hoveredImage"
        type="button"
        class="absolute z-30 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform hover:scale-105 delete-image-btn"
        :style="{
          top: `${hoveredImage.top}px`,
          left: `${hoveredImage.left}px`,
          padding: '6px',
        }"
        title="Remove image"
        @mousedown.prevent
        @click.stop="deleteImage(hoveredImage.el)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- ==================== VIDEO PICKER MODAL ==================== -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showVideoModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="showVideoModal = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0"
          >
            <h2 class="text-xl font-bold text-[#1C2D5B]">Pick a Video</h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-700 transition-colors p-1"
              aria-label="Close"
              @click="showVideoModal = false"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto px-6 py-5">
            <!-- Loading -->
            <div v-if="videoLoading" class="flex justify-center py-16">
              <div
                class="w-10 h-10 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
              ></div>
            </div>

            <!-- Error -->
            <div
              v-else-if="videoError"
              class="text-center py-12 text-rose-500 text-sm"
            >
              {{ videoError }}
            </div>

            <!-- Empty -->
            <div v-else-if="videoList.length === 0" class="text-center py-12">
              <p class="text-sm text-slate-500 mb-4">No videos uploaded yet.</p>
              <a
                href="/admin/blog/videos"
                target="_blank"
                class="text-[#F49321] font-semibold hover:underline text-sm"
              >
                Upload one first →
              </a>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                v-for="video in videoList"
                :key="video.id"
                type="button"
                class="group text-left rounded-xl overflow-hidden border border-slate-200 hover:border-[#F49321] hover:shadow-md transition-all bg-white"
                @click="pickVideo(video)"
              >
                <div class="relative aspect-video bg-black">
                  <video
                    :src="video.public_url"
                    class="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <i class="fas fa-check text-[#F49321]"></i>
                    </div>
                  </div>
                </div>
                <div class="p-3">
                  <p class="text-sm font-bold text-[#1C2D5B] truncate">
                    {{ video.title || "(Untitled)" }}
                  </p>
                  <p class="text-[10px] text-slate-500 truncate font-mono">
                    {{ video.storage_path }}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-3 border-t border-gray-200 flex justify-end shrink-0"
          >
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="showVideoModal = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from "vue";
import type { Video } from "~/types/video";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Write content…",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const editorEl = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
let syncing = false;
let savedSelection: Range | null = null;

const hoveredImage = ref<{
  el: HTMLImageElement;
  top: number;
  left: number;
} | null>(null);

// Video picker state
const showVideoModal = ref(false);
const videoList = ref<Video[]>([]);
const videoLoading = ref(false);
const videoError = ref<string | null>(null);

const state = reactive({
  bold: false,
  italic: false,
  underline: false,
  align: "" as "" | "left" | "center" | "right",
  fontSize: "" as string,
  link: false,
  quote: false,
  list: false,
});

// --- Core Commands ---
const cmd = (command: string, value?: string) => {
  editorEl.value?.focus();
  document.execCommand(command, false, value);
  onInput();
  syncToolbar();
};

const setColor = (color: string) => {
  cmd("foreColor", color);
};

const onSizeChange = (size: string) => {
  if (!size) return;
  cmd("fontSize", size);
};

const applyOrange = () => {
  editorEl.value?.focus();
  document.execCommand("foreColor", false, "#F49321");
  document.execCommand("bold", false);
  onInput();
  syncToolbar();
};

const applyLink = () => {
  editorEl.value?.focus();
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) {
    alert("Highlight text first, then click Link");
    return;
  }

  const existing = document.queryCommandValue("createLink") || "";
  const url = window.prompt("Enter URL[](https://…)", existing || "https://");
  if (url === null) return;
  if (!url.trim()) {
    document.execCommand("unlink");
  } else {
    document.execCommand("createLink", false, url.trim());
  }
  onInput();
  syncToolbar();
};

const applyQuote = () => {
  const editor = editorEl.value;
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  let node: Node | null = sel?.anchorNode || null;
  if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;

  const existing = (node as HTMLElement)?.closest?.("blockquote");
  if (existing && editor.contains(existing)) {
    const parent = existing.parentNode;
    while (existing.firstChild)
      parent?.insertBefore(existing.firstChild, existing);
    parent?.removeChild(existing);
    onInput();
    syncToolbar();
    return;
  }

  const text = sel?.toString()?.trim() || "Quote text here…";
  const html = `<blockquote class="about-quote">${text}</blockquote><p><br></p>`;
  document.execCommand("insertHTML", false, html);
  onInput();
  syncToolbar();
};

// --- Video Picker ---
const openVideoPicker = async () => {
  // Save cursor position before modal opens
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedSelection = sel.getRangeAt(0);
  }

  showVideoModal.value = true;

  if (videoList.value.length === 0) {
    videoLoading.value = true;
    videoError.value = null;
    try {
      const res = await $fetch<{
        success: boolean;
        data?: Video[];
        error?: string;
      }>("/api/blog/videos");
      if (!res.success) throw new Error(res.error || "Failed to load videos");
      videoList.value = res.data || [];
    } catch (e: any) {
      videoError.value = e?.message || "Failed to load videos";
    } finally {
      videoLoading.value = false;
    }
  }
};

const pickVideo = (video: Video) => {
  showVideoModal.value = false;

  editorEl.value?.focus();
  // Restore cursor position
  if (savedSelection) {
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(savedSelection);
  }

  const html = `
    <div style="margin: 1.5rem 0;">
      <video
        src="${video.public_url}"
        controls
        preload="metadata"
        playsinline
        style="width: 100%; max-width: 720px; border-radius: 0.5rem; display: block; margin: 0 auto; background: #000;"
      ></video>
    </div>
    <p><br></p>
  `;

  document.execCommand("insertHTML", false, html);
  onInput();
  savedSelection = null;
};

// --- Image Upload & Conversion Logic ---
const triggerImageUpload = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedSelection = sel.getRangeAt(0);
  }
  fileInputRef.value?.click();
};

const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (
      file.type === "image/webp" ||
      file.type === "image/gif" ||
      file.type === "image/svg+xml"
    ) {
      return resolve(file);
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");

      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP conversion failed"));

          const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const webpFile = new File([blob], newName, { type: "image/webp" });
          resolve(webpFile);
        },
        "image/webp",
        0.85,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = url;
  });
};

const handleImageUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  input.value = "";
  isUploading.value = true;

  try {
    const processedFile = await convertToWebP(file);

    const formData = new FormData();
    formData.append("file", processedFile);
    formData.append("folder", "blog/inline");

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

    editorEl.value?.focus();
    if (savedSelection) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection);
    }

    const html = `
      <div style="text-align: center; margin: 1.5rem 0;">
        <img 
          src="${response.url}" 
          style="display: inline-block; max-width: 100%; max-height: 450px; width: auto; height: auto; border-radius: 0.5rem; object-fit: contain;" 
          alt="Inserted Image" 
        />
      </div>
      <p><br></p>
    `;

    document.execCommand("insertHTML", false, html);
    onInput();
  } catch (err: any) {
    alert(err?.message || "Failed to upload image. Please try again.");
  } finally {
    isUploading.value = false;
    savedSelection = null;
  }
};

// --- Image Hover & Delete Logic ---
const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (target.closest(".delete-image-btn")) return;

  if (target.tagName === "IMG") {
    const img = target as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const editorRect = editorEl.value?.getBoundingClientRect();

    if (editorRect) {
      hoveredImage.value = {
        el: img,
        top: rect.top - editorRect.top + (editorEl.value?.scrollTop || 0) + 8,
        left: rect.right - editorRect.left - 32,
      };
    }
  } else {
    hoveredImage.value = null;
  }
};

const deleteImage = async (imgElement: HTMLImageElement) => {
  const src = imgElement.getAttribute("src");
  if (!src) return;

  const parent = imgElement.parentElement;
  if (parent && parent.tagName === "DIV" && parent.children.length === 1) {
    parent.remove();
  } else {
    imgElement.remove();
  }

  hoveredImage.value = null;
  onInput();

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

// --- State & Lifecycle ---
const syncToolbar = () => {
  try {
    state.bold = document.queryCommandState("bold");
    state.italic = document.queryCommandState("italic");
    state.underline = document.queryCommandState("underline");
    state.list = document.queryCommandState("insertUnorderedList");

    if (document.queryCommandState("justifyCenter")) state.align = "center";
    else if (document.queryCommandState("justifyRight")) state.align = "right";
    else if (document.queryCommandState("justifyLeft")) state.align = "left";
    else state.align = "left";

    const fs = document.queryCommandValue("fontSize");
    state.fontSize = fs && fs !== "0" ? fs : "";

    const sel = window.getSelection();
    let node: Node | null = sel?.anchorNode || null;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
    const el = node as HTMLElement | null;
    state.link = !!el?.closest?.("a");
    state.quote = !!el?.closest?.("blockquote");
  } catch {
    /* ignore */
  }
};

const onInput = () => {
  if (!editorEl.value || syncing) return;
  emit("update:modelValue", editorEl.value.innerHTML);
  syncToolbar();
};

const setHtml = (html: string) => {
  if (!editorEl.value) return;
  syncing = true;
  editorEl.value.innerHTML = html || "";
  syncing = false;
};

watch(
  () => props.modelValue,
  (val) => {
    if (!editorEl.value) return;
    if (editorEl.value.innerHTML === (val || "")) return;
    setHtml(val || "");
  },
);

onMounted(() => {
  setHtml(props.modelValue || "");
  document.addEventListener("selectionchange", onSelectionChange);
});

onUnmounted(() => {
  document.removeEventListener("selectionchange", onSelectionChange);
});

const onSelectionChange = () => {
  if (!editorEl.value) return;
  const sel = window.getSelection();
  if (!sel?.anchorNode) return;
  if (editorEl.value.contains(sel.anchorNode)) syncToolbar();
};
</script>

<style scoped>
.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}
.rte-btn:hover {
  background: #f1f5f9;
}
.rte-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rte-active {
  background: #f49321 !important;
  color: #fff !important;
  border-color: #f49321 !important;
}
.rte-sep {
  width: 1px;
  height: 1.25rem;
  background: #cbd5e1;
  margin: 0 0.15rem;
}
.rte-select {
  width: auto;
  max-width: max-content;
  flex-shrink: 0;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  font-size: 0.75rem;
  background: #fff;
}
.rte-content:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}
.rte-content :deep(a) {
  color: #f49321;
  text-decoration: underline;
}
.rte-content :deep(blockquote),
.rte-content :deep(.about-quote) {
  border-left: 4px solid #f49321;
  padding-left: 0.75rem;
  margin: 0.75rem 0;
  color: #1c2d5b;
  font-weight: 600;
}
.rte-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rte-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rte-content :deep(li) {
  display: list-item;
  margin: 0.25rem 0;
}
.rte-content :deep(ul ul) {
  list-style-type: circle;
}
.rte-content :deep(ul ul ul) {
  list-style-type: square;
}
.rte-content :deep(ol ol) {
  list-style-type: lower-alpha;
}
.rte-content :deep(ol ol ol) {
  list-style-type: lower-roman;
}
.rte-content :deep(iframe) {
  max-width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}
.rte-content :deep(video) {
  max-width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}
</style>
