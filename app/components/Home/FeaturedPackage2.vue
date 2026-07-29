<template>
    <section class="packages-compare">
        <div class="container">
            <h2 class="section-title">Choose Your Holiday Package</h2>
            <p class="section-sub">Compare what’s included in each plan</p>

            <div class="compare-grid">
                <div 
                    class="package-col" 
                    v-for="pkg in packageProducts" 
                    :key="pkg.id"
                    :class="{ popular: pkg.is_popular }"
                    >
                    <div class="package-header" :class="pkg.name?.toLowerCase()">
                        <h3>{{ pkg.name }}</h3>
                        <div class="price"><sup>$</sup>{{ Number(pkg.price).toLocaleString() }}</div>
                        <!-- <p>{{ pkg.description || 'Holiday lighting package' }}</p> -->
                    </div>

                    <div class="inclusions">
                        <template v-for="(variation, vIndex) in pkg.variations" :key="vIndex">
                            <div
                                class="inclusion-item"
                                v-for="(option, oIndex) in variation.options"
                                :key="`${vIndex}-${oIndex}`"
                                >
                                <img
                                    :src="getImageUrl(option.image_url)"
                                    :alt="option.name"
                                    @error="handleImgError"
                                >
                                <div class="inclusion-text">
                                    <strong>{{ option.name }}</strong>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- <NuxtLink 
                    :to="`/checkout?package=${pkg.slug || pkg.name?.toLowerCase()}`" 
                    class="btn-select"
                    >
                    Select {{ pkg.name }}
                    </NuxtLink> -->
                    <button @click="selectPackage(pkg)" class="select-btn w-75 d-block mx-auto">Select Package</button>
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
    .sort((a, b) => a.id - b.id) // oldest first
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
</script>

<style scoped>
.packages-compare {
  padding: 80px 0;
  background: #f8fafc;
}

.section-title {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 800;
  color: #0c2340;
  margin-bottom: 8px;
}

.section-sub {
  text-align: center;
  color: #6b7280;
  margin-bottom: 50px;
  font-size: 1.1rem;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: start;
}

.package-col {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.package-col.popular {
  transform: scale(1.03);
  box-shadow: 0 12px 40px rgba(244, 147, 34, 0.2);
  border: 2px solid #F49322;
  z-index: 2;
}

.package-header {
  padding: 32px 24px 24px;
  text-align: center;
  color: #fff;
  position: relative;
}

.package-header.joy {
  background: linear-gradient(135deg, #166534, #15803d);
}

.package-header.jolly {
  background: linear-gradient(135deg, #c2410f, #ea580c);
}

.package-header.merry {
  background: linear-gradient(135deg, #991b1b, #b91c1c);
}

.package-header h3 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.package-header .price {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.package-header .price sup {
  font-size: 1rem;
}

.package-header p {
  opacity: 0.9;
  font-size: 0.95rem;
  margin: 0;
}

.inclusions {
  padding: 16px 20px 8px;
  display: flex;
  flex-direction: column;   /* ← stack rows */
  width: 100%;
  flex: 1;
}

.inclusion-item {
  display: flex;            /* ← image + text on one line */
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.inclusion-item:last-child {
  border-bottom: none;
}

.inclusion-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  background: #f1f5f9;
}

.inclusion-text {
  flex: 1;
  min-width: 0;
}

.inclusion-text strong {
  font-size: 0.9rem;
  color: #0c2340;
  line-height: 1.35;
  display: block;
}

.btn-select {
  display: block;
  margin: 16px 20px 24px;
  text-align: center;
  background: #0c2340;
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-select:hover {
  background: #F49322;
  color: #fff;
}

.package-col.popular .btn-select {
  background: #F49322;
}

.package-col.popular .btn-select:hover {
  background: #0c2340;
}

@media (max-width: 992px) {
  .compare-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
  .package-col.popular {
    transform: none;
  }
}
</style>