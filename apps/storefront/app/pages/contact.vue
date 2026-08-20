<template>
  <div>
    <!-- Contact Hero Banner -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade><span class="text-brand-orange">Contact</span> Us</h1>
            <p v-fade class="breadcrumb"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container py-12 lg:py-20 mb-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <!-- Left: Speak With Our Experts -->
        <div>
          <!-- <h2 class="text-3xl lg:text-[2.4rem] font-bold text-navy leading-tight mb-5">
            SPEAK WITH OUR LIGHTING & DECOR EXPERTS TODAY
          </h2>
          <p class="text-lg leading-relaxed text-slate-600 mb-10">
            Have a question about your order or need help choose the right package? Our Festive Express experts are ready to assist you with fast, friendly support – contact us today. 
          </p> -->

          <div class="flex flex-col gap-5">
            <div
              class="bg-slate-50 p-3.5 rounded-xl flex items-center gap-4.5 border border-slate-100"
            >
              <div class="text-3xl shrink-0">✉️</div>
              <div class="text-slate-700 leading-normal">
                <strong class="text-navy font-semibold">Contact Us</strong
                ><br />
                Call us:
                <span class="font-semibold text-brand-orange">{{
                  settings.contact_phone_display || "(941) 239-4722"
                }}</span
                ><br />
                {{ settings.contact_email }}
              </div>
            </div>

            <div
              class="bg-slate-50 p-3.5 rounded-xl flex items-center gap-4.5 border border-slate-100"
            >
              <div class="text-3xl shrink-0">🕒</div>
              <div class="text-slate-700 leading-normal whitespace-pre-line">
                <strong class="text-navy font-semibold">Opening Hours</strong
                ><br />
                {{ settings.opening_hours }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Contact Form -->
        <div>
          <h3 class="text-2xl font-bold text-navy mb-3">
            Let’s connect today.
          </h3>
          <p class="mb-[30px] text-slate-600">
            We’re here to guide you – help select the right rental package,
            provide more details about the lights, installation, etc.
          </p>

          <form @submit.prevent="submitForm" class="flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name *"
                required
                class="w-full px-2 px-4.5 py-3.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors"
              />
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name *"
                required
                class="w-full px-2 px-4.5 py-3.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors"
              />
            </div>

            <input
              v-model="form.phone"
              type="tel"
              placeholder="Phone *"
              required
              class="w-full px-2 px-4.5 py-3.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors"
            />
            <input
              v-model="form.email"
              type="email"
              placeholder="Email *"
              required
              class="w-full px-2 px-4.5 py-3.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors"
            />

            <textarea
              v-model="form.message"
              placeholder="Message *"
              rows="6"
              required
              class="w-full px-2 px-4.5 py-3.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors resize-y"
            ></textarea>

            <button
              type="submit"
              class="bg-navy hover:bg-brand-orange text-white py-4 px-12 rounded-lg text-lg font-semibold w-full cursor-pointer transition-colors duration-200 shadow-sm"
            >
              Send a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Contact Us",
});

const { settings, loadSettings, telHref } = useSettings();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
});

const submitForm = () => {
  alert("Thank you! Your message has been sent.");
  form.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };
};
</script>
