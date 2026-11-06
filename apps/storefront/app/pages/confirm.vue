<template>
  <div
    class="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-poppins"
  >
    <div
      class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center"
    >
      <!-- Loading State -->
      <div v-if="pending" class="py-10">
        <div
          class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-slate-500 text-sm">Verifying your email...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success">
        <div
          class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <svg
            class="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-[#1C2D5B] mb-3">
          Hooray!
        </h1>
        <p class="text-slate-500 text-sm leading-relaxed mb-6">
          Thanks for subscribing to Festive Express. You'll now receive our
          latest lighting insights and seasonal inspiration straight to your
          inbox.
        </p>
        <NuxtLink
          to="/blogs"
          class="inline-flex items-center gap-2 bg-[#F49321] hover:bg-[#e07e0e] text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm uppercase tracking-wide"
        >
          Read the Blog
          <i class="fas fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else>
        <div
          class="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <svg
            class="w-10 h-10 text-rose-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-[#1C2D5B] mb-3">
          Confirmation Failed
        </h1>
        <p class="text-slate-500 text-sm leading-relaxed mb-6">
          {{
            errorMessage ||
            "This link is invalid or has expired. Please subscribe again."
          }}
        </p>
        <NuxtLink
          to="/blogs"
          class="inline-flex items-center gap-2 bg-[#1C2D5B] hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm uppercase tracking-wide"
        >
          Back to Blog
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const email = route.query.email as string;
const token = route.query.s as string;

const { data, pending } = await useFetch<{
  success: boolean;
  message?: string;
}>("/api/newsletter/confirm", {
  query: { email, s: token },
});

const success = computed(() => data.value?.success === true);
const errorMessage = computed(() => data.value?.message);

useSeoMeta({
  title: "Confirm Subscription | Festive Express",
  robots: "noindex, nofollow", // Prevents confirmation pages from being indexed by Google
});
</script>
