<template>
  <footer class="bg-[#101518] text-white pt-5">
    <div class="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-5">
        <!-- Logo -->
        <div>
          <img
            src="/Images/FE-Logo.png"
            alt="Festive Express"
            class="h-auto w-3/4"
          />
        </div>

        <!-- Contact Us -->
        <div>
          <h4
            class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide"
          >
            CONTACT US
          </h4>
          <p class="text-slate-300 mb-2.5">
            <a
              v-if="settings.contact_email"
              :href="`mailto:${settings.contact_email}`"
              class="text-slate-300 hover:text-brand-orange transition-colors"
            >
              {{ settings.contact_email }}
            </a>
            <span v-else>—</span>
          </p>
          <p class="text-slate-300 mb-2.5">
            <a
              :href="`tel:${String(settings.contact_phone || '').replace(/[^\d+]/g, '')}`"
              class="contact-box btn-secondary-2 hover:text-brand-orange"
            >{{ settings.contact_phone_display || "(941) 239-4722" }}
            </a>
          </p>
        </div>

        <!-- Customer (Hidden) -->
        <div class="hidden">
          <h4
            class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide"
          >
            CUSTOMER
          </h4>
          <NuxtLink
            to="#"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Help Center
          </NuxtLink>
          <NuxtLink
            to="#"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Refund Policy
          </NuxtLink>
          <NuxtLink
            to="#"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Gift Cards
          </NuxtLink>
        </div>

        <!-- Quick Links -->
        <div>
          <h4
            class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide"
          >
            QUICK LINKS
          </h4>
          <NuxtLink
            to="/about-us"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            About Us
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Contact Us
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            FAQ
          </NuxtLink>
          <NuxtLink
            to="/privacy-policy"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300"
          >
            Terms & Conditions
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Bar Section -->
    <div class="bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div
        class="w-full mx-auto max-w-7xl  flex flex-wrap justify-between items-center gap-[15px] text-slate-400 text-[0.95rem]"
      >
        <div
          class="text-navy text-base w-full sm:w-auto text-center sm:text-left"
        >
          {{ settings?.copyright_text || `Copyright © ${new Date().getFullYear()} Festive Express. All Rights Reserved.` }}
        </div>

        <div
          class="payment-methods w-full sm:w-auto flex justify-center sm:justify-end max-w-[200px] sm:max-w-none mx-auto sm:mx-0"
        >
          <img
            src="/Images/checkout.png"
            alt="Payment Method"
            class="w-full h-auto"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings, loadSettings, telHref } = useSettings();
</script>
