<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p class="text-sm text-gray-500 mt-1">
          Update product details and variations
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="$router.back()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving"
          @click="updateProduct"
        >
          {{ isSaving ? "Updating..." : "Update Product" }}
        </button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form (Left 2 Columns) -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6"
        >
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="product.name"
              type="text"
              placeholder="e.g. American Flag Waving LED Patriotic Metal Frame"
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2"
              >Description</label
            >
            <textarea
              v-model="product.description"
              rows="5"
              placeholder="Write detailed product description..."
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
            ></textarea>
          </div>

          <!-- Price & Stock -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >Price ($)</label
              >
              <input
                v-model="product.price"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >Sale Price ($)</label
              >
              <input
                v-model="product.sale_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >Stock Quantity</label
              >
              <input
                v-model="product.stock"
                type="number"
                placeholder="0"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              />
            </div>
          </div>

          <!-- SKU & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >SKU</label
              >
              <input
                v-model="product.sku"
                type="text"
                placeholder="PAT-002"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >Category</label
              >
              <select
                v-model="product.category_id"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
              >
                <option :value="null">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2"
              >Status</label
            >
            <select
              v-model="product.status"
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
            >
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <!-- Variations -->
          <div class="pt-4 border-t border-gray-200">
            <label
              class="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                v-model="product.has_variations"
                class="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange"
              />
              <span class="text-sm font-semibold text-gray-800"
                >This product has variations (Color, Size, etc.)</span
              >
            </label>

            <div v-if="product.has_variations" class="mt-4 space-y-4">
              <div
                v-for="(variation, vIndex) in product.variations"
                :key="vIndex"
                class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3"
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="variation.name"
                    placeholder="Variation Name (e.g. Color)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange text-sm bg-white"
                  />
                  <button
                    type="button"
                    @click="removeVariation(vIndex)"
                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Remove Group
                  </button>
                </div>

                <!-- Option Rows -->
                <div class="space-y-2">
                  <div
                    v-for="(option, oIndex) in variation.options"
                    :key="oIndex"
                    class="flex items-center gap-2"
                  >
                    <!-- Option Text Input (Main Field) -->
                    <input
                      v-model="option.name"
                      type="text"
                      placeholder="Option (e.g. Warm White)"
                      class="flex-1 min-w-[180px] px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange text-sm bg-white"
                    />

                    <!-- Image File Input (Constrained) -->
                    <input
                      type="file"
                      accept="image/*"
                      @change="uploadOptionImage(vIndex, oIndex, $event)"
                      class="w-auto max-w-[220px] text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer shrink-0"
                    />

                    <!-- Image Preview -->
                    <img
                      v-if="option.image_url"
                      :src="getImageUrl(option.image_url)"
                      class="w-8 h-8 object-cover rounded-md border border-gray-300 shrink-0"
                    />

                    <!-- Delete Button -->
                    <button
                      type="button"
                      @click="removeOption(vIndex, oIndex)"
                      class="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 text-sm font-bold shrink-0 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  @click="addOption(vIndex)"
                  class="text-xs font-medium text-brand-orange hover:underline pt-1 inline-block"
                >
                  + Add Option
                </button>
              </div>

              <button
                type="button"
                @click="addVariation"
                class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                + Add New Variation Group
              </button>
            </div>
          </div>

          <!-- Package Section -->
          <div class="pt-4 border-t border-gray-200 space-y-4">
            <label
              class="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                v-model="product.is_package"
                class="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange"
              />
              <span class="text-sm font-semibold text-gray-800"
                >This is a Package</span
              >
            </label>

            <div v-if="product.is_package">
              <label class="block text-sm font-semibold text-gray-800 mb-2"
                >Package Type</label
              >
              <select
                v-model="product.package_data"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
              >
                <option value="">Select Package Program</option>
                <option value="holiday-lighting-package-programs">
                  Holiday Lighting Package Programs
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar (Right 1 Column) -->
      <div class="space-y-6">
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <label class="block text-sm font-semibold text-gray-800"
            >Featured Image</label
          >

          <div
            class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-brand-orange transition-colors min-h-[220px] flex flex-col items-center justify-center bg-gray-50"
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover.prevent
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />

            <div v-if="imagePreview" class="relative group w-full">
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <div
                class="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
              >
                Click to Replace Image
              </div>
            </div>

            <div v-else class="space-y-2 py-4">
              <div class="text-3xl">📷</div>
              <p class="text-xs text-gray-500 font-medium">
                Click or drag featured image here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface VariationOption {
  id?: string | number;
  name: string;
  image_url?: string;
}

interface ProductVariation {
  id?: string | number;
  name: string;
  options: VariationOption[];
}

interface Category {
  id: number | string;
  name: string;
  slug?: string;
}

interface ProductResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    sale_price: number;
    stock: number;
    sku: string;
    category_id: string | null;
    status: string;
    image_url: string;
    has_variations: boolean;
    is_package: boolean;
    package_data: string;
    variations: ProductVariation[];
  } | null;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

const route = useRoute();
const productId = route.params.id;
const { showToast } = useToast();

const isSaving = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const categories = ref<Category[]>([]);

const product = ref({
  name: "",
  description: "",
  price: null as number | null,
  sale_price: null as number | null,
  stock: null as number | null,
  sku: "",
  category_id: null as number | string | null,
  status: "publish",
  image_url: "",
  has_variations: false,
  variations: [] as ProductVariation[],
  is_package: false,
  package_data: "",
});

const triggerFileInput = () => fileInput.value?.click();

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const getImageUrl = (url?: string | null) => {
  if (!url) return "/Images/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return url;
};

const uploadImage = async (file: File, folder: string = "products") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await $fetch<{ success: boolean; url: string }>(
    "/api/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.success) {
    throw new Error("Upload failed");
  }

  return response.url;
};

const uploadOptionImage = async (vIndex: number, oIndex: number, e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const url = await uploadImage(file, "variations");

    if (product.value.variations?.[vIndex]?.options?.[oIndex]) {
      product.value.variations[vIndex].options[oIndex].image_url = url;
    }

    showToast("Option image uploaded", "success");
  } catch (error: any) {
    console.error("Failed to upload option image:", error);
    showToast(error?.message || "Failed to upload option image", "error");
  }
};

const loadCategories = async () => {
  try {
    const response = await $fetch<CategoriesResponse>("/api/categories");
    if (response.success) {
      categories.value = response.data || [];
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
};

const loadProduct = async () => {
  try {
    const response = await $fetch<ProductResponse>(
      `/api/products/${productId}`,
    );
    if (response.success && response.data) {
      const loadedProduct = response.data;
      product.value = {
        name: loadedProduct.name || "",
        description: loadedProduct.description || "",
        price: loadedProduct.price,
        sale_price: loadedProduct.sale_price,
        stock: loadedProduct.stock,
        sku: loadedProduct.sku || "",
        category_id: loadedProduct.category_id,
        status: loadedProduct.status || "publish",
        image_url: loadedProduct.image_url || "",
        has_variations: Boolean(loadedProduct.has_variations),
        is_package: Boolean(loadedProduct.is_package),
        package_data: loadedProduct.package_data || "",
        variations:
          loadedProduct.variations?.map((v: any) => ({
            id: v.id,
            name: v.name || "",
            options: v.options || [{ name: "", image_url: "" }],
          })) || [],
      };

      if (loadedProduct.image_url) {
        imagePreview.value = getImageUrl(loadedProduct.image_url);
      }
    }
  } catch (error: any) {
    console.error("Failed to load product:", error);
    showToast(error.message || "Failed to load product", "error");
  }
};

const updateProduct = async () => {
  if (!product.value.name?.trim()) {
    showToast("Product name is required", "error");
    return;
  }

  isSaving.value = true;

  try {
    let finalImageUrl = product.value.image_url;

    if (imageFile.value) {
      finalImageUrl = await uploadImage(imageFile.value, "products");
    }

    const response = await $fetch<{ success: boolean }>(
      `/api/products/${productId}`,
      {
        method: "PUT",
        body: {
          name: product.value.name,
          description: product.value.description,
          price: product.value.price || 0,
          sale_price: product.value.sale_price || 0,
          stock: product.value.stock || 0,
          sku: product.value.sku,
          category_id: product.value.category_id,
          status: product.value.status,
          image_url: finalImageUrl,
          has_variations: product.value.has_variations,
          is_package: product.value.is_package,
          package_data: product.value.package_data,
          variations: product.value.has_variations
            ? product.value.variations
            : [],
        },
      },
    );

    if (!response.success) {
      throw new Error("Failed to update product");
    }

    showToast("Product updated successfully!", "success");
    navigateTo("/admin/products");
  } catch (error: any) {
    console.error("Update product failed:", error);
    showToast(error.message || "Failed to update product", "error");
  } finally {
    isSaving.value = false;
  }
};

const addVariation = () => {
  product.value.variations.push({
    name: "",
    options: [{ name: "", image_url: "" }],
  });
};

const removeVariation = (vIndex: number) => {
  product.value.variations.splice(vIndex, 1);
};

const addOption = (vIndex: number) => {
  const variation = product.value.variations[vIndex];
  if (variation) {
    variation.options.push({ name: "", image_url: "" });
  }
};

const removeOption = (vIndex: number, oIndex: number) => {
  const variation = product.value.variations[vIndex];
  if (variation && variation.options.length > 1) {
    variation.options.splice(oIndex, 1);
  }
};

onMounted(async () => {
  await Promise.all([loadCategories(), loadProduct()]);
});
</script>
