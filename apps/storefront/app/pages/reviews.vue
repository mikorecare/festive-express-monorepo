<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#fef9f4] to-[#f3f4f6] py-6 md:py-12"
  >
    <div class="w-full mx-auto px-4 lg:px-[84px] max-w-[2048px]">
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
        class="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm"
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
      <div
        v-else-if="review"
        class="bg-white rounded-2xl p-6 md:p-10 lg:p-16 xl:p-24"
      >
        <!-- Header Section with Mascot -->
        <div
          class="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 mb-6"
        >
          <!-- Left Content -->
          <div class="flex-1 flex flex-col justify-between w-full md:h-[264px]">
            <!-- Top Section -->
            <div class="flex flex-col items-center md:items-start">
              <p
                class="text-2xl md:text-[50px] font-semibold text-[#0c2340] mb-1 text-center md:text-left leading-tight"
              >
                Thank you, {{ review.customer_name }}!
              </p>
              <p
                class="text-lg md:text-[32px] text-black text-center md:text-left leading-tight"
              >
                Order #{{ review.order_number }}
              </p>
            </div>

            <!-- Bottom Section -->
            <div class="mt-4 md:mt-0">
              <div
                class="flex flex-col items-center md:items-start gap-2 md:gap-3"
              >
                <p
                  class="text-lg md:text-[32px] font-bold text-[#0c2340] text-center md:text-left leading-tight"
                >
                  Share your experience
                </p>
                <h1
                  class="text-2xl md:text-[50px] font-bold text-[#F39124] text-center md:text-left leading-tight"
                >
                  We'd Love Your Feedback!
                </h1>
              </div>
            </div>
          </div>

          <!-- Right Content - Mascot Image -->
          <div class="flex-shrink-0 mx-auto md:mx-0">
            <img
              src="/Images/reviews/review-mascot.png"
              alt="Review Mascot"
              class="h-[150px] md:h-[264px] w-auto object-contain"
            />
          </div>
        </div>

        <!-- Intro Paragraph -->
        <div>
          <p
            class="text-base md:text-[32px] text-slate-700 leading-relaxed text-justify"
          >
            To help us improve our services and provide you with the best
            possible experience, we value your honest feedback. Please take a
            moment to share your thoughts about your experience with Festive
            Express. Your responses help us create more magical moments for
            families like yours!
          </p>
        </div>

        <div class="border-t border-gray-200 pt-6 md:pt-8">
          <form @submit.prevent="submitSurvey">
            <div class="space-y-6 md:space-y-8">
              <!-- Question 1: Overall Rating -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border-2 transition-colors duration-200"
                :class="
                  form.rating_overall > 0
                    ? 'border-[#F39124]'
                    : 'border-gray-200'
                "
              >
                <div
                  class="flex flex-col md:flex-row items-center gap-4 md:gap-8"
                >
                  <!-- Left: Label -->
                  <div class="flex-1 w-full md:w-1/2">
                    <label
                      class="block text-base md:text-[32px] font-semibold transition-colors duration-200 text-left leading-tight"
                      :class="
                        form.rating_overall > 0
                          ? 'text-[#F39124]'
                          : 'text-[#0c2340]'
                      "
                    >
                      How would you rate your overall experience?
                      <span class="text-red-400">*</span>
                    </label>
                  </div>

                  <!-- Right: Stars with Labels -->
                  <div class="flex-1 w-full md:w-1/2">
                    <div
                      class="flex justify-between items-center space-x-1 md:space-x-0"
                    >
                      <div
                        v-for="star in 5"
                        :key="star"
                        class="flex flex-col items-center flex-1"
                      >
                        <button
                          type="button"
                          class="transition-all hover:scale-110 focus:outline-none"
                          @mouseenter="hoverOverall = star"
                          @mouseleave="hoverOverall = 0"
                          @click="form.rating_overall = star"
                        >
                          <img
                            :src="
                              getStarImage(
                                star,
                                form.rating_overall,
                                hoverOverall,
                              )
                            "
                            :alt="`${star} star`"
                            class="h-[36px] md:h-[120px] w-auto object-contain"
                          />
                        </button>
                        <span
                          class="text-[8px] md:text-sm mt-1 text-center whitespace-nowrap transition-colors duration-200"
                          :class="
                            form.rating_overall === star
                              ? 'text-[#F39124] font-semibold'
                              : 'text-gray-500'
                          "
                        >
                          {{ getRatingLabel(star) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Question 2: Installation Process -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border-2 transition-colors duration-200"
                :class="
                  form.rating_installation > 0
                    ? 'border-[#F39124]'
                    : 'border-gray-200'
                "
              >
                <div
                  class="flex flex-col md:flex-row items-center gap-4 md:gap-8"
                >
                  <!-- Left: Label -->
                  <div class="flex-1 w-full md:w-1/2">
                    <label
                      class="block text-base md:text-[32px] font-semibold transition-colors duration-200 text-left leading-tight"
                      :class="
                        form.rating_installation > 0
                          ? 'text-[#F39124]'
                          : 'text-[#0c2340]'
                      "
                    >
                      How would you rate the installation process?
                    </label>
                  </div>

                  <!-- Right: Stars with Labels -->
                  <div class="flex-1 w-full md:w-1/2">
                    <div
                      class="flex justify-between items-center space-x-1 md:space-x-0"
                    >
                      <div
                        v-for="star in 5"
                        :key="star"
                        class="flex flex-col items-center flex-1"
                      >
                        <button
                          type="button"
                          class="transition-all hover:scale-110 focus:outline-none"
                          @mouseenter="hoverInstallation = star"
                          @mouseleave="hoverInstallation = 0"
                          @click="form.rating_installation = star"
                        >
                          <img
                            :src="
                              getStarImage(
                                star,
                                form.rating_installation,
                                hoverInstallation,
                              )
                            "
                            :alt="`${star} star`"
                            class="h-[36px] md:h-[120px] w-auto object-contain"
                          />
                        </button>
                        <span
                          class="text-[8px] md:text-sm mt-1 text-center whitespace-nowrap transition-colors duration-200"
                          :class="
                            form.rating_installation === star
                              ? 'text-[#F39124] font-semibold'
                              : 'text-gray-500'
                          "
                        >
                          {{ getRatingLabel(star) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Question 3: Comments about Installation -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border border-gray-200"
              >
                <label
                  class="block text-base md:text-[32px] font-semibold text-[#0c2340] mb-2 leading-tight text-left"
                >
                  What did you think about the installation process?
                </label>
                <p class="text-sm md:text-base text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_installation"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y text-sm md:text-[32px]"
                  rows="4"
                  placeholder="Share your thoughts about the installation..."
                ></textarea>
              </div>

              <!-- Question 4: Technicians Rating -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border-2 transition-colors duration-200"
                :class="
                  form.rating_technicians > 0
                    ? 'border-[#F39124]'
                    : 'border-gray-200'
                "
              >
                <div
                  class="flex flex-col md:flex-row items-center gap-4 md:gap-8"
                >
                  <!-- Left: Label -->
                  <div class="flex-1 w-full md:w-1/2">
                    <label
                      class="block text-base md:text-[32px] font-semibold transition-colors duration-200 text-left leading-tight"
                      :class="
                        form.rating_technicians > 0
                          ? 'text-[#F39124]'
                          : 'text-[#0c2340]'
                      "
                    >
                      How would you rate our technicians and carpenters?
                    </label>
                  </div>

                  <!-- Right: Stars with Labels -->
                  <div class="flex-1 w-full md:w-1/2">
                    <div
                      class="flex justify-between items-center space-x-1 md:space-x-0"
                    >
                      <div
                        v-for="star in 5"
                        :key="star"
                        class="flex flex-col items-center flex-1"
                      >
                        <button
                          type="button"
                          class="transition-all hover:scale-110 focus:outline-none"
                          @mouseenter="hoverTechnicians = star"
                          @mouseleave="hoverTechnicians = 0"
                          @click="form.rating_technicians = star"
                        >
                          <img
                            :src="
                              getStarImage(
                                star,
                                form.rating_technicians,
                                hoverTechnicians,
                              )
                            "
                            :alt="`${star} star`"
                            class="h-[36px] md:h-[120px] w-auto object-contain"
                          />
                        </button>
                        <span
                          class="text-[8px] md:text-sm mt-1 text-center whitespace-nowrap transition-colors duration-200"
                          :class="
                            form.rating_technicians === star
                              ? 'text-[#F39124] font-semibold'
                              : 'text-gray-500'
                          "
                        >
                          {{ getRatingLabel(star) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Question 5: Comments about Team -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border border-gray-200"
              >
                <label
                  class="block text-base md:text-[32px] font-semibold text-[#0c2340] mb-2 leading-tight text-left"
                >
                  How was your experience with our team?
                </label>
                <p class="text-sm md:text-base text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_technicians"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y text-sm md:text-[32px]"
                  rows="4"
                  placeholder="Tell us about your experience with our team..."
                ></textarea>
              </div>

              <!-- Question 6: Additional Comments -->
              <div
                class="bg-gray-50 rounded-xl p-4 md:!p-12 lg:!p-16 border border-gray-200"
              >
                <label
                  class="block text-base md:text-[32px] font-semibold text-[#0c2340] mb-2 leading-tight text-left"
                >
                  Any additional feedback or suggestions?
                </label>
                <p class="text-sm md:text-base text-gray-400 mb-3">Optional</p>
                <textarea
                  v-model="form.comments_additional"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y text-sm md:text-[32px]"
                  rows="4"
                  placeholder="Anything else you'd like to share..."
                ></textarea>
              </div>

              <!-- Question 7: Would Recommend -->
              <div
                class="bg-[#0c2340] rounded-[36px] md:!h-[489px] border-[9px] border-[#F39124] flex flex-col justify-center items-center py-8 md:!py-0 px-6 md:!px-12 lg:!px-16"
              >
                <label
                  class="block text-base md:text-[32px] text-center font-normal text-white mb-4 md:mb-8 leading-tight"
                >
                  Would you recommend Festive Express to family and friends?
                </label>
                <div
                  class="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center"
                >
                  <div class="relative">
                    <button
                      type="button"
                      class="w-full sm:w-auto px-8 md:!px-12 lg:!px-16 py-3 md:!py-5 lg:!py-6 rounded-full font-normal text-white transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-[32px]"
                      :class="
                        form.would_recommend === true
                          ? 'bg-[#F39124] font-semibold'
                          : 'bg-[#F39124]'
                      "
                      @click="form.would_recommend = true"
                    >
                      Yes, absolutely!
                      <span
                        v-if="form.would_recommend === true"
                        class="text-white"
                        >✓</span
                      >
                    </button>
                    <img
                      v-if="form.would_recommend === true"
                      src="/Images/Holiday-Lighting-Package/starburst.png"
                      alt="Starburst"
                      class="absolute -top-4 -right-5 w-12 h-12 md:w-15 md:h-15 object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    class="w-full sm:w-auto px-8 md:!px-12 lg:!px-16 py-3 md:!py-5 lg:!py-6 rounded-full font-normal text-white transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-[32px]"
                    :class="
                      form.would_recommend === false
                        ? 'bg-gray-600 font-semibold'
                        : 'bg-gray-400'
                    "
                    @click="form.would_recommend = false"
                  >
                    No, I will not
                    <span
                      v-if="form.would_recommend === false"
                      class="text-white"
                      >✓</span
                    >
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <button
                  type="submit"
                  class="w-full sm:w-max bg-[#F49322] text-white font-bold py-4 px-8 md:px-12 rounded-full hover:bg-[#e07e0e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-[32px]"
                  :disabled="!form.rating_overall || isSubmitting"
                >
                  <i
                    v-if="isSubmitting"
                    class="fas fa-spinner fa-spin mr-2"
                  ></i>
                  {{ isSubmitting ? "Submitting..." : "Submit Feedback" }}
                </button>
              </div>

              <p class="text-xs md:text-base text-gray-400 text-center">
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

const getStarImage = (star: number, rating: number, hover: number) => {
  const active = rating >= star || hover >= star;

  if (!active) {
    return `/Images/reviews/off.png`;
  }

  const highestActive = Math.max(rating, hover);
  if (star === highestActive) {
    return `/Images/reviews/${star}-on.png`;
  }

  return `/Images/reviews/on.png`;
};

const getRatingLabel = (rating: number) => {
  const labels: Record<number, string> = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Happy",
    5: "Festive!",
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
