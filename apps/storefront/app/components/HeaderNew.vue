<template>
  <header class="w-full" role="banner">
    <!-- Top Bar (NOT sticky — scrolls away) -->
    <div class="bg-navy text-white py-2.5 text-base font-semibold">
      <div class="w-full px-4 mx-auto max-w-7xl">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0"
        >
          <div
            class="welcome text-[0.7rem] sm:text-sm md:text-base text-center md:flex-1 order-2"
          >
            Welcome to
            <span class="highlight">
              <span class="brand-text">Festive Express</span>
              <svg
                class="underline-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
              >
                <path
                  d="M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7"
                />
              </svg>
            </span>
          </div>

          <!-- Empty div to balance the layout (desktop only) -->
          <div class="hidden md:block shrink-0 w-[180px] order-3"></div>
        </div>
      </div>
    </div>

    <!-- Main Header (STICKY) -->
    <div
      class="sticky top-0 z-[9999] bg-white py-2 md:py-3 shadow-md transition-all duration-300 w-full"
    >
      <div class="w-full px-4 mx-auto max-w-7xl">
        <!-- Mobile: 3 equal columns (menu | logo | phone). Desktop: original row -->
        <div
          class="grid grid-cols-3 items-center lg:flex lg:items-center lg:justify-between gap-2.5 md:gap-8"
        >
          <!-- Mobile hamburger (left column) — glossy button, NO card/wrapper -->
          <button
            type="button"
            class="mobile-menu-btn btn-secondary-2 justify-self-start lg:hidden"
            aria-label="Open menu"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span
              class="hamburger-icon shrink-0"
              :class="{ open: mobileMenuOpen }"
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <!-- Logo (center column on mobile, normal flow on desktop) -->
          <NuxtLink
            to="/"
            aria-label="Home"
            class="logo-link flex flex-col items-center gap-1 text-transparent shrink-0 justify-self-center lg:justify-self-auto"
          >
            <div class="logo-wrap">
              <MainLogo class="logo-img" />
            </div>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="hidden lg:block flex-1 min-w-0" role="navigation">
            <ul
              class="flex justify-end items-center gap-4 xl:gap-8 list-none p-0 m-0"
            >
              <li>
                <NuxtLink
                  to="/"
                  class="nav-link block whitespace-nowrap text-[#1a2b4a] no-underline px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors hover:text-[#ff7a00]"
                  exact-active-class="nav-link-active"
                >
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/packages"
                  class="nav-link block whitespace-nowrap text-[#1a2b4a] no-underline px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors hover:text-[#ff7a00]"
                  active-class="nav-link-active"
                >
                  Packages
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/faq"
                  class="nav-link block whitespace-nowrap text-[#1a2b4a] no-underline px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors hover:text-[#ff7a00]"
                  active-class="nav-link-active"
                >
                  FAQ
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/blogs"
                  class="nav-link block whitespace-nowrap text-[#1a2b4a] no-underline px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors hover:text-[#ff7a00]"
                  active-class="nav-link-active"
                >
                  Blog
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Right actions: full call box on desktop; icon-only phone on mobile (right column) -->
          <div class="flex justify-end lg:justify-normal lg:shrink-0">
            <a
              :href="telHref"
              class="btn-gloss contact-box btn-secondary-2 relative overflow-hidden"
              :aria-label="`Call ${settings.contact_phone_display || '(941) 239-4722'}`"
            >
              <span class="phone-icon shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.279-.087.431a15.2 15.2 0 006.414 6.414c.152.077.33.048.431-.087l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>

              <div class="contact-text">
                <div class="call-now">CALL US NOW!</div>
                <div class="phone-number">
                  {{ settings.contact_phone_display || "(941) 239-4722" }}
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Mobile dropdown menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <nav
            v-if="mobileMenuOpen"
            class="mobile-dropdown lg:hidden mt-3"
            role="navigation"
          >
            <ul class="flex flex-col list-none p-0 m-0">
              <li>
                <NuxtLink
                  to="/"
                  class="mobile-nav-link"
                  exact-active-class="mobile-nav-link-active"
                  @click="mobileMenuOpen = false"
                >
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/packages"
                  class="mobile-nav-link"
                  active-class="mobile-nav-link-active"
                  @click="mobileMenuOpen = false"
                >
                  Packages
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/faq"
                  class="mobile-nav-link"
                  active-class="mobile-nav-link-active"
                  @click="mobileMenuOpen = false"
                >
                  FAQ
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/blogs"
                  class="mobile-nav-link"
                  active-class="mobile-nav-link-active"
                  @click="mobileMenuOpen = false"
                >
                  Blog
                </NuxtLink>
              </li>
            </ul>

            <!-- Mobile call button (full glossy pill with number inside dropdown) -->
            <a
              :href="telHref"
              class="contact-box btn-secondary-2 relative overflow-hidden w-full mt-3"
              :aria-label="`Call ${settings.contact_phone_display || '(941) 239-4722'}`"
            >
              <span class="phone-icon shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.279-.087.431a15.2 15.2 0 006.414 6.414c.152.077.33.048.431-.087l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>

              <div class="contact-text">
                <div class="call-now">CALL US NOW!</div>
                <div class="phone-number">
                  {{ settings.contact_phone_display || "(941) 239-4722" }}
                </div>
              </div>
            </a>
          </nav>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLogo from "./Logos/MainLogo.vue";

const { settings, telHref } = useSettings();

const mobileMenuOpen = ref(false);
</script>

<style scoped>
/* ============ LOGO: force big, no exceptions ============ */
.logo-link {
  max-width: none !important;
}

.logo-wrap {
  height: 100px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  flex: 0 0 auto;
}

.logo-wrap :deep(svg),
.logo-img {
  height: 100% !important;
  width: auto !important;
  max-height: none !important;
  max-width: none !important;
  display: block;
}

@media (min-width: 1024px) {
  .logo-wrap {
    height: 110px;
  }
}
/* ======================================================== */

/* Welcome Text & SVG Animation */
.welcome {
  text-align: center;
}

.highlight {
  position: relative;
  display: inline-block;
  color: #f49321;
  font-weight: 700;
}

.brand-text {
  display: inline-block;
  animation: pulseText 2.8s ease-in-out infinite;
}

.underline-svg {
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 18px;
  overflow: visible;
}

.underline-svg path {
  fill: none;
  stroke: #f49321;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: drawLine 4s ease-in-out infinite;
}

@keyframes pulseText {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

@keyframes drawLine {
  0% {
    stroke-dashoffset: 800;
  }
  25% {
    stroke-dashoffset: 0;
  }
  70% {
    stroke-dashoffset: 0;
  }
  80% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 800;
    opacity: 0.6;
  }
}

/* ---------- Nav link + active indicator ---------- */
.nav-link {
  position: relative;
}

.nav-link-active {
  font-weight: 700;
}

.nav-link-active::after {
  content: "";
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0;
  height: 3px;
  border-radius: 9999px;
  background: #ff7a00;
}

/* ---------- Contact Box Styles ---------- */
.contact-box {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f49321 !important;
  border: 3px solid #1c2d5b;
}

.contact-box:hover {
  background: #1c2d5b !important;
  color: #f49321 !important;
  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  border: 3px solid #f49321;
}

/* 3D Glossy Contact Box Button */
.contact-box.btn-secondary-2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.6rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  color: #ffffff;
  font-family: inherit;
  background: linear-gradient(180deg, #f49321 0%, #f49321 50%, #f49321 100%);
  border: none;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.35),
    inset 0 2px 3px rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.contact-box.btn-secondary-2::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 6px;
  right: 6px;
  height: 45%;
  border-radius: 40px 40px 20px 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.75) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.contact-box.btn-secondary-2::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -150%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.08) 40%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.08) 60%,
    rgba(255, 255, 255, 0) 80%
  );
  transform: rotate(25deg);
  pointer-events: none;
}

.contact-box.btn-secondary-2:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.contact-box.btn-secondary-2:active {
  transform: translateY(1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.contact-box .phone-icon {
  font-size: 1.25rem;
  color: #ffffff;
  position: relative;
  z-index: 1;
}

.contact-box .contact-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.contact-box .phone-number {
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.contact-box .call-now {
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 1px;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* ---------- Mobile hamburger glossy button — scoped to mobile only ---------- */
@media (max-width: 1023px) {
  .mobile-menu-btn.btn-secondary-2 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
    background: linear-gradient(180deg, #f49321 0%, #f49321 50%, #f49321 100%);
    border: none;
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.35),
      inset 0 2px 3px rgba(255, 255, 255, 0.6);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .mobile-menu-btn.btn-secondary-2::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 6px;
    right: 6px;
    height: 45%;
    border-radius: 40px 40px 20px 20px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.75) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }

  .mobile-menu-btn.btn-secondary-2:active {
    transform: translateY(1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
}

.hamburger-icon {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 20px;
  height: 16px;
}

.hamburger-icon span {
  display: block;
  width: 100%;
  height: 2.5px;
  border-radius: 2px;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.25s ease,
    opacity 0.2s ease;
}

.hamburger-icon.open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.hamburger-icon.open span:nth-child(2) {
  opacity: 0;
}
.hamburger-icon.open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ---------- Mobile dropdown ---------- */
.mobile-dropdown {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  border: 1px solid rgba(28, 45, 91, 0.08);
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #1a2b4a;
  text-decoration: none;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-nav-link:hover {
  background: rgba(244, 147, 33, 0.1);
  color: #f49321;
}

.mobile-nav-link-active {
  background: rgba(244, 147, 33, 0.12);
  color: #f49321;
  font-weight: 700;
}

/* Mobile adjustments */
@media (max-width: 1023px) {
  .contact-box {
    padding: 8px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    gap: 0;
    background: linear-gradient(180deg, #f49321 0%, #f49321 50%, #f49321 100%);
    justify-content: center;
  }
  .contact-box .contact-text {
    display: none;
  }
  .contact-box .phone-icon {
    font-size: 1.15rem;
  }
  .underline-svg {
    height: 12px;
    bottom: -4px;
  }

  .mobile-dropdown .contact-box {
    width: 100%;
    height: auto;
    padding: 0.6rem 2rem;
    border-radius: 50px;
    gap: 0.75rem;
    background: linear-gradient(180deg, #f49321 0%, #f49321 50%, #f49321 100%);
  }
  .mobile-dropdown .contact-box .contact-text {
    display: flex;
  }
  .mobile-dropdown .contact-box .phone-icon {
    font-size: 1.25rem;
  }
}

@keyframes festive-express-animation-pulse-grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}
</style>
