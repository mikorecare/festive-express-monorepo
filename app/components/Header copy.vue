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
      
            <div class="social-icons">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-facebook"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-x-twitter"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-youtube"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-pinterest-p"></i></a>
            </div>

        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <div class="logo">
            <img src="/Images/FLP-EXPRESS-BLUE.png" alt="FLP Express Logo" class="logo-img mb-2">
            <p class="tagline">Rent • Relax • Celebrate</p>
          </div>

          <!-- Search -->
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Search product here..." 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            >
            <button @click="handleSearch">Search</button>
          </div>

          <!-- Contact - Right -->
          <a href="tel:+19412221012" class="contact-box">
            <span class="phone-icon"><i class="fas fa-phone-alt"></i></span>
            <div class="contact-text">
              <div class="phone-number">(941) 222-1012</div>
              <div class="call-now">CALL US NOW!</div>
            </div>
          </a>

        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="menu-bar" :class="{ sticky: isSticky }">
      <div class="container">
        <div class="menu-wrapper">
          <ul class="main-menu">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <!-- <li class="dropdown">
              <NuxtLink to="/shop">Shop By <span class="arrow">▼</span></NuxtLink>
            </li>
            <li><NuxtLink to="/membership">Membership</NuxtLink></li> -->
            <li><NuxtLink to="/how-it-works">How It Works</NuxtLink></li>
            <!-- <li><NuxtLink to="/faq">FAQ</NuxtLink></li> -->
            <!-- <li><NuxtLink to="/gallery">Gallery</NuxtLink></li> -->
            <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
          </ul>

          <!-- Cart Total -->
          <div class="cart-total">
            <span class="price">${{ cartTotal.toFixed(2) }}</span>
            <a href="/cart" class="cart-icon">
              🛒 <span class="count">{{ cartCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching:', searchQuery.value)
    // Add navigation or search logic here later
  }
}
// FOR STICKY
import { ref, onMounted, onUnmounted } from 'vue'

const isSticky = ref(false)

const { cartTotal, cartCount } = useCart()


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isSticky.value = window.scrollY > 180   // Change 180 to adjust when it sticks
}

</script>

<style scoped>
.top-bar {
  background: #0c2340;
  color: white;
  padding: 21px  0;
  font-size: 1rem;
  font-weight: 600;
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-header {
  background: #F2F2F2;
  padding: 25px 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: space-between;
  width: 100%;
}

.search-bar {
  flex: 1;
  max-width: 520px;
  display: flex;
}

.search-bar input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 15px 0px 0px 15px;
  font-size: 1.05rem;
  outline: none;
}

.search-bar button {
  background: #0c2340;
  color: white;
  border: none;
  padding: 0 32px;
  border-radius: 0 15px 15px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.05rem;
}

.menu-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.main-menu {
  display: flex;
  gap: 28px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 500;
}

.main-nav {
  background: #0c2340;
  color: white;
  padding: 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-nav ul {
  display: flex;
  gap: 32px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-nav a {
  color: white;
  text-decoration: none;
  padding: 16px 0;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.98rem;
}

.main-nav a:hover,
.main-nav .active {
  color: #F49322;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.logo-img {
  max-height: 88px;        /* Adjust this value to control size */
  width: auto;
  object-fit: contain;
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


</style>