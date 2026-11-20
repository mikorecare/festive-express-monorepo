<template>
  <footer
    class="bg-[#1C2D5B] text-white pt-8 sm:pt-12 border-t-[12px] border-[#F49321] shadow-[inset_0_8px_0_0_#ffffff]"
    role="contentinfo"
    aria-label="Site footer"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-10 mb-8 sm:mb-12"
      >
        <div
          class="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start"
        >
          <MainLogoForDark />

          <!-- Social links -->
          <div class="mt-4 sm:mt-5 flex items-center gap-8 sm:gap-10">
            <a
              href="https://www.instagram.com/festive.express.decor/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Festive Express on Instagram"
              class="text-slate-300 hover:text-brand-orange transition-colors duration-300 text-xl sm:text-2xl"
            >
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com/Festive.Express/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Festive Express on Facebook"
              class="text-slate-300 hover:text-brand-orange transition-colors duration-300 text-xl sm:text-2xl"
            >
              <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/festive-express-decor/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Festive Express on LinkedIn"
              class="text-slate-300 hover:text-brand-orange transition-colors duration-300 text-xl sm:text-2xl"
            >
              <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div>
          <p
            class="text-brand-orange text-base sm:text-[1.1rem] font-semibold mb-2.5 sm:mb-5 uppercase tracking-widest"
          >
            Contact Us
          </p>
          <p
            class="text-slate-300 tracking-wide mb-2 sm:mb-2.5 text-sm sm:text-base break-words"
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
            class="text-slate-300 tracking-wide mb-2 sm:mb-2.5 text-sm sm:text-base"
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
            class="text-brand-orange text-base sm:text-[1.1rem] font-semibold mb-2.5 sm:mb-5 uppercase tracking-widest"
          >
            Quick Links
          </p>
          <div
            class="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 sm:gap-y-0"
          >
            <NuxtLink
              to="/about-us"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              About Us
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              Contact Us
            </NuxtLink>
            <NuxtLink
              to="/faq"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              FAQ
            </NuxtLink>
            <NuxtLink
              to="/privacy-policy"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/cookie-policy"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              Cookie Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-slate-300 tracking-wide hover:text-brand-orange sm:block sm:mb-2.5 transition-colors duration-300 text-sm sm:text-base"
            >
              Terms & Conditions
            </NuxtLink>
          </div>
        </div>
      </div>

      <div
        class="border-t border-white/15 pt-6 sm:pt-8 pb-8 sm:pb-12"
        aria-labelledby="footer-service-areas"
      >
        <div class="flex flex-col gap-4 sm:gap-5">
          <!-- Heading -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2
              id="footer-service-areas"
              class="text-brand-orange text-base sm:text-[1.1rem] font-semibold uppercase tracking-widest"
            >
              Areas We Serve
            </h2>

            <span
              class="hidden sm:block h-1 w-1 rounded-full bg-slate-400"
              aria-hidden="true"
            ></span>

            <p class="text-slate-400 text-xs sm:text-sm">
              Holiday Lighting Rental & Installation in Southwest Florida
            </p>
          </div>

          <!-- Service Area Cities -->
          <p
            class="text-slate-300 text-sm sm:text-base leading-relaxed sm:leading-7 tracking-wide"
          >
            Sarasota <span class="text-brand-orange/70 mx-1">•</span> Bradenton
            <span class="text-brand-orange/70 mx-1">•</span> Lakewood Ranch
            <span class="text-brand-orange/70 mx-1">•</span> Venice
            <span class="text-brand-orange/70 mx-1">•</span> Siesta Key
            <span class="text-brand-orange/70 mx-1">•</span> Longboat Key
            <span class="text-brand-orange/70 mx-1">•</span> Osprey
            <span class="text-brand-orange/70 mx-1">•</span> Nokomis
            <span class="text-brand-orange/70 mx-1">•</span> Palmetto
            <span class="text-brand-orange/70 mx-1">•</span> Ellenton
            <span class="text-brand-orange/70 mx-1">•</span> Parrish
            <span class="text-brand-orange/70 mx-1">•</span> North Port
            <span class="text-brand-orange/70 mx-1">•</span> Englewood
            <span class="text-brand-orange/70 mx-1">•</span> Anna Maria
            <span class="text-brand-orange/70 mx-1">•</span> Holmes Beach
            <span class="text-brand-orange/70 mx-1">•</span> Ruskin
            <span class="text-brand-orange/70 mx-1">•</span> Sun City Center
            <span class="text-brand-orange/70 mx-1">•</span> Apollo Beach
            <span class="text-brand-orange/70 mx-1">•</span>
            Port Charlotte
          </p>

          <!-- County Coverage -->
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Serving Sarasota and Manatee counties, plus select communities in
            Southern Hillsborough and Northern Charlotte counties.
          </p>

          <!-- Service Availability -->
          <div class="flex items-start gap-2">
            <i
              class="fas fa-map-marker-alt text-brand-orange text-xs mt-1"
              aria-hidden="true"
            ></i>

            <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Our primary service area is approximately 45 minutes from
              Sarasota, FL. Extended locations may be available upon request.

              <NuxtLink
                to="/#service-areas-form"
                class="text-brand-orange hover:text-white font-semibold transition-colors duration-300 underline underline-offset-4"
              >
                Confirm your service area
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div
        class="w-full mx-auto max-w-7xl flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3 sm:gap-[15px] text-slate-400 text-[0.85rem] sm:text-[0.95rem]"
      >
        <div
          class="text-navy text-center sm:text-left text-sm sm:text-sm w-full sm:w-auto space-y-1"
        >
          <!-- Copyright Line -->
          <div class="font-semibold">
            {{
              settings?.copyright_text ||
              `Copyright © ${currentYear} Festive Express. All Rights Reserved.`
            }}
          </div>

          <!-- Shorter Disclaimer Line -->
          <div class="text-slate-500 text-xs sm:text-[0.75rem] leading-snug">
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
import MainLogoForDark from "./Logos/MainLogoForDark.vue";

const { settings, telHref } = useSettings();
const currentYear = useState("current-year", () => new Date().getFullYear());
</script>
