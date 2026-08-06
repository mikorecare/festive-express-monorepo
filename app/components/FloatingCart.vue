<!-- components/FloatingCart.vue -->
<template>
  <Transition name="fade-slide">
    <div v-if="cartCount >= 0" class="floating-cart-container">
      <NuxtLink to="/cart" class="cart-total-link" aria-label="View Cart">
        <!-- Price on the Left -->
        <span class="price-content">
          <span class="price">${{ Number(cartTotal).toFixed(2) }}</span>
        </span>

        <!-- Icon & Count Badge on the Right -->
        <div class="cart-icon">
          <span class="icon"><i class="fas fa-shopping-cart"></i></span>
          <span class="count" :key="cartCount">{{ cartCount }}</span>
        </div>
      </NuxtLink>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { cartTotal, cartCount, loadCart } = useCart()

onMounted(() => {
  if (typeof loadCart === 'function') {
    loadCart()
  }
})
</script>

<style scoped>
.floating-cart-container {
  position: fixed;
  bottom: 170px;
  right: 30px;
  z-index: 999;
  font-family: 'Poppins', 'Roboto', sans-serif;
  display: flex;
  justify-content: flex-end;

  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.cart-total-link {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #172a50;
  border: 3px solid #ff890b;
  border-radius: 50px;
  width: 60px;
  height: 60px;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  text-decoration: none;
  cursor: pointer;
  margin-left: auto;
  overflow: visible;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
}

.cart-total-link:hover {
  width: 175px; 
  box-shadow: 0 12px 28px rgba(247, 148, 29, 0.4);
  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff890b;
  color: #ffffff;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: visible;
  transition: background-color 0.25s ease;
}

.cart-icon .icon {
  font-size: 1.2rem;
}

.cart-total-link:hover .cart-icon {
  background-color: #ff890b;
}

.count {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 10;
  background-color: #ffffff;
  color: #172a50;
  font-size: 0.8rem;
  font-weight: 800;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ff890b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
}

.price-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-grow: 1;
  overflow: hidden;
}

.price {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  padding-left: 18px;
  padding-right: 12px;
  opacity: 0;
  transition: opacity 0.2s ease 0.1s;
}

.cart-total-link:hover .price {
  opacity: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 576px) {
  .floating-cart-container {
    bottom: 20px;
    right: 20px;
  }
}
</style>