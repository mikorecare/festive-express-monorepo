<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-code-modal-title"
          @click.self="close"
        >
          <Transition name="modal-pop" appear>
            <div
              class="relative w-full max-w-[600px] mx-auto my-auto bg-[#1C2D5B] rounded-3xl shadow-2xl overflow-hidden font-poppins"
            >
              <!-- Close button -->
              <button
                type="button"
                class="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Close"
                @click="close"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- ================= HEADER IMAGE ================= -->
              <div
                class="relative w-full h-[120px] sm:h-[160px] bg-[#1C2D5B] overflow-hidden flex flex-col justify-center"
              >
                <!-- Background Image (Right Half Only) -->
                <div class="absolute top-0 right-0 w-[55%] sm:w-1/2 h-full">
                  <img
                    src="/New/PromoCode/promo-code-image.webp"
                    alt="Promo Code background"
                    class="w-full h-full object-contain object-right"
                  />
                  <div
                    class="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#1C2D5B] to-transparent"
                  ></div>
                </div>

                <!-- Gradient for bottom text readability -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-[#1C2D5B] via-transparent to-transparent opacity-80"
                ></div>

                <!-- Overlaid Title & Info -->
                <div
                  class="absolute inset-y-0 left-0 flex flex-col justify-center pl-3 sm:pl-8 pr-4 z-10 w-full pointer-events-none"
                >
                  <img
                    src="/New/PromoCode/promo-code.webp"
                    alt="Enter your details to claim your exclusive $500 discount and bring the magic of holiday lighting to your home!"
                    class="relative w-full sm:w-[75%] h-20 sm:h-32 object-contain object-left drop-shadow-md"
                    style="transform: skewX(-6deg)"
                  />
                </div>
              </div>

              <!-- ================= BODY ================= -->
              <div class="px-3 pb-3 sm:px-4 sm:pb-4">
                <!-- The White Container -->
                <div
                  class="bg-white rounded-[20px] p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                >
                  <!-- SUCCESS STATE -->
                  <div v-if="isSuccess" class="space-y-3">
                    <ApplicationSuccessScratch />

                    <div class="text-center space-y-2">
                      <p
                        class="text-[#1C2D5B] text-sm font-bold leading-relaxed"
                      >
                        Your promo code is on its way to
                        <br />
                        <span
                          class="text-[#F49321] font-black break-all text-base"
                          >{{ sentEmail }}</span
                        >
                      </p>
                      <button
                        type="button"
                        class="w-full min-h-[46px] inline-flex items-center justify-center bg-[#1C2D5B] hover:bg-[#F49321] text-white py-2.5 rounded-xl text-base font-extrabold uppercase transition-all duration-200"
                        @click="close"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <!-- FORM STATE -->
                  <form
                    v-else
                    aria-label="Promo Code form"
                    @submit.prevent="submitForm"
                    class="space-y-3"
                  >
                    <label for="promo-code-name" class="block">
                      <span
                        class="block text-[11px] font-extrabold text-[#1C2D5B] uppercase tracking-wide mb-1"
                      >
                        Full Name <span class="text-[#F49321]">*</span>
                      </span>
                      <input
                        id="promo-code-name"
                        v-model="form.name"
                        type="text"
                        autocomplete="name"
                        placeholder="Jane Doe"
                        required
                        class="form-input"
                        :disabled="isSubmitting"
                      />
                    </label>

                    <label for="promo-code-email" class="block">
                      <span
                        class="block text-[11px] font-extrabold text-[#1C2D5B] uppercase tracking-wide mb-1"
                      >
                        Email <span class="text-[#F49321]">*</span>
                      </span>
                      <input
                        id="promo-code-email"
                        v-model="form.email"
                        type="email"
                        autocomplete="email"
                        inputmode="email"
                        placeholder="jane@example.com"
                        required
                        class="form-input"
                        :disabled="isSubmitting"
                      />
                    </label>

                    <!-- Turnstile -->
                    <div>
                      <TurnstileWidget
                        ref="turnstileRef"
                        :site-key="siteKey"
                        :errors="turnstileErrors"
                        :status="turnstileStatus"
                        :status-type="turnstileStatusType"
                        :status-class="turnstileStatusClass"
                        :status-icon="turnstileStatusIcon"
                        @success="onTurnstileSuccess"
                        @error="onTurnstileError"
                        @expired="onTurnstileExpired"
                      />
                    </div>

                    <p
                      v-if="error"
                      class="text-xs sm:text-sm font-bold text-red-600 flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ error }}
                    </p>

                    <button
                      type="submit"
                      class="btn-3d-glossy btn-3d-glossy--navy w-full min-h-[50px] text-base font-extrabold uppercase tracking-wide"
                      :disabled="isSubmitting || !turnstileVerified"
                    >
                      <span v-if="!isSubmitting">Send My Promo Code</span>
                      <span
                        v-else
                        class="flex items-center justify-center gap-2"
                      >
                        <svg
                          class="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </span>
                    </button>

                    <p
                      class="text-[11px] font-bold text-slate-700 text-center leading-snug"
                    >
                      By submitting your email, you agree to receive emails from
                      Festive Express about our services, scheduling, and
                      appointment reminders. You may receive about 2-4 emails
                      per month. You can unsubscribe at any time using the link
                      in any email. Consent is not a condition of purchase.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  font-family: "Poppins", "Arial", sans-serif;
  color: #1c2d5b;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  outline: none;
  appearance: none;
  line-height: 1.4;
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 600;
}

.form-input:hover {
  border-color: #cbd5e1;
}

.form-input:focus {
  background-color: #ffffff;
  border-color: #f49321;
  box-shadow: 0 0 0 3px rgba(244, 147, 33, 0.2);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-pop-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(15px);
}

.outlined {
  position: relative;
  isolation: isolate;
  paint-order: stroke fill;
  -webkit-text-stroke-linejoin: round;
  stroke-linejoin: round;
}

.outlined::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: -1;
  paint-order: stroke fill;
  stroke-linejoin: round;
  pointer-events: none;
}

/* ---------- Mobile (default) ---------- */

/* Line 1: white text, navy inner outline, orange outer outline */
.outlined-line1 {
  -webkit-text-stroke: 2px #1c2d5b;
}
.outlined-line1::before {
  color: #f49321;
  -webkit-text-stroke: 4px #f49321;
}

/* Line 2: orange text, navy inner outline, white outer outline + drop shadow */
.outlined-line2 {
  -webkit-text-stroke: 3.5px #1c2d5b;
}
.outlined-line2::before {
  color: #fff;
  -webkit-text-stroke: 8px #fff;
  text-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
}

/* ---------- sm and up (640px+) ---------- */
@media (min-width: 640px) {
  .outlined-line1 {
    -webkit-text-stroke: 3px #1c2d5b;
  }
  .outlined-line1::before {
    -webkit-text-stroke: 6px #f49321;
  }

  .outlined-line2 {
    -webkit-text-stroke: 5px #1c2d5b;
  }
  .outlined-line2::before {
    -webkit-text-stroke: 12px #fff;
    text-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }
}
</style>

<script setup lang="ts">
import TurnstileWidget from "~/components/Checkout/TurnstileWidget.vue";
import ApplicationSuccessScratch from "~/components/ApplicationSuccessScratch.vue";

const props = withDefaults(defineProps<{ apiEndpoint?: string }>(), {
  apiEndpoint: "/api/voucher",
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const isOpen = ref(false);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const error = ref("");
const sentEmail = ref("");

const form = ref({ name: "", email: "" });

const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null);
const turnstileToken = ref("");
const turnstileVerified = ref(false);
const turnstileStatus = ref("");
const turnstileStatusType = ref("");
const turnstileErrors = ref({ turnstile: "" });

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
  turnstileVerified.value = true;
  turnstileStatus.value = "Verification successful!";
  turnstileStatusType.value = "success";
  turnstileErrors.value.turnstile = "";
};

const onTurnstileError = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  turnstileErrors.value.turnstile = "Please complete the security verification";
};

const onTurnstileExpired = () => {
  turnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  turnstileErrors.value.turnstile = "Verification expired. Please try again.";
  turnstileRef.value?.reset();
};

// Store the voucher intent globally, but do NOT open the modal
const checkVoucherParams = () => {
  if (!import.meta.client) return;

  if (route.query.q === "voucher" && route.query.d === "true") {
    localStorage.setItem("hasVoucher", "true");
  }
};

const submitForm = async () => {
  if (isSubmitting.value) return;
  error.value = "";

  if (!turnstileVerified.value || !turnstileToken.value) {
    error.value = "Please complete the security verification first.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<{ success: boolean; error?: string }>(
      props.apiEndpoint,
      {
        method: "POST",
        body: {
          name: form.value.name,
          email: form.value.email,
          turnstileToken: turnstileToken.value,
        },
      },
    );

    if (response.success) {
      sentEmail.value = form.value.email;
      isSuccess.value = true;
      form.value = { name: "", email: "" };
      turnstileRef.value?.reset();
      turnstileVerified.value = false;
      turnstileToken.value = "";
    } else {
      error.value = response.error || "Something went wrong. Please try again.";
      if (
        typeof response.error === "string" &&
        response.error.toLowerCase().includes("verification")
      ) {
        turnstileRef.value?.reset();
        turnstileVerified.value = false;
        turnstileToken.value = "";
      }
    }
  } catch (err: any) {
    console.error("Voucher submit error:", err);
    error.value = err?.data?.message || "Network error. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  isOpen.value = false;
  isSuccess.value = false;

  // Remove the flag so it doesn't pop up again on refresh
  if (import.meta.client) {
    localStorage.removeItem("hasVoucher");
  }

  // Clean up URL if they are on the home page
  if (route.query.q || route.query.d) {
    const query = { ...route.query };
    delete query.q;
    delete query.d;

    router.replace({
      query,
      hash: route.hash,
    });
  }
};

// 1. Watch query params ONLY to save to localStorage (does NOT open modal)
watch(() => route.query, checkVoucherParams, { immediate: true });

// 2. Watch route path ONLY to trigger the modal on /checkout
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/checkout" && import.meta.client) {
      const hasVoucher = localStorage.getItem("hasVoucher");
      if (hasVoucher === "true") {
        isOpen.value = true;
      }
    }
  },
  { immediate: true },
);

defineExpose({
  open: () => {
    isOpen.value = true;
  },
  close,
});
</script>
