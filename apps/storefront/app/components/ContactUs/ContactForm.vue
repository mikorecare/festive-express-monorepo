<template>
  <div class="relative w-full max-w-[600px] mx-auto">
    <!-- Success state -->
    <Transition name="fade">
      <div
        v-if="stage >= 4"
        class="bg-white rounded-xl shadow-lg border-4 border-[#1C2D5B] overflow-hidden"
      >
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
          <h3 class="text-lg sm:text-xl font-bold text-white mb-1">
            Message Sent!
          </h3>
          <p class="text-white/90 text-sm">
            Thank you! We'll get back to you in a
            <span class="text-brand-orange font-bold">FLASH</span>.
          </p>
        </div>
        <div class="p-3.5 sm:p-4 text-center">
          <button
            type="button"
            class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#1C2D5B] text-[#1C2D5B] font-semibold text-sm hover:bg-[#1C2D5B] hover:text-white transition-colors"
            @click="resetForm"
          >
            Send another message
          </button>
        </div>
      </div>
    </Transition>

    <!-- Skeleton (keeps height while submitting) -->
    <div
      v-if="isSubmitting"
      aria-hidden="true"
      class="opacity-0 pointer-events-none"
    >
      <div
        class="bg-white rounded-xl shadow-lg border-4 border-brand-orange overflow-hidden"
      >
        <div class="bg-[#1C2D5B] h-[100px]"></div>
        <div class="p-3.5 sm:p-4 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="h-[44px] bg-gray-200 rounded-lg"></div>
            <div class="h-[44px] bg-gray-200 rounded-lg"></div>
          </div>
          <div class="h-[44px] bg-gray-200 rounded-lg"></div>
          <div class="h-[44px] bg-gray-200 rounded-lg"></div>
          <div class="h-[110px] bg-gray-200 rounded-lg"></div>
          <div class="h-[60px] bg-gray-200 rounded-lg"></div>
          <div class="h-[46px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form
      v-else-if="stage < 4"
      aria-label="Contact form"
      @submit.prevent="submitForm"
      class="relative bg-white rounded-xl shadow-lg border-4 border-[#1C2D5B] overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-[#1C2D5B] py-3.5 px-4 text-center">
        <h3
          class="text-lg sm:text-xl font-bold text-white mb-0.5 leading-tight"
        >
          {{ headerTitle }}
        </h3>
        <p class="text-brand-orange text-xs sm:text-sm font-medium">
          {{ headerSubtitle }}
        </p>
      </div>

      <!-- Fields -->
      <div class="p-3.5 sm:p-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label for="firstName" class="block">
            <span
              class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
            >
              First Name <span class="text-brand-orange">*</span>
            </span>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              placeholder="Jane"
              required
              class="form-input"
            />
          </label>

          <label for="lastName" class="block">
            <span
              class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
            >
              Last Name <span class="text-brand-orange">*</span>
            </span>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              required
              class="form-input"
            />
          </label>
        </div>

        <label for="phone" class="block">
          <span
            class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
          >
            Phone <span class="text-brand-orange">*</span>
          </span>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            inputmode="tel"
            placeholder="(555) 123-4567"
            required
            class="form-input"
          />
        </label>

        <label for="email" class="block">
          <span
            class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
          >
            Email <span class="text-brand-orange">*</span>
          </span>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            inputmode="email"
            placeholder="jane@example.com"
            required
            class="form-input"
          />
        </label>

        <label for="message" class="block">
          <span
            class="block text-xs font-semibold text-[#1C2D5B] uppercase tracking-wide mb-1"
          >
            Message <span class="text-brand-orange">*</span>
          </span>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="How can we help you?"
            rows="4"
            required
            data-gramm="false"
            data-gramm-false="true"
            spellcheck="false"
            class="form-input resize-y"
          ></textarea>
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

        <button
          type="submit"
          class="w-full min-h-[46px] inline-flex items-center justify-center gap-2 bg-[#1C2D5B] hover:bg-brand-orange active:scale-[0.99] text-white py-2.5 px-5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_8px_rgba(28,45,91,0.2)] hover:shadow-[0_5px_12px_rgba(244,147,33,0.3)]"
          :disabled="isSubmitting || !turnstileVerified"
        >
          <span v-if="!isSubmitting">{{ submitLabel }}</span>
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
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import TurnstileWidget from "~/components/Checkout/TurnstileWidget.vue";

const props = withDefaults(
  defineProps<{
    headerTitle?: string;
    headerSubtitle?: string;
    submitLabel?: string;
    apiEndpoint?: string;
  }>(),
  {
    headerTitle: "Let's Connect Today",
    headerSubtitle: "We're here to guide you.",
    submitLabel: "Send a Message",
    apiEndpoint: "/api/contact-us",
  },
);

const emit = defineEmits<{
  (e: "success", payload: any): void;
  (e: "error", error: any): void;
}>();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
});

const stage = ref(0);
const isSubmitting = ref(false);

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

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
  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  if (!turnstileVerified.value || !turnstileToken.value) {
    alert("Please complete the security verification first.");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<{ success: boolean; error?: string }>(
      props.apiEndpoint,
      {
        method: "POST",
        body: {
          ...form.value,
          turnstileToken: turnstileToken.value,
        },
      },
    );

    if (response.success) {
      stage.value = 4;

      emit("success", { ...form.value });

      form.value = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      };

      if (turnstileRef.value) {
        turnstileRef.value.reset();
      }
      turnstileVerified.value = false;
      turnstileToken.value = "";
    } else {
      const msg = response.error || "Something went wrong. Please try again.";
      alert(msg);
      emit("error", msg);
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Network error. Please try again.");
    emit("error", err);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  stage.value = 0;
  form.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };
  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
  turnstileVerified.value = false;
  turnstileToken.value = "";
};

defineExpose({
  reset: resetForm,
});
</script>

<style scoped>
/* ---------- Inputs ---------- */
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
.form-input[type="tel"],
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

textarea.form-input {
  resize: vertical;
  line-height: 1.45;
  min-height: 100px;
  padding-top: 0.55rem;
}

/* ---------- Transition ---------- */
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

/* ---------- Mobile ---------- */
@media (max-width: 640px) {
  /* Keep 16px on mobile so iOS Safari doesn't zoom on focus */
  .form-input {
    font-size: 1rem;
    padding: 0.7rem 0.85rem;
  }

  .form-input[type="text"],
  .form-input[type="tel"],
  .form-input[type="email"] {
    height: 46px;
  }

  textarea.form-input {
    min-height: 100px;
  }
}
</style>
