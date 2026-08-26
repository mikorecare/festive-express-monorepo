<template>
  <div
    class="rich-editor border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
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

    <!-- Editor -->
    <div
      ref="editorEl"
      class="rte-content min-h-[180px] max-h-[420px] overflow-y-auto px-4 py-3 text-sm text-slate-700 focus:outline-none"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="onInput"
      @keyup="syncToolbar"
      @mouseup="syncToolbar"
      @focus="syncToolbar"
    />
  </div>
</template>

<script setup lang="ts">
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
let syncing = false;

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

    // fontSize returns "1"–"7" when using execCommand fontSize
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
</style>
