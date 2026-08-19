<template>
  <header class="sticky top-0 z-[9999] w-full shadow-md">
    <!-- Top Bar -->
    <div class="bg-[#0c2340] text-white py-2.5 text-base font-semibold">
      <!-- Use max-w-7xl and mx-auto instead of container -->
      <div class="w-full px-4 mx-auto max-w-7xl">
        <!-- Mobile: stacked, Desktop: inline -->
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0"
        >
          <!-- Social Icons (Top on mobile, Left on desktop) -->
          <div
            class="hidden flex gap-3 md:gap-4 justify-center md:justify-start w-full md:w-auto order-1 md:order-1"
          >
            <a
              v-if="settings.social_facebook"
              :href="settings.social_facebook"
              target="_blank"
              rel="noopener"
              class="text-white text-[1.1rem] md:text-[1.5rem] transition-all duration-300 hover:text-[#F49322] hover:-translate-y-1"
              aria-label="Facebook"
              ><i class="fab fa-facebook"></i
            ></a>
            <a
              v-if="settings.social_instagram"
              :href="settings.social_instagram"
              target="_blank"
              rel="noopener"
              class="text-white text-[1.1rem] md:text-[1.5rem] transition-all duration-300 hover:text-[#F49322] hover:-translate-y-1"
              aria-label="Instagram"
              ><i class="fab fa-instagram"></i
            ></a>
            <a
              v-if="settings.social_x"
              :href="settings.social_x"
              target="_blank"
              rel="noopener"
              class="text-white text-[1.1rem] md:text-[1.5rem] transition-all duration-300 hover:text-[#F49322] hover:-translate-y-1"
              aria-label="X"
              ><i class="fab fa-x-twitter"></i
            ></a>
            <a
              v-if="settings.social_youtube"
              :href="settings.social_youtube"
              target="_blank"
              rel="noopener"
              class="text-white text-[1.1rem] md:text-[1.5rem] transition-all duration-300 hover:text-[#F49322] hover:-translate-y-1"
              aria-label="YouTube"
              ><i class="fab fa-youtube"></i
            ></a>
            <a
              v-if="settings.social_pinterest"
              :href="settings.social_pinterest"
              target="_blank"
              rel="noopener"
              class="text-white text-[1.1rem] md:text-[1.5rem] transition-all duration-300 hover:text-[#F49322] hover:-translate-y-1"
              aria-label="Pinterest"
              ><i class="fab fa-pinterest-p"></i
            ></a>
          </div>

          <div
            class="welcome text-[0.7rem] sm:text-sm md:text-base text-center md:flex-1 order-2 md:order-2"
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

    <!-- Main Header -->
    <div class="bg-white py-3 md:py-4 transition-all duration-300 w-full">
      <!-- Use max-w-7xl and mx-auto instead of container -->
      <div class="w-full px-4 mx-auto max-w-7xl">
        <div
          class="flex items-center justify-between gap-2.5 md:gap-8 flex-nowrap"
        >
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex flex-col items-start md:items-center gap-1 text-transparent shrink-0"
          >
            <img
              src="/Images/FE-Logo.png"
              alt="FLP Express Logo"
              class="max-h-[42px] sm:max-h-[48px] lg:max-h-[70px]"
            />
            <p
              class="m-0 text-[0.75rem] md:text-base text-[#1d3156] font-semibold text-center"
            >
              Rent • Relax • Celebrate
            </p>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="hidden md:block flex-1">
            <ul class="flex justify-center gap-4 lg:gap-8 list-none p-0 m-0">
              <li>
                <NuxtLink
                  to="/"
                  class="text-[#1a2b4a] no-underline px-2.5 lg:px-4 py-2 font-medium transition-colors hover:text-[#ff7a00]"
                  >Home</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/packages"
                  class="text-[#1a2b4a] no-underline px-2.5 lg:px-4 py-2 font-medium transition-colors hover:text-[#ff7a00]"
                  >Packages</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/how-it-works"
                  class="text-[#1a2b4a] no-underline px-2.5 lg:px-4 py-2 font-medium transition-colors hover:text-[#ff7a00]"
                  >How It Works</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-[#1a2b4a] no-underline px-2.5 lg:px-4 py-2 font-medium transition-colors hover:text-[#ff7a00]"
                  >Contact Us</NuxtLink
                >
              </li>
            </ul>
          </nav>

          <!-- Right actions -->
          <div class="flex items-center gap-3 shrink-0">
            <a
              :href="`tel:${String(settings.contact_phone || '').replace(/[^\d+]/g, '')}`"
              class="contact-box btn-secondary-2"
            >
              <span class="phone-icon"><i class="fas fa-phone"></i></span>
              <div class="contact-text">
                <div class="call-now">CALL US NOW!</div>
                <div class="phone-number">
                  {{ settings.contact_phone_display || "(941) 239-4722" }}
                </div>
              </div>
              <!-- Glossy Shine Overlay -->
              <div
                class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              ></div>
            </a>

            <!-- Hamburger -->
            <button
              type="button"
              class="md:hidden flex flex-col justify-center gap-1.25 w-[42px] h-[42px] p-2 border border-[#0c2340] rounded-lg bg-white cursor-pointer"
              :aria-expanded="mobileOpen"
              aria-label="Toggle menu"
              @click="mobileOpen = !mobileOpen"
            >
              <span class="block h-[2px] w-full bg-[#0c2340] rounded-sm" />
              <span class="block h-[2px] w-full bg-[#0c2340] rounded-sm" />
              <span class="block h-[2px] w-full bg-[#0c2340] rounded-sm" />
            </button>
          </div>
        </div>

        <!-- Mobile nav -->
        <nav
          class="md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out"
          :class="mobileOpen ? 'max-h-[420px]' : 'max-h-0'"
        >
          <ul class="list-none m-0 pt-3 pb-2 px-0">
            <li>
              <NuxtLink
                to="/"
                class="block py-3 px-1 text-[#0c2340] no-underline font-semibold border-b border-gray-200 hover:text-[#F49322]"
                @click="mobileOpen = false"
                >Home</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/packages"
                class="block py-3 px-1 text-[#0c2340] no-underline font-semibold border-b border-gray-200 hover:text-[#F49322]"
                @click="mobileOpen = false"
                >Packages</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/how-it-works"
                class="block py-3 px-1 text-[#0c2340] no-underline font-semibold border-b border-gray-200 hover:text-[#F49322]"
                @click="mobileOpen = false"
                >How It Works</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="block py-3 px-1 text-[#0c2340] no-underline font-semibold border-b border-gray-200 hover:text-[#F49322]"
                @click="mobileOpen = false"
                >Contact Us</NuxtLink
              >
            </li>
          </ul>
          <a
            :href="`tel:${String(settings.contact_phone || '').replace(/[^\d+]/g, '')}`"
            class="mobile-call"
            @click="mobileOpen = false"
          >
            <i class="fas fa-phone-alt"></i>
            {{ settings.contact_phone_display || "(941) 239-4722" }}
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { settings, loadSettings, telHref } = useSettings();

const mobileOpen = ref(false);

const { cartTotal, cartCount, loadCart } = useCart();

const router = useRouter();
const route = useRoute();

const scrollTo = async (id: string) => {
  if (route.path !== "/") {
    await navigateTo({ path: "/", hash: `#${id}` });
  }
  await nextTick();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  loadCart();
  loadSettings();
});

// Close menu on route change
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);
</script>

<style scoped>
/* Welcome Text & SVG Animation */
.welcome {
  text-align: center;
}

.highlight {
  position: relative;
  display: inline-block;
  color: #ff890b;
  font-weight: 700;
}

.brand-text {
  display: inline-block;
  animation: pulseText 2.8s infinite ease-in-out;
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
  stroke: #ff890b;
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

/* Contact Box Styles */
.contact-box {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #ff890b !important;
  border: 3px solid #0c2340;
}

.contact-box:hover {
  background: #0c2340 !important;
  color: #ff890b !important;
  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  border: 3px solid #ff890b;
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
  background: linear-gradient(180deg, #ff890b 0%, #ff890b 50%, #ff890b 100%);
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
  /* animation: glossyShineContinuous 3s linear infinite; */
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

/* Mobile Call Action Button */
.mobile-call {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 8px;
  padding: 12px 14px;
  background: #0c2340;
  color: #fff !important;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  border: none !important;
}

/* Mobile adjustments for contact button */
@media (max-width: 768px) {
  .contact-box .contact-text {
    display: none;
  }
  .contact-box {
    padding: 8px;
    border-radius: 50%;
    background: rgba(12, 35, 64, 0.08);
  }
  .contact-box .phone-icon {
    font-size: 1.15rem;
  }
  .underline-svg {
    height: 12px;
    bottom: -4px;
  }
}

/* @keyframes glossyShineContinuous {
  0% {
    transform: rotate(25deg) translateX(-100%);
  }
  100% {
    transform: rotate(25deg) translateX(100%);
  }
} */

@keyframes festive-express-animation-pulse-grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}
</style>
