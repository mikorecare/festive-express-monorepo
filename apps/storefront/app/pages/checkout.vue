<template>
  <div class="checkout-page min-h-[80vh] bg-[#e7e7e7]">
    <section
      aria-label="Checkout page header"
      role="region"
      class="relative py-10 sm:py-16 text-white overflow-hidden min-h-[320px] sm:min-h-[400px]"
    >
      <img
        src="/New/Banner/checkout.webp"
        alt="Checkout background"
        width="1920"
        height="800"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover z-10"
      />
      <div class="absolute inset-0 bg-black/40 z-[11]" aria-hidden="true"></div>
      <div
        class="relative z-[12] container mx-auto px-3 sm:px-4 flex items-center justify-center min-h-[320px] sm:min-h-[400px]"
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

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Contact Info (Shared) -->
          <CheckoutServiceInformation
            v-model="contactForm"
            :errors="contactErrors"
            @validate="validateContactField"
          />

          <!-- Loop through each installation unit -->
          <div
            v-for="(inst, index) in installations"
            :key="index"
            class="space-y-6"
          >
            <div>
              <div
                class="relative btn-gloss overflow-hidden bg-[#1C2D5B] text-white px-4 py-2 rounded-t-xl flex items-center justify-between border-b-4 border-[#F49321]"
              >
                <span
                  class="relative z-10 text-sm sm:text-base font-extrabold tracking-wide"
                >
                  Installation #{{ index + 1 }}
                  <span class="text-[#F49321]"
                    >for {{ inst.product_name }}</span
                  >
                </span>
              </div>

              <!-- Installation Specific Address & Phone -->
              <div
                class="bg-white rounded-b-2xl p-6 shadow-md border border-slate-200"
              >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="md:col-span-3">
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Installation Address *</label
                    >
                    <input
                      :value="inst.address"
                      @input="
                        (e) =>
                          updateInstallationField(
                            index,
                            'address',
                            (e.target as HTMLInputElement).value,
                          )
                      "
                      @blur="validateInstallation(index, 'address')"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      :class="{ 'border-red-500': inst.errors.address }"
                      placeholder="123 Festive Lane"
                    />
                    <p
                      v-if="inst.errors.address"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ inst.errors.address }}
                    </p>
                  </div>
                  <div class="md:col-span-1">
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >ZIP / Postcode *</label
                    >
                    <input
                      :value="inst.postcode"
                      @input="
                        (e) =>
                          updateInstallationField(
                            index,
                            'postcode',
                            (e.target as HTMLInputElement).value,
                          )
                      "
                      @blur="validateInstallation(index, 'postcode')"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      :class="{ 'border-red-500': inst.errors.postcode }"
                      maxlength="10"
                      placeholder="34236"
                    />
                    <p
                      v-if="inst.errors.postcode"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ inst.errors.postcode }}
                    </p>
                  </div>
                  <div class="md:col-span-4">
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Installation Contact Phone *</label
                    >
                    <input
                      :value="inst.phone"
                      @input="
                        (e) =>
                          updateInstallationField(
                            index,
                            'phone',
                            (e.target as HTMLInputElement).value,
                          )
                      "
                      @blur="validateInstallation(index, 'phone')"
                      type="tel"
                      class="w-full md:max-w-[50%] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      :class="{ 'border-red-500': inst.errors.phone }"
                      maxlength="14"
                      placeholder="(555) 123-4567"
                    />
                    <p
                      v-if="inst.errors.phone"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ inst.errors.phone }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Installation Specific Dates -->
            <CheckoutScheduleService
              :model-value="inst"
              :errors="inst.errors"
              :min-date="minDate"
              @update:model-value="(val) => updateInstallation(index, val)"
              @validate="(field) => validateInstallation(index, field)"
            />
          </div>

          <!-- Payment Information -->
          <CheckoutPaymentInformation
            v-model="paymentForm"
            :errors="paymentErrors"
            :is-single-installation="installations.length === 1"
            @validate="validatePaymentField"
          />
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-1">
          <CheckoutOrderSummary
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
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Checkout" });
import CheckoutTurnstileWidget from "../components/Checkout/TurnstileWidget.vue";
import { usePaymentError } from "~/composables/usePaymentError";
import { useToast } from "~/composables/useToast";
import { toast } from "vue-sonner";

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const { settings } = useSettings();
const FL_TAX_RATE = computed(() => {
  const raw =
    settings.value?.fl_tax_rate ?? (settings.value as any)?.["fl_tax_rate"];
  const n = Number(raw);
  if (!Number.isNaN(n) && n >= 0) return n;
  return 0.07;
});

const { cartItems, cartTotal, loadCart, clearCart } = useCart();
const { isServiceZip } = useServiceZips();
const { handlePaymentError } = usePaymentError();
const { showToast } = useToast();

const paymentMethod = ref<string>("converge");
const isPaying = ref(false);

const turnstileRef = ref<InstanceType<typeof CheckoutTurnstileWidget> | null>(
  null,
);
const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const turnstileStatus = ref("");
const turnstileStatusType = ref("");

// 1. Shared Contact Info (Removed Phone)
const contactForm = ref({
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
  customer_note: "",
});

const contactErrors = ref({
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
});

// 2. Payment Info
const paymentForm = ref({
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
  billing_same: true,
  billing_address: "",
  billing_city: "",
  billing_state: "FL",
  billing_postcode: "",
  billing_phone: "",
});

const paymentErrors = ref({
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
});

// 3. Dynamic Installations
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

const installations = ref<Installation[]>([]);

// Watch cart to generate installations based on quantity
watch(
  cartItems,
  (items) => {
    const newInstallations: Installation[] = [];
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        newInstallations.push({
          product_id: String(item.product_id),
          product_name: item.product?.name || "Package",
          address: "",
          postcode: "",
          phone: "",
          install_dates: ["", "", ""],
          removal_dates: ["", "", ""],
          errors: {},
        });
      }
    });
    installations.value = newInstallations;
  },
  { immediate: true, deep: true },
);

const validationErrors = ref({ turnstile: "" });

const isFormValid = computed(() => {
  const contactValid =
    Object.values(contactErrors.value).every((e) => !e) &&
    !!contactForm.value.billing_first_name &&
    !!contactForm.value.billing_last_name &&
    !!contactForm.value.billing_email;

  const paymentValid =
    Object.values(paymentErrors.value).every((e) => !e) &&
    !!paymentForm.value.card_name &&
    !!paymentForm.value.card_number &&
    !!paymentForm.value.card_expiry &&
    !!paymentForm.value.card_cvv;

  const installationsValid = installations.value.every(
    (inst) =>
      Object.values(inst.errors).every((e) => !e) &&
      !!inst.address &&
      !!inst.postcode &&
      !!inst.phone &&
      inst.install_dates.some((d) => d),
  );

  return (
    contactValid &&
    paymentValid &&
    installationsValid &&
    isTurnstileVerified.value
  );
});

const updateInstallationField = (index: number, field: string, value: any) => {
  const inst = installations.value[index];
  if (inst) {
    (inst as any)[field] = value;
  }
};

const updateInstallation = (index: number, updated: any) => {
  const current = installations.value[index];
  if (!current) return;

  installations.value[index] = {
    ...current,
    ...updated,
    errors: current.errors,
  };
};

// Turnstile Methods...
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

// Validation Methods...
const validateContactField = (field: string) => {
  const value = contactForm.value[field as keyof typeof contactForm.value];
  const stringValue = String(value || "");

  if (field === "billing_email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    contactErrors.value.billing_email = !stringValue
      ? "Email address is required"
      : !emailRegex.test(stringValue)
        ? "Please enter a valid email address"
        : "";
  } else {
    (contactErrors.value as any)[field] =
      !stringValue || stringValue.trim().length < 2
        ? "This field is required"
        : "";
  }
};

const validatePaymentField = (field: string) => {
  // Keep your existing payment validation logic here
};

const validateInstallation = (index: number, field: string) => {
  const inst = installations.value[index];
  if (!inst) return;

  if (field === "postcode") {
    const zip = inst.postcode.replace(/\D/g, "");
    if (zip.length !== 5) {
      inst.errors.postcode = "Please enter a valid 5-digit ZIP code";
    } else if (!isServiceZip(zip)) {
      inst.errors.postcode =
        "We currently only serve the Sarasota, Bradenton, and Lakewood Ranch area.";
    } else {
      inst.errors.postcode = "";
      inst.postcode = zip;
    }
  } else if (field === "phone") {
    const digits = inst.phone.replace(/\D/g, "");
    inst.errors.phone =
      digits.length < 10 ? "Please enter a valid phone number" : "";
  } else if (field === "install_dates") {
    inst.errors.install_dates =
      inst.install_dates.filter((d) => d).length === 0
        ? "Please select at least 1 date"
        : "";
  } else if (field === "address") {
    inst.errors.address =
      inst.address.trim().length < 5 ? "Please enter a valid address" : "";
  }
};

const validateAllFields = () => {
  Object.keys(contactForm.value).forEach(validateContactField);
  Object.keys(paymentForm.value).forEach(validatePaymentField);
  installations.value.forEach((_, index) => {
    validateInstallation(index, "address");
    validateInstallation(index, "postcode");
    validateInstallation(index, "phone");
    validateInstallation(index, "install_dates");
  });

  if (!isTurnstileVerified.value) {
    validationErrors.value.turnstile =
      "Please complete the security verification";
  } else {
    validationErrors.value.turnstile = "";
  }
  return isFormValid.value;
};

// Totals
const alacarteCartTotal = computed(() =>
  cartItems.value.reduce(
    (sum: number, item: any) => sum + Number(item.options?.alacarte_total || 0),
    0,
  ),
);

const { discountAmount, appliedPromo } = usePromo();
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
  if (cartItems.value.length === 0) {
    toast.error("Your cart is empty");
    return false;
  }
  if (!validateAllFields()) {
    toast.error("Please fix all errors before proceeding");
    return false;
  }
  return true;
};

const getCityFromZip = (zip: string): string => {
  return "Sarasota";
};

// Payment Flow
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
    const email = contactForm.value.billing_email || "";
    const promoCodeId = appliedPromo.value?.id || null;

    // Determine billing address source
    const useInstallationBilling = paymentForm.value.billing_same;
    const primaryInst = installations.value[0]!;
    const billingAddress = useInstallationBilling
      ? primaryInst.address
      : paymentForm.value.billing_address;
    const billingCity = useInstallationBilling
      ? getCityFromZip(primaryInst.postcode)
      : paymentForm.value.billing_city;
    const billingState = useInstallationBilling
      ? "FL"
      : paymentForm.value.billing_state;
    const billingZip = useInstallationBilling
      ? primaryInst.postcode
      : paymentForm.value.billing_postcode;
    const billingPhone = primaryInst.phone; // always use installation phone for AVS

    const orderBody = {
      first_name: contactForm.value.billing_first_name,
      last_name: contactForm.value.billing_last_name,
      email: email,
      billing_phone: billingPhone,
      billing_address: billingAddress,
      billing_postcode: billingZip,
      shipping_address: primaryInst.address,
      shipping_postcode: primaryInst.postcode,
      billing_city: billingCity,
      billing_state: billingState,
      customer_note: contactForm.value.customer_note || null,

      items: installations.value.map((inst, index) => {
        const cartItem = cartItems.value.find(
          (i) => String(i.product_id) === inst.product_id,
        );
        return {
          product_id: inst.product_id,
          product_name: inst.product_name,
          quantity: 1,
          price: Number(cartItem?.price || 0),
          is_package: cartItem?.is_package || false,
          options: cartItem?.options || {},
          installation_address: inst.address,
          installation_postcode: inst.postcode,
          installation_phone: inst.phone,
          preferred_install_dates: inst.install_dates.filter((d) => d),
          removal_dates: inst.removal_dates.filter((d) => d),
        };
      }),
      subtotal: combinedSubtotal.value,
      tax_total: estimatedTax.value,
      total: grandTotal.value,
      promo_code_id: promoCodeId,
    };

    const tokenRes: any = await $fetch("/api/elavon/session", {
      method: "POST",
      body: {
        amount: grandTotal.value,
        first_name: contactForm.value.billing_first_name,
        last_name: contactForm.value.billing_last_name,
        email: email,
        invoice_number: `F-EX-${Date.now()}`,
        billing_address: billingAddress,
        billing_city: billingCity,
        billing_state: billingState,
        billing_zip: billingZip,
        billing_country: "USA",
        billing_phone: billingPhone,
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
      ssl_first_name: contactForm.value.billing_first_name,
      ssl_last_name: contactForm.value.billing_last_name,
      ssl_avs_address: billingAddress,
      ssl_city: billingCity,
      ssl_state: billingState,
      ssl_avs_zip: billingZip,
      ssl_country: "USA",
      ssl_email: email,
      ssl_phone: billingPhone,
      ssl_invoice_number: `INV-${Date.now()}`,
      ssl_get_token: "Y",
      ssl_add_token: "Y",
    };

    const callback = {
      onError: (error: any) => {
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

          await clearCart();
          showToast("Payment successful!", "success");
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

onMounted(async () => {
  await loadCart();
});
</script>

<style scoped>
.checkout-page {
  background: #e7e7e7;
  min-height: 80vh;
}
</style>
