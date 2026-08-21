<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header (same as Package SKUs) -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Product Colors</h1>
        <p class="text-slate-500 text-sm">
          Manage light / product color options
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-navy transition-colors gap-2"
        @click="openCreate"
      >
        <PlusIcon class="h-4 w-4" />
        Add Color
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: form -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-[#0c2340] mb-5">
            {{ editingId ? "Edit Color" : "Add New Color" }}
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-[#0c2340] mb-1.5">
                Color Label <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.color_label"
                type="text"
                placeholder="e.g. Warm White"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/40 focus:border-[#F49322]"
                @input="onLabelInput"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#0c2340] mb-1.5">
                Color Key <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.color_key"
                type="text"
                placeholder="warm_white"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/40 focus:border-[#F49322]"
              />
              <p class="text-xs text-gray-400 mt-1 mb-0">
                Auto from label; used in code
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-[#0c2340] mb-1.5"
                  >Hex</label
                >
                <div class="flex items-center gap-2">
                  <input
                    v-model="form.hex"
                    type="color"
                    class="w-11 h-10 p-0.5 border border-gray-300 rounded-lg cursor-pointer bg-white"
                  />
                  <input
                    v-model="form.hex"
                    type="text"
                    placeholder="#f5e6c8"
                    class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/40 focus:border-[#F49322]"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-[#0c2340] mb-1.5"
                  >Sort order</label
                >
                <input
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/40 focus:border-[#F49322]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#0c2340] mb-1.5">
                Swatch CSS
                <span class="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                v-model="form.swatch_css"
                rows="2"
                placeholder="repeating-linear-gradient(...) or conic-gradient(...)"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/40 focus:border-[#F49322]"
              ></textarea>
              <p class="text-xs text-gray-400 mt-1 mb-0">
                For Candy Cane / Multicolor. Leave empty to use hex.
              </p>
            </div>

            <label
              class="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                v-model="form.is_active"
                type="checkbox"
                class="w-auto rounded border-gray-300"
              />
              Active
            </label>

            <div
              v-if="form.hex || form.swatch_css"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span
                class="w-7 h-7 rounded-full border border-gray-200 shrink-0"
                :style="swatchStyle(form)"
              ></span>
              <span class="text-sm font-medium text-[#0c2340]">
                {{ form.color_label || "Preview" }}
              </span>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button
                v-if="editingId"
                type="button"
                class="px-5 py-2.5 rounded-lg font-semibold text-[#0c2340] bg-gray-200 hover:bg-gray-300 transition-colors"
                @click="resetForm"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-5 py-2.5 rounded-lg font-semibold text-white bg-[#F49322] hover:bg-[#0c2340] transition-colors disabled:opacity-60"
                :disabled="isSaving"
                @click="saveColor"
              >
                {{
                  isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Color"
                      : "Add Color"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: list -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-[#0c2340] mb-5">
            Colors ({{ colors.length }})
          </h3>

          <div v-if="loading" class="text-center text-gray-400 py-10">
            Loading...
          </div>
          <div
            v-else-if="!colors.length"
            class="text-center text-gray-400 py-10"
          >
            No colors yet
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="(c, index) in colors"
              :key="c.id"
              class="flex flex-wrap items-center justify-between gap-3 py-3.5 px-2"
              :class="index % 2 === 0 ? 'bg-gray-50' : ''"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span
                  class="w-7 h-7 rounded-full border border-gray-200 shrink-0"
                  :style="swatchStyle(c)"
                ></span>
                <div class="min-w-0">
                  <p class="font-semibold text-[#0c2340] m-0 truncate">
                    {{ c.color_label }}
                  </p>
                  <p class="text-xs text-gray-500 m-0">{{ c.color_key }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <code
                      v-if="c.hex"
                      class="text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                      >{{ c.hex }}</code
                    >
                    <span
                      class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      :class="
                        c.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ c.is_active ? "Active" : "Inactive" }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 shrink-0">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md font-medium text-white bg-[#0c2340] hover:bg-[#F49322] transition-colors"
                  @click="editColor(c)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                  @click="confirmDelete(c)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-semibold text-[#0c2340] m-0 mb-2">
          Delete color?
        </h3>
        <p class="font-semibold text-gray-800 mb-5">
          {{ colorToDelete?.color_label }}
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-5 py-2.5 rounded-lg font-semibold text-[#0c2340] bg-gray-200 hover:bg-gray-300 transition-colors"
            @click="showModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProductColor {
  id: string;
  color_key: string;
  color_label: string;
  hex: string | null;
  swatch_css: string | null;
  sort_order: number;
  is_active: boolean;
}

const supabase = useSupabaseClient();

const colors = ref<ProductColor[]>([]);
const loading = ref(true);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const showModal = ref(false);
const colorToDelete = ref<ProductColor | null>(null);

const form = ref({
  color_key: "",
  color_label: "",
  hex: "#f5e6c8",
  swatch_css: "",
  sort_order: 0,
  is_active: true,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const onLabelInput = () => {
  if (!editingId.value) {
    form.value.color_key = slugify(form.value.color_label);
  }
};

const swatchStyle = (c: {
  hex?: string | null;
  swatch_css?: string | null;
}) => {
  if (c.swatch_css) return { background: c.swatch_css };
  return { backgroundColor: c.hex || "#ccc" };
};

const loadColors = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("product_colors")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    colors.value = (data || []) as ProductColor[];
  } catch (e) {
    console.error(e);
    colors.value = [];
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  editingId.value = null;
  form.value = {
    color_key: "",
    color_label: "",
    hex: "#f5e6c8",
    swatch_css: "",
    sort_order: colors.value.length + 1,
    is_active: true,
  };
};

const openCreate = () => {
  resetForm();
  form.value.sort_order = colors.value.length + 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const editColor = (c: ProductColor) => {
  editingId.value = c.id;
  form.value = {
    color_key: c.color_key,
    color_label: c.color_label,
    hex: c.hex || "#ffffff",
    swatch_css: c.swatch_css || "",
    sort_order: c.sort_order ?? 0,
    is_active: !!c.is_active,
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const saveColor = async () => {
  if (!form.value.color_label.trim() || !form.value.color_key.trim()) {
    alert("Label and key are required");
    return;
  }

  isSaving.value = true;
  try {
    const row = {
      color_key: form.value.color_key.trim(),
      color_label: form.value.color_label.trim(),
      hex: form.value.hex || null,
      swatch_css: form.value.swatch_css.trim() || null,
      sort_order: Number(form.value.sort_order) || 0,
      is_active: form.value.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingId.value) {
      const { error } = await supabase
        .from("product_colors")
        .update(row as never)
        .eq("id", editingId.value);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("product_colors")
        .insert(row as never);
      if (error) throw error;
    }

    await loadColors();
    resetForm();
  } catch (e: any) {
    console.error(e);
    alert(e?.message || "Failed to save color");
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (c: ProductColor) => {
  colorToDelete.value = c;
  showModal.value = true;
};

const executeDelete = async () => {
  if (!colorToDelete.value) return;
  try {
    const { error } = await supabase
      .from("product_colors")
      .delete()
      .eq("id", colorToDelete.value.id);
    if (error) throw error;
    showModal.value = false;
    colorToDelete.value = null;
    await loadColors();
  } catch (e: any) {
    console.error(e);
    alert(e?.message || "Failed to delete");
  }
};

onMounted(loadColors);
</script>
