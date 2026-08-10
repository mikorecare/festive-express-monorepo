<template>
  <div>
    <!-- Hero Section -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>Holiday Lighting Package Programs</h1>
            <p class="breadcrumb">Choose the perfect package for your home</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div class="product-detail-page">
      <div class="container">
      <div v-if="loading" class="text-center py-5">
        <p class="text-muted fs-5">Loading package options...</p>
      </div>

      <!-- Error / Empty State -->
      <div v-else-if="!packages.length" class="text-center py-5">
        <p class="text-muted fs-5">No packages found at this time.</p>
      </div>

      <!-- Packages Grid -->
      <div v-else class="packages-grid">
        <div 
          v-for="pkg in packages" 
          :key="pkg.id" 
          class="package-card"
          :class="{ 'featured': pkg.isPopular }"
        >
          <!-- Popular Badge -->
          <div v-if="pkg.isPopular" class="popular-badge">Most Popular</div>

          <!-- Package Header -->
          <div class="card-header">
            <h2 class="package-title">{{ pkg.name }}</h2>
            <div class="package-price">
              <span class="currency">$</span>
              <span class="amount">{{ pkg.price }}</span>
            </div>
            <p class="package-desc">{{ pkg.description }}</p>
          </div>

          <!-- Image & Hotspots Preview -->
          <div class="image-section">
            <div class="image-wrapper" @click="openLightbox(pkg)">
              <img 
                :src="getColorImageUrl(pkg.slug, pkg.selectedColor)" 
                :alt="pkg.name" 
                class="package-image"
                @error="handleImageError"
              />

              <!-- Interactive Hotspots -->
              <button
                v-for="spot in getHotspotsForPackage(pkg.slug)"
                :key="spot.key"
                type="button"
                class="hotspot"
                :class="{ active: pkg.activeHotspot === spot.key }"
                :style="{ top: spot.top, left: spot.left }"
                @click.stop="toggleHotspot(pkg, spot.key)"
              >
                <span class="hotspot-dot"></span>
                <span class="hotspot-pulse"></span>
              </button>

              <!-- Hotspot Popup Card -->
              <div
                v-if="pkg.activeHotspot"
                class="hotspot-popup"
                :style="getPopupStyle(pkg)"
                @click.stop
              >
                <button type="button" class="hotspot-close" @click.stop="pkg.activeHotspot = null">×</button>
                <div v-if="getActiveSpot(pkg)?.thumb" class="hotspot-popup-img-wrap">
                  <img :src="getActiveSpot(pkg)?.thumb" :alt="getActiveSpot(pkg)?.label" class="hotspot-popup-img" />
                </div>
                <div class="hotspot-popup-body">
                  <h4 class="hotspot-popup-title">{{ getActiveSpot(pkg)?.label }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- Color Selector -->
          <div class="color-picker-section">
            <label class="color-picker-label">Select C-9 Light Color:</label>
            <div class="color-options">
              <div
                v-for="color in colors"
                :key="color.name"
                class="color-option"
                :class="{ active: pkg.selectedColor === color.name }"
                @click="pkg.selectedColor = color.name"
              >
                <div class="color-swatch" :style="{ backgroundColor: color.hex }"></div>
                <span class="color-name">{{ color.name }}</span>
              </div>
            </div>
          </div>

          <!-- Package Inclusions -->
          <div class="inclusions-section">
            <h3 class="inclusions-title">Package Inclusions:</h3>
            <ul class="inclusions-list">
              <li 
                v-for="(item, idx) in pkg.inclusions" 
                :key="idx"
                class="inclusion-item"
                :class="{ active: pkg.activeHotspot === item.hotspotKey }"
                @click="toggleHotspot(pkg, item.hotspotKey)"
              >
                <span class="check-icon">✔</span>
                <span class="item-text">{{ item.label }}</span>
              </li>
            </ul>
          </div>

          <!-- Action Button -->
          <div class="card-footer">
            <button 
              class="btn-primary add-to-cart-btn"
              @click="addToCartHandler(pkg)"
            >
              Add {{ pkg.name }} Package to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Lightbox -->
    <!-- <div v-if="lightboxImage" class="lightbox" @click.self="lightboxImage = null">
      <button class="lightbox-close" @click="lightboxImage = null">×</button>
      <img :src="lightboxImage" alt="Enlarged View" class="lightbox-image" />
    </div> -->

    
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Our Packages'
})

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toast } from 'sonner'

const route = useRoute()
const productId = route.params.id
const config = useRuntimeConfig()
const { addToCart } = useCart()

type Inclusion = {
  label: string
  hotspotKey?: string
}

type Package = {
  id: number
  name: string
  slug: string
  price: number
  description: string
  isPopular?: boolean
  selectedColor: string
  activeHotspot: string | null
  inclusions: Inclusion[]
}

// State variables
const packages = ref<Package[]>([])
const loading = ref(true)
const lightboxImage = ref<string | null>(null)

const colors = [
  { name: 'Warm White', hex: '#f5e8c7' },
  { name: 'Pure White', hex: '#f8f9fa' },
  { name: 'Champagne', hex: '#f0e4d2' }
]

const allHotspots = [
  { key: 'c9', label: 'C-9 Roofline Lights', top: '31%', left: '72%', thumb: '/Images/Holiday-Lighting-Package/c9lights.png', packages: ['joy', 'jolly', 'merry'] },
  { key: 'wreath', label: 'Deluxe Wreath', top: '60%', left: '38%', thumb: '/Images/Holiday-Lighting-Package/mixed-noble-wreath.png', packages: ['jolly', 'merry'] },
  { key: 'bow', label: '12" Velvet Red Bow', top: '67%', left: '40%', thumb: '/Images/Holiday-Lighting-Package/velvet-red-bow.png', packages: ['jolly'] },
  { key: 'ground', label: 'Ground Stake Lights', top: '86%', left: '64%', thumb: '/Images/Holiday-Lighting-Package/ground-lights.png', packages: ['jolly', 'merry'] },
  { key: 'minis', label: '5mm Tree Mini Lights', top: '76%', left: '11%', thumb: '/Images/Holiday-Lighting-Package/5mm-minis.png', packages: ['merry'] },
  { key: 'bursts', label: 'Light Bursts', top: '80%', left: '27%', thumb: '/Images/Holiday-Lighting-Package/light-bursts.png', packages: ['merry'] }
]

// Helper function to convert API variations or items into local inclusions
const mapInclusions = (pkgData: any): Inclusion[] => {
  if (pkgData.inclusions && Array.isArray(pkgData.inclusions)) {
    return pkgData.inclusions
  }

  const list: Inclusion[] = []
  if (pkgData.variations && Array.isArray(pkgData.variations)) {
    pkgData.variations.forEach((v: any) => {
      v.options?.forEach((opt: any) => {
        const name = opt.name.toLowerCase()
        let key: string | undefined

        if (name.includes('c-9') || name.includes('roofline')) key = 'c9'
        else if (name.includes('wreath')) key = 'wreath'
        else if (name.includes('bow')) key = 'bow'
        else if (name.includes('ground') || name.includes('stake')) key = 'ground'
        else if (name.includes('mini')) key = 'minis'
        else if (name.includes('burst')) key = 'bursts'

        list.push({ label: opt.name, hotspotKey: key })
      })
    })
  }

  return list
}

// API Call on Mount
onMounted(async () => {
  try {
    const res: any = await $fetch('/products/packages', {
      baseURL: config.public.apiBase
    })

    const rawData = Array.isArray(res) ? res : res.data || []

    packages.value = rawData.map((item: any) => {
      const slug = (item.slug || item.name || '').toLowerCase().trim()
      return {
        id: item.id,
        name: item.name,
        slug: slug,
        price: item.price,
        description: item.description,
        isPopular: item.is_popular || slug.includes('jolly'),
        selectedColor: colors[0]?.name ?? 'Warm White',
        activeHotspot: null,
        inclusions: mapInclusions(item)
      }
    })
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    toast.error('Unable to load holiday packages.')
  } finally {
    loading.value = false
  }
})

// UI Helper Methods
const getColorImageUrl = (packageSlug: string, colorName: string) => {
  const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-')
  const capSlug = packageSlug.charAt(0).toUpperCase() + packageSlug.slice(1)
  return `/Images/Colors/${capSlug}-${colorSlug}.jpg`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/Colors/default-house.jpg'
}

const getHotspotsForPackage = (packageSlug: string) => {
  return allHotspots.filter(h => h.packages.includes(packageSlug.toLowerCase()))
}

const toggleHotspot = (pkg: Package, hotspotKey?: string) => {
  if (!hotspotKey) return
  pkg.activeHotspot = pkg.activeHotspot === hotspotKey ? null : hotspotKey
}

const getActiveSpot = (pkg: Package) => {
  if (!pkg.activeHotspot) return null
  return allHotspots.find(h => h.key === pkg.activeHotspot) || null
}

const getPopupStyle = (pkg: Package) => {
  const spot = getActiveSpot(pkg)
  if (!spot) return {}
  return {
    top: `calc(${spot.top} - 12px)`,
    left: spot.left,
    transform: 'translate(-50%, -100%)'
  }
}

const openLightbox = (pkg: Package) => {
  lightboxImage.value = getColorImageUrl(pkg.slug, pkg.selectedColor)
}

const addToCartHandler = async (pkg: Package) => {
  try {
    await addToCart(pkg.id, 1, true, {
      c9_color: pkg.selectedColor
    })

    toast.success(`Added ${pkg.name} Package to cart!`, {
      description: `Color: ${pkg.selectedColor} — $${pkg.price}`
    })
  } catch (err) {
    toast.error(`Failed to add ${pkg.name} Package to cart.`)
  }
}
</script>

<style scoped>
.product-detail-page {
  padding: 60px 0;
  background: #f8fafc;
}

.outdoor-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  align-items: start;
  padding: 40px 0 60px;
}

/* Lights Preview */
.lights-preview-section {
  margin: 0;
  background: #f8fafc;
  border-radius: 16px;
}

.product-image {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.image-wrapper {
  position: relative;
  border-radius: 16px 16px 0 0;
  background: #f1f5f9;
  cursor: zoom-in;
  overflow: visible;
}

.main-image {
  width: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s;
  border-radius: 16px 16px 0 0;
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

/* Color Picker Strip */
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
  justify-content: center;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #d1d5db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.color-option.active .color-swatch {
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.25);
}

.color-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.product-description {
  line-height: 1.7;
  color: #374151;
  font-size: 1.05rem;
  white-space: pre-line;
}

.btn-large {
  width: 100%;
  padding: 18px;
  font-size: 1.2rem;
  margin-top: 24px;
}

.custom-description ul {
  list-style: none;
  padding: 0;
  margin: 24px 0;
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

/* Hotspots */
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
}

.hotspot.active .hotspot-pulse {
  animation: pulseRing 1.6s ease-out infinite;
}

@keyframes pulseRing {
  0% { transform: scale(0.6); opacity: 0.7; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Hotspot Popup */
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

@media (max-width: 900px) {
  .outdoor-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>