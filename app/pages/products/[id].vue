<template>
  <div>
    <section class="page-hero snow-bg" :class="getHeroClass()">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <div v-if="product?.is_package" class="package-badge">
              <!-- <span class="badge">PACKAGE</span> -->
              <div 
                      class="badge" 
                      :class="{
                        'standard': product?.name?.toLowerCase() === 'joy',
                        'popular': product?.name?.toLowerCase() === 'jolly',
                        'premium': product?.name?.toLowerCase() === 'merry',
                        'new': product?.name?.toLowerCase().includes('new'),
                        'best-seller': product?.name?.toLowerCase().includes('best'),
                        'limited': product?.name?.toLowerCase().includes('limited'),
                        'exclusive': product?.name?.toLowerCase().includes('exclusive'),
                        'featured': !['joy','jolly','merry'].some(n => product?.name?.toLowerCase().includes(n))
                      }"
                    >
                      {{ getBadgeText(product?.name) }}
                    </div>
            </div>
            <h1 class="text-uppercase">{{ product?.name }}</h1>
            <div class="price font-color-orange">
              ${{ product?.price || '0.00' }}
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- ===================== -->
    <!-- 1. Outdoor Packages   -->
    <!-- ===================== -->
    <div class="product-detail-page" v-if="isOutdoorPackage">
      <div class="container">
        <div class="outdoor-layout" v-if="isPackageProduct">

          <!-- LEFT: Preview -->
          <div class="lights-preview-section">
            <div class="product-image">
              <div class="image-wrapper" @click="openLightbox">
                <img
                  :src="getColorImageUrl(selectedColor)"
                  alt=""
                  class="main-image"
                  @error="handleImageError"
                />


                <!-- Hotspots -->
                <button
                  v-for="spot in hotspots"
                  :key="spot.key"
                  type="button"
                  class="hotspot"
                  :class="{ active: activeInclusion === spot.key }"
                  :style="{ top: spot.top, left: spot.left }"
                  @click.stop="activateHotspot(spot)"
                >
                  <span class="hotspot-dot"></span>
                  <span class="hotspot-pulse"></span>
                </button> 

                <!-- Popup card -->
                <!-- <div
                  v-if="activeSpot"
                  class="hotspot-popup"
                  :style="popupStyle"
                >
                  <div class="hotspot-popup-title">{{ activeSpot.label }}</div>
                  <img
                    v-if="activeSpot.thumb"
                    :src="activeSpot.thumb"
                    alt=""
                    class="hotspot-popup-img"
                  />
                  <p v-if="activeSpot.desc" class="hotspot-popup-desc">{{ activeSpot.desc }}</p>
                </div> -->

                <div
                  v-if="activeSpot"
                  class="hotspot-popup"
                  :style="popupStyle"
                  @click.stop
                >
                  <button type="button" class="hotspot-close" @click.stop="activeInclusion = null">
                    ×
                  </button>

                  <div class="hotspot-popup-img-wrap" v-if="activeSpot.thumb">
                    <img :src="activeSpot.thumb" alt="" class="hotspot-popup-img" />
                  </div>

                  <div class="hotspot-popup-body">
                    <h4 class="hotspot-popup-title">{{ activeSpot.label }}</h4>
                    <p v-if="activeSpot.desc" class="hotspot-popup-desc">{{ activeSpot.desc }}</p>
                  </div>
                </div>

                

              </div>

              <!-- Lightbox -->
              <div v-if="showLightbox" class="lightbox" @click.self="closeLightbox">
                <button class="lightbox-close" @click="closeLightbox">×</button>
                <img
                  :src="getColorImageUrl(selectedColor)"
                  alt="Preview"
                  class="lightbox-image"
                />
              </div>

              <!-- Color below image -->
              <div class="color-overlay">
                <h4 class="color-title">Select C-9 Light Color</h4>
                <div class="color-options">
                  <div
                    v-for="color in colors"
                    :key="color.name"
                    class="color-option"
                    :class="{ active: selectedColor === color.name }"
                    @click="selectColor(color)"
                  >
                    <div class="color-swatch" :style="{ backgroundColor: color.hex }"></div>
                    <span class="color-label">{{ color.name }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="product?.description"
                class="product-description mb-4"
                v-html="product.description"
              ></div>
            </div>
          </div>

          <!-- RIGHT: Inclusions + Cart -->
          <div class="product-info-right">
            <div class="custom-description" v-if="product?.has_variations">
              <h2>Package Inclusions:</h2>
              <ul>
                <li v-for="(variation, vIndex) in product.variations" :key="vIndex">
                  <div
                    v-for="(option, oIndex) in variation.options"
                    :key="oIndex"
                    class="feature-line"
                  >
                  <!-- :class="{ active: isActiveOption(option.name) }"
                    @click="highlightInclusion(option.name)" -->
                    <span v-if="!option.image_url" class="check-icon">✔</span>
                    <img
                      v-if="option.image_url"
                      :src="getImageUrl(option.image_url)"
                      class="option-preview"
                    >
                    <span>{{ option.name }}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="p-info-card">
              <p class="d-flex align-items-center gap-3 mb-0">
                <i class="fas fa-info-circle text-secondary text-3xl"></i>
                Professional commercial-grade LEDs with expert installation included.
              </p>
            </div>

            <button
              class="btn-primary btn-large mw-100"
              :disabled="isOutOfStock"
              @click="addToCartHandler"
            >
              {{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>

        </div>
      </div>
    </div>


    <!-- ===================== -->
    <!-- 2. Indoor Packages   -->
    <!-- ===================== -->
    <div class="product-detail-page" v-else-if="isIndoorPackage">
      <div class="container">

        <!-- Step 2: Design themes -->
        <div class="themes-header">
          <div class="step-label">
            <span class="step-num">2.</span>
            <!-- <span class="step-icon">🎄</span> -->
            <h2>Select a design theme</h2>
          </div>
          <div class="themes-badge">
            CHOOSE FROM ANY <span>12 DESIGNS</span>
          </div>
        </div>

        <div class="collections-grid">
          <div
            v-for="collection in designCollections"
            :key="collection.id"
            class="collection-block"
          >
            <div class="collection-title" :style="{ background: collection.color }">
              {{ collection.name }}
            </div>

            <div class="designs-row">
              <div
                v-for="design in collection.designs"
                :key="design.id"
                class="design-card"
                :class="{ active: selectedDesign?.id === design.id }"
                @click="selectDesign(design)"
              >
                <div class="design-image">
                  <img
                    :src="design.image"
                    :alt="design.name"
                    @error="handleImageError"
                  >
                </div>
                <p class="design-name">{{ design.name }}</p>
              </div>
            </div>
          </div>
        </div>


        <!-- Step 3: A La Carte -->
        <div class="alacarte-section" v-if="selectedDesign">
          <div class="themes-header">
            <div class="step-label">
              <span class="step-num">3.</span>
              <!-- <span class="step-icon">🎄</span> -->
              <h2>Add optional elements <span class="alacarte-tag">A LA CARTE</span></h2>
            </div>
            <button type="button" class="btn-skip" @click="skipAlacarte">
              Skip this step →
            </button>
          </div>

          <div class="alacarte-list">
            <div
              v-for="group in alacarteGroups"
              :key="group.id"
              class="alacarte-group"
            >
              <div class="alacarte-group-header">
                <h3>{{ group.name }}</h3>
                <span v-if="group.hasLights" class="lights-badge">+ lights</span>
              </div>

              <div class="alacarte-row">
                <select
                  v-model="alacarteSelections[group.id]"
                  class="alacarte-select"
                >
                  <option value="">None – skip</option>
                  <option
                    v-for="item in group.items"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.label }} — ${{ item.price.toFixed(2) }}
                    <template v-if="item.lightsPrice">
                      (lights +${{ item.lightsPrice.toFixed(2) }})
                    </template>
                  </option>
                </select>

                <label
                  v-if="selectedAlacarteItem(group.id)?.lightsPrice"
                  class="lights-check"
                >
                  <input
                    type="checkbox"
                    v-model="alacarteLights[group.id]"
                  />
                  Add lights (+${{ selectedAlacarteItem(group.id)?.lightsPrice }})
                </label>
              </div>
            </div>
          </div>

          <div class="alacarte-summary" v-if="alacarteTotal > 0">
            A la carte total: <strong>${{ alacarteTotal.toFixed(2) }}</strong>
          </div>
        </div>


        <!-- Selected + Add to cart -->
        <div class="product-grid indoor-actions">
          <div class="product-info-right">
            <div
              v-if="product?.description"
              class="product-description mb-4"
              v-html="product.description"
            ></div>

            <div v-if="selectedDesign" class="selected-label mb-3">
              Selected: <strong>{{ selectedDesign.name }}</strong>
              <span class="collection-tag">{{ selectedDesign.collection }}</span>
            </div>

            <div class="p-info-card mb-4">
              <p class="d-flex align-items-center gap-3 mb-0">
                <i class="fas fa-info-circle text-secondary text-3xl"></i>
                Professional commercial-grade LEDs with expert installation included.
              </p>
            </div>

            <button
              class="btn-primary btn-large mw-100"
              :disabled="isOutOfStock || !selectedDesign"
              @click="addToCartHandler"
            >
              {{ !selectedDesign ? 'Select a Design First' : (isOutOfStock ? 'Out of Stock' : 'Add to Cart') }}
            </button>
          </div>
        </div>






      </div>
    </div>

    <!-- ===================== -->
    <!-- 3. Normal Products   -->
    <!-- ===================== -->
    <div class="product-detail-page" v-else>
      <div class="container">
        <div class="row g-5">
          <!-- Left: Image -->
          <div class="col-md-6">
            <div class="product-image-main">
              <img 
                :src="getImageUrl(product?.image_url)" 
                :alt="product?.name"
                class="img-fluid rounded-4 main-product-img"
                @error="handleImageError"
              >
            </div>

            <!-- Gallery (if available) -->
            <!-- <div v-if="product?.gallery?.length" class="gallery-thumbs mt-3 d-flex gap-2">
              <img 
                v-for="(img, index) in product.gallery" 
                :key="index"
                :src="getImageUrl(img)"
                class="gallery-thumb"
                @click="currentImage = getImageUrl(img)"
              >
            </div> -->
          </div>

          <!-- Right: Info -->
          <div class="col-md-6 product-info-right">
            <div class="price mb-3">
              ${{ product?.price || '0.00' }}
            </div>

            <!-- SKU & Stock --> 
            <div class="meta-row mb-3">
              <span v-if="product?.sku" class="meta-item">
                <strong>SKU:</strong> {{ product.sku }}
              </span>
              <span class="meta-item" :class="stockClass">
                <strong>Stock:</strong> 
                {{ product?.stock > 0 ? `${product.stock} available` : 'Out of Stock' }}
              </span>
            </div>

            <!-- Description -->
            <div 
              v-if="product?.description" 
              class="product-description mb-4"
              v-html="product.description"
            ></div>

            <!-- Variations -->
            <div v-if="product?.has_variations && product?.variations?.length" class="variations-box mb-4">
              <div 
                v-for="(variation, vIndex) in product.variations" 
                :key="vIndex" 
                class="variation-group mb-3"
              >
                <label class="form-label fw-semibold">{{ variation.name }}</label>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="(option, oIndex) in variation.options"
                    :key="oIndex"
                    type="button"
                    class="variation-option"
                    :class="{ active: selectedVariations[vIndex] === option.name }"
                    @click="selectVariation(vIndex, option.name)"
                  >
                    <img 
                      v-if="option.image_url" 
                      :src="getImageUrl(option.image_url)" 
                      class="option-thumb"
                    >
                    {{ option.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="quantity-box mb-4">
              <label class="form-label fw-semibold">Quantity</label>
              <div class="qty-controls">
                <button type="button" class="qty-btn" @click="decreaseQty">−</button>
                <input 
                  type="number" 
                  v-model.number="quantity" 
                  min="1" 
                  :max="product?.stock || 999"
                  class="qty-input"
                >
                <button type="button" class="qty-btn" @click="increaseQty">+</button>
              </div>
            </div>

            <!-- Info Card -->
            <div class="p-info-card mb-4">
              <p class="d-flex align-items-center gap-3 mb-0">
                <i class="fas fa-info-circle text-secondary fs-4"></i>
                Professional commercial-grade LEDs with expert installation included.
              </p>
            </div>

            <!-- Add to Cart -->
            <button 
              class="btn-primary btn-large w-100"
              :disabled="!product?.stock || product.stock <= 0"
              @click="addToCartHandler"
            >
              {{ product?.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
  

      </div>
    </div>

    <!-- Explore More Packages -->
    <section class="explore-packages py-5">
      <div class="container">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <h2 class="section-title mb-1">Explore More Packages</h2>
            <p class="text-muted mb-0">Find the perfect holiday lighting display for your home.</p>
          </div>
          <a href="/packages" class="view-all-link">
            View All Packages <i class="fas fa-arrow-right ms-1"></i>
          </a>
        </div>

        <!-- Dynamic Cards -->
        <div class="row g-4">
          <div 
            v-for="pkg in packageProducts" 
            :key="pkg.id" 
            class="col-md-6"
          >
            <div class="package-card h-100">
              <div class="package-img-wrap">
                <img 
                  :src="getImageUrl(pkg.image_url)" 
                  :alt="pkg.name" 
                  class="package-img"
                  @error="handleImageError"
                >
                <span 
                  class="badge"
                  :class="{
                    'standard': pkg?.name?.toLowerCase() === 'joy',
                    'popular': pkg?.name?.toLowerCase() === 'jolly',
                    'premium': pkg?.name?.toLowerCase() === 'merry',
                    'new': pkg?.name?.toLowerCase().includes('new'),
                    'best-seller': pkg?.name?.toLowerCase().includes('best'),
                    'limited': pkg?.name?.toLowerCase().includes('limited'),
                    'exclusive': pkg?.name?.toLowerCase().includes('exclusive'),
                    'featured': !['joy','jolly','merry'].some(n => pkg?.name?.toLowerCase().includes(n))
                  }"
                >
                  {{ getBadgeText(pkg.name) }}
                </span>
              </div>

              <div class="package-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h3 class="package-name">{{ pkg.name }}</h3>
                  <div class="text-end">
                    <small class="starting-at">STARTING AT</small>
                    <div class="package-price">${{ pkg.price }}</div>
                  </div>
                </div>

                <p class="package-desc">
                  {{ pkg.description || 'Professional holiday lighting package with expert installation.' }}
                </p>

                <NuxtLink 
                  :to="`/products/${pkg.id}`" 
                  class="btn btn-package w-100"
                >
                  View Package Details
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const productId = route.params.id

const config = useRuntimeConfig()
const product = ref<{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_package: boolean;
  package_type: string;
  sku: string;
  has_variations: boolean;           // ← Add this
  variations: Array<{
    name: string;
    options: Array<{
      name: string;
      image_url: string;
    }>;
  }>;
  // add other fields as needed
} | null>(null)
const loading = ref(true)

const quantity = ref(1)
const currentImage = ref('')
const selectedColor = ref('Warm White')
const selectedVariations = ref<Record<number, string>>({})

const packageProducts = ref<any[]>([])

import { toast } from 'sonner'

const colors = [
  { name: 'Warm White', hex: '#f5e8c7' },
  { name: 'Pure White', hex: '#f8f9fa' },
  { name: 'Champagne', hex: '#f0e4d2' }
]

useHead({
  title: computed(() => {
    return product.value?.name 
      ? `${product.value.name}` 
      : 'Product - Festive Lighting Pros Express'
  })
})

const { addToCart } = useCart()

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/Colors/default-house.jpg'
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/Colors/default-house.jpg'
}

const getColorImageUrl = (colorName: string) => {
  const productName = product.value?.name || 'Joy'
  let packageSlug = 'Joy'
  
  if (productName.toLowerCase().includes('jolly')) packageSlug = 'Jolly'
  else if (productName.toLowerCase().includes('merry')) packageSlug = 'Merry'

  const colorSlug = colorName
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-')
  
  // const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-')
  
  console.log('Package detected:', packageSlug, 'Product:', productName)
  
  return `/Images/Colors/${packageSlug}-${colorSlug}.jpg`
}

const selectColor = (color: any) => {
  selectedColor.value = color.name
  currentImage.value = getColorImageUrl(color.name)
}

const getHeroClass = () => {
  if (!product.value) return ''
  const name = product.value.name?.toLowerCase() || ''
  if (name.includes('joy')) return 'page-hero-joy'
  if (name.includes('jolly')) return 'page-hero-jolly'
  if (name.includes('merry')) return 'page-hero-merry'
  return ''
}

const showLightbox = ref(false)

const openLightbox = () => {
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  showLightbox.value = false
  document.body.style.overflow = ''
}

onMounted(async () => {
  selectColor(colors[0])

  try {
    const res: any = await $fetch(`/products/${productId}`, {
      baseURL: config.public.apiBase
    })
    product.value = res
    currentImage.value = res.image_url
  } catch (error) {
    loading.value = false
    console.error('Failed to load product:', error)
  }

  // 
  try {
    const res: any = await $fetch('/products', {
      baseURL: config.public.apiBase,
      params: {
        is_package: 1,
        status: 'publish'
      }
    })
    packageProducts.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))

})

const addToCartHandler = async () => {
  if (!product.value) return

  // 1. Outdoor
  if (isOutdoorPackage.value) {
    await addToCart(product.value.id, quantity.value || 1, true, {
      c9_color: selectedColor.value
    })
    toast.success('Added to cart!', {
      description: `${product.value.name} (${selectedColor.value})`
    })
    return
  }

  // 2. Indoor
  if (isIndoorPackage.value) {
    if (!selectedDesign.value) {
      toast.error('Please select a design theme')
      return
    }
    await addToCart(product.value.id, 1, true, {
      product_name: product.value.name,
      price: Number(product.value.price) + alacarteTotal.value,
      image_url: product.value.image_url,
      package_type: 'indoor',
      design_id: selectedDesign.value.id,
      design_name: selectedDesign.value.name,
      alacarte: getAlacarteOptions(),
      alacarte_total: alacarteTotal.value
    })
    toast.success('Added to cart!', {
      description: `${product.value.name} – ${selectedDesign.value.name}`
    })
    return
  }

  // 3. Normal product
  if (product.value.has_variations && product.value.variations?.length) {
    const missing = product.value.variations.some(
      (_: any, i: number) => !selectedVariations.value[i]
    )
    if (missing) {
      toast.error('Please select all options')
      return
    }
  }

  const options = Object.keys(selectedVariations.value).length
    ? { variations: selectedVariations.value }
    : undefined

  await addToCart(
    product.value.id,
    quantity.value || 1,
    product.value.is_package || false,
    options
  )

  toast.success('Added to cart!', {
    description: `${product.value.name} × ${quantity.value}`
  })
}


const isPackageProduct = computed(() => {
  const name = product.value?.name?.toLowerCase() || ''
  return name.includes('joy') || name.includes('jolly') || name.includes('merry')
})

const getBadgeText = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('joy')) return 'STANDARD'
  if (n.includes('jolly')) return 'POPULAR'
  if (n.includes('merry')) return 'PREMIUM'
  return 'FEATURED' // NEW BEST SELLER LIMITED EXCLUSIVE
}

const isOutdoorPackage = computed(() => {
  const name = product.value?.name?.toLowerCase() || ''
  return name.includes('joy') || name.includes('jolly') || name.includes('merry')
  // or: product.value?.product_type === 'outdoor_package'
})

const isIndoorPackage = computed(() => {
  const name = product.value?.name?.toLowerCase() || ''
  return name.includes('cheer') || name.includes('glow') || 
         name.includes('wonder') || name.includes('bliss')
  // or: product.value?.product_type === 'indoor_package'
})

const isOutOfStock = computed(() => {
  if (isOutdoorPackage.value || isIndoorPackage.value) return false
  return !product.value?.stock || product.value.stock <= 0
})


// const activeInclusion = ref('c9')

// const pins = [
//   { key: 'c9',     label: 'C-9 Roofline Lights',      position: 'top-right' },
//   { key: 'wreath', label: '24" Mixed Noble Wreath',   position: 'mid-left' },
//   { key: 'bow',    label: '12" Velvet Red Bow',       position: 'mid-left-2' },
//   { key: 'ground', label: 'Ground Stake Lights',      position: 'bottom-left' },
//   { key: 'minis',  label: '5mm Mini Lights',          position: 'bottom-right' },
//   { key: 'bursts', label: 'Light Bursts',             position: 'mid-right' },
// ]

// Map option name → key
// const resolveInclusionKey = (name: string) => {
//   const n = name.toLowerCase()
//   if (n.includes('c-9') || n.includes('roofline')) return 'c9'
//   if (n.includes('wreath')) return 'wreath'
//   if (n.includes('bow')) return 'bow'
//   if (n.includes('ground') || n.includes('stake')) return 'ground'
//   if (n.includes('mini')) return 'minis'
//   if (n.includes('burst')) return 'bursts'
//   return 'c9'
// }

// const highlightInclusion = (name: string) => {
//   activeInclusion.value = resolveInclusionKey(name)
// }

// const isActiveOption = (name: string) => {
//   return resolveInclusionKey(name) === activeInclusion.value
// }

// Indoor
const selectedIndoorPackage = ref<any>(null) // set when user picks an indoor package
const selectedDesign = ref<{
  id: number
  name: string
  image: string
  collection: string
} | null>(null)

const designCollections = [
  {
    id: 1,
    name: 'CONTEMPORARY COLLECTION',
    color: '#1e3a5f',
    designs: [
      { id: 1, name: 'Crimson Seasons', image: '/Images/themes/crimson-seasons.png', collection: 'Contemporary' },
      { id: 2, name: 'Northern Seasons', image: '/Images/themes/northern-seasons.png', collection: 'Contemporary' },
      { id: 3, name: 'Winter Seasons', image: '/Images/themes/winter-seasons.png', collection: 'Contemporary' },
    ]
  },
  {
    id: 2,
    name: 'TRADITIONAL COLLECTION',
    color: '#1e3a5f',
    designs: [
      { id: 4, name: 'Scarlet Snow', image: '/Images/themes/scarlet-snow.png', collection: 'Traditional' },
      { id: 5, name: 'Crimson Cheer', image: '/Images/themes/crimson-cheer.png', collection: 'Traditional' },
      { id: 6, name: 'Midnight Jewels', image: '/Images/themes/midnight-jewels.png', collection: 'Traditional' },
    ]
  },
  {
    id: 3,
    name: 'MINIMALISTIC COLLECTION',
    color: '#F49322',
    designs: [
      { id: 7, name: 'Diamonds', image: '/Images/themes/diamonds.png', collection: 'Minimalistic' },
      { id: 8, name: 'Champagne Toast', image: '/Images/themes/champagne-toast.png', collection: 'Minimalistic' },
      { id: 9, name: 'Winter Luxe', image: '/Images/themes/winter-luxe.png', collection: 'Minimalistic' },
    ]
  },
  {
    id: 4,
    name: 'TRENDY COLLECTION',
    color: '#F49322',
    designs: [
      { id: 10, name: 'Frosted Nights', image: '/Images/themes/frosted-nights.png', collection: 'Trendy' },
      { id: 11, name: 'Enchanted Forest', image: '/Images/themes/enchanted-forest.png', collection: 'Trendy' },
      { id: 12, name: 'Heavenly Bordeaux', image: '/Images/themes/heavenly-bordeaux.png', collection: 'Trendy' },
    ]
  },
]

const selectDesign = (design: any) => {
  selectedDesign.value = design
}


// Hotspot
const activeInclusion = ref<string | null>(null)

type Hotspot = {
  key: string
  label: string
  top: string
  left: string
  thumb?: string
  desc?: string
  packages: string[]
}  

const allHotspots: Hotspot[] = [
  {
    key: 'c9',
    label: 'C-9 Roofline Lights',
    top: '31%',
    left: '72%',
    thumb: '/Images/Holiday-Lighting-Package/c9lights.png',
    packages: ['joy', 'jolly', 'merry']
    // desc: 'Professional C-9 LEDs along the roofline'
  },
  {
    key: 'wreath',
    label: '24" Mixed Noble Wreath',
    top: '60%',
    left: '38%',
    thumb: '/Images/Holiday-Lighting-Package/mixed-noble-wreath.png',
    packages: ['jolly', 'merry']
    // desc: 'Classic wreath on the front door'
  },
  {
    key: 'bow',
    label: '12" Velvet Red Bow',
    top: '67%',
    left: '40%',
    thumb: '/Images/Holiday-Lighting-Package/velvet-red-bow.png',
    packages: ['jolly', 'merry']
  },
  {
    key: 'ground',
    label: 'Ground Stake Lights',
    top: '86%',
    left: '64%',
    thumb: '/Images/Holiday-Lighting-Package/ground-lights.png',
    packages: ['jolly', 'merry']
  },
  {
    key: 'minis',
    label: '5mm Mini Lights',
    top: '76%',
    left: '11%',
    thumb: '/Images/Holiday-Lighting-Package/5mm-minis.png',
    packages: ['merry']
  },
  {
    key: 'bursts',
    label: 'Light Bursts',
    top: '80%',
    left: '27%',
    thumb: '/Images/Holiday-Lighting-Package/light-bursts.png',
    packages: ['merry']
  },
]

const packageKey = computed(() => {
  const n = product.value?.name?.toLowerCase() || ''
  if (n.includes('merry')) return 'merry'
  if (n.includes('jolly')) return 'jolly'
  if (n.includes('joy')) return 'joy'
  return ''
})

const hotspots = computed(() =>
  allHotspots.filter(s => s.packages.includes(packageKey.value))
)

const activeSpot = computed(() => {
  if (!activeInclusion.value) return null
  return hotspots.value.find(s => s.key === activeInclusion.value) || null
})

// Popup sits above the active hotspot
const popupStyle = computed(() => {
  const spot = activeSpot.value
  if (!spot) return {}
  return {
    top: `calc(${spot.top} - 14px)`,
    left: spot.left,
    transform: 'translate(-50%, -100%)'
  }
})

const activateHotspot = (spot: (typeof allHotspots)[0]) => {
  if (activeInclusion.value === spot.key) {
    activeInclusion.value = null
    return
  }
  activeInclusion.value = spot.key
}

// Keep your existing inclusion list click
const highlightInclusion = (name: string) => {
  const n = name.toLowerCase()
  let key: string | null = null
  if (n.includes('c-9') || n.includes('roofline')) key = 'c9'
  else if (n.includes('wreath')) key = 'wreath'
  else if (n.includes('bow')) key = 'bow'
  else if (n.includes('ground') || n.includes('stake')) key = 'ground'
  else if (n.includes('mini')) key = 'minis'
  else if (n.includes('burst')) key = 'bursts'

  // Only activate if this package includes it
  if (key && hotspots.value.some(s => s.key === key)) {
    activeInclusion.value = key
  } else {
    activeInclusion.value = null
  }
}


// Ala cart
const skippedAlacarte = ref(false)

const alacarteSelections = ref<Record<number, string>>({})
const alacarteLights = ref<Record<number, boolean>>({})

const alacarteGroups: AlacarteGroup[] = [
  {
    id: 1,
    name: 'Lighted Trees',
    hasLights: false,
    items: [
      { id: 'tree-6.5', label: "6.5'", price: 1049 },
      { id: 'tree-7.5', label: "7.5'", price: 1429 },
      { id: 'tree-8.5', label: "8.5'", price: 1959 },
      { id: 'tree-9.5', label: "9.5'", price: 2349 },
      { id: 'tree-12', label: "12'", price: 3849 },
    ]
  },
  {
    id: 2,
    name: 'Decorated Wreaths',
    hasLights: true,
    items: [
      { id: 'wreath-30', label: '30"', price: 129, lightsPrice: 21 },
      { id: 'wreath-36', label: '36"', price: 199, lightsPrice: 39 },
      { id: 'wreath-48', label: '48"', price: 319, lightsPrice: 56 },
      { id: 'wreath-60', label: '60"', price: 739, lightsPrice: 74 },
    ]
  },
  {
    id: 3,
    name: 'Garlands & Swags',
    hasLights: true,
    items: [
      { id: 'swag-6', label: "6' swag", price: 159, lightsPrice: 21 },
      { id: 'swag-8', label: "8' swag", price: 239, lightsPrice: 39 },
      { id: 'garland-9', label: "9' garland", price: 199, lightsPrice: 56 },
    ]
  },
  {
    id: 4,
    name: 'Column Sprays',
    hasLights: true,
    items: [
      { id: 'spray-24', label: '24"', price: 89, lightsPrice: 21 },
      { id: 'spray-36', label: '36"', price: 149, lightsPrice: 39 },
      { id: 'spray-48', label: '48"', price: 229, lightsPrice: 39 },
      { id: 'spray-60', label: '60"', price: 539, lightsPrice: 74 },
    ]
  },
  {
    id: 5,
    name: 'Branch Displays',
    hasLights: false,
    items: [
      { id: 'branch-3', label: '3\' tall in 12" x 22" container', price: 399 },
      { id: 'branch-5', label: '5\' tall in 16" x 30" container', price: 479 },
    ]
  },
  {
    id: 6,
    name: 'Ornament Vases',
    hasLights: false,
    items: [
      { id: 'vase-16', label: '16" x 8"', price: 109 },
      { id: 'vase-20', label: '20" x 8"', price: 129 },
      { id: 'vase-24', label: '24" x 8"', price: 149 },
    ]
  },
  {
    id: 7,
    name: 'Fresh Poinsettias',
    hasLights: false,
    items: [
      { id: 'poinsettia', label: '6 1/2 pot x 18" tall w/ deco cover', price: 21.95 },
    ]
  },
]

type AlacarteItem = {
  id: string
  label: string
  price: number
  lightsPrice?: number
}

type AlacarteGroup = {
  id: number
  name: string
  hasLights: boolean
  items: AlacarteItem[]
}


const selectedAlacarteItem = (groupId: number) => {
  const id = alacarteSelections.value[groupId]
  if (!id) return null
  const group = alacarteGroups.find(g => g.id === groupId)
  return group?.items.find(i => i.id === id) || null
}

const alacarteTotal = computed(() => {
  let total = 0
  for (const group of alacarteGroups) {
    const item = selectedAlacarteItem(group.id)
    if (!item) continue
    total += item.price
    if (alacarteLights.value[group.id] && item.lightsPrice) {
      total += item.lightsPrice
    }
  }
  return total
})

const getAlacarteOptions = () => {
  if (skippedAlacarte.value) return []
  const list: any[] = []
  for (const group of alacarteGroups) {
    const item = selectedAlacarteItem(group.id)
    if (!item) continue
    list.push({
      group: group.name,
      item_id: item.id,
      label: item.label,
      price: item.price,
      lights: !!alacarteLights.value[group.id],
      lights_price: alacarteLights.value[group.id] ? (item.lightsPrice || 0) : 0
    })
  }
  return list
}

const skipAlacarte = () => {
  skippedAlacarte.value = true
  alacarteSelections.value = {}
  alacarteLights.value = {}
  toast.message('A la carte skipped')
}


</script>

<style scoped>
.product-detail-page {
  padding: 60px 0;
  background: #f8fafc;
}

.page-hero {
  position: relative;
  height: 340px;           /* Smaller height */
  overflow: hidden;
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.page-hero-joy {
  /* background-image: url('/Images/Banner/FLP-Express-Hero-Banner.webp'); */
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.page-hero-jolly {
  /* background-image: url('/Images/Banner/FLP-Express-Hero-Banner.webp'); */
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.page-hero-merry {
  /* background-image: url('/Images/Banner/FLP-Express-Hero-Banner.webp'); */
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.product-grid {
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  gap: 60px;
  align-items: start;
}

/* .main-image {
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  object-fit: cover;
} */

.product-info h1 {
  font-size: 2.8rem;
  color: #0c2340;
  margin-bottom: 8px;
}

.price {
  font-size: 3.2rem;
  font-weight: 800;
  color: #0c2340;
  margin: 16px 0 24px;
}



.package-badge .badge {
  background: #F49322;
  color: white;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 16px;
  position: relative;
  margin: 0 auto 16px;
  left: auto;
  top: 10px;
}


.product-description {
  line-height: 1.7;
  color: #374151;
  font-size: 1.05rem;
  white-space: pre-line;
}

.product-description p {
  margin-bottom: 12px;
}

.product-description ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

/* Lights Preview */
.lights-preview-section {
  margin: 0px 0;
  /* padding: 32px; */
  background: #f8fafc;
  border-radius: 16px;
}

.simulator-title {
  font-size: 1.65rem;
  color: #0c2340;
  margin-bottom: 24px;
}

.product-image {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.image-wrapper {
  position: relative;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #f1f5f9;
  cursor: zoom-in;
  overflow: visible;
}

.main-image {
  width: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s;
  border-radius: 16px 16px 0 0;  /* radius on the image itself */
  object-fit: cover;
}

.image-wrapper:hover .main-image {
  transform: scale(1.02);
}

.zoom-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(12, 35, 64, 0.8);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.image-wrapper:hover .zoom-hint {
  opacity: 1;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: zoom-out;
}

.lightbox-image {
  max-width: 95vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  z-index: 10000;
}

.lightbox-close:hover {
  opacity: 1;
}

.color-overlay {
  padding: 20px 16px 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 16px 16px;
  text-align: center;
}

.color-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #0c2340;
  text-align: center;
}

.color-options {
  display: flex;
  justify-content: center;   /* center the group */
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s;
  min-width: 90px;
  background: #ececec;
}

.color-option:hover {
  background: #f8fafc;
}

.color-option.active {
  border-color: #F49322;
  background: #fff7ed;
}

.color-swatch {
  width: 48px;              /* larger */
  height: 48px;
  border-radius: 50%;
  border: 3px solid #d1d5db; /* stronger border so light colors show */
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* Optional: stronger outline for pure white */
.color-option.active .color-swatch {
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.25);
}

.color-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

/* End */

.form-group {
  margin-bottom: 24px;
}

.quantity-input {
  width: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.1rem;
}

.btn-large {
  width: 100%;
  padding: 18px;
  font-size: 1.2rem;
  margin-top: 24px;
  float: left;
}

.meta-info {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  color: #6b7280;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.custom-description ul {
  list-style: none;
  padding: 0;
  margin: 24px 0;
}

.custom-description li {
  display: block;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.custom-description img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 8px;
  margin-right: 20px !important;
}

.custom-description span {
  font-size: 0.875rem;
  color: #374151;
  font-weight: bold;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.feature-line:hover {
  background: #f8fafc;
  border-color: transparent;
}

.feature-line.active {
  background: #fff7ed;
  border: 2px solid #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

.feature-line .check-icon {
  display: inline-block;
  margin-right: 8px;
}

.feature-line img {
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.p-info-card {
  padding: 1.5rem;
  background-color: #eff4ff;
  border: 1px dashed #c5c6ce;
  border-radius: 0.75rem;
}


/* Explore Other Packages */
.explore-packages {
  background: #f8fafc;
  padding: 60px 0;
}

.section-title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #0c2340;
}

.view-all-link {
  color: #F49322;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all-link:hover {
  color: #0c2340;
  gap: 8px;
}

.package-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.35s ease;
}

.package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}

.package-img-wrap {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.package-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.package-card:hover .package-img {
  transform: scale(1.08);
}

.package-body {
  padding: 28px;
}

.package-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0c2340;
  letter-spacing: 1px;
  margin: 0;
}

.starting-at {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.package-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #F49322;
}

.package-desc {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.btn-package {
  background: #0c2340;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-package:hover {
  background: #F49322;
  color: #fff;
}


.outdoor-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  align-items: start;
  padding: 40px 0 60px;
}

@media (max-width: 900px) {
  .outdoor-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .lights-preview-section {
    position: static;
  }
}



/* ===== Pins (outdoor only) ===== */
/* .pin-label {
  position: absolute;
  z-index: 5;
  display: none;
  align-items: center;
  gap: 0;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  pointer-events: none;
}

.pin-label.active {
  display: inline-flex;
}

.pin-text {
  background: #fff;
  color: #0c2340;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 10px 14px;
  white-space: nowrap;
  line-height: 1.2;
}

.pin-arrow {
  width: 32px;
  height: 32px;
  background: #0c2340;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pin-arrow::after {
  content: '›';
  font-size: 1.15rem;
  font-weight: 700;
} */

/* Positions – tweak to match your photo */
/* .top-right    { top: 25.5%; right: 0%; }
.mid-left     { top: 59%; left: 4%; }
.mid-left-2   { top: 62.5%; left: 9.5%; }
.mid-right    { top: 71%; right: 24%; }
.bottom-left  { bottom: 4%; left: 32.5%; }
.bottom-right { bottom: 5%; right: 35%; } */

/* Left: [text][arrow›] */
/* .mid-left .pin-text,
.mid-left-2 .pin-text,
.bottom-left .pin-text {
  border-radius: 8px 0 0 8px;
}
.mid-left .pin-arrow,
.mid-left-2 .pin-arrow,
.bottom-left .pin-arrow {
  border-radius: 0 8px 8px 0;
} */

/* Right: [‹arrow][text] */
/* .top-right,
.mid-right,
.bottom-right {
  flex-direction: row-reverse;
}
.top-right .pin-text,
.mid-right .pin-text,
.bottom-right .pin-text {
  border-radius: 0 8px 8px 0;
}
.top-right .pin-arrow,
.mid-right .pin-arrow,
.bottom-right .pin-arrow {
  border-radius: 8px 0 0 8px;
}
.top-right .pin-arrow::after,
.mid-right .pin-arrow::after,
.bottom-right .pin-arrow::after {
  content: '‹';
} */


/* Indoor */
/* Indoor design themes (inside product-detail-page) */
.themes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 36px;
}

.step-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0c2340;
}

.step-label h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c2340;
  margin: 0;
}

.themes-badge {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0c2340;
}

.themes-badge span {
  background: #F49322;
  color: #fff;
  padding: 6px 14px;
  margin-left: 6px;
  border-radius: 4px;
}

.collections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 40px;
  margin-bottom: 40px;
}

.collection-title {
  color: #fff;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.designs-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.design-card {
  text-align: center;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: #fff;
  transition: all 0.2s;
}

.design-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.design-card.active {
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.2);
}

.design-image {
  aspect-ratio: 1;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.design-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.design-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.selected-label {
  font-size: 1.05rem;
  color: #0c2340;
}

.collection-tag {
  background: #e2e8f0;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  margin-left: 8px;
}

.indoor-actions {
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 900px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .designs-row {
    grid-template-columns: 1fr 1fr;
  }
}


/* Hotspot */
.hotspot {
  position: absolute;
  z-index: 6;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.hotspot-dot {
  display: block;
  width: 16px;
  height: 16px;
  margin: 6px auto;
  border-radius: 50%;
  background: #0c2340;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
  transition: background 0.2s, transform 0.2s;
}

.hotspot.active .hotspot-dot,
.hotspot:hover .hotspot-dot {
  background: #F49322;
  transform: scale(1.15);
}

.hotspot-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid #F49322;
  opacity: 0;
  animation: none;
}

.hotspot.active .hotspot-pulse {
  animation: pulseRing 1.6s ease-out infinite;
}

@keyframes pulseRing {
  0%   { transform: scale(0.6); opacity: 0.7; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Popup card (like Brisbane Office) */
.hotspot-popup {
  position: absolute;
  z-index: 10;
  width: 180px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
  overflow: hidden;
  pointer-events: auto;
  animation: popupIn 0.2s ease;
}

.hotspot-popup::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #fff;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% + 8px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%);
  }
}

.hotspot-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #0c2340;
  color: #fff;
  font-size: 1.1rem;
  /* line-height: 1; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  transition: background 0.2s, transform 0.2s;
}

.hotspot-close:hover {
  background: #F49322;
  transform: scale(1.08);
}

.hotspot-popup-img-wrap {
  width: 100%;
  height: 140px;
  background: #e2e8f0;
  padding: 10px;
}

.hotspot-popup-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.hotspot-popup-body {
  padding: 14px 16px 16px;
}

.hotspot-popup-title {
  margin: 0 0 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0c2340;
  line-height: 1.3;
  text-align: center;
}

.hotspot-popup-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.45;
}

/* Ala cart */
.alacarte-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
}

.alacarte-tag {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #F49322;
  margin-left: 6px;
}

.btn-skip {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-skip:hover {
  border-color: #0c2340;
  color: #0c2340;
}

.alacarte-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
}

.alacarte-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.alacarte-group-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0c2340;
}

.lights-badge {
  background: #0c2340;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.alacarte-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.alacarte-select {
  flex: 1;
  min-width: 220px;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  color: #0c2340;
}

.alacarte-select:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

.lights-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
}

.alacarte-summary {
  margin-top: 24px;
  font-size: 1.05rem;
  color: #0c2340;
}

.alacarte-summary strong {
  color: #F49322;
}

</style>