<template>
  <div
    class="min-h-screen relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed font-sans text-slate-800 lg:pb-0 overflow-hidden"
  >
    <div
      v-if="pending"
      class="flex items-center justify-center min-h-[60vh] text-slate-500"
    >
      Loading package…
    </div>

    <div
      v-else-if="!pkg"
      class="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center"
    >
      <p class="text-lg font-semibold text-[#1C2D5B]">Package not found.</p>
      <NuxtLink
        to="/packages"
        class="inline-flex btn-gloss items-center justify-center text-white font-bold px-6 py-3 rounded-full"
        >Browse for More</NuxtLink
      >
    </div>

    <div
      v-else
      class="max-w-6xl mx-auto pt-6 pb-8 lg:py-8 px-4 sm:px-6 lg:px-6"
    >
      <!-- top banner -->
      <div
        class="relative section-gloss mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C2D5B] p-2 rounded-2xl shadow-lg border-b-4 border-[#F49321] overflow-hidden"
      >
        <NuxtLink
          to="/packages"
          class="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shrink-0 shadow-sm group"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Browse for More
        </NuxtLink>
        <p
          class="relative z-10 text-sm font-semibold text-white italic tracking-wide text-left sm:text-right [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]"
        >
          <span class="text-[#F49321]">"</span>
          Brighten your holidays and wrap your home in festive magic—the perfect
          gift for you and your loved ones.
          <span class="text-[#F49321]">"</span>
        </p>
      </div>

      <div class="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10">
        <PackageDetailsPackageImageCard
          :image-src="selectedSku?.image_url || pkg.title_image_url"
          :alt="pkg.name"
          :description="shortDescription"
        />

        <div
          id="package"
          class="px-4 bg-white pb-4 pt-2 lg:flex lg:flex-col rounded-2xl"
        >
          <PackageDetailsPackageHero
            :name="pkg.name"
            :title-image="pkg.title_image_url"
            :price="selectedPrice"
          />

          <PackageDetailsPackageAddressInput
            v-model:address="address"
            :suggestions="suggestions"
            :suggestions-open="suggestionsOpen"
            :errors="errors"
            :address-error="addressError"
            :validating="validating"
            @input="debouncedSearch"
            @focus="suggestionsOpen = true"
            @select="onSelectAddress"
            @close="suggestionsOpen = false"
          />

          <!-- NEW: Installation Phone Input -->
          <div class="mb-4">
            <label
              class="block text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-navy mb-1.5"
            >
              Installation Contact Phone *
            </label>
            <input
              v-model="installPhone"
              @input="formatPhone"
              type="tel"
              placeholder="(555) 123-4567"
              class="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[15px] lg:text-[16px]"
              maxlength="14"
            />
          </div>

          <PackageDetailsPackageColorPicker
            :skus="skusForPkg"
            :selected="selectedSku"
            :swatch-style="swatchStyle"
            :by-key="byKey"
            @select="selectSku"
          />
          <PackageDetailsPackageInclusions :items="inclusions" />
          <PackageDetailsPackageAddOnsTrigger
            :extra="addonSubtotal + overagePrice"
            @open="extrasOpen = true"
          />
          <PackageDetailsPackageSubTotalCard
            :base-label="pkg.name"
            :base-price="selectedPrice"
            :addon-qty="addonQty"
            :addon-products="addonProducts"
            :addon-subtotal="addonSubtotal"
            :overage-price="overagePrice"
            :overage-ft="overageFt"
            :estimated-footage="estimatedFootage"
            :package-included-ft="packageIncludedFt"
          />
          <PackageDetailsPackageAddToCartButton
            :disabled="
              !selectedSku?.id ||
              adding ||
              !serviceable ||
              !placeId ||
              installPhone.length < 10
            "
            :loading="adding"
            :is-editing="!!editingCartItemId"
            @click="handleAddToCart"
          />
        </div>
      </div>
    </div>

    <PackageDetailsPackageAddOnsModal
      :open="extrasOpen"
      :categories="addonCategories"
      :addon-qty="addonQty"
      :addon-subtotal="addonSubtotal"
      :products-by-category="productsByCategory"
      :bundled-ribbon-for="bundledRibbonFor"
      @close="extrasOpen = false"
      @increment="incrementAddon"
      @decrement="decrementAddon"
    />

    <Teleport to="body">
      <div
        v-if="cartModal.open"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4"
        @click.self="cartModal.open = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
        >
          <h3
            class="font-extrabold text-lg mb-2"
            :class="
              cartModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'
            "
          >
            {{ cartModal.title }}
          </h3>
          <p class="text-sm text-slate-600 mb-4">{{ cartModal.message }}</p>
          <button
            class="btn-gloss px-5 py-2 rounded-full text-white font-bold"
            @click="cartModal.open = false"
          >
            OK
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePackagePage } from "~/composables/usePackagePage";
import { useServiceableAddress } from "~/composables/useServiceableAddress";
import { onMounted, ref } from "vue";
import { usePhoneFormat } from "~/composables/usePhoneFormat";

const { phone: installPhone, formatPhone } = usePhoneFormat("");

const {
  pkg,
  pending,
  inclusions,
  skusForPkg,
  selectedSku,
  selectedPrice,
  shortDescription,
  selectSku,
  byKey,
  swatchStyle,
  addonCategories,
  productsByCategory,
  bundledRibbonFor,
  addonProducts,
  addonQty,
  incrementAddon,
  decrementAddon,
  addonSubtotal,
  overagePrice,
  overageFt,
  estimatedFootage,
  packageIncludedFt,
  setOverage,
  extrasOpen,
  cartModal,
  adding,
  addToCart,
  slug,
  editingCartItemId,
  loadCartItemForEdit,
} = usePackagePage();

const {
  address,
  placeId,
  suggestions,
  suggestionsOpen,
  errors,
  debouncedSearch,
  addressError,
  serviceable,
  validating,
  onSelectAddress,
} = useServiceableAddress({
  packageSlug: () => slug.value,
  onEstimator: (data) => {
    setOverage(data);
  },
});

const cart = useCart();
const route = useRoute();

onMounted(async () => {
  if (route.query.edit) {
    if (!cart.cartItems.value.length) {
      await cart.loadCart();
    }
    const item = cart.cartItems.value.find(
      (i: any) => String(i.id) === String(route.query.edit),
    );

    if (item) {
      loadCartItemForEdit(item);
      if (item.options?.address) {
        address.value = item.options.address;
      }
      if (item.options?.place_id) {
        placeId.value = item.options.place_id;
        serviceable.value = true;
      }
      if (item.options?.phone) {
        installPhone.value = item.options.phone;
      }
    }
  }
});

const handleAddToCart = async () => {
  const success = await addToCart(
    serviceable.value,
    address.value,
    placeId.value,
    installPhone.value,
  );

  if (success) {
    address.value = "";
    placeId.value = "";
    installPhone.value = "";
    serviceable.value = false;
    setOverage(null);

    if (route.query.edit) {
      navigateTo("/checkout");
    }
  }
};
</script>
