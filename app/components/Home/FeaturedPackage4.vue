<template>
  <section class="featured-bundles" id="packages">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          Festive Express makes<br>professional <span>holiday lighting</span> simple.
        </h2>
        <p class="subtitle">
          Choose one of three fixed packages.<br>
          Pay once. Pick your install date and take-down date. We handle the rest.
        </p>
      </div>

      <div class="packages-cards-row">
        <div
          v-for="pkg in packageProducts"
          :key="pkg.id"
          class="package-card-v2"
        >
          <div class="card-top">
            <div class="card-image">
              <!-- <img
                :src="getImageUrl(pkg.image_url)"
                :alt="pkg.name"
              >
            </div> -->

            <!-- Static -->
            <div class="card-image">
              <img
                :src="getPackagePhoto(pkg.name)"
                :alt="pkg.name"
              >
            </div>
          </div>

            <img
              class="pkg-title-img"
              :src="getPackageTitleImage(pkg.name)"
              :alt="pkg.name"
            >

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
          </div>

          <div class="card-panel">
            <div class="description-tooltip">
              <button
                type="button"
                class="btn-inclusions"
                @click.stop="openTooltipId = openTooltipId === pkg.id ? null : pkg.id"
              >
                <i class="fas fa-gift"></i>
                <span>View Package<br>Inclusions</span>
              </button>

              <div
                class="tooltip-content"
                :class="{ show: openTooltipId === pkg.id }"
              >
                <template v-if="pkg.variations?.length">
                  <div
                    v-for="(variation, vIndex) in pkg.variations"
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
                </template>
                <p v-else class="mb-0">No inclusions listed.</p>
              </div>
            </div>

            <div class="right-actions">
              <div class="price">${{ Number(pkg.price).toFixed(2) }}</div>
              <button
                type="button"
                class="btn-cart"
                :aria-label="`Select ${pkg.name}`"
                @click="selectPackage(pkg)"
              >
                <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-note">
        <h4>
          Every package is professionally installed, maintained through the season,
          and taken down when you’re ready. You simply enjoy the holidays.
        </h4>
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
  image_url: string | null
  is_package?: boolean
  package_data?: string
  created_at?: string
  variations?: PackageVariation[]
}

const packages = ref<PackageProduct[]>([])
const openTooltipId = ref<number | null>(null)

const BASE = '/Images/Holiday-Lighting-Package'

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

// Static for Placeholder Temp
const getPackagePhoto = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/JollyPhoto.webp`
  if (n.includes('merry')) return `${BASE}/MERRYphoto.webp`
  return `${BASE}/JoyPhoto.webp`
}

</script>

<style scoped>
/* Brand tokens */
.featured-bundles {
  --navy: #1C2D5B;
  --orange: #F49321;
  --gray: #D6D7D8;

  padding: 70px 0;
  background: #fff;
  scroll-margin-top: 110px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.5rem;
  color: var(--navy);
  margin-bottom: 12px;
  text-transform: uppercase;
  font-weight: bold;
}
.section-title span{
  color: var(--orange);
}

.subtitle {
  color: #000;
  max-width: 80%;
  margin: 0 auto;
  line-height: 1.3;
  font-size: 1.25rem
}

.packages-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  justify-items: center;
  margin-bottom: 48px;
}

.package-card-v2 {
  width: 100%;
  max-width: 340px;
  border-radius: 28px;
  /* background: var(--navy); */
  overflow: visible;
  box-shadow: 0 14px 36px rgba(28, 45, 91, 0.28);
}

.card-top {
  position: relative;
  padding: 12px 12px 0;
  /* background: var(--navy); */
}

.card-image {
  border-radius: 22px;
  border: 4px solid var(--orange);
  overflow: hidden;
  line-height: 0;
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.pkg-title-img {
  position: absolute;
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
  right: 16px;
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

/* .card-panel {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 140px 18px 22px;
  background: var(--navy);
  border-radius: 28px 28px 0 0;
  margin-top: -90px;
} */

.card-panel {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 140px 18px 22px;
  margin-top: -90px;
  border-radius: 28px 28px 0 0;

  background-color: var(--navy);
  background-image: url('/Images/LV.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 200%; /* or contain / 100% 100% */
}

.btn-inclusions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.btn-inclusions:hover {
  border-color: var(--orange);
  background: rgba(244, 147, 33, 0.15);
}

.btn-inclusions i {
  font-size: 1.4rem;
  color: var(--orange);
}

.btn-inclusions span {
  display: block;
  text-align: center;
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
}

.btn-cart {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: var(--orange);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-cart:hover {
  background: #e08518;
  animation-name: festive-express-animation-pulse-grow;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.btn-cart i {
  font-size: 1.2rem;
  color: #fff;
}

.description-tooltip {
  position: relative;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #fff;
  border: 1px solid var(--gray);
  border-radius: 12px;
  padding: 14px;
  width: 280px;
  max-width: 90vw;
  box-shadow: 0 10px 25px rgba(28, 45, 91, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
  z-index: 30;
  margin-bottom: 8px;
  text-align: left;
  color: var(--navy);
}

.tooltip-content.show {
  opacity: 1;
  visibility: visible;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid var(--gray);
  font-size: 0.9rem;
}

.option-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.footer-note {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 16px;
}

.footer-note h4 {
  color: #000;
  font-weight: 500;
  line-height: 1.3;
  max-width: 80%;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .packages-cards-row {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .pkg-title-img {
    left: 20px;
    bottom: -28px;
    height: 56px;
  }

  .lights-badge {
    right: 12px;
    bottom: -24px;
    width: 64px;
    height: 64px;
  }

  .lights-icon-img {
    width: 64px;
    height: 64px;
  }

  .card-panel {
    padding: 100px 14px 18px; /* less top space */
    margin-top: -70px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .btn-inclusions {
    font-size: 0.72rem;
    padding: 10px 12px;
  }

  .price {
    font-size: 1.4rem;
  }
}
</style>