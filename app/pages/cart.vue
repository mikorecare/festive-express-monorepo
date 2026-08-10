<template>
  <div class="cart-page">
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 class="text-uppercase">Your Cart</h1>
            <p class="breadcrumb">Review your holiday package selection and secure your installation date.</p>
            <!-- <span class="item-count">
              ({{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }})
            </span> -->
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row g-4">
        <!-- Left: Cart Items -->
        <div class="col-lg-8">
          <div class="cart-title-section d-flex justify-content-between align-items-center mb-4">
            <h1 class="cart-title mb-0">
              Shopping Bag
              <span class="item-count">({{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }})</span>
            </h1>
            <span class="ready-text">Ready for installation</span>
          </div>

          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Your cart is empty.</p>
            <NuxtLink to="/packages" class="btn-primary">Browse Packages</NuxtLink>
          </div>

          <div v-else class="cart-items">
            <div 
              v-for="item in cartItems" 
              :key="item.id" 
              class="cart-item"
            >
              <div class="item-image">
                <img 
                  :src="getImageUrl(item.product?.image_url)" 
                  :alt="item.product?.name"
                  @error="handleImageError"
                >
              </div>

              <div class="item-details">
                <!-- <span 
                  class="item-badge"
                  :class="item.is_package ? 'package' : 'addon'"
                >
                  {{ item.is_package ? 'PACKAGE' : 'ADD-ON' }}
                </span> -->

                <!-- <span 
                  class="item-badge" 
                      :class="{
                        'standard': item.product?.name?.toLowerCase() === 'joy',
                        'popular': item.product?.name?.toLowerCase() === 'jolly',
                        'premium': item.product?.name?.toLowerCase() === 'merry',
                        'new': item.product?.name?.toLowerCase().includes('new'),
                        'best-seller': item.product?.name?.toLowerCase().includes('best'),
                        'limited': item.product?.name?.toLowerCase().includes('limited'),
                        'exclusive': item.product?.name?.toLowerCase().includes('exclusive'),
                        'featured': !['joy','jolly','merry'].some(n => item.product?.name?.toLowerCase().includes(n))
                      }"
                    >
                      {{ getBadgeText(item.product?.name) }}
                </span> -->

                <h3 class="item-name">{{ item.product?.name || item.name }}</h3>

                <!-- Options (e.g. C-9 color) -->
                <div v-if="item.options?.c9_color" class="item-option">
                  <span class="dot"></span>
                  Selected: {{ item.options.c9_color }} LEDs
                </div>

                <!-- Indoor: design theme -->
                <div v-if="item.options?.design_name" class="item-option">
                  <span class="dot"></span>
                  Design: {{ item.options.design_name }}
                </div>

                <!-- Indoor: a la carte -->
                <div
                  v-if="item.options?.alacarte?.length"
                  class="item-features"
                >
                  <div
                    v-for="(line, i) in item.options.alacarte"
                    :key="i"
                  >
                    <i class="fas fa-check"></i>
                    {{ line.group }} – {{ line.label }}
                    <template v-if="line.lights"> + lights</template>
                    (${{ (Number(line.price) + Number(line.lights_price || 0)).toFixed(2) }})
                  </div>
                </div>
                

                <div v-if="item.is_package && !item.options?.alacarte?.length" class="item-features">
                  <div><i class="fas fa-check"></i> Custom-fit installation</div>
                  <div><i class="fas fa-check"></i> 24-hour repair guarantee</div>
                </div>

                <div class="item-actions" v-if="!item.is_package">
                  <div class="qty-controls">
                    <button @click="updateQty(item, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQty(item, item.quantity + 1)">+</button>
                  </div>
                  <!-- <button class="remove-btn" @click="removeItem(item.id)">
                    <i class="fas fa-trash-alt"></i> Remove
                  </button> -->
                </div>
              </div>

              <div class="item-right">
                <div class="item-price">
                  ${{ Number(item.price).toFixed(2) }}
                </div>

                <!-- Optional breakdown -->
                <div
                  v-if="item.options?.alacarte_total > 0"
                  class="item-option"
                >
                  <span class="dot"></span>
                  Incl. a la carte <span class="font-weight-bold">${{ Number(item.options.alacarte_total).toFixed(2) }}</span>
                </div>
                
                <button class="remove-btn" @click="removeItem(item.id)">
                  <i class="fas fa-trash-alt"></i> Remove
                </button>
              </div>
            </div>
              
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="col-lg-4">
          <div class="order-summary">
            <h3>Order Summary</h3>

            <div class="summary-row">
              <span>Subtotal</span>
              <span class="font-weight-bold">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <!-- Optional: sum of all a la carte in cart -->
            <div class="summary-row" v-if="alacarteCartTotal > 0">
              <span>A la carte</span>
              <span class="font-weight-bold">${{ alacarteCartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Estimated Tax (FL)</span>
              <span class="font-weight-bold">${{ estimatedTax.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Installation Deposit</span>
              <span class="font-weight-bold">${{ installDeposit.toFixed(2) }}</span>
            </div>

            <div class="summary-total">
              <div>
                <strong>Total</strong>
          
              </div>
              <div class="total-amount">${{ grandTotal.toFixed(2) }}
                <small>PRICING INCLUDES REMOVAL & STORAGE</small>
              </div>
            </div>

            
            <div class="promo-box">
              <label>PROMO CODE</label>
              <div class="promo-input">
                <input v-model="promoCode" type="text" placeholder="GIFT2025">
                <button @click="applyPromo">Apply</button>
              </div>
            </div>

            <NuxtLink to="/checkout" class="btn-checkout"
              :class="{ 'disabled-link': !cartItems.length }"
  :aria-disabled="!cartItems.length"
  @click.prevent="!cartItems.length && $event.preventDefault()"
            >
              Proceed to Checkout <i class="fas fa-arrow-right"></i>
            </NuxtLink>

            <p class="checkout-note">
              A representative will contact you within 24 hours to schedule your specific installation date.
            </p>
          </div>
        </div>
      </div>

      <!-- Trust badges -->
      <div class="trust-row mt-5">
        <div class="trust-item">
          <i class="fas fa-lock"></i>
          <div>
            <strong>Secure Checkout</strong>
            <small>256-bit SSL encrypted payments</small>
          </div>
        </div>
        <div class="trust-item">
          <i class="fas fa-tools"></i>
          <div>
            <strong>Premium Install</strong>
            <small>CLIPA-certified professionals</small>
          </div>
        </div>
        <div class="trust-item">
          <i class="fas fa-headset"></i>
          <div>
            <strong>Worry-Free</strong>
            <small>Season-long maintenance included</small>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: computed(() => {
    return 'Cart - Festive Lighting Pros Express'
  })
})
const config = useRuntimeConfig()
const FL_TAX_RATE = Number(config.public.flTaxRate) || 0.07
const { cartTotal, cartCount, cartItems, loadCart, removeFromCart } = useCart()


// Sum of a la carte across all items
const alacarteCartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    return sum + Number(item.options?.alacarte_total || 0)
  }, 0)
)

const promoCode = ref('')
const estimatedTax = computed(() =>
  Number(cartTotal.value) * FL_TAX_RATE
)
const installDeposit = ref(250)
const grandTotal = computed(() => 
  Number(cartTotal.value) + estimatedTax.value + installDeposit.value + alacarteCartTotal.value
)

const getImageUrl = (url: string | undefined) => {
  if (!url) return '/Images/Colors/default-house.jpg'
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/Colors/placeholder.jpg'
}

const updateQty = async (item: any, qty: number) => {
  if (qty < 1) return
  // Optional: call API to update quantity
  item.quantity = qty
  await loadCart()
}

const removeItem = async (id: number) => {
  await removeFromCart(id)
}

const applyPromo = () => {
  // placeholder
  alert('Promo applied (demo)')
}

onMounted(() => loadCart())


// Refresh cart after remove
const removeFromCartHandler = async (id: number) => {
  await removeFromCart(id)
  window.location.reload()  // Temporary fix to refresh header
}

onMounted(loadCart)

const getBadgeText = (name?: string | null) => {
  const n = name?.toLowerCase() || ''
  
  if (n.includes('joy')) return 'STANDARD'
  if (n.includes('jolly')) return 'POPULAR'
  if (n.includes('merry')) return 'PREMIUM'
  if (n.includes('new')) return 'NEW'
  if (n.includes('best')) return 'BEST SELLER'
  if (n.includes('limited')) return 'LIMITED'
  if (n.includes('exclusive')) return 'EXCLUSIVE'
  
  return 'FEATURED'
}

</script>

<style scoped>
.cart-page {
  padding: 0 0 40px;
  background: #e7e7e7;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-hero {
  position: relative;
  height: 340px;           /* Smaller height */
  overflow: hidden;
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.cart-title-section{
  border-bottom: 2px solid #9ca3af;
  padding-bottom: 15px;
}
.cart-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0c2340;
}

.item-count {
  font-weight: 500;
  color: #6b7280;
  font-size: 16px;
}

.ready-text {
  color: #9ca3af;
  font-size: 0.9rem;
}

.cart-item {
  display: flex;
  gap: 20px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  align-items: stretch;
}

.item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* price top, remove bottom */
  align-items: flex-end;
  min-width: 100px;
}

.item-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: 6px;
  color: #fff;
}

.item-badge.package {
  background: #fff7ed;
  color: #F49322;
}

.item-badge.addon {
  background: #eff6ff;
  color: #2563eb;
}

.item-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 6px;
}

.item-option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #F49322;
  border-radius: 50%;
}

.item-features {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 12px;
}

.item-features i {
  color: #10b981;
  margin-right: 6px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.qty-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.qty-controls button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f9fafb;
  cursor: pointer;
}

.qty-controls span {
  width: 40px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.9rem;
  cursor: pointer;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c2340;
  white-space: nowrap;
}

/* Order Summary */
.order-summary {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
}

.order-summary h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #6b7280;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  margin: 16px 0 24px;
}

.summary-total small {
  display: block;
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 2px;
  font-weight: 500;
}

.total-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #F49322;
  text-align: right;
}

.promo-box label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.promo-input {
  display: flex;
  margin-top: 8px;
  margin-bottom: 20px;
}

.promo-input input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 8px 0 0 8px;
  padding: 10px 14px;
  border-right: none;
}

.promo-input button {
  background: #0c2340;
  color: #fff;
  border: none;
  padding: 0 18px;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
}

.btn-checkout {
  display: block;
  width: 100%;
  text-align: center;
  background: #F49322;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-checkout:hover {
  background: #0c2340;
  color: #fff;
}

.checkout-note {
  font-size: 0.8rem;
  color: #9ca3af;
  text-align: center;
  margin-top: 14px;
  line-height: 1.5;
}

/* Trust row */
.trust-row {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #0c2340;
}

.trust-item i {
  font-size: 1.5rem;
  color: #F49322;
}

.trust-item strong {
  display: block;
  font-size: 0.95rem;
}

.trust-item small {
  color: #9ca3af;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
  }
  .item-price {
    align-self: flex-end;
  }
}

</style>