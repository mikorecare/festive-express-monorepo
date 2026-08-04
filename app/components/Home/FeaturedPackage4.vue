<template>
  <section class="featured-bundles">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Festive Express makes professional holiday lighting simple.</h2>
        <p class="subtitle">Choose one of three fixed packages. <br>
Pay once. Pick your install date and take-down date.  We handle the rest.</p>
      </div>

      <div class="packages-cards-row">
        <div
          v-for="pkg in packageProducts"
          :key="pkg.id"
          class="package-card-v2"
          :style="{ '--accent': pkg.color || '#F49322' }"
        >
          <!-- Photo + overlapping title / lights badge -->
          <div class="card-top">
            <div class="card-image">
              <img
                :src="getImageUrl(pkg.image_url)"
                :alt="pkg.name"
              >
            </div>

            <h3 class="pkg-title">{{ pkg.name }}</h3>

            <div class="lights-badge" aria-hidden="true">
              <span class="sparkle">✦</span>
              <span class="lights-icon">💡</span>
            </div>
          </div>

          <!-- Navy bottom -->
          <div class="card-panel">
            <div class="description-tooltip">
              <button type="button" class="btn-inclusions">
                <span class="gift-icon">🎁</span>
                <span>Discover What’s<br>Included</span>
              </button>
              <div class="tooltip-content">
                <div
                  v-for="(variation, vIndex) in (pkg.variations || [])"
                  :key="vIndex"
                  class="variation-group"
                >
                  <strong>{{ variation.name }}:</strong>
                  <div
                    v-for="(option, oIndex) in variation.options"
                    :key="oIndex"
                    class="feature-line"
                  >
                    <img
                      v-if="option.image_url"
                      :src="getImageUrl(option.image_url)"
                      class="option-preview"
                      alt=""
                    >
                    {{ option.name }}
                  </div>
                </div>
              </div>
            </div>

            <div class="right-actions">
              <div class="price">
                ${{ Number(pkg.price).toFixed(2) }}
              </div>
              <button
                type="button"
                class="btn-cart"
                :aria-label="`Select ${pkg.name}`"
                @click="selectPackage(pkg)"
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup lang="ts">
interface PackageOption {
  name: string
  image_url?: string
}

interface PackageVariation {
  name: string
  options: PackageOption[]
}

interface PackageProduct {
  id: number
  name: string
  price: number | string
  color?: string
  image_url: string | null
  is_package?: boolean
  package_data?: string
  created_at?: string
  variations?: PackageVariation[]
}

const packages = ref<PackageProduct[]>([])

onMounted(async () => {
  try {
    const res: any = await $fetch('/products?is_package=true', {
      baseURL: useRuntimeConfig().public.apiBase,
      params: { status: 'publish' },
    })
    packages.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  }
})

const packageProducts = computed(() =>
  packages.value
    .filter((p) => p.is_package && p.package_data === 'holiday-lighting-package-programs')
    .sort(
      (a, b) =>
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    )
)

const selectPackage = (pkg: PackageProduct) => {
  navigateTo(`/products/${pkg.id}`)
}

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/placeholder.png'
  return `${useRuntimeConfig().public.imageBase}/${url}`
}
</script>

<style scoped>
.featured-bundles {
  padding: 70px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.5rem;
  color: #0c2340;
  margin-bottom: 12px;
}

.subtitle {
  color: #555;
  max-width: 600px;
  margin: 0 auto;
}

.packages-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  justify-items: center;
}

/* Card shell */
.package-card-v2 {
  width: 100%;
  max-width: 340px;
  border-radius: 28px;
  background: #0c2340;
  overflow: hidden;
  box-shadow: 0 14px 36px rgba(12, 35, 64, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.package-card-v2:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 44px rgba(12, 35, 64, 0.36);
}

/* Top: image + overlays */
.card-top {
  position: relative;
  padding: 12px 12px 0;
  background: #0c2340;
}

.card-image {
  border-radius: 22px;
  border: 4px solid var(--accent, #F49322);
  overflow: hidden;
  line-height: 0;
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

/* Script title over bottom-left of photo */
.pkg-title {
  position: absolute;
  left: 22px;
  bottom: -8px;
  margin: 0;
  font-family: 'Playfair Display', Georgia, 'Brush Script MT', cursive;
  font-size: 3.2rem;
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  color: #fff;
  -webkit-text-stroke: 3px var(--accent, #F49322);
  paint-order: stroke fill;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  z-index: 2;
  pointer-events: none;
}

/* Orange circle + lights on right */
.lights-badge {
  position: absolute;
  right: 18px;
  bottom: -28px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent, #F49322);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(244, 147, 34, 0.5);
  z-index: 3;
}

.lights-icon {
  font-size: 1.75rem;
  filter: brightness(2);
}

.sparkle {
  position: absolute;
  left: -6px;
  top: 8px;
  color: #fff;
  font-size: 1rem;
  text-shadow: 0 0 8px #fff;
}

/* Bottom navy panel */
.card-panel {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 36px 18px 22px;
  background: #0c2340;
}

.btn-inclusions {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: left;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-inclusions:hover {
  border-color: var(--accent, #F49322);
  background: rgba(244, 147, 34, 0.15);
}

.gift-icon {
  font-size: 1.35rem;
}

.right-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.price {
  font-size: 1.65rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.btn-cart {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: var(--accent, #F49322);
  color: #fff;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
}

.btn-cart:hover {
  transform: scale(1.08);
  background: #ff9f2e;
}

/* Tooltip */
.description-tooltip {
  position: relative;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 14px;
  width: 280px;
  max-width: 90vw;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
  z-index: 30;
  margin-bottom: 8px;
  text-align: left;
  color: #0c2340;
}

.description-tooltip:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.option-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.85rem;
  }

  .packages-cards-row {
    grid-template-columns: 1fr;
  }

  .pkg-title {
    font-size: 2.6rem;
  }
}
</style>