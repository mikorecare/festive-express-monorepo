<template>
  <div class="checkout-page min-h-[80vh] bg-[#e7e7e7]">
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container mx-auto px-4">
          <div class="hero-content text-center py-12">
            <h1 class="text-4xl font-bold text-white uppercase">Checkout</h1>
            <p class="text-white-600 max-w-2xl mx-auto mt-2">
              Finalize your professional holiday installation details and lock
              in your install/take down dates.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <CheckoutServiceInformation
            v-model="form"
            :errors="validationErrors"
            @validate="validateField"
          />

          <CheckoutScheduleService
            v-model="form"
            :errors="validationErrors"
            :min-date="minDate"
            @validate="validateField"
          />

          <CheckoutPaymentInformation
            v-model="form"
            :errors="validationErrors"
            @validate="validateField"
            @formatCardNumber="formatCardNumber"
            @formatExpiry="formatExpiry"
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
const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;
const FL_TAX_RATE = Number(config.public.flTaxRate) || 0.07;
const { cartItems, cartTotal, loadCart, clearCart } = useCart();
const { isServiceZip } = useServiceZips();

import { toast } from "vue-sonner";

const paymentMethod = ref<string>("converge");
const isPaying = ref(false);

const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const turnstileStatus = ref("");
const turnstileStatusType = ref("");

const form = ref({
  billing_first_name: "",
  billing_email: "",
  billing_phone: "",
  shipping_address_1: "",
  billing_postcode: "",
  install_dates: ["", "", ""],
  removal_dates: ["", "", ""],
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
  billing_same: true,
  customer_note: "",
});

const validationErrors = ref({
  billing_first_name: "",
  billing_email: "",
  billing_phone: "",
  shipping_address_1: "",
  billing_postcode: "",
  install_dates: "",
  card_name: "",
  card_number: "",
  card_expiry: "",
  card_cvv: "",
  turnstile: "",
});

const isFormValid = computed(() => {
  const hasInstallDate = form.value.install_dates.some((d) => d);
  return (
    Object.values(validationErrors.value).every((error) => error === "") &&
    !!form.value.billing_first_name &&
    !!form.value.billing_email &&
    !!form.value.billing_phone &&
    !!form.value.shipping_address_1 &&
    !!form.value.billing_postcode &&
    hasInstallDate &&
    !!form.value.card_name &&
    !!form.value.card_number &&
    !!form.value.card_expiry &&
    !!form.value.card_cvv &&
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
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  validationErrors.value.turnstile =
    "Please complete the security verification";
};

const onTurnstileExpired = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  validationErrors.value.turnstile = "Verification expired. Please try again.";
};

const resetTurnstile = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "";
  turnstileStatusType.value = "";
};

const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");

  if (!digits || digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const validateField = (field: string) => {
  const value = form.value[field as keyof typeof form.value];
  const errors = validationErrors.value;

  if (
    field === "billing_postcode" ||
    field === "card_number" ||
    field === "card_expiry" ||
    field === "card_cvv"
  ) {
    const stringValue = String(value || "");
    switch (field) {
      case "billing_postcode":
        const zip = stringValue.replace(/\D/g, "");
        if (zip.length !== 5) {
          errors.billing_postcode = "Please enter a valid 5-digit ZIP code";
        } else if (!isServiceZip(zip)) {
          errors.billing_postcode =
            "Sorry, we only serve Sarasota / Bradenton / Lakewood Ranch area";
        } else {
          errors.billing_postcode = "";
          form.value.billing_postcode = zip;
        }
        break;
      case "card_number":
        const cardNum = stringValue.replace(/\s/g, "");
        if (!cardNum) {
          errors.card_number = "Card number is required";
        } else if (cardNum.length < 13) {
          errors.card_number = "Card number must be at least 13 digits";
        } else if (!validateLuhn(cardNum)) {
          errors.card_number =
            "Invalid card number - please check and try again";
        } else {
          errors.card_number = "";
        }
        break;
      case "card_expiry":
        if (!stringValue) {
          errors.card_expiry = "Expiry date is required";
        } else if (!/^\d{2}\/\d{2}$/.test(stringValue)) {
          errors.card_expiry = "Please use MM/YY format";
        } else {
          const [month, year] = stringValue.split("/");
          const expMonth = parseInt(month!);
          const expYear = parseInt("20" + year!);
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentYear = now.getFullYear();
          if (expMonth < 1 || expMonth > 12) {
            errors.card_expiry = "Invalid month";
          } else if (
            expYear < currentYear ||
            (expYear === currentYear && expMonth < currentMonth)
          ) {
            errors.card_expiry = "Card has expired";
          } else {
            errors.card_expiry = "";
          }
        }
        break;
      case "card_cvv":
        if (!stringValue) {
          errors.card_cvv = "CVV is required";
        } else {
          const cvvLength = stringValue.length;
          const isAmex =
            form.value.card_number.replace(/\s/g, "").startsWith("34") ||
            form.value.card_number.replace(/\s/g, "").startsWith("37");
          const expectedLength = isAmex ? 4 : 3;
          if (cvvLength !== expectedLength) {
            errors.card_cvv = `CVV must be ${expectedLength} digits for ${isAmex ? "AMEX" : "this card type"}`;
          } else if (!/^\d+$/.test(stringValue)) {
            errors.card_cvv = "CVV must contain only numbers";
          } else {
            errors.card_cvv = "";
          }
        }
        break;
    }
    return;
  }

  const stringValue = String(value || "");

  switch (field) {
    case "billing_first_name":
      if (!stringValue || stringValue.trim().length < 2) {
        errors.billing_first_name = "Please enter your full name";
      } else {
        errors.billing_first_name = "";
      }
      break;

    case "billing_email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!stringValue) {
        errors.billing_email = "Email address is required";
      } else if (!emailRegex.test(stringValue)) {
        errors.billing_email = "Please enter a valid email address";
      } else {
        errors.billing_email = "";
      }
      break;

    case "billing_phone":
      const phoneRegex = /^[\d\s\-\(\)\+]{10,15}$/;
      if (!stringValue) {
        errors.billing_phone = "Phone number is required";
      } else if (!phoneRegex.test(stringValue.replace(/\s/g, ""))) {
        errors.billing_phone = "Please enter a valid phone number";
      } else {
        errors.billing_phone = "";
      }
      break;

    case "shipping_address_1":
      if (!stringValue || stringValue.trim().length < 5) {
        errors.shipping_address_1 = "Please enter your installation address";
      } else {
        errors.shipping_address_1 = "";
      }
      break;

    case "install_dates":
      const dates = form.value.install_dates.filter((d) => d);
      if (dates.length === 0) {
        errors.install_dates = "Please select at least 1 installation date";
      } else {
        errors.install_dates = "";
      }
      break;

    case "card_name":
      if (!stringValue || stringValue.trim().length < 2) {
        errors.card_name = "Please enter the cardholder name";
      } else {
        errors.card_name = "";
      }
      break;
  }
};

const validateAllFields = () => {
  const fields = [
    "billing_first_name",
    "billing_email",
    "billing_phone",
    "shipping_address_1",
    "billing_postcode",
    "install_dates",
    "card_name",
    "card_number",
    "card_expiry",
    "card_cvv",
  ];
  fields.forEach((field) => validateField(field));

  if (!isTurnstileVerified.value) {
    validationErrors.value.turnstile =
      "Please complete the security verification";
  } else {
    validationErrors.value.turnstile = "";
  }

  return isFormValid.value;
};

const formatCardNumber = () => {
  const value = form.value.card_number || "";
  let cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length > 16) {
    cleanValue = cleanValue.slice(0, 16);
  }
  const formatted = cleanValue.replace(/(.{4})/g, "$1 ").trim();
  form.value.card_number = formatted;
};

const formatExpiry = () => {
  const value = form.value.card_expiry || "";
  let cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length > 4) {
    cleanValue = cleanValue.slice(0, 4);
  }
  if (cleanValue.length >= 2) {
    const month = cleanValue.slice(0, 2);
    const year = cleanValue.slice(2);
    if (parseInt(month) > 12) {
      form.value.card_expiry = "12/" + year;
      return;
    }
    form.value.card_expiry = month + "/" + year;
  } else {
    form.value.card_expiry = cleanValue;
  }
};

const alacarteCartTotal = computed(() =>
  cartItems.value.reduce((sum: number, item: any) => {
    return sum + Number(item.options?.alacarte_total || 0);
  }, 0),
);

const estimatedTax = computed(() => cartTotal.value * FL_TAX_RATE);
const installDeposit = ref(0);
const grandTotal = computed(
  () =>
    Number(cartTotal.value) +
    estimatedTax.value +
    installDeposit.value +
    alacarteCartTotal.value,
);

const minDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0] || "";
});

const buildOrderPayload = () => {
  const nameParts = (form.value.billing_first_name || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const installDates = form.value.install_dates.filter((d) => d);
  const removalDates = form.value.removal_dates.filter((d) => d);

  return {
    billing_first_name: firstName,
    billing_last_name: lastName,
    billing_email: form.value.billing_email,
    billing_phone: form.value.billing_phone,
    billing_postcode: form.value.billing_postcode,
    shipping_address_1: form.value.shipping_address_1,
    shipping_postcode: form.value.billing_postcode,
    preferred_install_dates: installDates,
    removal_dates: removalDates,
    status: "pending",
    payment_method: "converge",
    payment_status: "paid",
    subtotal: cartTotal.value + alacarteCartTotal.value,
    tax_total: estimatedTax.value,
    total: grandTotal.value,
    items: cartItems.value.map((item: any) => ({
      product_id: item.product_id,
      product_name: item.product?.name || item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options || null,
      is_package: item.is_package || false,
    })),
    customer_note: form.value.customer_note || null,
    transaction_id: null,
    approval_code: null,
    payment_token: null,
  };
};

const validateCheckout = () => {
  if (cartItems.value.length === 0) {
    toast.error("Your cart is empty");
    return false;
  }

  const isValid = validateAllFields();
  if (!isValid) {
    toast.error("Please fix all errors before proceeding");
    return false;
  }

  return true;
};

const loadConvergeScript = () => {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).PayWithConverge) {
      resolve();
      return;
    }
    const demo = true;
    const src = demo
      ? "https://api.demo.convergepay.com/hosted-payments/PayWithConverge.js"
      : "https://api.convergepay.com/hosted-payments/PayWithConverge.js";

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Converge script"));
    document.head.appendChild(s);
  });
};

const payWithConverge = async () => {
  if (!validateCheckout()) return;

  isPaying.value = true;

  try {
    const nameParts = (form.value.billing_first_name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || firstName;
    const tokenRes: any = await $fetch("/api/elavon/session", {
      method: "POST",
      body: {
        amount: grandTotal.value,
        first_name: firstName,
        last_name: lastName,
        email: form.value.billing_email,
        invoice_number: `FLP-${Date.now()}`,
        billing_phone: form.value.billing_phone,
        billing_address: form.value.shipping_address_1,
        billing_postcode: form.value.billing_postcode,
        shipping_address: form.value.shipping_address_1,
        shipping_postcode: form.value.billing_postcode,
        preferred_install_dates: form.value.install_dates.filter((d) => d),
        removal_dates: form.value.removal_dates.filter((d) => d),
        customer_note: form.value.customer_note || null,
        subtotal: cartTotal.value + alacarteCartTotal.value,
        tax_total: estimatedTax.value,
        total: grandTotal.value,
        deposit_amount: 0,
        items: cartItems.value.map((item: any) => ({
          product_id: item.product_id || item.id,
          product_name: item.product?.name || item.name,
          quantity: item.quantity,
          price: item.price,
          is_package: item.is_package || false,
          options: item.options || {},
        })),
      },
    });

    if (!tokenRes.success || !tokenRes.token) {
      throw new Error("Failed to get payment token");
    }

    await loadConvergeScript();

    (window as any).PayWithConverge.open(
      { ssl_txn_auth_token: tokenRes.token },
      {
        onApproval: async (payment: any) => {
          try {
            const orderPayload = buildOrderPayload();
            orderPayload.transaction_id =
              payment.ssl_txn_id || tokenRes.transactionId;
            orderPayload.approval_code = payment.ssl_approval_code;

            const orderResponse: any = await $fetch("/api/orders", {
              method: "POST",
              body: orderPayload,
            });

            await clearCart();
            toast.success("Payment successful!");
            navigateTo(
              `/thank-you?order=${orderResponse.order_number || orderResponse.id}`,
            );
          } catch (e: any) {
            toast.error("Payment OK but order failed — contact support");
            resetTurnstile();
          } finally {
            isPaying.value = false;
          }
        },
        onError: () => {
          toast.error("Payment error");
          isPaying.value = false;
          resetTurnstile();
        },
        onCancelled: () => {
          toast.message("Payment cancelled");
          isPaying.value = false;
          resetTurnstile();
        },
        onDeclined: () => {
          toast.error("Card declined");
          isPaying.value = false;
          resetTurnstile();
        },
      },
    );
  } catch (error: any) {
    toast.error(error.message || "Unable to start payment");
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
