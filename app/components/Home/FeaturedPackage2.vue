<template>
  <section class="packages-compare">
    <div class="container">
      <h2 v-fade class="section-title">CHOOSE YOUR <span class="highlight">HOLIDAY</span> PACKAGE</h2>
      <p v-fade class="section-sub">COMPARE WHAT’S INCLUDED IN EACH PLAN</p>

      <div class="compare-grid">
        <div 
          class="package-col" 
          v-for="pkg in packageProducts" 
          :key="pkg.id"
          :class="{ popular: pkg.is_popular }"
        >
          <!-- Package Header -->
          <div class="package-header">
            <div class="title-img-wrapper">
              <img
                class="pkg-title-img"
                :src="getPackageTitleImage(pkg.name)"
                :alt="pkg.name"
              >
            </div>
            <div class="price">${{ Number(pkg.price).toLocaleString() }}</div>
          </div>

          <!-- Package Body / Inclusions -->
          <div class="inclusions-wrapper">
            <div class="inclusions">
              <template v-for="(variation, vIndex) in pkg.variations" :key="vIndex">
                <div
                  class="inclusion-item"
                  v-for="(option, oIndex) in variation.options"
                  :key="`${vIndex}-${oIndex}`"
                >
                  <div class="img-circle">
                    <img
                      :src="getImageUrl(option.image_url)"
                      :alt="option.name"
                      @error="handleImgError"
                    >
                  </div>
                  <div class="inclusion-text">
                    <strong>{{ option.name }}</strong>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Bottom Orange Shell with Overlapping Button -->
          <div class="package-footer">
            <button class="select-btn" @click="selectPackage(pkg)">
              {{ getPackageButtonText(pkg) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const packages = ref<Array<{
  id: number;
  name: string;
  description: string;
  slug: string;
  event_date_from: string;
  event_date_to: string;
  is_popular: boolean;
  is_package: boolean;  
  package_data: string;    
  price: number;  
  color: string;
  image_url: string | null;
  created_at?: string;
  variations: Array<{
    name: string;
    options: Array<{
      name: string;
      image_url: string;
    }>;
  }>;
}>>([])

onMounted(async () => {
  try {
    const res: any = await $fetch('/products', {
      baseURL: config.public.apiBase,
      params: {
        is_package: true,
        status: 'publish'
      }
    })
    packages.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  }
})

const packageProducts = computed(() => 
  packages.value
    .filter(p => p.is_package && p.package_data === 'holiday-lighting-package-programs')
    .sort((a, b) => a.id - b.id)
)

const getImageUrl = (url?: string | null) => {
  if (!url) return '/Images/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/placeholder.jpg'
}

const selectPackage = async (pkg: any) => {
  navigateTo(`/products/${pkg.id}`)
}

const BASE = '/Images/Holiday-Lighting-Package'
const getPackageTitleImage = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Jolly.png`
  if (n.includes('merry')) return `${BASE}/Merry.png`
  return `${BASE}/Joy.png`
}

const getPackageButtonText = (pkg: { name: string; id?: string | number }) => {
  const name = pkg.name.toLowerCase()

  if (name.includes('joy')) return 'Choose Joy'
  if (name.includes('jolly')) return 'Get Jolly'
  if (name.includes('merry')) return 'Make It Merry'

  // Fallback for any other package name
  return `Choose ${pkg.name}`
}
</script>

<style scoped>
/* Main Section Background using #0c2340 */
.packages-compare {
  position: relative;
  /* 1. Add background image with parallax effect */
  background-image: url('/Images/Choose-Your-Package.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* Creates the Parallax Effect */

  /* 2. Optional: Add an overlay padding so text remains readable */
  padding: 80px 0;
  z-index: 1;
  border-top: 5px solid #ff890b;
}

/* Optional: Dark Overlay to keep comparison text legible */
.packages-compare::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: rgba(12, 35, 64, 0.75);  */
  z-index: -1;
}

/* iOS Safari Parallax Fix (Prevents rendering glitches on mobile devices) */
@supports (-webkit-touch-callout: none) {
  .packages-compare {
    background-attachment: scroll;
  }
}

/* Titles */
.section-title {
  text-align: center;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 1px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.section-sub {
  text-align: center;
  color: #e2e8f0;
  margin-bottom: 50px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Compare Grid */
.compare-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  align-items: stretch;
}

/* Outer Card Container with #ff890b border */
.package-col {
  background: #ff890b; /* Solid orange background for top border & bottom shell */
  border: 4px solid #ff890b;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

/* Header Container */
.package-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0c2340;
  min-height: 90px;
}

.title-img-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.pkg-title-img {
  height: 60px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.package-header .price {
  font-size: 2.2rem;
  font-weight: 900;
  color: #ffffff;
  margin-left: 12px;
}

/* Inner Body Box */
.inclusions-wrapper {
  background: #ffffff;
  border-bottom-left-radius: 70px; 
  border-bottom-right-radius: 70px;
  padding: 24px 20px 60px; /* Adds bottom breathing room inside the white card */
  flex: 1;
  background-image: url(/Images/LV.png);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
}

.inclusions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* Inclusion Items */
.inclusion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

/* Circular Images with #ff890b border */
.img-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #ff890b;
  overflow: hidden;
  flex-shrink: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.img-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inclusion-text strong {
  font-size: 0.95rem;
  color: #0c2340;
  font-weight: 800;
  line-height: 1.3;
  display: block;
}

/* Footer & Action Button */
.package-footer {
  background: transparent;
  padding: 0 16px 16px; /* Bottom padding inside the orange shell */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.select-btn {
  width: 85%;
  background: #ff890b;
  color: #ffffff;
  border: 2px solid #0c2340; 
  border-radius: 50px;       
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background-color 0.2s ease;
  margin-top: -30px;
}

.select-btn:hover {
  background: #0c2340;
  color: #ffffff;
  transform: translateY(-2px);
}

/* Responsive breakpoint */
@media (max-width: 992px) {
  .compare-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
}

</style>