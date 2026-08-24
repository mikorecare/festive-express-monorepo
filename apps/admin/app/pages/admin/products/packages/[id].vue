<template>
  <div class="max-w-5xl mx-auto">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#0c2340]">
          {{ loading ? "Edit Package" : `Edit: ${form.name || "Package"}` }}
        </h1>
        <p class="text-slate-500 text-sm mt-1">Program details + inclusions</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          to="/admin/products/packages"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
        >
          Back
        </NuxtLink>
        <NuxtLink
          :to="`/admin/products/package-skus?package_id=${id}`"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 no-underline hover:border-[#F49322]"
        >
          View SKUs
        </NuxtLink>
        <button
          type="button"
          class="px-5 py-2 rounded-lg bg-[#F49322] text-white text-sm font-semibold hover:bg-[#0c2340] disabled:opacity-60"
          :disabled="saving"
          @click="saveAll"
        >
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-slate-500">
      Loading...
    </div>

    <template v-else>
      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-slate-200">
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
          :class="
            tab === 'details'
              ? 'border-[#F49322] text-[#0c2340]'
              : 'border-transparent text-slate-500'
          "
          @click="tab = 'details'"
        >
          Details
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
          :class="
            tab === 'inclusions'
              ? 'border-[#F49322] text-[#0c2340]'
              : 'border-transparent text-slate-500'
          "
          @click="tab = 'inclusions'"
        >
          Inclusions
        </button>
      </div>

      <!-- DETAILS -->
      <div
        v-show="tab === 'details'"
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Name</label
            >
            <input v-model="form.name" type="text" class="field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Slug</label
            >
            <input v-model="form.slug" type="text" class="field" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5"
            >Description</label
          >
          <textarea v-model="form.description" rows="4" class="field" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Base price ($)</label
            >
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              class="field"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Sort order</label
            >
            <input
              v-model.number="form.sort_order"
              type="number"
              class="field"
            />
          </div>
          <div class="flex flex-col justify-end gap-3 pb-1">
            <label
              class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <input
                v-model="form.is_popular"
                type="checkbox"
                class="w-auto rounded border-slate-300"
              />
              Most popular
            </label>
            <label
              class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <input
                v-model="form.is_active"
                type="checkbox"
                class="w-auto rounded border-slate-300"
              />
              Active
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Featured / card image -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Featured image (card)
            </label>
            <div
              class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#F49322]"
              @click="imageFileInput?.click()"
            >
              <img
                v-if="imagePreviewUrl || form.image_url"
                :src="imagePreviewUrl || getImageUrl(form.image_url)"
                alt=""
                class="mx-auto max-h-32 w-full object-cover rounded-lg mb-2"
              />
              <p class="text-sm text-slate-500">
                {{
                  form.image_url || imagePreviewUrl
                    ? "Click to replace"
                    : "Click to upload featured image"
                }}
              </p>
            </div>
            <input
              ref="imageFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImageFileChange"
            />
            <input
              v-model="form.image_url"
              type="text"
              class="field mt-2"
              placeholder="Or paste path (packages/...)"
            />
          </div>

          <!-- Title image (existing) -->
          <div>
            <!-- ... your title upload block ... -->
          </div>

          <!-- Icon (existing) -->
          <div>
            <!-- ... your icon upload block ... -->
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Title image URL / path</label>
            <input v-model="form.title_image_url" type="text" class="field" placeholder="packages/joy-title.png" />
            <img
              v-if="form.title_image_url"
              :src="getImageUrl(form.title_image_url)"
              alt=""
              class="mt-3 h-16 object-contain"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Icon URL / path</label>
            <input v-model="form.icon_url" type="text" class="field" placeholder="packages/joy-icon.png" />
            <img
              v-if="form.icon_url"
              :src="getImageUrl(form.icon_url)"
              alt=""
              class="mt-3 h-12 object-contain"
            />
          </div> -->
          <!-- Title image -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Title image</label
            >
            <div
              class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#F49322]"
              @click="titleFileInput?.click()"
            >
              <img
                v-if="titlePreviewUrl || form.title_image_url"
                :src="titlePreviewUrl || getImageUrl(form.title_image_url)"
                alt=""
                class="mx-auto max-h-24 object-contain mb-2"
              />
              <p class="text-sm text-slate-500">
                {{
                  form.title_image_url || titlePreviewUrl
                    ? "Click to replace"
                    : "Click to upload title image"
                }}
              </p>
            </div>
            <input
              ref="titleFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onTitleFileChange"
            />
            <input
              v-model="form.title_image_url"
              type="text"
              class="field mt-2"
              placeholder="Or paste path / URL (packages/...)"
            />
          </div>

          <!-- Icon -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Icon</label
            >
            <div
              class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#F49322]"
              @click="iconFileInput?.click()"
            >
              <img
                v-if="iconPreviewUrl || form.icon_url"
                :src="iconPreviewUrl || getImageUrl(form.icon_url)"
                alt=""
                class="mx-auto max-h-16 object-contain mb-2"
              />
              <p class="text-sm text-slate-500">
                {{
                  form.icon_url || iconPreviewUrl
                    ? "Click to replace"
                    : "Click to upload icon"
                }}
              </p>
            </div>
            <input
              ref="iconFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onIconFileChange"
            />
            <input
              v-model="form.icon_url"
              type="text"
              class="field mt-2"
              placeholder="Or paste path / URL (packages/...)"
            />
          </div>
        </div>
      </div>

      <!-- INCLUSIONS -->
      <div
        v-show="tab === 'inclusions'"
        class="bg-white rounded-xl border border-slate-100 shadow-sm p-6"
      >
        <p class="text-sm text-slate-500 mb-4">
          Check items included in this package. Unchecked = not included (can
          show as struck out on storefront).
        </p>

        <div v-if="!inclusionItems.length" class="text-slate-500 text-sm">
          No inclusion items yet. Add some under
          <NuxtLink
            to="/admin/products/inclusions"
            class="text-[#F49322] font-semibold"
            >Inclusion Items</NuxtLink
          >.
        </div>

        <ul class="space-y-3">
          <li
            v-for="item in inclusionItems"
            :key="item.id"
            class="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#F49322]/50"
          >
            <input
              type="checkbox"
              class="w-auto rounded border-slate-300"
              :checked="inclusionState[item.id]?.checked ?? false"
              @change="
                toggleInclusion(
                  item.id,
                  ($event.target as HTMLInputElement).checked,
                )
              "
            />

            <img
              v-if="item.image_url"
              :src="getImageUrl(item.image_url)"
              alt=""
              class="w-10 h-10 object-contain"
            />

            <div class="flex-1 min-w-[140px]">
              <div class="font-semibold text-sm text-[#0c2340]">
                {{ item.name }}
              </div>
              <div class="text-xs text-slate-400">{{ item.slug }}</div>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-slate-500">Qty</label>
              <input
                type="number"
                min="1"
                class="w-20 field py-1.5"
                :disabled="!(inclusionState[item.id]?.checked ?? false)"
                :value="inclusionState[item.id]?.quantity ?? 1"
                @input="
                  setQuantity(
                    item.id,
                    Number(($event.target as HTMLInputElement).value),
                  )
                "
              />
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({ middleware: 'auth' })

const route = useRoute();
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const db = supabase as any;
const { showToast } = useToast();

const id = computed(() => String(route.params.id));
const tab = ref<"details" | "inclusions">("details");
const loading = ref(true);
const saving = ref(false);

const form = ref({
  name: "",
  slug: "",
  description: "",
  price: 0,
  sort_order: 0,
  is_popular: false,
  is_active: true,
  image_url: "",
  title_image_url: "",
  icon_url: "",
});

type InclusionItem = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  sort_order?: number;
};

const inclusionItems = ref<InclusionItem[]>([]);
const inclusionState = ref<
  Record<string, { checked: boolean; quantity: number }>
>({});

const getImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  const path = url.replace(/^\//, "");
  const supabaseUrl =
    (config.public.supabaseUrl as string) ||
    (config.public.supabase as any)?.url ||
    "";
  const bucket = (config.public.storageBucket as string) || "Products";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const load = async () => {
  loading.value = true;
  try {
    const [
      { data: pkg, error: e1 },
      { data: items, error: e2 },
      { data: links, error: e3 },
    ] = await Promise.all([
      db.from("packages").select("*").eq("id", id.value).single(),
      db
        .from("inclusion_items")
        .select("id, name, slug, image_url, sort_order")
        .order("sort_order"),
      db
        .from("package_inclusions")
        .select("inclusion_item_id, quantity, is_included")
        .eq("package_id", id.value),
    ]);

    if (e1) throw e1;
    if (e2) throw e2;
    if (e3) throw e3;

    form.value = {
      name: pkg.name || "",
      slug: pkg.slug || "",
      description: pkg.description || "",
      price: Number(pkg.price) || 0,
      sort_order: Number(pkg.sort_order) || 0,
      is_popular: !!pkg.is_popular,
      is_active: pkg.is_active !== false,
      image_url: pkg.image_url || "",
      title_image_url: pkg.title_image_url || "",
      icon_url: pkg.icon_url || "",
    };

    inclusionItems.value = items || [];

    const map: Record<string, { checked: boolean; quantity: number }> = {};
    for (const item of inclusionItems.value) {
      const row = (links || []).find(
        (l: any) => String(l.inclusion_item_id) === String(item.id),
      );
      map[item.id] = {
        checked: row ? !!row.is_included : false,
        quantity: row?.quantity ?? 1,
      };
    }

    inclusionState.value = map;
  } catch (e: any) {
    console.error(e);
    showToast?.(e?.message || "Failed to load package", "error");
  } finally {
    loading.value = false;
  }
};

const saveDetails = async () => {
  const image_url = await uploadToPackages(
    imageFile.value,
    form.value.image_url,
  );

  const title_image_url = await uploadToPackages(
    titleImageFile.value,
    form.value.title_image_url,
  );

  const icon_url = await uploadToPackages(
    iconImageFile.value,
    form.value.icon_url,
  );

  const payload = {
    name: form.value.name,
    slug: form.value.slug,
    description: form.value.description ?? "",
    price: form.value.price,
    sort_order: form.value.sort_order,
    is_popular: form.value.is_popular,
    is_active: form.value.is_active,
    image_url: image_url,
    title_image_url: title_image_url,
    icon_url: icon_url,
    updated_at: new Date().toISOString(),
  };

  console.log("Saving package", id.value, payload);

  const { data, error } = await db
    .from("packages")
    .update(payload)
    .eq("id", id.value)
    .select()
    .maybeSingle();

  console.log("Update result", { data, error });

  // after successful save:
  form.value.title_image_url = title_image_url || "";
  form.value.icon_url = icon_url || "";

  imageFile.value = null;
  titleImageFile.value = null;
  iconImageFile.value = null;

  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = null;
  }

  if (titlePreviewUrl.value) {
    URL.revokeObjectURL(titlePreviewUrl.value);
    titlePreviewUrl.value = null;
  }
  if (iconPreviewUrl.value) {
    URL.revokeObjectURL(iconPreviewUrl.value);
    iconPreviewUrl.value = null;
  }

  if (error) throw error;
  if (!data) throw new Error("No row updated (check id / RLS)");
};

const saveInclusions = async () => {
  // Replace strategy: delete existing links, insert current checklist
  const { error: delErr } = await db
    .from("package_inclusions")
    .delete()
    .eq("package_id", id.value);

  if (delErr) throw delErr;

  const rows = inclusionItems.value.map((item, index) => {
    const state = inclusionState.value[item.id];
    return {
      package_id: id.value,
      inclusion_item_id: item.id,
      quantity: state?.quantity || 1,
      is_included: !!state?.checked,
      sort_order: item.sort_order ?? index,
    };
  });

  // Only store rows that are checked — OR store all for strikeout UI
  // Store ALL so storefront can show struck-out items:
  if (rows.length) {
    const { error } = await db.from("package_inclusions").insert(rows);
    if (error) throw error;
  }
};

const saveAll = async () => {
  saving.value = true;
  try {
    await saveDetails();
    await saveInclusions();
    await load();
    showToast?.("Package saved", "success");
  } catch (e: any) {
    console.error(e);
    showToast?.(e?.message || "Save failed", "error");
  } finally {
    saving.value = false;
  }
};

const ensureInclusion = (itemId: string) => {
  if (!inclusionState.value[itemId]) {
    inclusionState.value[itemId] = { checked: false, quantity: 1 };
  }
  return inclusionState.value[itemId];
};

const toggleInclusion = (itemId: string, checked: boolean) => {
  const row = ensureInclusion(itemId);
  row.checked = checked;
};

const setQuantity = (itemId: string, quantity: number) => {
  const row = ensureInclusion(itemId);
  row.quantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

//
const imageFileInput = ref<HTMLInputElement | null>(null);
const titleFileInput = ref<HTMLInputElement | null>(null);
const iconFileInput = ref<HTMLInputElement | null>(null);

const imageFile = ref<File | null>(null);
const titleImageFile = ref<File | null>(null);
const iconImageFile = ref<File | null>(null);

const imagePreviewUrl = ref<string | null>(null);
const titlePreviewUrl = ref<string | null>(null);
const iconPreviewUrl = ref<string | null>(null);

const onImageFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  imageFile.value = file;
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);
  imagePreviewUrl.value = file ? URL.createObjectURL(file) : null;
};

const onTitleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  titleImageFile.value = file;
  if (titlePreviewUrl.value) URL.revokeObjectURL(titlePreviewUrl.value);
  titlePreviewUrl.value = file ? URL.createObjectURL(file) : null;
};

const onIconFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  iconImageFile.value = file;
  if (iconPreviewUrl.value) URL.revokeObjectURL(iconPreviewUrl.value);
  iconPreviewUrl.value = file ? URL.createObjectURL(file) : null;
};

const uploadToPackages = async (
  file: File | null,
  existingPath: string,
): Promise<string | null> => {
  if (!file) return existingPath?.trim() || null;

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `packages/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const bucket = (config.public.storageBucket as string) || "Products";

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || `image/${ext}`,
  });
  if (error) throw error;
  return path; // e.g. packages/1786....png
};

onMounted(load);
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
}
.field:focus {
  outline: none;
  border-color: #f49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.2);
}
</style>
