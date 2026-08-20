<template>
  <div class="checkout-page min-h-[80vh] bg-[#e7e7e7]">
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 class="text-uppercase">Checkout</h1>
            <p class="breadcrumb">
              Finalize your professional holiday installation details and lock in your festive season dates.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row g-4">
        <!-- LEFT -->
        <div class="col-lg-8">
          <!-- Service Information -->
          <div class="checkout-card mb-4 bg-white rounded-2xl p-7 shadow-sm">
            <h3 class="text-lg font-bold text-[#0c2340] mb-5 flex items-center gap-2">
              <i class="fas fa-user-circle"></i> Service Information
            </h3>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  v-model="form.billing_first_name"
                  type="text"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="John Doe"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  v-model="form.billing_email"
                  type="email"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="john@example.com"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  v-model="form.billing_phone"
                  type="tel"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="(555) 123-4567"
                  required
                >
              </div>
              <div class="col-12">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Installation Address</label>
                <input
                  v-model="form.shipping_address_1"
                  type="text"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="123 Festive Lane, Sarasota, FL 34234"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">ZIP / Postcode</label>
                <input
                  v-model="form.billing_postcode"
                  type="text"
                  maxlength="10"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="e.g. 34236"
                  required
                >
                <small class="block mt-1.5 text-sm text-slate-500">
                  Service area: Sarasota &amp; Manatee counties (incl. Lakewood Ranch)
                </small>
                <p v-if="zipError" class="text-red-500 text-sm mt-1.5">{{ zipError }}</p>
              </div>
              <div class="col-12">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                  Customer Note <span class="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  v-model="form.customer_note"
                  rows="3"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  placeholder="Any special instructions? (gate code, pets, preferred side of house, etc.)"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="checkout-card mb-4 bg-white rounded-2xl p-7 shadow-sm">
            <h3 class="text-lg font-bold text-[#0c2340] mb-5 flex items-center gap-2">
              <i class="fas fa-calendar-alt"></i> Schedule Your Service
            </h3>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Installation Date</label>
                <input
                  v-model="form.preferred_install_date"
                  type="date"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  :min="minDate"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Removal Date</label>
                <input
                  v-model="form.removal_date"
                  type="date"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
                  :min="form.preferred_install_date || minDate"
                >
              </div>
            </div>
          </div>

          <!-- Payment (UI only — Converge handles card) -->
          <div class="checkout-card mb-4 bg-white rounded-2xl p-7 shadow-sm">
            <h3 class="text-lg font-bold text-[#0c2340] mb-5 flex items-center gap-2">
              <i class="fas fa-credit-card"></i> Payment Information
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Card details are collected securely on the Converge payment screen after you click Confirm &amp; Pay.
            </p>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.billing_same" type="checkbox" class="w-auto rounded border-slate-300">
              Billing address is same as installation address
            </label>
          </div>
        </div>

        <!-- RIGHT – Order Summary -->
        <div class="col-lg-4">
          <div class="order-summary sticky top-24 bg-white rounded-2xl p-7 shadow-sm">
            <h3 class="text-xl font-bold text-[#0c2340] mb-5">Order Summary</h3>

            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex justify-between gap-3 mb-3.5 text-[0.95rem]"
            >
              <div class="min-w-0">
                <strong class="text-[#0c2340] block">{{ item.product?.name }}</strong>
                <small v-if="item.options?.c9_color" class="block text-gray-500">
                  {{ item.options.c9_color }} LEDs
                </small>
                <small class="block text-gray-500">Professional Installation</small>
              </div>
              <span class="font-bold text-[#F49322] whitespace-nowrap">
                ${{ (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2) }}
              </span>
            </div>

            <hr class="border-slate-200 my-4">

            <!-- Promo -->
            <div class="mb-4 space-y-2">
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Promo code"
                  class="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322] disabled:bg-slate-50"
                  :disabled="!!appliedPromo"
                  @keyup.enter="() => applyPromo(subtotalBase)"
                >
                <button
                  v-if="!appliedPromo"
                  type="button"
                  class="px-4 py-2.5 bg-[#F49322] text-white rounded-lg text-sm font-medium hover:bg-[#0c2340] transition"
                  @click="() => applyPromo(subtotalBase)"
                >
                  Apply
                </button>
                <button
                  v-else
                  type="button"
                  class="px-4 py-2.5 bg-white border border-slate-200 text-[#0c2340] rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                  @click="removePromo"
                >
                  Remove
                </button>
              </div>
              <p v-if="promoError" class="text-red-500 text-xs">{{ promoError }}</p>
              <p v-else-if="appliedPromo" class="text-emerald-600 text-sm">
                {{ appliedPromo.code }} applied (−${{ promoDiscount.toFixed(2) }})
              </p>
            </div>

            <div class="flex justify-between text-gray-500 mb-2.5 text-[0.95rem]">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-800">${{ subtotalBase.toFixed(2) }}</span>
            </div>

            <div
              v-if="alacarteCartTotal > 0"
              class="flex justify-between text-gray-500 mb-2.5 text-[0.95rem]"
            >
              <span>A la carte</span>
              <span class="font-semibold text-gray-800">${{ alacarteCartTotal.toFixed(2) }}</span>
            </div>

            <div
              v-if="appliedPromo && promoDiscount > 0"
              class="flex justify-between text-gray-500 mb-2.5 text-[0.95rem]"
            >
              <span>Discount ({{ appliedPromo.code }})</span>
              <span class="font-semibold text-emerald-600">−${{ promoDiscount.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-gray-500 mb-2.5 text-[0.95rem]">
              <span>Estimated Taxes</span>
              <span class="font-semibold text-gray-800">${{ estimatedTax.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center mt-4 mb-6 pt-4 border-t border-slate-200 font-bold text-[#0c2340]">
              <span>Grand Total</span>
              <span class="text-3xl text-[#F49322]">${{ grandTotal.toFixed(2) }}</span>
            </div>

            <div class="mb-4 space-y-3">
              <p class="text-sm font-semibold text-[#0c2340]">Payment method</p>
              <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input v-model="paymentMethod" type="radio" value="converge" class="w-auto">
                Credit / Debit Card (Converge Pay)
              </label>

              <label class="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input v-model="paymentMethod" type="radio" value="pay_on_install" class="w-auto mt-0.5">
                <span>
                  <span class="font-medium">Pay on installation</span>
                  <span class="block text-xs text-gray-500">Cash or card with our crew on install day</span>
                </span>
              </label>

            </div>

            <button
              type="button"
              class="w-full py-4 rounded-xl font-bold text-white bg-[#F49322] hover:bg-[#0c2340] transition disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="isPaying || isSubmitting"
              @click="submitCheckout"
            >
              <!-- {{ isPaying ? 'Processing...' : 'Confirm & Pay' }} -->
                {{
                  isPaying
                    ? 'Processing...'
                    : paymentMethod === 'pay_on_install'
                      ? 'Place order'
                      : 'Confirm & Pay'
                }}
            </button>

            <ul class="list-none p-0 my-5 space-y-2">
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <i class="fas fa-check-circle text-emerald-500"></i> SSL Secure Connection
              </li>
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <i class="fas fa-check-circle text-emerald-500"></i> CLIPA Certified Installers
              </li>
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <i class="fas fa-check-circle text-emerald-500"></i> Guaranteed Maintenance
              </li>
            </ul>

            <div class="bg-[#0c2340] text-white rounded-xl p-4 flex justify-between items-center gap-3">
              <div>
                <strong class="block mb-1">Early Bird Special</strong>
                <p class="m-0 text-sm opacity-90 leading-snug">
                  Book before Oct 31st and get a free Mixed Noble Wreath.
                </p>
              </div>
              <i class="fas fa-home text-2xl opacity-80"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

useHead({
  title: 'Checkout - Festive Express',
})

const config = useRuntimeConfig()
const FL_TAX_RATE = Number(config.public.flTaxRate) || 0.07
const { cartItems, cartTotal, loadCart, clearCart } = useCart()
const { isServiceZip, normalizeZip } = useServiceZips()
const {
  promoCode,
  promoError,
  appliedPromo,
  discountAmount,
  applyPromo,
  removePromo,
  loadPromo,
} = usePromo()

const paymentMethod = ref<'converge' | 'pay_on_install'>('converge')
const { pay, isPaying } = useConverge()
const isSubmitting = ref(false)
const zipError = ref('')
const installDeposit = ref(0)

const form = ref({
  billing_first_name: '',
  billing_last_name: '',
  billing_email: '',
  billing_phone: '',
  shipping_address_1: '',
  billing_postcode: '',
  preferred_install_date: '',
  removal_date: '',
  billing_same: true,
  customer_note: '',
})

const alacarteCartTotal = computed(() =>
  cartItems.value.reduce((sum, item: any) => {
    return sum + Number(item.options?.alacarte_total || 0)
  }, 0)
)

const subtotalBase = computed(
  () => Number(cartTotal.value) + Number(alacarteCartTotal.value)
)

const promoDiscount = computed(() => discountAmount(subtotalBase.value))

const estimatedTax = computed(
  () => Math.max(0, subtotalBase.value - promoDiscount.value) * FL_TAX_RATE
)

const grandTotal = computed(() =>
  Math.max(
    0,
    subtotalBase.value - promoDiscount.value + estimatedTax.value + installDeposit.value
  )
)

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toISOString().split('T')[0]
})

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
    subtotal: subtotalBase.value,
    discount_total: promoDiscount.value,
    promo_code: appliedPromo.value?.code || null,
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

const loadConvergeScript = () => {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).PayWithConverge) {
      resolve()
      return
    }
    const demo = true
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

const payWithConverge = async () => {
  if (!validateCheckout()) return

  try {
    const nameParts = form.value.billing_first_name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || firstName

    const payment = await pay({
      amount: grandTotal.value,
      first_name: firstName,
      last_name: lastName,
      email: form.value.billing_email,
      invoice_number: `FLP-${Date.now()}`,
    })

    // Save order in Supabase
    const payload = {
      ...buildOrderPayload(),
      ssl_txn_id: payment.ssl_txn_id || null,
      ssl_approval_code: payment.ssl_approval_code || null,
      payment_status: 'paid',
      status: 'processing',
    }

    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .insert(payload as never)
      .select('id, order_number')
      .single()

    if (error) throw error

    await clearCart()
    removePromo()

    const order = data as { id: string; order_number?: string | null }

    navigateTo(`/thank-you?order=${order.order_number || order.id}`)
  } catch (e: any) {
    if (e?.message === 'cancelled') {
      toast.message('Payment cancelled')
      return
    }
    if (e?.message === 'declined') {
      toast.error('Card declined')
      return
    }
    console.error(e)
    toast.error(e?.data?.statusMessage || e?.message || 'Unable to complete payment')
  }
}

const submitCheckout = async () => {
  if (!validateCheckout()) return

  if (paymentMethod.value === 'pay_on_install') {
    isSubmitting.value = true
    try {
      await saveOrder({
        payment_method: 'pay_on_install',
        payment_status: 'pending',
        status: 'pending',
      })
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Failed to place order')
    } finally {
      isSubmitting.value = false
    }
    return
  }

  // card
  await payWithConverge()
}

const saveOrder = async (payment: {
  payment_method: string
  payment_status: string
  status: string
  ssl_txn_id?: string | null
  ssl_approval_code?: string | null
}) => {
  const supabase = useSupabaseClient()
  const payload = buildOrderPayload()

  // 1) Order only — no items
  const { items, ...orderRow } = payload

  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderRow,
      payment_method: payment.payment_method,
      payment_status: payment.payment_status,
      status: payment.status,
      ssl_txn_id: payment.ssl_txn_id ?? null,
      ssl_approval_code: payment.ssl_approval_code ?? null,
    } as never)
    .select('id, order_number')
    .single()

  if (error) throw error

  const order = data as { id: number | string; order_number?: string | null }

  // 2) Order items
  if (items?.length) {
    const rows = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      total: Number(item.price) * Number(item.quantity),
      meta: item.options || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(rows as never)

    if (itemsError) throw itemsError
  }

  await clearCart()
  removePromo()
  navigateTo(`/thank-you?order=${order.order_number || order.id}`)
}



onMounted(() => {
  loadCart()
  loadPromo()
})
</script>