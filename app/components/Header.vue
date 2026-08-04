<template>
  <header>
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container">
        <div class="top-content">
          <div class="welcome">
            Welcome to
            <span class="highlight">
              <span class="brand-text">Festive Express</span>
              <svg class="underline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d="M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7" />
              </svg>
            </span>
          </div>

          <!-- <div class="social-icons">
            <a href="#" target="_blank" class="social-link" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
            <a href="#" target="_blank" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" target="_blank" class="social-link" aria-label="X"><i class="fab fa-x-twitter"></i></a>
            <a href="#" target="_blank" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            <a href="#" target="_blank" class="social-link" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
          </div> -->

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


        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header" :class="{ sticky: isSticky }">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <NuxtLink to="/" class="logo">
            <img src="/Images/FE-Logo.jpg" alt="FLP Express Logo" class="logo-img">
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
            <!-- <a href="tel:+19412221012" class="contact-box btn-secondary">
              <span class="phone-icon"><i class="fas fa-phone-alt"></i></span>
              <div class="contact-text">
                <div class="phone-number">(941) 222-1012</div>
                <div class="call-now">CALL US NOW!</div>
              </div>
            </a> -->

            <a :href="telHref" class="contact-box btn-secondary">
              <span class="phone-icon"><i class="fas fa-phone-alt"></i></span>
              <div class="contact-text">
                <div class="phone-number">{{ settings.contact_phone_display || '(941) 222-1012' }}</div>
                <div class="call-now">CALL US NOW!</div>
              </div>
            </a>

            <div class="cart-total">
              <span class="price">${{ cartTotal.toFixed(2) }}</span>
              <NuxtLink to="/cart" class="cart-icon">
                🛒 <span class="count">{{ cartCount }}</span>
              </NuxtLink>
            </div>

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
          <a :href="telHref" class="mobile-call" @click="mobileOpen = false">
            <i class="fas fa-phone-alt"></i> {{ settings.contact_phone_display || '(941) 222-1012' }}
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
  padding: 10px  0;
  font-size: 1rem;
  font-weight: 600;
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-header {
  background: transparent; /* Hero background initially */
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
  color: #F49322;
}

.tagline {
  margin: 0;
  font-size: 1rem;
  color: #1d3156;
  font-weight: 600;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-img {
    max-height: 55px;
  }
}

@media (max-width: 480px) {
  .logo-img {
    max-height: 48px;
  }
}

.contact-box{
  display: flex;
  align-items: center;
  gap: 12px;
  color: #0c2340;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(12, 35, 64, 0.05);
}
.contact-box:hover {
  background: #0c2340;
  color: white;
  transform: translateY(-2px);
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

/* Responsive */
@media (max-width: 768px) {
  .contact-box {
    padding: 6px 12px;
  }
}

/* MAIN MENU */
.menu-bar {
  background: white;
  border-bottom: 3px solid #f5a623;   /* Orange border like your design */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.menu-bar.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
}
.menu-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.main-menu {
  display: flex;
  gap: 32px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 500;
}

.main-menu a {
  color: #1a2b4a;
  text-decoration: none;
  padding: 18px 0;
  transition: color 0.3s;
}

.main-menu a:hover {
  color: #F49322;
}
/* MAIN MENU */

.cart {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.cart-total {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #69727d;
  font-weight: 600;
  padding: 6px 20px;
  border: 1px solid #69727d;
  border-radius: 14px;
  margin: 10px 0;
}

.cart-icon {
  position: relative;
  font-size: 1.4rem;
  color: white;
  text-decoration: none;
}

.count {
  position: absolute;
  top: -4px;
  right: -8px;
  background: #f5a623;
  color: #000;
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 50%;
  font-weight: bold;
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
/* highlight Welcome */

/* Social Icons */
.social-icons {
  display: flex;
  gap: 16px;
}

.social-link {
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #F49322;
  transform: translateY(-4px);
}

/* ==================== RESPONSIVE MEDIA QUERIES ==================== */

@media (max-width: 1024px) {
  .nav-content {
    gap: 20px;
  }
  .search-bar {
    max-width: 350px;
  }
}

@media (max-width: 768px) {
  .top-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .menu-bar ul {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    padding: 10px 0;
  }
  
  
  .logo {
    text-align: center;
    display: block;
  }
}

@media (max-width: 480px) {
  .top-bar {
    font-size: 0.85rem;
  }
  
  .menu-bar ul {
    gap: 10px;
    font-size: 0.9rem;
  }
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
  .header-content {
    gap: 16px;
  }

  .main-menu ul {
    gap: 16px;
  }

  .main-menu a {
    padding: 8px 10px;
    font-size: 0.95rem;
  }

  .contact-box {
    padding: 6px 10px;
  }

  .phone-number {
    font-size: 1rem;
  }

  .logo-img {
    max-height: 60px;
  }
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .top-bar {
    padding: 8px 0;
    font-size: 0.9rem;
  }

  .top-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .social-icons {
    gap: 14px;
    justify-content: center;
  }

  .social-link {
    font-size: 1.25rem;
  }

  .main-header {
    padding: 12px 0;
  }

  .header-content {
    gap: 10px;
    flex-wrap: nowrap;
  }

  .logo {
    align-items: flex-start;
  }

  .logo-img {
    max-height: 48px;
  }

  .tagline {
    font-size: 0.75rem;
  }

  /* Hide desktop nav + full contact text */
  .desktop-nav {
    display: none !important;
  }

  .contact-box .contact-text {
    display: none;
  }

  .contact-box {
    padding: 8px;
    border-radius: 50%;
    background: rgba(12, 35, 64, 0.08);
  }

  .phone-icon {
    font-size: 1.15rem;
  }

  .cart-total {
    padding: 4px 10px;
    margin: 0;
    gap: 6px;
    font-size: 0.85rem;
  }

  .cart-icon {
    font-size: 1.2rem;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-nav {
    display: block;
  }

  /* Sticky: full width white bar */
  .main-header.sticky {
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .welcome {
    font-size: 0.85rem;
  }

  .underline-svg {
    height: 12px;
    bottom: -4px;
  }

  .price {
    display: none; /* icon + count only on very small screens */
  }

  .logo-img {
    max-height: 42px;
  }
}

</style>