<template>
  <div class="checkout-page min-h-[80vh] bg-[#e7e7e7]">
    <section
      aria-label="Checkout page header"
      role="region"
      class="relative py-10 sm:py-16 text-white overflow-hidden min-h-[420px] sm:min-h-[400px] !border-b-8 !border-b-red"
    >
      <img
        src="/New/Banner/checkout-latest.avif"
        alt="Checkout background"
        width="2500"
        height="800"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-[70%_70%] z-10"
      />
      <!-- <div class="absolute inset-0 bg-black/10 z-[11]" aria-hidden="true"></div> -->
      <div
        class="relative z-[12] container mx-auto px-3 sm:px-4 flex items-start justify-start min-h-[320px] sm:min-h-[400px]"
      >
        <div class="hero-content text-center max-w-2xl mx-auto">
          <h1
            v-fade
            class="text-[1.75rem] leading-tight sm:text-3xl md:text-5xl font-extrabold tracking-wider mb-3 sm:mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            <span
              class="text-outline text-brand-orange [--o:#fff] [--w:2px] md:[--w:3px]"
              >Check</span
            ><span
              class="text-outline text-[#1C2D5B] [--o:#fff] [--w:2px] md:[--w:3px]"
              >out</span
            >
          </h1>
          <p
            v-fade
            class="text-outline text-base sm:text-xl md:text-2xl tracking-wide font-bold text-[#1c2d5b] [--o:#fff] [--w:1.5px] md:[--w:2px] [text-wrap:balance] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            Finalize your professional holiday installation details and lock in
            your install/take down dates.
          </p>
        </div>
      </div>
    </section>

    <div
      v-if="pending"
      class="flex items-center justify-center min-h-[40vh] text-slate-500"
    >
      Loading package…
    </div>

    <div
      v-else-if="!pkg"
      class="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center"
    >
      <p class="text-lg font-semibold text-[#1C2D5B]">Package not found.</p>
      <NuxtLink
        to="/packages"
        class="inline-flex btn-gloss items-center justify-center text-white font-bold px-6 py-3 rounded-full"
        >Browse Packages</NuxtLink
      >
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->

        <div class="lg:col-span-2 space-y-6">
          <!-- Package summary -->
          <div
            class="bg-white rounded-2xl shadow-md border border-slate-200 space-y-4"
          >
            <div
              class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
            >
              <h3
                class="text-lg font-extrabold text-white flex items-center tracking-wide"
              >
                <i class="fas fa-map-location-dot mr-3 text-[#F49321]"></i
                >Installation
              </h3>
            </div>
            <div>
              <div class="px-6 pb-6">
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

                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  v-model="installPhone"
                  @input="formatPhone"
                  @blur="validateInstallation('phone')"
                  type="tel"
                  class="w-full md:max-w-[50%] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  :class="{ 'border-red-500': installation.errors.phone }"
                  maxlength="14"
                  placeholder="(555) 123-4567"
                />
                <p
                  v-if="installation.errors.phone"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ installation.errors.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 2: Color + add-ons -->
          <div
            class="bg-white rounded-2xl shadow-md border border-slate-200 space-y-4"
          >
            <div
              class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
            >
              <h3
                class="text-lg font-extrabold text-white flex items-center tracking-wide"
              >
                <i class="fas fa-lightbulb mr-3 text-[#F49321]"></i>Customize
              </h3>
            </div>
            <div class="pb-6 px-6">
              <PackageDetailsPackageColorPicker
                :skus="skusForPkg"
                :selected="selectedSku"
                :swatch-style="swatchStyle"
                :by-key="byKey"
                @select="selectSku"
              />

              <PackageDetailsPackageAddOnsTrigger
                :extra="addonSubtotal + overagePrice"
                @open="extrasOpen = true"
              />
            </div>
          </div>
          <CheckoutPaymentInformation
            v-model="paymentForm"
            :errors="paymentErrors"
            @validate="validatePaymentField"
          />

          <div
            class="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          >
            <div
              class="relative btn-gloss overflow-hidden bg-[#1C2D5B] text-white px-4 py-2 flex items-center justify-between border-b-4 border-[#F49321]"
            >
              <span
                class="relative z-10 text-sm sm:text-base font-extrabold tracking-wide"
              >
                Package Details
                <span class="text-[#F49321]">· {{ pkg.name }}</span>
              </span>
              <!-- <NuxtLink
                to="/packages"
                class="relative z-10 text-xs font-semibold uppercase tracking-wider underline underline-offset-2"
              >
                Change
              </NuxtLink> -->
            </div>
            <div class="px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- <PackageDetailsPackageImageCard
                :image-src="selectedSku?.image_url || pkg.title_image_url"
                :alt="pkg.name"
                :description="shortDescription"
              /> -->
              <div>
                <PackageDetailsPackageHero
                  :name="pkg.name"
                  :title-image="pkg.title_image_url"
                  :price="selectedPrice"
                />
                <PackageDetailsPackageInclusions :items="inclusions" />
              </div>
            </div>
          </div>

          <!-- Step 1: Address + phone -->

          <!-- Step 3: Dates -->
          <div class="bg-white rounded-2xl shadow-md border border-slate-200">
            <div
              class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
            >
              <h3
                class="text-lg font-extrabold text-white flex items-center tracking-wide"
              >
                <i class="fas fa-calendar-day mr-3 text-[#F49321]"></i
                >Installation Dates
              </h3>
            </div>
            <div class="pb-6 px-6 pt-2">
              <CheckoutScheduleService
                :model-value="installation"
                :errors="installation.errors"
                :min-date="minDate"
                @update:model-value="updateInstallation"
                @validate="validateInstallation"
              />
            </div>
          </div>

          <!-- Payment -->

          <!-- Customer Note -->
          <div class="bg-white rounded-2xl shadow-md">
            <div
              class="bg-[#1C2D5B] btn-gloss px-6 py-2 flex items-center border-b-4 border-[#F49321] rounded-t-xl mb-2"
            >
              <i class="fas fa-pen-to-square mr-3 text-[#F49321]"></i>
              <label class="block text-sm font-bold text-white mb-1">
                Notes
                <span class="text-slate-400 font-normal">(optional)</span>
              </label>
            </div>
            <div class="px-2 pb-2">
              <textarea
                v-model="customerNote"
                class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F49321] focus:border-transparent transition-all"
                rows="3"
                placeholder="Any special instructions? (gate code, pets, preferred side of house, etc.)"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Right Column (Order Summary + voucher) -->
        <div class="lg:col-span-1">
          <CheckoutOrderSummary
            :selected-price="selectedPrice"
            :cart-items="cartItems"
            :cart-total="cartTotal"
            :alacarte-cart-total="alacarteCartTotal"
            :estimated-tax="estimatedTax"
            :grand-total="grandTotal"
            :payment-method="paymentMethod"
            :is-paying="isPaying"
            :is-form-valid="isFormValid"
            @update:paymentMethod="paymentMethod = $event"
            @pay="payWithConverge"
          >
            <template #turnstile>
              <CheckoutTurnstileWidget
                ref="turnstileRef"
                :site-key="siteKey"
                :errors="validationErrors"
                :status="turnstileStatus"
                :status-type="turnstileStatusType"
                :status-class="turnstileStatusClass"
                :status-icon="turnstileStatusIcon"
                @success="onTurnstileSuccess"
                @error="onTurnstileError"
                @expired="onTurnstileExpired"
              />
            </template>
          </CheckoutOrderSummary>
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
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Checkout" });
import CheckoutTurnstileWidget from "~/components/Checkout/TurnstileWidget.vue";
import { usePackagePage } from "~/composables/usePackagePage";
import { useServiceableAddress } from "~/composables/useServiceableAddress";
import { usePhoneFormat } from "~/composables/usePhoneFormat";
import { toast } from "vue-sonner";

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const { settings } = useSettings();
const { showToast } = useToast();
const { discountAmount, appliedPromo } = usePromo();
const { phone: installPhone, formatPhone } = usePhoneFormat("");

const FL_TAX_RATE = computed(() => {
  const raw =
    settings.value?.fl_tax_rate ?? (settings.value as any)?.["fl_tax_rate"];
  const n = Number(raw);
  if (!Number.isNaN(n) && n >= 0) return n;
  return 0.07;
});

/* ------------------------------------------------------------------ */
/* Package + address (moved over from the old slug page)               */
/* ------------------------------------------------------------------ */
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
  addonQty,
  incrementAddon,
  decrementAddon,
  addonSubtotal,
  overagePrice,
  setOverage,
  extrasOpen,
  slug,
  buildOptions,
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

/* ------------------------------------------------------------------ */
/* Single installation (kept in the same shape the backend expects)    */
/* ------------------------------------------------------------------ */
interface Installation {
  product_id: string;
  product_name: string;
  address: string;
  postcode: string;
  phone: string;
  install_dates: string[];
  removal_dates: string[];
  errors: Record<string, string>;
}

const postcode = computed(() => {
  const zips = address.value?.match(/\b\d{5}\b/g);
  return zips ? zips[zips.length - 1]! : "";
});

const installation = ref<Installation>({
  product_id: "",
  product_name: "Package",
  address: "",
  postcode: "",
  phone: "",
  install_dates: ["", "", ""],
  removal_dates: ["", "", ""],
  errors: {},
});

// Keep the fields owned by this page in sync; dates/errors are owned by the schedule UI.
watch(
  [pkg, selectedSku, address, postcode, installPhone],
  () => {
    // The cart's product_id was the SKU id (cart.addToCart(sku.id, ...)).
    installation.value.product_id = String(selectedSku.value?.id ?? "");
    installation.value.product_name =
      selectedSku.value?.name || pkg.value?.name || "Package";
    installation.value.address = address.value || "";
    installation.value.postcode = postcode.value;
    installation.value.phone = installPhone.value || "";
  },
  { immediate: true },
);

const updateInstallation = (updated: any) => {
  installation.value = {
    ...installation.value,
    ...updated,
    errors: installation.value.errors,
  };
};

/* ------------------------------------------------------------------ */
/* Order item (replaces the cart row)                                  */
/* ------------------------------------------------------------------ */

// Same options object addToCart() used to send to /api/cart/add.
// Server-added keys (if /api/cart/add adds any, e.g. alacarte_total) are NOT here yet.
const buildItemOptions = () =>
  buildOptions(address.value, placeId.value, installPhone.value);

const orderItem = computed(() => {
  if (!pkg.value || !selectedSku.value) return null;
  return {
    id: "direct",
    product_id: selectedSku.value.id,
    product: { name: selectedSku.value.name || pkg.value.name },
    // The old cart row's price had add-ons + overage baked in (server-side),
    // and the order body sent that as items[].price. Match it here.
    price:
      Number(selectedPrice.value || 0) +
      Number(addonSubtotal.value || 0) +
      Number(overagePrice.value || 0),
    is_package: true,
    options: buildItemOptions(),
  };
});

// Same names the summary component already receives, just fed by one item.
const cartItems = computed(() => (orderItem.value ? [orderItem.value] : []));
// Old cart price = product price + add-ons + overage; options.alacarte_total was never set.
const cartTotal = computed(() => Number(orderItem.value?.price || 0));
const alacarteCartTotal = computed(() => 0);

/* ------------------------------------------------------------------ */
/* Payment form, Turnstile, totals (unchanged)                         */
/* ------------------------------------------------------------------ */
const paymentMethod = ref<string>("converge");
const isPaying = ref(false);
const customerNote = ref("");

const turnstileRef = ref<InstanceType<typeof CheckoutTurnstileWidget> | null>(
  null,
);
const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const turnstileStatus = ref("");
const turnstileStatusType = ref("");
const validationErrors = ref({ turnstile: "" });

const paymentForm = ref({
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
  billing_phone: "",
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
  billing_address: "",
  billing_city: "",
  billing_postcode: "",
});

const paymentErrors = ref({
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
  billing_phone: "",
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
  billing_address: "",
  billing_city: "",
  billing_postcode: "",
});

const isFormValid = computed(() => {
  const p = paymentForm.value;
  const paymentValid =
    Object.values(paymentErrors.value).every((e) => !e) &&
    !!p.billing_first_name &&
    !!p.billing_last_name &&
    !!p.billing_email &&
    !!p.billing_phone &&
    !!p.card_name &&
    !!p.card_number &&
    !!p.card_expiry &&
    !!p.card_cvv &&
    !!p.billing_address &&
    !!p.billing_city &&
    !!p.billing_postcode;

  const inst = installation.value;
  const installationValid =
    Object.values(inst.errors).every((e) => !e) &&
    !!inst.address &&
    !!inst.phone &&
    inst.install_dates.some((d) => d);

  const selectionValid =
    !!selectedSku.value?.id && serviceable.value && !!placeId.value;

  return (
    paymentValid &&
    installationValid &&
    selectionValid &&
    isTurnstileVerified.value
  );
});

const turnstileStatusClass = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-gray-500";
  }
});
const turnstileStatusIcon = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "fas fa-check-circle";
    case "error":
      return "fas fa-exclamation-circle";
    case "warning":
      return "fas fa-exclamation-triangle";
    default:
      return "fas fa-info-circle";
  }
});
const onTurnstileSuccess = (token: string) => {
  turnstileToken.value = token;
  isTurnstileVerified.value = true;
  turnstileStatus.value = "Verification successful!";
  turnstileStatusType.value = "success";
  validationErrors.value.turnstile = "";
};
const onTurnstileError = () => {
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  validationErrors.value.turnstile =
    "Please complete the security verification";
  turnstileToken.value = "";
  isTurnstileVerified.value = false;
};
const onTurnstileExpired = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  validationErrors.value.turnstile = "Verification expired. Please try again.";
  if (turnstileRef.value) turnstileRef.value.reset();
};
const resetTurnstile = () => {
  if (!isTurnstileVerified.value && turnstileRef.value)
    turnstileRef.value.reset();
  turnstileStatus.value = "";
  turnstileStatusType.value = "";
};

const validatePaymentField = (field: string) => {
  const value = (paymentForm.value as any)[field];
  const stringValue = String(value || "");

  if (field === "billing_email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    paymentErrors.value.billing_email = !stringValue
      ? "Email address is required"
      : !emailRegex.test(stringValue)
        ? "Please enter a valid email address"
        : "";
  } else if (field === "billing_phone") {
    const digits = stringValue.replace(/\D/g, "");
    paymentErrors.value.billing_phone =
      digits.length < 10 ? "Please enter a valid phone number" : "";
  } else if (field === "billing_postcode") {
    const zip = stringValue.replace(/\D/g, "");
    paymentErrors.value.billing_postcode =
      zip.length !== 5 ? "Please enter a valid 5-digit ZIP code" : "";
  } else {
    (paymentErrors.value as any)[field] =
      !stringValue || stringValue.trim().length < 2
        ? "This field is required"
        : "";
  }
};

const validateInstallation = (field: string) => {
  const inst = installation.value;

  if (field === "phone") {
    const digits = (inst.phone || "").replace(/\D/g, "");
    inst.errors.phone =
      digits.length < 10 ? "Please enter a valid phone number" : "";
  } else if (field === "install_dates") {
    inst.errors.install_dates =
      inst.install_dates.filter((d) => d).length === 0
        ? "Please select at least 1 date"
        : "";
  } else if (field === "address") {
    inst.errors.address = !inst.address ? "Address is required" : "";
  }
};

const validateAllFields = () => {
  Object.keys(paymentForm.value).forEach((key) => validatePaymentField(key));
  validateInstallation("address");
  validateInstallation("phone");
  validateInstallation("install_dates");

  validationErrors.value.turnstile = isTurnstileVerified.value
    ? ""
    : "Please complete the security verification";
  return isFormValid.value;
};

const combinedSubtotal = computed(
  () => Number(cartTotal.value) + Number(alacarteCartTotal.value),
);
const promoDiscount = computed(() => discountAmount(combinedSubtotal.value));
const taxableAmount = computed(() =>
  Math.max(0, combinedSubtotal.value - promoDiscount.value),
);
const estimatedTax = computed(() => taxableAmount.value * FL_TAX_RATE.value);
const grandTotal = computed(() =>
  Math.max(
    0,
    combinedSubtotal.value - promoDiscount.value + estimatedTax.value,
  ),
);

const minDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0] || "";
});

const validateCheckout = () => {
  if (!orderItem.value) {
    if (!selectedSku.value?.id) toast.error("Please pick a color");
    else toast.error("Your order is empty");
    return false;
  }
  if (!serviceable.value || !placeId.value) {
    toast.error("Please enter a serviceable installation address");
    return false;
  }
  if (!validateAllFields()) {
    toast.error("Please fix all errors before proceeding");
    return false;
  }
  return true;
};

/* ------------------------------------------------------------------ */
/* Payment flow (order body identical to before)                       */
/* ------------------------------------------------------------------ */
const loadCheckoutScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).ConvergeEmbeddedPayment) return resolve();
    const script = document.createElement("script");
    script.src = "https://api.convergepay.com/hosted-payments/Checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Checkout.js"));
    document.head.appendChild(script);
  });
};

const payWithConverge = async () => {
  if (!validateCheckout()) return;
  isPaying.value = true;

  try {
    const email = paymentForm.value.billing_email || "";
    const promoCodeId = appliedPromo.value?.id || null;
    const inst = installation.value;
    const item = orderItem.value!;

    const orderBody = {
      first_name: paymentForm.value.billing_first_name,
      last_name: paymentForm.value.billing_last_name,
      email: email,
      billing_phone: paymentForm.value.billing_phone,
      billing_address: paymentForm.value.billing_address,
      billing_postcode: paymentForm.value.billing_postcode,
      shipping_address: inst.address,
      shipping_postcode: inst.postcode,
      billing_city: paymentForm.value.billing_city,
      customer_note: customerNote.value || null,

      // Still an array, now always one entry.
      items: [
        {
          product_id: inst.product_id,
          product_name: inst.product_name,
          quantity: 1,
          price: Number(item.price || 0),
          is_package: item.is_package,
          options: item.options,
          installation_address: inst.address,
          installation_postcode: inst.postcode,
          installation_phone: inst.phone,
          preferred_install_dates: inst.install_dates.filter((d) => d),
          removal_dates: inst.removal_dates.filter((d) => d),
        },
      ],
      subtotal: combinedSubtotal.value,
      tax_total: estimatedTax.value,
      total: grandTotal.value,
      promo_code_id: promoCodeId,
    };

    const tokenRes: any = await $fetch("/api/elavon/session", {
      method: "POST",
      body: {
        amount: grandTotal.value,
        first_name: paymentForm.value.billing_first_name,
        last_name: paymentForm.value.billing_last_name,
        email: email,
        invoice_number: `F-EX-${Date.now()}`,
        billing_address: paymentForm.value.billing_address,
        billing_city: paymentForm.value.billing_city,
        billing_zip: paymentForm.value.billing_postcode,
        billing_country: "USA",
        billing_phone: paymentForm.value.billing_phone,
      },
    });

    if (!tokenRes || !tokenRes.success || !tokenRes.token) {
      throw new Error("Failed to generate payment session");
    }

    await loadCheckoutScript();

    const paymentData = {
      ssl_txn_auth_token: tokenRes.token,
      ssl_card_number: paymentForm.value.card_number.replace(/\s/g, ""),
      ssl_exp_date: paymentForm.value.card_expiry.replace("/", ""),
      ssl_cvv2cvc2: paymentForm.value.card_cvv,
      ssl_first_name: paymentForm.value.billing_first_name,
      ssl_last_name: paymentForm.value.billing_last_name,
      ssl_avs_address: paymentForm.value.billing_address,
      ssl_city: paymentForm.value.billing_city,
      ssl_avs_zip: paymentForm.value.billing_postcode,
      ssl_country: "USA",
      ssl_email: email,
      ssl_phone: paymentForm.value.billing_phone,
      ssl_invoice_number: `INV-${Date.now()}`,
      ssl_get_token: "Y",
      ssl_add_token: "Y",
    };

    const callback = {
      onError: () => {
        showToast("Payment error occurred.", "error");
        isPaying.value = false;
        resetTurnstile();
      },
      onDeclined: (response: any) => {
        showToast(response?.ssl_result_message || "Card declined", "error");
        isPaying.value = false;
        resetTurnstile();
      },
      onApproval: async (response: any) => {
        if (response.ssl_result && response.ssl_result !== "0") {
          showToast("Transaction declined", "error");
          isPaying.value = false;
          resetTurnstile();
          return;
        }

        try {
          const orderRes: any = await $fetch("/api/orders/create", {
            method: "POST",
            body: {
              ...orderBody,
              transaction_id: response.ssl_txn_id,
              approval_code: response.ssl_approval_code,
              payment_token: response.ssl_token || tokenRes.token,
              card_last4: paymentForm.value.card_number
                .replace(/\s/g, "")
                .slice(-4),
              turnstile_token: turnstileToken.value,
              cvv_response: response.ssl_cvv2_response,
            },
          });

          if (!orderRes || !orderRes.success)
            throw new Error("Order creation failed");

          showToast("Payment successful!", "success");
          // address/placeId live in shared estimator state; don't leak into the next order
          address.value = "";
          placeId.value = "";
          serviceable.value = false;
          setOverage(null);
          navigateTo(
            `/thank-you?order=${orderRes.order.order_number}&email=${encodeURIComponent(email)}`,
          );
        } catch (err) {
          showToast("Payment successful but order creation failed.", "error");
          isPaying.value = false;
          resetTurnstile();
        } finally {
          isPaying.value = false;
        }
      },
    };

    (window as any).ConvergeEmbeddedPayment.pay(paymentData, callback);
  } catch (error: any) {
    showToast(error.message || "An error occurred", "error");
    isPaying.value = false;
    resetTurnstile();
  }
};
</script>

<style scoped>
.checkout-page {
  background: #e7e7e7;
  min-height: 80vh;
}
</style>
