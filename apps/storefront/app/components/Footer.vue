<template>
  <footer
    class="bg-[#1C2D5B] text-white pt-8 sm:pt-12"
    role="contentinfo"
    aria-label="Site footer"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-10 mb-8 sm:mb-12"
      >
        <div
          class="col-span-2 sm:col-span-1 flex justify-center sm:justify-start"
        >
          <MainLogoForDark />
        </div>

        <div>
          <p
            class="text-brand-orange text-sm sm:text-[1.1rem] font-semibold mb-2.5 sm:mb-5 uppercase tracking-widest"
          >
            Contact Us
          </p>
          <p
            class="text-slate-300 tracking-wide mb-2 sm:mb-2.5 text-xs sm:text-base break-words"
          >
            <a
              v-if="settings.contact_email"
              :href="`mailto:${settings.contact_email}`"
              class="text-slate-300 tracking-wide hover:text-brand-orange transition-colors"
            >
              {{ settings.contact_email }}
            </a>
            <span v-else>—</span>
          </p>
          <p
            class="text-slate-300 tracking-wide mb-2 sm:mb-2.5 text-xs sm:text-base"
          >
            <a
              :href="telHref"
              class="contact-box btn-secondary-2 hover:text-brand-orange"
            >
              {{ settings.contact_phone_display || "(941) 239-4722" }}
            </a>
          </p>
        </div>

        <div class="hidden">
          <p
            class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide"
          >
            Customer
          </p>
          <!-- links unchanged -->
        </div>

        <div class="col-span-2 sm:col-span-1">
          <p
            class="text-brand-orange text-sm sm:text-[1.1rem] font-semibold mb-2.5 sm:mb-5 uppercase tracking-widest"
          >
            Quick Links
          </p>
          <div
            class="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 sm:gap-y-0"
          >
            <NuxtLink
              to="/about-us"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              About Us
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              Contact Us
            </NuxtLink>
            <NuxtLink
              to="/faq"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              FAQ
            </NuxtLink>
            <NuxtLink
              to="/privacy-policy"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/cookie-policy"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              Cookie Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-xs sm:text-base"
            >
              Terms & Conditions
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div
        class="w-full mx-auto max-w-7xl flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3 sm:gap-[15px] text-slate-400 text-[0.85rem] sm:text-[0.95rem]"
      >
        <div
          class="text-navy text-center sm:text-left text-[0.75rem] sm:text-sm w-full sm:w-auto space-y-1"
        >
          <!-- Copyright Line -->
          <div class="font-semibold">
            {{
              settings?.copyright_text ||
              `Copyright © ${currentYear} Festive Express. All Rights Reserved.`
            }}
          </div>

          <!-- Shorter Disclaimer Line -->
          <div
            class="text-slate-500 text-[0.65rem] sm:text-[0.75rem] leading-snug"
          >
            Festive Express is owned and operated by Festive Lighting Pros, a
            division of Festive Franchising Corp.
          </div>
        </div>

        <div
          class="payment-methods w-full sm:w-auto flex justify-center sm:justify-end max-w-[160px] sm:max-w-none mx-auto sm:mx-0"
        >
          <NuxtImg
            src="/Images/checkout.png"
            alt="Accepted payment methods"
            class="w-full h-auto"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import MainLogoForDark from './Logos/MainLogoForDark.vue';

const { settings, telHref } = useSettings();
const currentYear = useState("current-year", () => new Date().getFullYear());
</script>
