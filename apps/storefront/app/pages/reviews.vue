<template>
  <div class="min-h-screen bg-gradient-to-b from-[#fef9f4] to-[#f3f4f6] py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-20">
        <div
          class="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-500">Loading your survey...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-white rounded-2xl p-12 text-center shadow-sm"
      >
        <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
        <h3 class="text-xl font-bold text-[#0c2340] mb-2">{{ error.title }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ error.message }}</p>
        <NuxtLink
          to="/"
          class="inline-block bg-[#F49322] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#e07e0e] transition-colors no-underline"
        >
          Go to Home
        </NuxtLink>
      </div>

      <!-- Survey -->
      <div v-else-if="review" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="text-center mb-8">
          <div
            class="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold mb-4"
          >
            <i class="fas fa-check-circle mr-2"></i> Share Your Experience
          </div>
          <h1 class="text-3xl font-bold text-[#0c2340]">
            We'd Love Your Feedback!
          </h1>
          <p class="text-gray-500 mt-2">
            Order #{{ review.order_number }} &bull; Thank you,
            {{ review.customer_name }}!
          </p>
          <p class="text-sm text-gray-400 mt-1">
            This survey expires
            <strong class="text-brand-orange">{{ formatExpiry }}</strong>
          </p>
        </div>

        <!-- Intro Paragraph -->
        <div
          class="mb-8 p-6 bg-brand-orange/5 rounded-xl border-l-4 border-brand-orange"
        >
          <p class="text-slate-700 text-base leading-relaxed">
            To help us improve our services and provide you with the best
            possible experience, we value your honest feedback. Please take a
            moment to share your thoughts about your experience with Festive
            Express. Your responses help us create more magical moments for
            families like yours!
          </p>
        </div>

        <div class="border-t border-gray-200 pt-8">
          <form @submit.prevent="submitSurvey">
            <div class="space-y-8">
              <!-- Question 1: Overall Rating -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-3"
                >
                  How would you rate your overall experience? *
                </label>
                <div class="flex gap-3 justify-center">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="transition-all hover:scale-110 focus:outline-none"
                    @mouseenter="hoverOverall = star"
                    @mouseleave="hoverOverall = 0"
                    @click="form.rating_overall = star"
                  >
                    <FestiveLightBulb
                      :filled="
                        form.rating_overall >= star || hoverOverall >= star
                      "
                      class="w-12 h-12"
                    />
                  </button>
                </div>
                <p class="text-center text-sm text-gray-500 mt-2">
                  {{ getRatingLabel(form.rating_overall) }}
                </p>
              </div>

              <!-- Question 2: Installation Process -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-3"
                >
                  How would you rate the installation process?
                </label>
                <div class="flex gap-3 justify-center">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="transition-all hover:scale-110 focus:outline-none"
                    @mouseenter="hoverInstallation = star"
                    @mouseleave="hoverInstallation = 0"
                    @click="form.rating_installation = star"
                  >
                    <FestiveLightBulb
                      :filled="
                        form.rating_installation >= star ||
                        hoverInstallation >= star
                      "
                      class="w-12 h-12"
                    />
                  </button>
                </div>
                <p class="text-center text-sm text-gray-500 mt-2">
                  {{ getRatingLabel(form.rating_installation) }}
                </p>
              </div>

              <!-- Question 3: Comments about Installation -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-2"
                >
                  What did you think about the installation process?
                </label>
                <p class="text-sm text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_installation"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y"
                  rows="3"
                  placeholder="Share your thoughts about the installation..."
                ></textarea>
              </div>

              <!-- Question 4: Technicians Rating -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-3"
                >
                  How would you rate our technicians and carpenters?
                </label>
                <div class="flex gap-3 justify-center">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="transition-all hover:scale-110 focus:outline-none"
                    @mouseenter="hoverTechnicians = star"
                    @mouseleave="hoverTechnicians = 0"
                    @click="form.rating_technicians = star"
                  >
                    <FestiveLightBulb
                      :filled="
                        form.rating_technicians >= star ||
                        hoverTechnicians >= star
                      "
                      class="w-12 h-12"
                    />
                  </button>
                </div>
                <p class="text-center text-sm text-gray-500 mt-2">
                  {{ getRatingLabel(form.rating_technicians) }}
                </p>
              </div>

              <!-- Question 5: Comments about Team -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-2"
                >
                  How was your experience with our team?
                </label>
                <p class="text-sm text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_technicians"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y"
                  rows="3"
                  placeholder="Tell us about your experience with our team..."
                ></textarea>
              </div>

              <!-- Question 6: Additional Comments -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-2"
                >
                  Any additional feedback or suggestions?
                </label>
                <p class="text-sm text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_additional"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y"
                  rows="3"
                  placeholder="Anything else you'd like to share..."
                ></textarea>
              </div>

              <!-- Question 7: Would Recommend -->
              <div class="bg-gray-50 rounded-xl p-6">
                <label
                  class="block text-base font-semibold text-[#0c2340] mb-3"
                >
                  Would you recommend Festive Express to family and friends?
                </label>
                <div class="flex gap-6 justify-center">
                  <label
                    class="flex items-center gap-3 cursor-pointer hover:text-brand-orange transition-colors"
                  >
                    <input
                      type="radio"
                      v-model="form.would_recommend"
                      :value="true"
                      class="w-5 h-5 text-brand-orange"
                    />
                    <span class="text-lg">Yes, absolutely!</span>
                  </label>
                  <label
                    class="flex items-center gap-3 cursor-pointer hover:text-brand-orange transition-colors"
                  >
                    <input
                      type="radio"
                      v-model="form.would_recommend"
                      :value="false"
                      class="w-5 h-5 text-brand-orange"
                    />
                    <span class="text-lg">No</span>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-[#F49322] text-white font-bold py-4 rounded-xl hover:bg-[#e07e0e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                :disabled="!form.rating_overall || isSubmitting"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                {{ isSubmitting ? "Submitting..." : "Submit Feedback" }}
              </button>

              <p class="text-xs text-gray-400 text-center">
                <i class="fas fa-lock mr-1"></i> Your feedback is secure and
                anonymous
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FestiveLightBulb from "~/components/shared/FestiveLightBulb.vue";

const route = useRoute();
const config = useRuntimeConfig();

const token = ref((route.query.token as string) || "");
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<{ title: string; message: string } | null>(null);
const review = ref<any>(null);

// Hover states for each rating
const hoverOverall = ref(0);
const hoverInstallation = ref(0);
const hoverTechnicians = ref(0);

const form = ref({
  rating_overall: 0,
  rating_installation: 0,
  rating_technicians: 0,
  comments_installation: "",
  comments_technicians: "",
  comments_additional: "",
  would_recommend: null as boolean | null,
});

const formatExpiry = computed(() => {
  if (!review.value?.expires_at) return "";
  return new Date(review.value.expires_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const getRatingLabel = (rating: number) => {
  const labels: Record<number, string> = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent!",
  };
  return labels[rating] || "";
};

const submitSurvey = async () => {
  if (!form.value.rating_overall) {
    alert("Please provide an overall rating");
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/api/survey/submit", {
      method: "POST",
      body: {
        token: token.value,
        rating_overall: form.value.rating_overall,
        rating_installation: form.value.rating_installation || null,
        rating_technicians: form.value.rating_technicians || null,
        comments_installation: form.value.comments_installation || null,
        comments_technicians: form.value.comments_technicians || null,
        comments_additional: form.value.comments_additional || null,
        would_recommend: form.value.would_recommend,
      },
    });

    alert("Thank you for your valuable feedback!");
    navigateTo("/");
  } catch (err: any) {
    alert(err.data?.message || "Failed to submit feedback. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (!token.value) {
    error.value = {
      title: "Invalid Survey Link",
      message: "No survey token provided.",
    };
    isLoading.value = false;
    return;
  }

  try {
    const res = (await $fetch(`/survey/validate?token=${token.value}`, {
      baseURL: config.public.apiBase,
    })) as any;

    if (res.success) {
      review.value = res.review;
    }
  } catch (err: any) {
    if (err.statusCode === 410) {
      error.value = {
        title: "Survey Expired",
        message: "This survey has expired. Links are valid for 72 hours.",
      };
    } else if (err.statusCode === 400) {
      error.value = {
        title: "Already Completed",
        message: "You have already completed this survey. Thank you!",
      };
    } else {
      error.value = {
        title: "Invalid Link",
        message: err.message || "Something went wrong. Please try again.",
      };
    }
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "Share Your Experience - Festive Express",
});
</script>
