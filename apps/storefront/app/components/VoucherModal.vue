<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voucher-modal-title"
        @click.self="close"
      >
        <Transition name="modal-pop" appear>
          <div
            class="relative w-full max-w-[600px] mx-auto my-auto bg-white rounded-xl shadow-lg border-4 border-[#1C2D5B] overflow-hidden"
          >
            <!-- Close button -->
            <button
              type="button"
              class="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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

            <!-- Success state -->
            <Transition name="fade">
              <div v-if="isSuccess">
                <div class="bg-[#1C2D5B] py-5 px-4 text-center">
                  <div
                    class="mx-auto w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center mb-3 shadow-[0_4px_10px_rgba(244,147,33,0.4)]"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    id="voucher-modal-title"
                    class="text-lg sm:text-xl font-bold text-white mb-1"
                  >
                    Voucher Sent!
                  </h3>
                  <p class="text-white/90 text-sm">
                    Your voucher is on its way to
                    <span class="text-brand-orange font-bold">{{
                      sentEmail
                    }}</span>
                  </p>
                </div>
                <div class="p-3.5 sm:p-4 text-center">
                  <button
                    type="button"
                    class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#1C2D5B] text-[#1C2D5B] font-semibold text-sm hover:bg-[#1C2D5B] hover:text-white transition-colors"
                    @click="close"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition>

            <!-- Form -->
            <form
              v-if="!isSuccess"
              aria-label="Voucher form"
              @submit.prevent="submitForm"
            >
              <!-- Header -->
              <div class="bg-[#1C2D5B] py-4 px-4 text-center">
                <div
                  class="mx-auto w-11 h-11 rounded-full bg-brand-orange flex items-center justify-center mb-2 shadow-[0_4px_10px_rgba(244,147,33,0.4)]"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <h3
                  id="voucher-modal-title"
                  class="text-lg sm:text-xl font-bold text-white mb-0.5 leading-tight"
                >
                  You've Got a Voucher!
                </h3>
                <p class="text-brand-orange text-xs sm:text-sm font-medium">
                  Enter your details to receive it by email
                </p>
              </div>

              <!-- Fields -->
              <div class="p-3.5 sm:p-4 space-y-3">
                <label for="voucher-name" class="block">
                  <span
                    class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
                  >
                    Full Name <span class="text-brand-orange">*</span>
                  </span>
                  <input
                    id="voucher-name"
                    v-model="form.name"
                    type="text"
                    autocomplete="name"
                    placeholder="Jane Doe"
                    required
                    class="form-input"
                    :disabled="isSubmitting"
                  />
                </label>

                <label for="voucher-email" class="block">
                  <span
                    class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
                  >
                    Email <span class="text-brand-orange">*</span>
                  </span>
                  <input
                    id="voucher-email"
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

                <p
                  v-if="error"
                  class="text-sm text-red-600 flex items-center gap-1"
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
                  class="w-full min-h-[46px] inline-flex items-center justify-center gap-2 bg-[#1C2D5B] hover:bg-brand-orange active:scale-[0.99] text-white py-2.5 px-5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_8px_rgba(28,45,91,0.2)] hover:shadow-[0_5px_12px_rgba(244,147,33,0.3)]"
                  :disabled="isSubmitting || !turnstileVerified"
                >
                  <span v-if="!isSubmitting">Send My Voucher</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg
                      class="animate-spin h-4 w-4 text-white"
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

                <p class="text-[11px] text-gray-500 text-center leading-snug">
                  By submitting, you agree to receive marketing emails from
                  Festive Express.
                </p>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import TurnstileWidget from "~/components/Checkout/TurnstileWidget.vue";

const props = withDefaults(
  defineProps<{
    apiEndpoint?: string;
  }>(),
  {
    apiEndpoint: "/api/voucher",
  },
);

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const isOpen = ref(false);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const error = ref("");
const sentEmail = ref("");

const form = ref({
  name: "",
  email: "",
});

const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null);
const turnstileToken = ref("");
const turnstileVerified = ref(false);
const turnstileStatus = ref("");
const turnstileStatusType = ref("");
const turnstileErrors = ref({ turnstile: "" });

let closeTimer: ReturnType<typeof setTimeout> | null = null;

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

const checkVoucherParams = () => {
  if (route.query.q === "voucher" && route.query.d === "true") {
    isOpen.value = true;
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

      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => close(), 4000);
    } else {
      error.value = response.error || "Something went wrong. Please try again.";

      // If the server rejected due to Turnstile, reset the widget so the user
      // isn't stuck with a "verified" UI + a dead submit button.
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

  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  // remove ?q=voucher&d=true from URL so refresh won't retrigger
  if (route.query.q || route.query.d) {
    const query = { ...route.query };
    delete query.q;
    delete query.d;
    router.replace({ query });
  }
};

watch(() => route.query, checkVoucherParams, { immediate: true });

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer);
});

defineExpose({
  open: () => {
    isOpen.value = true;
  },
  close,
});
</script>

<style scoped>
/* ---------- Inputs (matches your theme) ---------- */
.form-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  font-family: "Poppins", "Arial", sans-serif;
  color: #1c2d5b;
  background-color: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.5rem;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  outline: none;
  appearance: none;
  line-height: 1.4;
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.form-input:hover {
  border-color: #cbd5e1;
}

.form-input:focus {
  background-color: #ffffff;
  border-color: #f49321;
  box-shadow: 0 0 0 3px rgba(244, 147, 33, 0.15);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input[type="text"],
.form-input[type="email"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 44px;
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #1c2d5b;
  -webkit-box-shadow: 0 0 0 1000px #f8fafc inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* ---------- Transitions ---------- */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
    opacity 0.25s ease,
    transform 0.25s ease;
}
.modal-pop-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

/* ---------- Mobile ---------- */
@media (max-width: 640px) {
  .form-input {
    font-size: 1rem;
    padding: 0.7rem 0.85rem;
  }
  .form-input[type="text"],
  .form-input[type="email"] {
    height: 46px;
  }
}
</style>
