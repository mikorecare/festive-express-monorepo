<template>
  <div class="relative w-full max-w-[600px] mx-auto">
    <!-- Success message -->
    <Transition name="fade">
      <div
        v-if="stage >= 4"
        class="absolute inset-x-0 top-0 z-10 text-center py-6"
      >
        <p class="text-slate-600 text-lg tracking-wide">
          Thank you! We'll get back to you in a
          <span class="text-brand-orange font-bold">FLASH</span>.
        </p>
        <button
          type="button"
          class="mt-4 text-sm text-[#1C2D5B] underline hover:text-brand-orange transition-colors"
          @click="resetForm"
        >
          Send another message
        </button>
      </div>
    </Transition>

    <!-- Skeleton placeholder (invisible, keeps layout height while submitting) -->
    <div
      v-if="isSubmitting"
      aria-hidden="true"
      class="opacity-0 pointer-events-none"
    >
      <div
        class="bg-white rounded-xl shadow-lg border-4 border-brand-orange overflow-hidden"
      >
        <div class="bg-navy h-[120px]"></div>
        <div class="p-5 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="h-[52px] bg-gray-200 rounded-lg"></div>
            <div class="h-[52px] bg-gray-200 rounded-lg"></div>
          </div>
          <div class="h-[52px] bg-gray-200 rounded-lg"></div>
          <div class="h-[52px] bg-gray-200 rounded-lg"></div>
          <div class="h-[140px] bg-gray-200 rounded-lg"></div>
          <div class="h-[65px] bg-gray-200 rounded-lg"></div>
          <div class="h-[56px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form
      v-else-if="stage < 4"
      role="form"
      aria-label="Contact form"
      @submit.prevent="submitForm"
      class="relative bg-white rounded-xl shadow-lg border-4 border-[#1C2D5B] overflow-hidden"
    >
      <!-- Form header -->
      <div class="text-center bg-[#1C2D5B] py-4 px-4">
        <h3 class="text-xl sm:text-2xl font-bold text-white mb-1">
          {{ headerTitle }}
        </h3>
        <p class="text-brand-orange text-sm sm:text-base">
          {{ headerSubtitle }}
        </p>
      </div>

      <!-- Fields -->
      <div class="p-4 sm:p-5 space-y-4 sm:space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <input
            v-model="form.firstName"
            type="text"
            autocomplete="given-name"
            placeholder="First Name *"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
          />
          <input
            v-model="form.lastName"
            type="text"
            autocomplete="family-name"
            placeholder="Last Name *"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
          />
        </div>

        <input
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          placeholder="Phone *"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
        />

        <input
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="Email *"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
        />

        <textarea
          v-model="form.message"
          placeholder="Message *"
          rows="5"
          required
          data-gramm="false"
          data-gramm-false="true"
          spellcheck="false"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-base"
        ></textarea>

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
          class="bg-navy hover:bg-brand-orange text-white py-3.5 px-6 rounded-lg text-lg font-semibold w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting || !turnstileVerified"
        >
          <span v-if="!isSubmitting">{{ submitLabel }}</span>
          <span v-else class="flex items-center justify-center gap-2">
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

      // Reset the Turnstile widget for a fresh challenge
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
input,
textarea {
  font-family: "Poppins", "Arial", sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
