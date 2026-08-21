<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Gallery</h1>
        <p class="text-slate-500 text-sm">
          Manage timeline / gallery photos on the storefront
        </p>
      </div>
      <!-- <button
        type="button"
        class="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-navy transition-colors gap-2"
        @click="openCreate"
      >
        + Add Gallery Item
      </button> -->
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Form -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-navy mb-5">
            {{ editingId ? "Edit Item" : "Add New Item" }}
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5"
                >Year</label
              >
              <input
                v-model="form.year"
                type="text"
                placeholder="e.g. 2024"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5"
                >Description</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Optional caption..."
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">
                Image <span class="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                class="w-full text-sm"
                @change="onImageSelect"
              />
              <div v-if="previewUrl || form.image_url" class="mt-3">
                <img
                  :src="previewUrl || getImageUrl(form.image_url)"
                  class="w-full max-h-48 object-cover rounded-lg border"
                  alt=""
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5"
                >Image position</label
              >
              <select
                v-model="form.image_position"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5"
                  >Sort order</label
                >
                <input
                  v-model.number="form.sort_order"
                  type="number"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div class="flex items-end pb-2">
                <label
                  class="inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    v-model="form.is_active"
                    type="checkbox"
                    class="w-auto rounded"
                  />
                  Active
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button
                v-if="editingId"
                type="button"
                class="px-5 py-2.5 rounded-lg font-semibold text-navy bg-gray-200 hover:bg-gray-300"
                @click="resetForm"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-5 py-2.5 rounded-lg font-semibold text-white bg-brand-orange hover:bg-navy disabled:opacity-60"
                :disabled="isSaving"
                @click="saveItem"
              >
                {{ isSaving ? "Saving..." : editingId ? "Update" : "Add Item" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-navy">
            Gallery items ({{ items.length }})
          </h3>
          <p class="text-slate-500 text-sm mb-5" v-if="items.length">
            Manage storefront gallery photos. Drag images to reposition their
            display order.
          </p>

          <div v-if="loading" class="text-center text-gray-400 py-10">
            Loading...
          </div>
          <div
            v-else-if="!items.length"
            class="text-center text-gray-400 py-10"
          >
            No gallery items yet
          </div>

          <!-- <div v-else class="space-y-3">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              class="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-slate-100"
              :class="index % 2 === 0 ? 'bg-slate-50' : 'bg-white'"
            >
              <img
                :src="getImageUrl(item.image_url)"
                class="w-16 h-16 object-cover rounded-lg shrink-0"
                alt=""
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-navy m-0 truncate">
                  {{ item.year || "No year" }}
                  <span class="text-xs font-normal text-slate-400">
                    · {{ item.image_position }}
                  </span>
                </p>
                <p class="text-sm text-slate-500 m-0 truncate">
                  {{ item.description || item.image_url }}
                </p>
                <span
                  class="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  :class="
                    item.is_active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ item.is_active ? "Active" : "Inactive" }}
                </span>
              </div>
              <div class="flex gap-2 shrink-0">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md text-white bg-navy hover:bg-brand-orange"
                  @click="editItem(item)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md text-white bg-red-500 hover:bg-red-600"
                  @click="confirmDelete(item)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div> -->

          <div v-else class="flex flex-wrap gap-3 content-start">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              draggable="true"
              class="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-grab active:cursor-grabbing select-none"
              :class="{
                'opacity-50 ring-2 ring-brand-orange scale-95':
                  dragIndex === index,
              }"
              :style="{ width: '150px' }"
              @dragstart="onDragStart(index, $event)"
              @dragover.prevent="onDragOver(index)"
              @drop.prevent="onDrop(index)"
              @dragend="onDragEnd"
            >
              <img
                :src="getImageUrl(item.image_url)"
                class="w-full h-full object-cover pointer-events-none"
                alt=""
              />

              <!-- overlay actions -->
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-end justify-center gap-2 p-2"
              >
                <button
                  type="button"
                  class="px-2 py-0.5 text-[10px] rounded text-white bg-navy hover:bg-brand-orange"
                  @click.stop="editItem(item)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-2 py-0.5 text-[10px] rounded text-white bg-red-500 hover:bg-red-600"
                  @click.stop="confirmDelete(item)"
                >
                  Delete
                </button>
              </div>

              <!-- optional badges -->
              <span
                v-if="!item.is_active"
                class="absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-500 text-white"
              >
                Off
              </span>
              <!-- <span
                class="absolute top-1.5 right-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/50 text-white"
              >
                {{ index + 1 }}
              </span> -->
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
        <h3 class="text-lg font-semibold text-navy m-0 mb-2">
          Delete gallery item?
        </h3>
        <p class="text-slate-600 mb-5">{{ colorLabel }}</p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-5 py-2.5 rounded-lg font-semibold text-navy bg-gray-200"
            @click="showModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-500"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const supabase = useSupabaseClient();

const items = ref([]);
const loading = ref(true);
const isSaving = ref(false);
const editingId = ref(null);
const showModal = ref(false);
const itemToDelete = ref(null);
const imageFile = ref(null);
const previewUrl = ref(null);
const dragIndex = ref(null);

const form = ref({
  year: "",
  description: "",
  image_url: "",
  image_position: "right",
  divider_image_url: "",
  sort_order: 0,
  is_active: true,
});

const colorLabel = computed(() => {
  const i = itemToDelete.value;
  if (!i) return "";
  return i.year || i.description || i.image_url || "This item";
});

const getImageUrl = (url) => {
  if (!url) return "/Images/placeholder.png";
  if (url.startsWith("http") || url.startsWith("/Images/")) return url;
  const path = String(url).replace(/^\/+/, "");
  const supabaseUrl =
    config.public.supabaseUrl || config.public.supabase?.url || "";
  return `${supabaseUrl}/storage/v1/object/public/Gallery/${path}`;
};

const loadItems = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    items.value = data || [];
  } catch (e) {
    console.error(e);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  editingId.value = null;
  imageFile.value = null;
  previewUrl.value = null;
  form.value = {
    year: "",
    description: "",
    image_url: "",
    image_position: "right",
    divider_image_url: "",
    sort_order: items.value.length + 1,
    is_active: true,
  };
};

const openCreate = () => {
  resetForm();
  form.value.sort_order = items.value.length + 1;
};

const editItem = (item) => {
  editingId.value = item.id;
  imageFile.value = null;
  previewUrl.value = null;
  form.value = {
    year: item.year || "",
    description: item.description || "",
    image_url: item.image_url || "",
    image_position: item.image_position || "right",
    divider_image_url: item.divider_image_url || "",
    sort_order: item.sort_order ?? 0,
    is_active: !!item.is_active,
  };
};

const onImageSelect = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const uploadImage = async (file) => {
  const ext = file.name.split(".").pop() || "webp";
  const path = `Festive-Images-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("Gallery").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  return path;
};

const onDragStart = (index) => {
  dragIndex.value = index;
};

const onDragOver = (index) => {
  if (dragIndex.value === null || dragIndex.value === index) return;

  const list = [...items.value];
  const [moved] = list.splice(dragIndex.value, 1);
  list.splice(index, 0, moved);
  items.value = list;
  dragIndex.value = index;
};

const onDragEnd = async () => {
  dragIndex.value = null;
  await saveOrder();
};

const onDrop = (index) => {
  // order already updated in onDragOver
  dragIndex.value = null;
};

const saveOrder = async () => {
  try {
    // update sort_order for each item
    await Promise.all(
      items.value.map((item, i) =>
        supabase
          .from("gallery_items")
          .update({ sort_order: i + 1, updated_at: new Date().toISOString() })
          .eq("id", item.id),
      ),
    );
  } catch (e) {
    console.error(e);
    alert(e?.message || "Failed to save order");
    await loadItems(); // revert on error
  }
};

const saveItem = async () => {
  if (!form.value.image_url && !imageFile.value) {
    alert("Image is required");
    return;
  }

  isSaving.value = true;
  try {
    let imageUrl = form.value.image_url;
    if (imageFile.value) {
      imageUrl = await uploadImage(imageFile.value);
    }

    const row = {
      year: form.value.year || null,
      description: form.value.description || null,
      image_url: imageUrl,
      image_position: form.value.image_position || "right",
      divider_image_url: form.value.divider_image_url || null,
      sort_order: Number(form.value.sort_order) || 0,
      is_active: form.value.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingId.value) {
      const { error } = await supabase
        .from("gallery_items")
        .update(row)
        .eq("id", editingId.value);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("gallery_items").insert(row);
      if (error) throw error;
    }

    await loadItems();
    resetForm();
  } catch (e) {
    console.error(e);
    alert(e?.message || "Failed to save");
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showModal.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", itemToDelete.value.id);
    if (error) throw error;
    showModal.value = false;
    itemToDelete.value = null;
    await loadItems();
  } catch (e) {
    console.error(e);
    alert(e?.message || "Failed to delete");
  }
};

onMounted(loadItems);
</script>
