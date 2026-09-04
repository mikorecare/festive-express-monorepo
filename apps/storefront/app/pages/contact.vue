<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade><span class="text-brand-orange">Contact</span> Us</h1>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-12 lg:py-20 mb-5">
      <div class="flex flex-col items-center">
        <!-- Get In Touch Card - Centered -->
        <div
          class="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-navy-600 border-4 hover:shadow-[0_20px_40px_rgba(28,45,91,0.08)] transition-all duration-300 pt-10 pb-6 px-6 text-center w-full max-w-[400px] mx-auto mb-32"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/95 to-white/80"
          ></div>

          <div class="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
            <div
              class="w-14 h-14 rounded-full bg-brand-orange border-4 border-white flex items-center justify-center shadow-lg shadow-brand-orange/20"
            >
              <svg
                class="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
          </div>

          <div class="relative z-10">
            <h2
              class="text-XL font-semibold text-navy uppercase tracking-wider mb-2 mt-2"
            >
              Get In Touch
            </h2>
            <div class="text-navy/70 text-sm leading-relaxed space-y-1">
              <p class="font-semibold text-brand-orange">
                {{ settings.contact_phone_display || "(941) 239-4722" }}
              </p>
              <a
                :href="`mailto:${settings.contact_email}`"
                class="text-navy/60 hover:text-brand-orange transition-colors block"
              >
                {{ settings.contact_email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="w-full max-w-[600px]">
          <div class="relative min-h-max">
            <div v-if="stage >= 4" class="message-success animate-fadeIn">
              <p class="text-slate-600 text-lg pb-4 tracking-wide text-center">
                Thank you! We'll get back to you in a
                <span class="text-brand-orange">FLASH</span>.
              </p>
            </div>

            <div class="envelope-scene">
              <div
                class="envelope-wrapper"
                :class="{ 'envelope-visible': stage >= 1 }"
              >
                <div class="envelope-circle-shadow"></div>
                <div class="envelope-back"></div>
                <div class="envelope-shadow"></div>
                <div
                  class="envelope-front"
                  :class="{ 'envelope-front-visible': stage >= 1 }"
                ></div>
                <div
                  class="envelope-flap"
                  :class="{
                    'envelope-flap-visible': stage >= 1,
                    'envelope-flap-closed': stage >= 3,
                  }"
                ></div>
              </div>

              <form
                v-if="stage < 4"
                @submit.prevent="submitForm"
                class="contact-form bg-white rounded-xl shadow-lg p-8 space-y-5"
                :class="{
                  'contact-form-sending': stage >= 1,
                  'contact-form-inserted': stage >= 2,
                }"
              >
                <div
                  class="transition-all duration-500 text-center"
                  :class="{ 'opacity-0 pointer-events-none': stage >= 1 }"
                >
                  <h3 class="text-2xl font-bold text-navy mb-1">
                    Let's connect today.
                  </h3>
                  <p class="mb-[30px] text-navy">We're here to guide you.</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="First Name *"
                    required
                    class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  />
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Last Name *"
                    required
                    class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  />
                </div>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Phone *"
                  required
                  class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                />
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email *"
                  required
                  class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                />
                <textarea
                  v-model="form.message"
                  placeholder="Message *"
                  rows="5"
                  required
                  class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-base"
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
                  <span v-if="!isSubmitting">Send a Message</span>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TurnstileWidget from "~/components/Checkout/TurnstileWidget.vue";

const { settings } = useSettings();

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
const siteKey = config.public.turnstile.siteKey;

const turnstileRef = ref(null);
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

const onTurnstileSuccess = (token) => {
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitForm = async () => {
  if (isSubmitting.value) return;
  if (!turnstileVerified.value || !turnstileToken.value) {
    alert("Please complete the security verification first.");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/contact-us", {
      method: "POST",
      body: {
        ...form.value,
        turnstileToken: turnstileToken.value,
      },
    });

    if (response.success) {
      stage.value = 1;
      await sleep(900);
      stage.value = 2;
      await sleep(900);
      stage.value = 3;
      await sleep(800);
      stage.value = 4;

      form.value = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      };
    } else {
      alert(response.error || "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Network error. Please try again.");
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
};
</script>

<style scoped>
.envelope-scene {
  position: relative;
  width: 100%;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.envelope-wrapper {
  position: absolute;
  width: 600px;
  height: 340px;
  top: 30%;
  left: 50%;
  margin-left: -300px;
  margin-top: -170px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.45s ease,
    visibility 0s linear 0.45s;
}

.envelope-visible {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.45s ease,
    visibility 0s linear 0s;
}

.envelope-circle-shadow {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 40px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.envelope-visible .envelope-circle-shadow {
  opacity: 1;
}

.envelope-back {
  position: absolute;
  inset: 0;
  background: #1c2d5b;
  border: 6px solid #f49321;
  border-radius: 14px;
  z-index: 1;
  box-shadow: 0 16px 40px rgba(28, 45, 91, 0.25);
}

.envelope-back::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 20%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.15) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.envelope-shadow {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 30%,
    rgba(0, 0, 0, 0) 70%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.envelope-front {
  position: absolute;
  inset: 0;
  background: #1c2d5b;
  border: 6px solid #f49321;
  border-top: none;
  clip-path: polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%);
  border-radius: 0 0 14px 14px;
  opacity: 0;
  z-index: 20;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.envelope-front-visible {
  opacity: 1;
}

.envelope-flap {
  position: absolute;
  top: 0px;
  left: -6px;
  width: calc(100% + 10px);
  height: calc(52% + 12px);
  background: #f49321;
  clip-path: polygon(1% 0, 100% 0, 50% 100%);
  border-radius: 8px 8px 0 0;
  transform-origin: top center;
  transform: rotateX(180deg);
  opacity: 0;
  z-index: 30;
  pointer-events: none;
  backface-visibility: hidden;
  transition:
    transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}

.envelope-flap-inner {
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: #1c2d5b;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  border-radius: 14px 14px 0 0;
}

.envelope-flap-visible {
  opacity: 1;
}

.envelope-flap-closed {
  transform: rotateX(0deg);
  opacity: 1;
  z-index: 30;
}

.contact-form {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  z-index: 50;
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
  transition:
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
}

.contact-form-sending {
  transform: translateY(-300px) scale(0.55);
  pointer-events: none;
  z-index: 50;
}

.contact-form-inserted {
  transform: translateY(-160px) scale(0.48);
  pointer-events: none;
  z-index: 5;
  opacity: 1;
}

.message-success {
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: -5px;
  padding-top: 0;
  z-index: 50;
  color: #1c2d5b;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

@media (max-width: 640px) {
  .envelope-scene {
    height: 480px;
  }
  .envelope-wrapper {
    width: 380px;
    height: 240px;
    top: 22%;
    margin-left: -190px;
    margin-top: -120px;
  }
  .envelope-back {
    border-width: 4px;
  }
  .envelope-front {
    border-width: 4px;
  }
  .envelope-flap {
    border-width: 4px;
  }
  .envelope-circle-shadow {
    bottom: -20px;
    width: 70%;
    height: 30px;
  }
  .contact-form {
    max-width: 100%;
  }
  .contact-form-sending {
    transform: translateY(-200px) scale(0.5);
  }
  .contact-form-inserted {
    transform: translateY(-130px) scale(0.42);
  }
}
</style>
