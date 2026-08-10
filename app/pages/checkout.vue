<template>
  <div class="checkout-page">
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 class="text-uppercase">Checkout</h1>
            <p class="breadcrumb">Finalize your professional holiday installation details and lock in your festive season dates.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row g-4">
        <!-- LEFT COLUMN -->
        <div class="col-lg-8">

          <!-- Service Information -->
          <div class="checkout-card mb-4">
            <h3 class="card-title">
              <i class="fas fa-user-circle me-2"></i> Service Information
            </h3>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <input v-model="form.billing_first_name" type="text" class="form-control" placeholder="John Doe" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Email Address</label>
                <input v-model="form.billing_email" type="email" class="form-control" placeholder="john@example.com" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Phone Number</label>
                <input v-model="form.billing_phone" type="tel" class="form-control" placeholder="(555) 123-4567" required>
              </div>
              <div class="col-12">
                <label class="form-label">Installation Address</label>
                <input v-model="form.shipping_address_1" type="text" class="form-control" placeholder="123 Festive Lane, Sarasota, FL 34234" required>
              </div>

              <div class="col-md-6">
                <label class="form-label">ZIP / Postcode</label>
                <input
                  v-model="form.billing_postcode"
                  type="text"
                  class="form-control"
                  maxlength="10"
                  placeholder="e.g. 34236"
                  required
                >
                <small class="zip-hint">Service area: Sarasota &amp; Manatee counties (incl. Lakewood Ranch)</small>
                <p v-if="zipError" class="error">{{ zipError }}</p>
              </div>

              <!-- Customer Note -->
              <div class="col-12">
                <label class="form-label">Customer Note <span class="text-muted">(optional)</span></label>
                <textarea 
                  v-model="form.customer_note" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Any special instructions? (gate code, pets, preferred side of house, etc.)"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Schedule Your Service -->
          <div class="checkout-card mb-4">
            <h3 class="card-title">
              <i class="fas fa-calendar-alt me-2"></i> Schedule Your Service
            </h3>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Preferred Installation Date</label>
                <input 
                  v-model="form.preferred_install_date" 
                  type="date" 
                  class="form-control"
                  :min="minDate"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="form-label">Preferred Removal Date</label>
                <input 
                  v-model="form.removal_date" 
                  type="date" 
                  class="form-control"
                  :min="form.preferred_install_date || minDate"
                >
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="checkout-card mb-4">
            <h3 class="card-title">
              <i class="fas fa-credit-card me-2"></i> Payment Information
            </h3>

            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Cardholder Name</label>
                <input v-model="form.card_name" type="text" class="form-control" placeholder="John Doe">
              </div>
              <div class="col-12">
                <label class="form-label">Card Number</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-credit-card"></i></span>
                  <input v-model="form.card_number" type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="19">
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Expiry Date</label>
                <input v-model="form.card_expiry" type="text" class="form-control" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="col-md-6">
                <label class="form-label">CVV</label>
                <input v-model="form.card_cvv" type="text" class="form-control" placeholder="•••" maxlength="4">
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input v-model="form.billing_same" class="form-check-input" type="checkbox" id="billingSame">
                  <label class="form-check-label" for="billingSame">
                    Billing address is same as installation address
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN – Order Summary -->
        <div class="col-lg-4">
          <div class="order-summary sticky-top">
            <h3>Order Summary</h3>

            <!-- Cart Items -->
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <div>
                <strong>{{ item.product?.name }}</strong>
                <small v-if="item.options?.c9_color" class="d-block text-muted">
                  {{ item.options.c9_color }} LEDs
                </small>
                <small class="d-block text-muted">Professional Installation</small>
              </div>
              <span class="font-weight-bold font-color-orange">${{ Number(item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <hr>

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
              <span>Estimated Taxes</span>
              <span class="font-weight-bold">${{ estimatedTax.toFixed(2) }}</span>
            </div>
            <!-- <div class="summary-row">
              <span>Installation Deposit</span>
              <span class="font-weight-bold">${{ installDeposit.toFixed(2) }}</span>
            </div> -->

            <div class="summary-total">
              <span>Grand Total</span>
              <span class="grand-total">${{ grandTotal.toFixed(2) }}</span>
            </div>

            <div class="payment-methods">
              <label class="payment-option">
                <input type="radio" v-model="paymentMethod" value="converge" />
                Credit / Debit Card (Converge Pay)
              </label>
            </div>

            <button
              class="btn-primary"
              :disabled="isPaying"
              @click="payWithConverge"
            >
              {{ isPaying ? 'Processing...' : 'Confirm & Pay' }}
            </button>

            <!-- <button 
              class="btn-confirm" 
              :disabled="isSubmitting"
              @click="placeOrder"
            >
              {{ isSubmitting ? 'Processing...' : 'Confirm & Pay' }}
            </button> -->

            <ul class="trust-list">
              <li><i class="fas fa-check-circle"></i> SSL Secure Connection</li>
              <li><i class="fas fa-check-circle"></i> CLIPA Certified Installers</li>
              <li><i class="fas fa-check-circle"></i> Guaranteed Maintenance</li>
            </ul>

            <!-- Early Bird Promo -->
            <div class="early-bird">
              <div>
                <strong>Early Bird Special</strong>
                <p>Book before Oct 31st and get a free Mixed Noble Wreath.</p>
              </div>
              <i class="fas fa-home"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: computed(() => {
    return 'Checkout - Festive Express'
  })
})
const config = useRuntimeConfig()
const FL_TAX_RATE = Number(config.public.flTaxRate) || 0.07
const { cartItems, cartTotal, cartCount, loadCart, clearCart } = useCart()
const router = useRouter()

const paymentMethod = ref('converge')
const isPaying = ref(false)

const isSubmitting = ref(false)

import { toast } from 'sonner'

const form = ref({
  billing_first_name: '',
  billing_last_name: '',
  billing_email: '',
  billing_phone: '',
  shipping_address_1: '',
  billing_postcode: '',
  preferred_install_date: '',
  removal_date: '',
  card_name: '',
  card_number: '',
  card_expiry: '',
  card_cvv: '',
  billing_same: true,
  customer_note: '',
})

// Sum of a la carte across all items
const alacarteCartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    return sum + Number(item.options?.alacarte_total || 0)
  }, 0)
)

const estimatedTax = computed(() => cartTotal.value * FL_TAX_RATE)
// const installDeposit = ref(250)
const installDeposit = ref(0)
const grandTotal = computed(() => 
  Number(cartTotal.value) + estimatedTax.value + installDeposit.value + alacarteCartTotal.value
)

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 3) // min 3 days from now
  return d.toISOString().split('T')[0]
})

const loadConvergeScript = () => {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).PayWithConverge) {
      resolve()
      return
    }
    const demo = true // match backend CONVERGE_DEMO
    const src = demo
      ? 'https://api.demo.convergepay.com/hosted-payments/PayWithConverge.js'
      : 'https://api.convergepay.com/hosted-payments/PayWithConverge.js'

    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Converge script'))
    document.head.appendChild(s)
  })
}

const buildOrderPayload = () => {
  const nameParts = form.value.billing_first_name.trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || firstName

  return {
    billing_first_name: firstName,
    billing_last_name: lastName,
    billing_email: form.value.billing_email,
    billing_phone: form.value.billing_phone,
    billing_postcode: form.value.billing_postcode,
    shipping_address_1: form.value.shipping_address_1,
    shipping_postcode: form.value.billing_postcode,
    preferred_install_date: form.value.preferred_install_date,
    removal_date: form.value.removal_date || null,
    status: 'processing',
    payment_method: 'converge',
    payment_status: 'paid',
    subtotal: cartTotal.value + alacarteCartTotal.value,
    tax_total: estimatedTax.value,
    total: grandTotal.value,
    items: cartItems.value.map((item: any) => ({
      product_id: item.product_id,
      product_name: item.product?.name || item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options || null,
      is_package: item.is_package || false,
    })),
    customer_note: form.value.customer_note || null,
  }
}

const validateCheckout = () => {
  if (cartItems.value.length === 0) {
    toast.error('Your cart is empty')
    return false
  }
  if (!form.value.billing_first_name || !form.value.billing_email || !form.value.billing_phone) {
    toast.error('Please fill in all required service information')
    return false
  }
  if (!form.value.shipping_address_1) {
    toast.error('Please enter the installation address')
    return false
  }
  if (!validateZips()) {
    toast.error(zipError.value)
    return false
  }
  if (!form.value.preferred_install_date) {
    toast.error('Please select a preferred installation date')
    return false
  }
  return true
}

const payWithConverge = async () => {
  if (!validateCheckout()) return

  isPaying.value = true
  try {
    await loadConvergeScript()

    const nameParts = form.value.billing_first_name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || firstName

    const tokenRes: any = await $fetch('/converge/token', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: {
        amount: grandTotal.value,
        first_name: firstName,
        last_name: lastName,
        email: form.value.billing_email,
        invoice_number: `FLP-${Date.now()}`,
      }
    })

    ;(window as any).PayWithConverge.open(
      { ssl_txn_auth_token: tokenRes.token },
      {
        onError: () => {
          toast.error('Payment error')
          isPaying.value = false
        },
        onCancelled: () => {
          toast.message('Payment cancelled')
          isPaying.value = false
        },
        onDeclined: () => {
          toast.error('Card declined')
          isPaying.value = false
        },
        onApproval: async (payment: any) => {
          try {
            const response: any = await $fetch('/orders', {
              baseURL: config.public.apiBase,
              method: 'POST',
              body: {
                ...buildOrderPayload(),
                ssl_txn_id: payment.ssl_txn_id,
                ssl_approval_code: payment.ssl_approval_code,
              }
            })

            await clearCart()
            navigateTo(`/thank-you?order=${response.order_number || response.id}`)
          } catch (e: any) {
            toast.error(e.data?.message || 'Payment OK but order failed — contact support')
          } finally {
            isPaying.value = false
          }
        }
      }
    )
  } catch (e: any) {
    toast.error(e.data?.message || 'Unable to start payment')
    isPaying.value = false
  }
}

// const placeOrder = async () => {
//   if (cartItems.value.length === 0) {
//     alert('Your cart is empty')
//     return
//   }

//   if (!form.value.billing_first_name || !form.value.billing_email || !form.value.billing_phone) {
//     alert('Please fill in all required service information')
//     return
//   }

//   if (!form.value.preferred_install_date) {
//     alert('Please select a preferred installation date')
//     return
//   }

//   isSubmitting.value = true

//   try {
//     // Split full name
//     const nameParts = form.value.billing_first_name.trim().split(' ')
//     const firstName = nameParts[0] || ''
//     const lastName = nameParts.slice(1).join(' ') || firstName

//     const payload = {
//       billing_first_name: firstName,
//       billing_last_name: lastName,
//       billing_email: form.value.billing_email,
//       billing_phone: form.value.billing_phone,
//       shipping_address_1: form.value.shipping_address_1,
//       preferred_install_date: form.value.preferred_install_date,
//       removal_date: form.value.removal_date || null,
//       status: 'pending',
//       payment_method: 'card',
//       subtotal: cartTotal.value,
//       tax_total: estimatedTax.value,
//       total: grandTotal.value,
//       items: cartItems.value.map((item: any) => ({
//         product_id: item.product_id,
//         product_name: item.product?.name,
//         quantity: item.quantity,
//         price: item.price,
//         options: item.options || null,   // includes c9_color
//         is_package: item.is_package || false,
//       })),
//       customer_note: form.value.customer_note || null,
//     }

//     const response: any = await $fetch('/orders', {
//       baseURL: config.public.apiBase,
//       method: 'POST',
//       body: payload,
//     })

//     await clearCart()

//     // Clear cart after success (optional)
//     // await $fetch('/cart/clear', { baseURL: config.public.apiBase, method: 'DELETE' })

//     navigateTo(`/thank-you?order=${response.order_number || response.id}`)
//   } catch (error: any) {
//     console.error(error)
//     alert(error.data?.message || 'Failed to place order. Please try again.')
//   } finally {
//     isSubmitting.value = false
//   }
// }

const { isServiceZip, normalizeZip } = useServiceZips()

const zipError = ref('')

const validateZips = () => {
  zipError.value = ''

  const zip = normalizeZip(form.value.billing_postcode || '')

  if (!zip || zip.length !== 5) {
    zipError.value = 'Please enter a valid 5-digit ZIP code.'
    return false
  }

  if (!isServiceZip(zip)) {
    zipError.value =
      'Sorry, we only serve the Sarasota / Bradenton / Lakewood Ranch area. Please enter a valid ZIP code.'
    return false
  }

  form.value.billing_postcode = zip
  return true
}


onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.checkout-page {
  background: #e7e7e7;
  min-height: 80vh;
}

.checkout-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 6px;
}

.form-control {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.95rem;
}

.form-control:focus {
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

/* Order Summary */
.order-summary {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  top: 100px;
}

.order-summary h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 0.95rem;
}

.summary-item strong {
  color: #0c2340;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #6b7280;
  font-size: 0.95rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px 0 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-weight: 700;
  color: #0c2340;
}

.grand-total {
  font-size: 2rem;
  color: #F49322;
}

.btn-confirm {
  width: 100%;
  background: #92400e;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-confirm:hover:not(:disabled) {
  background: #0c2340;
}

.btn-confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.trust-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.trust-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 8px;
}

.trust-list i {
  color: #10b981;
}

.early-bird {
  background: #0c2340;
  color: #fff;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.early-bird strong {
  display: block;
  margin-bottom: 4px;
}

.early-bird p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.4;
}

.early-bird i {
  font-size: 2rem;
  opacity: 0.8;
}

.zip-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.85rem;
  color: #64748b;
}
.error {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 6px;
}
</style>