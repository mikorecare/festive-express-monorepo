<template>
  <div class="bg-[#1C2D5B] p-8 rounded-xl shadow-sm text-white">
    <span
      class="text-[#F49321] text-xs font-bold uppercase tracking-wider block mb-2"
    >
      Stay Inspired
    </span>
    <h3 class="text-2xl font-bold leading-wide mb-3">
      New Lighting Ideas, By Email
    </h3>
    <p class="text-sm text-gray-300 leading-relaxed mb-4">
      Get an email when we publish a new article.
    </p>

    <!-- Form -->
    <form
      v-if="!isSubscribed"
      @submit.prevent="handleSubscribe"
      class="space-y-4"
    >
      <!-- Name Fields -->
      <div class="flex gap-3">
        <div class="flex-1">
          <label for="nl-first-name" class="sr-only">First Name</label>
          <input
            id="nl-first-name"
            v-model="firstName"
            type="text"
            placeholder="First Name"
            required
            :disabled="subscribing"
            class="w-full px-3.5 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321] disabled:opacity-60"
          />
        </div>
        <div class="flex-1">
          <label for="nl-last-name" class="sr-only">Last Name</label>
          <input
            id="nl-last-name"
            v-model="lastName"
            type="text"
            placeholder="Last Name"
            required
            :disabled="subscribing"
            class="w-full px-3.5 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321] disabled:opacity-60"
          />
        </div>
      </div>

      <!-- Email Field -->
      <div>
        <label for="nl-email" class="sr-only">Email Address</label>
        <input
          id="nl-email"
          v-model="email"
          type="email"
          placeholder="Email address"
          required
          :disabled="subscribing"
          class="w-full px-3.5 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321] disabled:opacity-60"
        />
      </div>

      <!-- Turnstile -->
      <div class="scale-[0.80]">
        <ClientOnly>
          <TurnstileWidget
            v-if="isMounted"
            ref="turnstileRef"
            :id="`newsletter-turnstile-${uniqueId}`"
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
          <template #fallback>
            <div
              class="h-[65px] w-full animate-pulse bg-white/10 rounded-lg"
            ></div>
          </template>
        </ClientOnly>
      </div>

      <button
        type="submit"
        :disabled="
          !isTurnstileVerified ||
          subscribing ||
          !email ||
          !firstName ||
          !lastName
        "
        class="w-full bg-[#F49321] hover:bg-[#e07e0e] text-white font-bold px-2 py-2 rounded-lg transition-colors text-sm uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ subscribing ? "Subscribing..." : "Subscribe" }}
      </button>
    </form>

    <!-- Success State -->
    <div
      v-else
      class="bg-emerald-500/20 border border-emerald-500 text-emerald-100 p-4 rounded-lg text-sm font-semibold text-center"
    >
      You're in! Check your inbox to confirm.
    </div>

    <p
      class="text-[10px] font-bold text-slate-400 text-center leading-snug mt-4"
    >
      By subscribing, you agree that Festive Express may send you our latest
      stories, blog posts, and occasional updates.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useNewsletter } from "#imports";
import TurnstileWidget from "../Checkout/TurnstileWidget.vue";

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const { subscribe: subscribeApi, subscribing, isSubscribed } = useNewsletter();
const { showToast } = useToast();

const firstName = ref("");
const lastName = ref("");
const email = ref("");

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;
const uniqueId = useId();

const turnstileRef = ref<any>(null);
const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const turnstileStatus = ref("");
const turnstileStatusType = ref("");
const turnstileErrors = ref({ turnstile: "" });

const onTurnstileSuccess = (token: string) => {
  turnstileToken.value = token;
  isTurnstileVerified.value = true;
  turnstileStatus.value = "Verification successful!";
  turnstileStatusType.value = "success";
  turnstileErrors.value.turnstile = "";
};

const onTurnstileError = () => {
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  turnstileErrors.value.turnstile = "Please complete the security verification";
  turnstileToken.value = "";
  isTurnstileVerified.value = false;
};

const onTurnstileExpired = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  turnstileErrors.value.turnstile = "Verification expired. Please try again.";
  if (turnstileRef.value) turnstileRef.value.reset();
};

const turnstileStatusClass = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "warning":
      return "text-yellow-400";
    default:
      return "text-gray-400";
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

const handleSubscribe = async () => {
  if (!email.value || !firstName.value || !lastName.value) return;

  // 1. Check if the widget has fired success
  if (!isTurnstileVerified.value) {
    showToast("Please wait for the security check to complete.", "error");
    return;
  }

  if (!turnstileToken.value) {
    showToast("Security token missing. Please refresh the page.", "error");
    return;
  }

  try {
    await subscribeApi(
      email.value,
      firstName.value,
      lastName.value,
      turnstileToken.value,
    );
    showToast("Subscribed successfully!", "success");
  } catch (error: any) {
    showToast(error.message || "Failed to subscribe", "error");

    isTurnstileVerified.value = false;
    turnstileToken.value = "";
    if (turnstileRef.value) turnstileRef.value.reset();
  }
};
</script>
