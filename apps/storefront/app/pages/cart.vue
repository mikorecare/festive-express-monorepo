<template>
  <div class="min-h-screen bg-[#e7e7e7] pb-10">
    <!-- Hero -->
    <section class="page-hero snow-bg relative">
      <div class="hero-overlay">
        <div class="container mx-auto max-w-[1280px] px-5">
          <div class="hero-content py-12 text-center">
            <h1 class="text-3xl md:text-4xl font-bold uppercase text-white">Your Cart</h1>
            <p class="mt-2 text-white/90 max-w-xl mx-auto">
              Review your holiday package selection and secure your installation date.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto max-w-[1280px] px-5 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: items -->
        <div class="lg:col-span-8">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-gray-400 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-[#0c2340] m-0">
              Shopping Bag
              <span class="text-base font-medium text-gray-500">
                ({{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }})
              </span>
            </h2>
            <span class="text-sm text-gray-400">Ready for installation</span>
          </div>

          <!-- Empty -->
          <div
            v-if="!loading && cartItems.length === 0"
            class="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <p class="text-gray-500 text-lg mb-6">Your cart is empty.</p>
            <NuxtLink
              to="/packages"
              class="inline-block bg-[#F49322] hover:bg-[#0c2340] text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Browse Packages
            </NuxtLink>
          </div>

          <div v-else-if="loading" class="bg-white rounded-2xl p-12 text-center text-gray-500">
            Loading cart…
          </div>

          <!-- Items -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col sm:flex-row gap-5 bg-white rounded-2xl p-6 shadow-sm"
            >
              <div class="w-full sm:w-[100px] h-[100px] shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img
                  :src="getImageUrl(item.product?.image_url)"
                  :alt="item.product?.name || 'Product'"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                >
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-[#0c2340] mb-2">
                  {{ item.product?.name || 'Product' }}
                </h3>

                <div v-if="item.options?.c9_color" class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span class="w-2 h-2 rounded-full bg-[#F49322]" />
                  Selected: {{ item.options.c9_color }} LEDs
                </div>

                <div v-if="item.options?.design_name" class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span class="w-2 h-2 rounded-full bg-[#F49322]" />
                  Design: {{ item.options.design_name }}
                </div>

                <div v-if="item.options?.alacarte?.length" class="text-sm text-gray-500 mb-3 space-y-1">
                  <div v-for="(line, i) in item.options.alacarte" :key="i">
                    <i class="fas fa-check text-emerald-500 mr-1" />
                    {{ line.group }} – {{ line.label }}
                    <template v-if="line.lights"> + lights</template>
                    (${{ (Number(line.price) + Number(line.lights_price || 0)).toFixed(2) }})
                  </div>
                </div>

                <div class="flex items-center gap-4 mt-3">
                  <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      class="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg"
                      :disabled="updatingId === item.id"
                      @click="updateQty(item, Number(item.quantity) - 1)"
                    >
                      −
                    </button>
                    <span class="w-10 text-center font-semibold">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg"
                      :disabled="updatingId === item.id"
                      @click="updateQty(item, Number(item.quantity) + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex sm:flex-col justify-between items-end sm:min-w-[110px]">
                <div class="text-xl font-bold text-[#0c2340] whitespace-nowrap">
                  ${{ lineTotal(item).toFixed(2) }}
                </div>
                <button
                  type="button"
                  class="text-red-500 text-sm hover:underline mt-2"
                  :disabled="updatingId === item.id"
                  @click="removeItem(item.id)"
                >
                  <i class="fas fa-trash-alt mr-1" /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: summary -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl p-7 shadow-sm sticky top-24">
            <h3 class="text-xl font-bold text-[#0c2340] mb-5">Order Summary</h3>

            <div class="flex justify-between text-gray-500 mb-3">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-800">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div v-if="alacarteCartTotal > 0" class="flex justify-between text-gray-500 mb-3">
              <span>A la carte</span>
              <span class="font-semibold text-gray-800">${{ alacarteCartTotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-gray-500 mb-3">
              <span>Estimated Tax (FL)</span>
              <span class="font-semibold text-gray-800">${{ estimatedTax.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-end border-t border-gray-200 pt-4 mt-4 mb-6">
              <div>
                <strong class="text-[#0c2340]">Total</strong>
              </div>
              <div class="text-right">
                <div class="text-3xl font-extrabold text-[#F49322]">
                  ${{ grandTotal.toFixed(2) }}
                </div>
                <small class="block text-xs text-gray-400 mt-1 font-medium">
                  PRICING INCLUDES REMOVAL & STORAGE
                </small>
              </div>
            </div>

            <div class="mb-5">
              <label class="text-xs font-bold text-gray-400 tracking-wide">PROMO CODE</label>
              <div class="flex mt-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="GIFT2025"
                  class="flex-1 border border-gray-200 border-r-0 rounded-l-lg px-3 py-2.5 outline-none focus:border-[#0c2340]"
                >
                <button
                  type="button"
                  class="bg-[#0c2340] text-white px-4 rounded-r-lg font-semibold hover:bg-[#F49322] transition"
                  @click="applyPromo"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              type="button"
              class="btn-checkout relative w-full text-center text-white font-bold py-4 rounded-xl border-2 border-[#0c2340] transition disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              :disabled="!cartItems.length || loading"
              @click="handleCheckout"
            >
              Proceed to Checkout <i class="fas fa-arrow-right ml-1" />
              <!-- Glossy Shine Overlay -->
              <div
                class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
              ></div>
            </button>

            <p class="text-xs text-gray-400 text-center mt-3.5 leading-relaxed">
              A representative will contact you within 24 hours to schedule your specific installation date.
            </p>
          </div>
        </div>
      </div>

      <!-- Trust -->
      <div class="flex flex-wrap justify-center gap-10 md:gap-14 mt-12">
        <div class="flex items-center gap-3 text-[#0c2340]">
          <i class="fas fa-lock text-2xl text-[#F49322]" />
          <div>
            <strong class="block text-sm">Secure Checkout</strong>
            <small class="text-gray-400 text-xs">256-bit SSL encrypted payments</small>
          </div>
        </div>
        <div class="flex items-center gap-3 text-[#0c2340]">
          <i class="fas fa-tools text-2xl text-[#F49322]" />
          <div>
            <strong class="block text-sm">Premium Install</strong>
            <small class="text-gray-400 text-xs">CLIPA-certified professionals</small>
          </div>
        </div>
        <div class="flex items-center gap-3 text-[#0c2340]">
          <i class="fas fa-headset text-2xl text-[#F49322]" />
          <div>
            <strong class="block text-sm">Worry-Free</strong>
            <small class="text-gray-400 text-xs">Season-long maintenance included</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Cart',
})

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const FL_TAX_RATE = Number(config.public.flTaxRate) || 0.07

const cart = useCart()
const cartItems = computed(() => cart.cartItems.value)
const cartCount = computed(() => cart.cartCount.value)
const cartTotal = computed(() => Number(cart.cartTotal.value || 0))

const loading = ref(true)
const updatingId = ref<string | number | null>(null)
const promoCode = ref('')
const installDeposit = ref(0)

const alacarteCartTotal = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + Number(item.options?.alacarte_total || 0),
    0
  )
)

const subtotal = computed(() => cartTotal.value)

const estimatedTax = computed(() => subtotal.value * FL_TAX_RATE)

const grandTotal = computed(
  () => subtotal.value + estimatedTax.value + installDeposit.value
  // alacarte already in line price if stored on item.price — don't double-count
)

const lineTotal = (item: any) => {
  const unit = Number(item.price) || Number(item.product?.price) || 0
  const qty = Number(item.quantity) || 1
  return unit * qty
}

// const getImageUrl = (url?: string) => {
//   if (!url) return '/Images/Colors/default-house.jpg'
//   if (url.startsWith('http')) return url
//   const base = String(config.public.imageBase || '').replace(/\/$/, '')
//   return `${base}/${url.replace(/^\//, '')}`
// }

const getImageUrl = (url?: string | null) => {
  if (!url) return '/Images/placeholder-package.jpg'

  // Already absolute, site path, or local preview
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('blob:')
  ) {
    return url
  }

  // DB may store "Products/foo.jpg" or "foo.jpg"
  const path = url
    .replace(/^\//, '')
    .replace(/^Products\//i, '')

  const bucket = (config.public.storageBucket as string) || 'Products'

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl || '/Images/placeholder-package.jpg'
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/placeholder.png'
}

const updateQty = async (item: any, qty: number) => {
  if (qty < 1) return
  updatingId.value = item.id
  try {
    await cart.updateCartItemQty(item.id, qty)
  } catch (e) {
    console.error(e)
  } finally {
    updatingId.value = null
  }
}

const removeItem = async (id: string | number) => {
  updatingId.value = id
  try {
    await cart.removeFromCart(id)
  } catch (e) {
    console.error(e)
  } finally {
    updatingId.value = null
  }
}

const applyPromo = () => {
  alert('Promo applied (demo)')
}

const handleCheckout = () => {
  if (!cartItems.value.length) return
  navigateTo('/checkout')
}

onMounted(async () => {
  await cart.loadCart()
  loading.value = false
})
</script>