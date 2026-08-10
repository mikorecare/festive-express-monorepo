<template>
  <div class="packages-page">
    <!-- Hero Section -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content text-center">
            <h1 v-fade>Holiday Lighting Package Programs</h1>
            <p v-fade class="breadcrumb">Choose the perfect package for your home</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <p class="text-lg text-gray-600">Loading package programs...</p>
    </div>

    <!-- Horizontal Package Sections -->
    <div v-else class="package-sections-container">
      <section
        v-for="pkg in orderedPackages"
        :key="pkg.id"
        :id="getPackageSlug(pkg.name)"
        class="package-section"
        :class="[getPackageSlug(pkg.name), { 'bg-alt': getPackageSlug(pkg.name) === 'jolly' }]"
      >
        <div class="container">
          <!-- Package Section Header -->
          <div class="section-header">
            <div class="header-left">
              <span class="badge" :class="getPackageSlug(pkg.name)">
                {{ getBadgeText(pkg.name) }}
              </span>
              <!-- <h2 class="package-title">{{ pkg.name }}</h2> -->
              <img
                class="pkg-title-img"
                :src="getPackageTitleImage(pkg.name)"
                :alt="pkg.name"
              >
            </div>
            <div class="package-price font-color-orange">
              ${{ pkg.price || '0.00' }}
            </div>
          </div>

          <!-- Horizontal 2-Column Product Detail Layout -->
          <div class="horizontal-layout">
            <!-- Left Column: Interactive Image Preview & Color Picker -->
            <div class="media-column">
              <div class="image-wrapper" @click="openLightbox(pkg)">
                <img
                  :src="getColorImageUrl(pkg.name, selectedColors[pkg.id])"
                  :alt="pkg.name"
                  class="main-image"
                  @error="handleImageError"
                />

                <div class="lights-badge" aria-hidden="true">
                  <img
                    class="sparkle-img"
                    src="/Images/Holiday-Lighting-Package/starburst.png"
                    alt=""
                  >
                  <img
                    class="lights-icon-img"
                    :src="getPackageIcon(pkg.name)"
                    alt=""
                  >
                </div>

                <!-- Hotspots -->
                <button
                  v-for="spot in getHotspotsForPackage(pkg.name)"
                  :key="spot.key"
                  type="button"
                  class="hotspot"
                  :class="{ active: activeInclusions[pkg.id] === spot.key }"
                  :style="{ top: spot.top, left: spot.left }"
                  @click.stop="activateHotspot(pkg.id, spot.key)"
                >
                  <span class="hotspot-dot"></span>
                  <span class="hotspot-pulse"></span>
                </button>

                <!-- Hotspot Popup Card -->
                <div
                  v-if="getActiveSpot(pkg.id, pkg.name)"
                  class="hotspot-popup"
                  :style="{ top: getActiveSpot(pkg.id, pkg.name)?.top, left: getActiveSpot(pkg.id, pkg.name)?.left }"
                  @click.stop
                >
                  <button 
                    type="button" 
                    class="hotspot-close" 
                    @click.stop="activeInclusions[pkg.id] = null"
                  >
                    ×
                  </button>
                  <div class="hotspot-popup-img-wrap" v-if="getActiveSpot(pkg.id, pkg.name)?.thumb">
                    <img 
                      :src="getActiveSpot(pkg.id, pkg.name)?.thumb" 
                      :alt="getActiveSpot(pkg.id, pkg.name)?.label" 
                      class="hotspot-popup-img" 
                    />
                  </div>
                  <div class="hotspot-popup-body">
                    <h4 class="hotspot-popup-title">{{ getActiveSpot(pkg.id, pkg.name)?.label }}</h4>
                  </div>
                </div>
              </div>

              <!-- C-9 Color Selection Options -->
              <div class="color-overlay">
                <h4 class="color-title">Select C-9 Light Color</h4>
                <div class="color-options">
                  <div
                    v-for="color in colors"
                    :key="color.name"
                    class="color-option"
                    :class="{ active: selectedColors[pkg.id] === color.name }"
                    @click="selectedColors[pkg.id] = color.name"
                  >
                    <div class="color-swatch" :style="{ backgroundColor: color.hex }"></div>
                    <span class="color-label">{{ color.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Details, Inclusions & Purchase Action -->
            <div class="details-column">
              <!-- <div 
                v-if="pkg.description" 
                class="package-description" 
                v-html="pkg.description"
              ></div> -->

              <div class="inclusions-block">
                <h3>Package Inclusions:</h3>
                <ul v-if="pkg.variations && pkg.variations.length" class="inclusions-list">
                  <li v-for="(variation, vIndex) in pkg.variations" :key="vIndex">
                    <div
                      v-for="(option, oIndex) in variation.options"
                      :key="oIndex"
                      class="feature-line"
                      @click="highlightInclusion(pkg.id, option.name)"
                    >
                      <span v-if="!option.image_url" class="check-icon">✔</span>
                      <img
                        v-if="option.image_url"
                        :src="getImageUrl(option.image_url)"
                        class="option-preview"
                        :alt="option.name"
                      >
                      <span>{{ option.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="p-info-card">
                <p class="info-text">
                  <i class="fas fa-info-circle text-secondary"></i>
                  Includes commercial-grade LEDs, custom fit sizing, professional installation, maintenance, and seasonal removal.
                </p>
              </div>

              <div class="action-block">
                <!-- <button
                  class="btn-primary btn-large"
                  :disabled="pkg.stock <= 0"
                  @click="addToCartHandler(pkg)"
                >
                  {{ pkg.stock <= 0 ? 'Out of Stock' : `Add ${pkg.name} to Cart` }}
                </button> -->

                <button
                  class="btn-primary btn-large"
                  :disabled="pkg.stock <= 0 || addingToCartId === pkg.id"
                  @click="addToCartHandler(pkg)"
                >
                  <span v-if="addingToCartId === pkg.id" class="button-loader">
                    <i class="fas fa-spinner fa-spin"></i> Adding...
                  </span>
                  <span v-else>
                    {{ pkg.stock <= 0 ? 'Out of Stock' : `Add ${pkg.name} to Cart` }}
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="activeLightboxImage" class="lightbox" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">×</button>
      <img
        :src="activeLightboxImage"
        alt="Preview Fullscreen"
        class="lightbox-image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toast } from 'sonner'

const config = useRuntimeConfig()
const { addToCart } = useCart()

interface PackageProduct {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image_url: string | null
  variations: Array<{
    name: string
    options: Array<{
      name: string
      image_url: string
    }>
  }>
}

const packages = ref<PackageProduct[]>([])
const loading = ref(true)

const selectedColors = ref<Record<number, string>>({})
const activeInclusions = ref<Record<number, string | null>>({})
const activeLightboxImage = ref<string | null>(null)

const colors = [
  { name: 'Warm White', hex: '#f5e8c7' },
  { name: 'Pure White', hex: '#f8f9fa' },
  { name: 'Champagne', hex: '#f0e4d2' }
]

useHead({
  title: 'Holiday Lighting Packages - Festive Express'
})

// Hotspots Definition
type Hotspot = {
  key: string
  label: string
  top: string
  left: string
  thumb?: string
  packages: string[]
}

const allHotspots: Hotspot[] = [
  {
    key: 'c9',
    label: 'C-9 Roofline Lights',
    top: '33%',
    left: '72%',
    thumb: '/Images/Holiday-Lighting-Package/c9lights.png',
    packages: ['joy', 'jolly', 'merry']
  },
  {
    key: 'wreath',
    label: '24" Mixed Noble Wreath',
    top: '33%',
    left: '55%',
    thumb: '/Images/Holiday-Lighting-Package/mixed-noble-wreath.png',
    packages: ['jolly', 'merry']
  },
  {
    key: 'bow',
    label: '12" Velvet Red Bow',
    top: '30%',
    left: '57%',
    thumb: '/Images/Holiday-Lighting-Package/velvet-red-bow.png',
    packages: ['jolly', 'merry']
  },
  {
    key: 'ground',
    label: 'Ground Stake Lights',
    top: '86%',
    left: '45%',
    thumb: '/Images/Holiday-Lighting-Package/ground-lights.png',
    packages: ['jolly', 'merry']
  },
  {
    key: 'minis',
    label: '5mm Mini Lights',
    top: '70%',
    left: '76%',
    thumb: '/Images/Holiday-Lighting-Package/5mm-minis.png',
    packages: ['merry']
  },
  {
    key: 'bursts',
    label: 'Light Bursts',
    top: '74%',
    left: '66%',
    thumb: '/Images/Holiday-Lighting-Package/light-bursts.png',
    packages: ['merry']
  }
]

const getPackageSlug = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('merry')) return 'merry'
  if (n.includes('jolly')) return 'jolly'
  return 'joy'
}

// Ensures correct display order: Joy -> Jolly -> Merry
const orderedPackages = computed(() => {
  const order = ['joy', 'jolly', 'merry']
  return [...packages.value].sort((a, b) => {
    return order.indexOf(getPackageSlug(a.name)) - order.indexOf(getPackageSlug(b.name))
  })
})

const getBadgeText = (name: string) => {
  const slug = getPackageSlug(name)
  if (slug === 'joy') return 'STANDARD PACKAGE'
  if (slug === 'jolly') return 'MOST POPULAR PACKAGE'
  if (slug === 'merry') return 'PREMIUM PACKAGE'
  return 'FEATURED PACKAGE'
}

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/Colors/default-house.jpg'
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/Colors/default-house.jpg'
}

const getColorImageUrl = (pkgName: string, colorName?: string) => {
  const packageSlug = getPackageSlug(pkgName).charAt(0).toUpperCase() + getPackageSlug(pkgName).slice(1)
  const colorSlug = (colorName || 'Warm White')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-')
  
  return `/Images/Colors/${packageSlug}-${colorSlug}.jpg`
}

const getHotspotsForPackage = (pkgName: string) => {
  const slug = getPackageSlug(pkgName)
  return allHotspots.filter(s => s.packages.includes(slug))
}

const getActiveSpot = (pkgId: number, pkgName: string) => {
  const key = activeInclusions.value[pkgId]
  if (!key) return null
  return getHotspotsForPackage(pkgName).find(s => s.key === key) || null
}

const activateHotspot = (pkgId: number, key: string) => {
  if (activeInclusions.value[pkgId] === key) {
    activeInclusions.value[pkgId] = null
  } else {
    activeInclusions.value[pkgId] = key
  }
}

const highlightInclusion = (pkgId: number, optionName: string) => {
  const n = optionName.toLowerCase()
  let key: string | null = null
  if (n.includes('c-9') || n.includes('roofline')) key = 'c9'
  else if (n.includes('wreath')) key = 'wreath'
  else if (n.includes('bow')) key = 'bow'
  else if (n.includes('ground') || n.includes('stake')) key = 'ground'
  else if (n.includes('mini')) key = 'minis'
  else if (n.includes('burst')) key = 'bursts'

  activeInclusions.value[pkgId] = key
}

const openLightbox = (pkg: PackageProduct) => {
  activeLightboxImage.value = getColorImageUrl(pkg.name, selectedColors.value[pkg.id])
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  activeLightboxImage.value = null
  document.body.style.overflow = ''
}

// Track loading state per package ID
const addingToCartId = ref<number | null>(null)

const addToCartHandler = async (pkg: PackageProduct) => {
  if (addingToCartId.value === pkg.id) return
  
  addingToCartId.value = pkg.id
  const color = selectedColors.value[pkg.id] || 'Warm White'
  
  try {
    await addToCart(pkg.id, 1, true, { c9_color: color })
    toast.success('Added to cart!', {
      description: `${pkg.name} (${color})`
    })
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    addingToCartId.value = null
  }
}

onMounted(async () => {
  try {
    const res: any = await $fetch('/products?type=packages', {
      baseURL: config.public.apiBase
    })
    
    const allProducts: PackageProduct[] = res?.data || res || []
    packages.value = allProducts.filter(p => 
      ['joy', 'jolly', 'merry'].some(k => p.name.toLowerCase().includes(k))
    )

    packages.value.forEach(pkg => {
      selectedColors.value[pkg.id] = 'Warm White'
      activeInclusions.value[pkg.id] = null
    })
  } catch (error) {
    console.error('Failed to load package programs:', error)
  } finally {
    loading.value = false
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

const BASE = '/Images/Holiday-Lighting-Package'
const getPackageTitleImage = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Jolly.png`
  if (n.includes('merry')) return `${BASE}/Merry.png`
  return `${BASE}/Joy.png`
}

const getPackageIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Icon2.png`
  if (n.includes('merry')) return `${BASE}/Icon3.png`
  return `${BASE}/Icon1.png`
}
</script>

<style scoped>
/* .page-hero {
  position: relative;
  height: 220px;
  background: #0c2340;
  color: #fff;
  display: flex;
  align-items: center;
}

.hero-overlay {
  width: 100%;
}

.hero-content h1 {
  font-size: 2.25rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.breadcrumb {
  font-size: 1.1rem;
  opacity: 0.85;
  margin: 0;
} */

/* Sections Styling */
.package-sections-container {
  display: flex;
  flex-direction: column;
}

.package-section {
  padding: 64px 0;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.package-section.bg-alt {
  background: #f8fafc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.package-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0c2340;
  margin: 0;
}

.pkg-title-img {
  /* position: absolute; */
  left: 45px;
  bottom: -38px;
  height: 72px;
  width: auto;
  z-index: 2;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
}

.lights-badge {
  position: absolute;
  right: 0px;
  bottom: -30px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 6px 16px rgba(244, 147, 33, 0.45);
}

.lights-icon-img {
  width: 76px;
  height: 76px;
  object-fit: contain;
}

.sparkle-img {
  position: absolute;
  left: -46px;
  top: 7px;
  width: 100px;
  height: 100px;
  object-fit: contain;
  z-index: -1;
}

.package-price {
  font-size: 2.25rem;
  font-weight: 800;
  color: #F49322;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #fff;
  background: #0c2340;
  letter-spacing: 0.05em;
}

.badge.jolly {
  background: #F49322;
}

.badge.merry {
  background: #059669;
}

/* Horizontal Layout Inside Each Section */
.horizontal-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 992px) {
  .horizontal-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Media Column & Image Preview */
.media-column {
  display: flex;
  flex-direction: column;
  background: #fff;
  /* border-radius: 16px; */
  /* border: 1px solid #e2e8f0; */
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.image-wrapper {
  position: relative;
  background: #f1f5f9;
  cursor: zoom-in;
  
}

.main-image {
  width: 100%;
  height: 380px;
  object-fit: cover;
  display: block;
  border: 4px solid #ff7a00;
  border-radius: 16px;
  overflow: hidden;
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

/* Popup Card */
.hotspot-popup {
  position: absolute;
  z-index: 10;
  width: 170px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
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
  top: 6px;
  right: 6px;
  z-index: 2;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #0c2340;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.hotspot-close:hover {
  background: #F49322;
}

.hotspot-popup-img-wrap {
  width: 100%;
  height: 100px;
  background: #e2e8f0;
  padding: 6px;
}

.hotspot-popup-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.hotspot-popup-body {
  padding: 10px;
}

.hotspot-popup-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0c2340;
  text-align: center;
}

/* Color Options Below Image */
.color-overlay {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.color-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #0c2340;
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #f8fafc;
}

.color-option.active {
  border-color: #F49322;
  background: #fff7ed;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
}

.color-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

/* Details Column */
.details-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.package-description {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.inclusions-block h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 12px;
}

.inclusions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.feature-line:hover {
  border-color: #F49322;
  background: #fff7ed;
}

.feature-line .check-icon {
  color: #10b981;
}

.feature-line .option-preview {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.feature-line span {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
}

.p-info-card {
  padding: 16px 20px;
  background-color: #eff4ff;
  border: 1px dashed #c5c6ce;
  border-radius: 12px;
}

.info-text {
  margin: 0;
  font-size: 0.9rem;
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Lightbox Modal */
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
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
}


.button-loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>