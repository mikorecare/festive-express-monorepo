<template>
  <footer class="bg-[#101518] text-white pt-5 border-t-5 border-white">
    <div class="container">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-5">
        <!-- Logo -->
        <div>
          <img 
            src="/Images/FE-Logo.png" 
            alt="Festive Lighting Pros" 
            class="h-auto w-3/4"
          >
        </div>

        <!-- Contact Us -->
        <div>
          <h4 class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide">
            CONTACT US
          </h4>
          <p class="text-slate-300 mb-2.5">packages@festive.express</p>
          <p class="text-slate-300 mb-2.5">
            ☎ {{ settings.contact_phone_display || '(941) 239-4722' }}
          </p>
        </div>

        <!-- Customer (Hidden) -->
        <div class="hidden">
          <h4 class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide">
            CUSTOMER
          </h4>
          <NuxtLink to="#" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Help Center
          </NuxtLink>
          <NuxtLink to="#" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Refund Policy
          </NuxtLink>
          <NuxtLink to="#" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Gift Cards
          </NuxtLink>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-brand-orange text-[1.1rem] font-semibold mb-5 uppercase tracking-wide">
            QUICK LINKS
          </h4>
          <NuxtLink to="/about-us" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            About Us
          </NuxtLink>
          <NuxtLink to="/contact" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Contact Us
          </NuxtLink>
          <NuxtLink to="/privacy-policy" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/terms" class="text-slate-300 hover:text-brand-orange block mb-2.5 transition-colors duration-300">
            Terms & Conditions
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Bar Section -->
    <div class="bg-white pb-[25px]">
      <div class="container pt-4 border-t border-[#1f3a5c] flex flex-wrap justify-between items-center gap-[15px] text-slate-400 text-[0.95rem]">
        <div class="text-navy text-base">
          Copyright © 2026 Festive Express. All Rights Reserved.
        </div>
        
        <div class="payment-methods">
          <img 
            src="/Images/checkout.png" 
            alt="Payment Method" 
            class="w-full h-auto"
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings, loadSettings, telHref } = useSettings()
</script>