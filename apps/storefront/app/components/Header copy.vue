<template>
  <header>
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container">
        <div class="top-content">
          <!-- Social Icons (Left) -->
          <div class="social-icons">
            <a
              v-if="settings.social_facebook"
              :href="settings.social_facebook"
              target="_blank"
              rel="noopener"
              class="social-link"
              aria-label="Facebook"
            ><i class="fab fa-facebook"></i></a>
            <a
              v-if="settings.social_instagram"
              :href="settings.social_instagram"
              target="_blank"
              rel="noopener"
              class="social-link"
              aria-label="Instagram"
            ><i class="fab fa-instagram"></i></a>
            <a
              v-if="settings.social_x"
              :href="settings.social_x"
              target="_blank"
              rel="noopener"
              class="social-link"
              aria-label="X"
            ><i class="fab fa-x-twitter"></i></a>
            <a
              v-if="settings.social_youtube"
              :href="settings.social_youtube"
              target="_blank"
              rel="noopener"
              class="social-link"
              aria-label="YouTube"
            ><i class="fab fa-youtube"></i></a>
            <a
              v-if="settings.social_pinterest"
              :href="settings.social_pinterest"
              target="_blank"
              rel="noopener"
              class="social-link"
              aria-label="Pinterest"
            ><i class="fab fa-pinterest-p"></i></a>
          </div>

          <!-- Welcome Message (Centered) -->
          <div class="welcome">
            Welcome to
            <span class="highlight">
              <span class="brand-text">Festive Express</span>
              <svg class="underline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d="M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7" />
              </svg>
            </span>
          </div>

          <!-- Spacer div to keep grid center mathematically aligned -->
          <div class="top-bar-spacer"></div>
           


        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header" :class="{ sticky: isSticky }">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <NuxtLink to="/" class="logo">
            <img src="/Images/FE-Logo.png" alt="FLP Express Logo" class="logo-img">
            <p class="tagline">Rent • Relax • Celebrate</p>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="main-menu desktop-nav">
            <ul>
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="/packages">Packages</NuxtLink></li>
              <li><NuxtLink to="/how-it-works">How It Works</NuxtLink></li>
              <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
            </ul>
          </nav>

          <!-- Right actions -->
          <div class="header-actions">
            <a href="tel:9412394722" class="contact-box btn-secondary-2">
              <span class="phone-icon"><i class="fas fa-phone"></i></span>
              <div class="contact-text">
                <div class="call-now">CALL US NOW!</div>
                <div class="phone-number">{{ settings.contact_phone_display || '(941) 239-4722' }}</div>
              </div>
            </a>

            <!-- Hamburger -->
            <button
              type="button"
              class="menu-toggle"
              :aria-expanded="mobileOpen"
              aria-label="Toggle menu"
              @click="mobileOpen = !mobileOpen"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <!-- Mobile nav -->
        <nav class="mobile-nav" :class="{ open: mobileOpen }">
          <ul>
            <li><NuxtLink to="/" @click="mobileOpen = false">Home</NuxtLink></li>
            <li><NuxtLink to="/packages" @click="mobileOpen = false">Packages</NuxtLink></li>
            <li><NuxtLink to="/how-it-works" @click="mobileOpen = false">How It Works</NuxtLink></li>
            <li><NuxtLink to="/contact" @click="mobileOpen = false">Contact Us</NuxtLink></li>
          </ul>
          <!-- <a :href="telHref" class="mobile-call" @click="mobileOpen = false">
            <i class="fas fa-phone-alt"></i> {{ settings.contact_phone_display || '(941) 239-4722' }}
          </a> -->
          <a href="tel:9412394722" class="mobile-call" @click="mobileOpen = false">
            <i class="fas fa-phone-alt"></i> {{ settings.contact_phone_display || '(941) 239-4722' }}
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { settings, loadSettings, telHref } = useSettings()

const isSticky = ref(false)
const mobileOpen = ref(false)

const { cartTotal, cartCount, loadCart } = useCart()

const handleScroll = () => {
  isSticky.value = window.scrollY > 120
}

const router = useRouter()

const scrollTo = async (id: string) => {
  if (route.path !== '/') {
    await navigateTo({ path: '/', hash: `#${id}` })
  }
  await nextTick()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  loadCart()
  loadSettings()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Close menu on route change
const route = useRoute()
watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

</script>

<style scoped>
.top-bar {
  background: #0c2340;
  color: white;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 600;
}

.top-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.welcome {
  text-align: center;
  grid-column: 2;
}

.social-icons {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  grid-column: 1;
  margin-left: 25px;
}

.top-bar-spacer {
  grid-column: 3;
}

.main-header {
  background: transparent;
  padding: 20px 0;
  transition: all 0.3s ease;
}

.main-header.sticky {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: transparent;
}

.logo-img {
  max-height: 70px;
}

.main-menu ul {
  display: flex;
  gap: 32px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-menu a {
  color: #1a2b4a;
  text-decoration: none;
  padding: 8px 16px;
  font-weight: 500;
  transition: color 0.3s;
}

.main-menu a:hover {
  color: #ff7a00;
}

.tagline {
  margin: 0;
  font-size: 1rem;
  color: #1d3156;
  font-weight: 600;
  text-align: center;
}

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
  /* transform: translateY(-2px); */
  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  border: 3px solid #ff890b;
}






/* 3D Glossy Orange Pill Button */
.contact-box.btn-secondary-2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.6rem 2rem;
  border-radius: 50px; /* Fully rounded pill shape */
  text-decoration: none;
  color: #ffffff;
  font-family: inherit;
  
  /* Vibrant Orange-Red Gradient Body */
  background: linear-gradient(180deg, #ff7a00 0%, #ff4500 50%, #e02e00 100%);
  
  /* Thick Red Outer Border & Soft Shadow */
  /* border: 4px solid #cc1100; */
  border: none;
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.35),         /* Drop shadow underneath */
    inset 0 2px 3px rgba(255, 255, 255, 0.6); /* Inner edge top glow */
  
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* Inner Glossy Top Rim Highlight */
.contact-box.btn-secondary-2::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  right: 6px;
  height: 45%;
  border-radius: 40px 40px 20px 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.contact-box.btn-secondary-2::after {
  content: '';
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
  animation: glossyShineContinuous 3s linear infinite;
}

/* Hover & Active States */
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

/* Typography & Icon Layout */
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





.phone-icon {
  font-size: 1.6rem;
  color: inherit;
}

.contact-text {
  text-align: left;
  line-height: 1.2;
}

.phone-number {
  font-size: 1.15rem;
  font-weight: 700;
}

.call-now {
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.9;
}

/* highlight Welcome */
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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes drawLine {
  0% { stroke-dashoffset: 800; }
  25% { stroke-dashoffset: 0; }
  70% { stroke-dashoffset: 0; }
  80% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 800; opacity: 0.6; }
}

/* Social Icons */
.social-link {
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #F49322;
  transform: translateY(-4px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 8px;
  border: 1px solid #0c2340;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: #0c2340;
  border-radius: 2px;
}

.mobile-nav {
  display: none;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-nav.open {
  max-height: 420px;
}

.mobile-nav ul {
  list-style: none;
  margin: 0;
  padding: 12px 0 8px;
}

.mobile-nav a {
  display: block;
  padding: 12px 4px;
  color: #0c2340;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-nav a:hover {
  color: #F49322;
}

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

/* ===== Tablet ===== */
@media (max-width: 1024px) {
  .header-content { gap: 16px; }
  .main-menu ul { gap: 16px; }
  .main-menu a { padding: 8px 10px; font-size: 0.95rem; }
  .contact-box { padding: 6px 10px; }
  .phone-number { font-size: 1rem; }
  .logo-img { max-height: 60px; }
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .top-bar { padding: 8px 0; font-size: 0.9rem; }
  
  .top-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .top-bar-spacer { display: none; }

  .social-icons {
    gap: 14px;
    justify-content: center;
  }

  .social-link { font-size: 1.25rem; }
  .main-header { padding: 12px 0; }
  .header-content { gap: 10px; flex-wrap: nowrap; }
  .logo { align-items: flex-start; }
  .logo-img { max-height: 48px; }
  .tagline { font-size: 0.75rem; }

  .desktop-nav { display: none !important; }
  .contact-box .contact-text { display: none; }
  .contact-box { padding: 8px; border-radius: 50%; background: rgba(12, 35, 64, 0.08); }
  .phone-icon { font-size: 1.15rem; }

  .menu-toggle { display: flex; }
  .mobile-nav { display: block; }

  .main-header.sticky { padding: 10px 0; }
}

@media (max-width: 480px) {
  .welcome { font-size: 0.85rem; }
  .underline-svg { height: 12px; bottom: -4px; }
  .logo-img { max-height: 42px; }
}
</style>