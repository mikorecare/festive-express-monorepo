<template>
  <div class="min-h-screen bg-[#e7e7e7]">
    <!-- Hero Banner -->
    <section
      class="bg-[url('/Images/Banner/hero-image.webp')] bg-cover bg-center bg-no-repeat relative"
    >
      <div class="absolute inset-0 bg-[#0c2340]/80"></div>
      <div class="container mx-auto px-4 py-20 text-center relative z-10">
        <span
          class="inline-flex items-center gap-2 bg-[#F49322]/20 border border-[#F49322] text-[#F49322] px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-5"
        >
          <i class="fas fa-check-circle"></i> ORDER CONFIRMED
        </span>
        <h1 class="text-white text-4xl md:text-5xl font-extrabold mb-3">
          Thank You for Choosing Magic!
        </h1>
        <p class="text-white/90 text-lg max-w-xl mx-auto mb-7">
          Your holiday lighting experience has been secured. Get ready to shine
          this season.
        </p>
        <div
          class="inline-block bg-white/10 border border-white/25 rounded-xl px-8 py-4"
        >
          <span
            class="block text-white/80 text-xs tracking-widest font-bold uppercase"
            >Confirmation Number</span
          >
          <span class="text-white text-2xl font-bold tracking-wide">{{
            orderNumber
          }}</span>
        </div>
      </div>
    </section>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-500">Loading your order...</p>
      </div>
    </div>

    <div v-else-if="order" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Details -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-xl font-bold text-[#0c2340] mb-6">
              <i class="fas fa-gift mr-2"></i> Your Holiday Package
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Package Info -->
              <div>
                <span
                  class="text-xs font-bold text-gray-400 tracking-wider uppercase"
                  >Selected Plan</span
                >
                <h4 class="text-2xl font-extrabold text-[#0c2340] mt-1 mb-2">
                  {{ packageName }}
                </h4>
                <p class="text-gray-500 text-sm mb-3">{{ packageDesc }}</p>
                <ul class="space-y-1">
                  <li
                    v-for="(f, i) in features"
                    :key="i"
                    class="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <i class="fas fa-check text-emerald-500"></i> {{ f }}
                  </li>
                </ul>
              </div>

              <!-- Dates -->
              <div class="space-y-3">
                <div class="flex gap-3 bg-gray-50 rounded-xl p-4">
                  <div
                    class="w-11 h-11 bg-blue-50 text-[#F49322] rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  >
                    <i class="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <span
                      class="block text-xs font-bold text-gray-400 tracking-wider uppercase"
                      >Installation Date</span
                    >
                    <strong class="text-[#0c2340] text-lg">{{
                      installDate || "To be confirmed"
                    }}</strong>
                    <span
                      v-if="installTime"
                      class="block text-gray-400 text-xs"
                      >{{ installTime }}</span
                    >
                  </div>
                </div>

                <div class="flex gap-3 bg-gray-50 rounded-xl p-4">
                  <div
                    class="w-11 h-11 bg-blue-50 text-[#F49322] rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  >
                    <i class="fas fa-calendar-check"></i>
                  </div>
                  <div>
                    <span
                      class="block text-xs font-bold text-gray-400 tracking-wider uppercase"
                      >Removal Window</span
                    >
                    <strong class="text-[#0c2340] text-lg">{{
                      removalDate || "To be scheduled"
                    }}</strong>
                    <span class="block text-gray-400 text-xs"
                      >Hassle-free take down included</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div>
            <h3 class="text-xl font-bold text-[#0c2340] mb-4">
              What Happens Next?
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(step, i) in steps"
                :key="i"
                class="bg-white rounded-2xl p-6 shadow-sm"
              >
                <span
                  class="inline-flex w-8 h-8 bg-[#0c2340] text-white rounded-full items-center justify-center font-bold text-sm mb-3"
                >
                  {{ i + 1 }}
                </span>
                <h5 class="font-bold text-[#0c2340] mb-2">{{ step.title }}</h5>
                <p class="text-gray-500 text-sm leading-relaxed">
                  {{ step.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Help Card -->
          <div class="bg-[#0c2340] text-white rounded-2xl p-6">
            <h4 class="font-bold text-lg mb-3">
              <i class="fas fa-headset mr-2"></i> Need Help?
            </h4>
            <p class="text-white/80 text-sm mb-5">
              Our team is standing by to ensure your holiday season is
              absolutely perfect.
            </p>

            <a
              href="tel:5555555548"
              class="flex items-center gap-4 bg-white/10 border border-white/15 rounded-xl p-4 hover:bg-white/20 transition-colors text-white no-underline mb-3"
            >
              <i class="fas fa-phone-alt text-[#F49322] text-lg"></i>
              <div>
                <span
                  class="block text-white/60 text-xs font-bold tracking-wider uppercase"
                  >Phone Support</span
                >
                <strong class="text-white">(555) LIGHT-UP</strong>
              </div>
            </a>

            <a
              href="mailto:JoyJollyMerry@festive.express"
              class="flex items-center gap-4 bg-white/10 border border-white/15 rounded-xl p-4 hover:bg-white/20 transition-colors text-white no-underline mb-4"
            >
              <i class="fas fa-envelope text-[#F49322] text-lg"></i>
              <div>
                <span
                  class="block text-white/60 text-xs font-bold tracking-wider uppercase"
                  >Email Support</span
                >
                <strong class="text-white">JoyJollyMerry@festive.express</strong>
              </div>
            </a>

            <!-- <NuxtLink
              to="/"
              class="block text-center bg-[#F49322] text-white font-bold py-4 rounded-xl hover:bg-[#e07e0e] transition-colors no-underline"
            >
              Go to Dashboard <i class="fas fa-arrow-right ml-1"></i>
            </NuxtLink> -->
          </div>

          <!-- Testimonial -->
          <div
            class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#F49322]"
          >
            <span
              class="inline-block bg-orange-50 text-[#F49322] text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3"
              >Trusted Pro</span
            >
            <p class="text-gray-700 text-sm italic leading-relaxed mb-3">
              "The process was seamless and the results were stunning. Truly the
              best investment we made for our family's holiday spirit!"
            </p>
            <span class="text-[#0c2340] text-sm font-semibold"
              >— Sarah J., Happy Customer</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!isLoading && !order && errorMessage"
      class="container mx-auto px-4 py-20 text-center"
    >
      <div class="bg-white rounded-2xl p-12 shadow-sm max-w-md mx-auto">
        <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
        <h3 class="text-xl font-bold text-[#0c2340] mb-2">Order Not Found</h3>
        <p class="text-gray-500 text-sm mb-6">{{ errorMessage }}</p>
        <NuxtLink
          to="/"
          class="inline-block bg-[#F49322] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#e07e0e] transition-colors no-underline"
        >
          Go to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const orderNumber = ref(String(route.query.order || ""));
const email = ref(String(route.query.email || ""));
const order = ref<any>(null);
const isLoading = ref(true);
const errorMessage = ref("");

const packageName = computed(
  () => order.value?.items?.[0]?.product_name || "Holiday Package",
);
const packageDesc = computed(
  () => "Our most popular all-inclusive residential lighting solution.",
);
const installDate = computed(() => {
  if (order.value?.preferred_install_dates?.length) {
    return formatDate(order.value.preferred_install_dates[0]);
  }
  return null;
});
const installTime = ref("9:00 AM - 12:00 PM");
const removalDate = computed(() => {
  if (order.value?.removal_dates?.length) {
    return formatDate(order.value.removal_dates[0]);
  }
  return null;
});

const features = computed(() => {
  const opts = order.value?.items?.[0]?.options;
  const list = [
    "Custom-fit C9 Roofline Lights",
    "Wreath for the Main Entry",
    "Automated Smart Timer",
  ];
  if (opts?.c9_color)
    list[0] = `Custom-fit C9 Roofline Lights (${opts.c9_color})`;
  return list;
});

const steps = [
  {
    title: "Consultation",
    desc: "Our lead designer will call you within 24 hours to confirm your custom layout and bulb colors.",
  },
  {
    title: "Installation",
    desc: "Our professional, insured crew arrives to handle the heavy lifting while you stay cozy inside.",
  },
  {
    title: "Maintenance",
    desc: "Enjoy a bright season! If a bulb goes out, we'll be there within 48 hours to fix it for free.",
  },
];

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

onMounted(async () => {
  if (!route.query.order || !route.query.email) {
    isLoading.value = false;
    errorMessage.value = "Missing order information.";
    return;
  }

  try {
    const res: any = await $fetch(
      `/orders/by-number/${route.query.order}`,
      {
        baseURL: config.public.apiBase,
        params: {
          email: email.value,
        },
      },
    );

    if (res && res.order_number) {
      order.value = res;
      orderNumber.value = res.order_number;
    } else {
      errorMessage.value =
        "We couldn't find your order. Please contact support.";
    }
  } catch (error: any) {
    console.error("Error loading order:", error);
    if (error.statusCode === 403) {
      errorMessage.value = "You don't have permission to view this order.";
    } else if (error.statusCode === 404) {
      errorMessage.value =
        "Order not found. Please check your confirmation number.";
    } else {
      errorMessage.value = "Something went wrong. Please contact support.";
    }
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "Thank You - Festive Express",
});
</script>
