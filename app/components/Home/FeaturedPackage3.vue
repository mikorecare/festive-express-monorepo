<template>
  <section class="packages-table-section">
    <div class="container">
      <h2 class="section-title">Package Comparison</h2>
      <p class="section-sub">See exactly what’s included in each plan</p>

      <div class="table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="feature-col">Features</th>
              <th v-for="pkg in packageProducts" :key="pkg.id" class="pkg-col">
                <div class="pkg-head" :class="pkg.name?.toLowerCase()">
                  <img 
                    v-if="pkg.image_url" 
                    :src="getImageUrl(pkg.image_url)" 
                    :alt="pkg.name"
                    class="pkg-img"
                    @error="handleImgError"
                  >
                  <h4>{{ pkg.name }}</h4>
                  <div class="pkg-price">${{ Number(pkg.price).toLocaleString() }}</div>
                  <small v-if="pkg.max_roofline_ft || true">up to 125 ft</small>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIndex) in comparisonRows" :key="rIndex">
              <td class="feature-name">
                <img 
                  :src="row.image" 
                  :alt="row.label" 
                  class="feature-icon"
                  @error="handleImgError"
                >
                <span>{{ row.label }}</span>
              </td>
              <td v-for="pkg in packageProducts" :key="pkg.id" class="value-cell">
                <template v-if="getValue(pkg, row.key) === false || getValue(pkg, row.key) === 'x'">
                  <span class="icon-no">✕</span>
                </template>
                <template v-else-if="getValue(pkg, row.key) === true || getValue(pkg, row.key) === '✓'">
                  <span class="icon-yes">✓</span>
                </template>
                <template v-else>
                  <span class="icon-qty">{{ getValue(pkg, row.key) }}</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-actions">
        <NuxtLink 
          v-for="pkg in packageProducts" 
          :key="pkg.id"
          :to="`/checkout?package=${pkg.slug || pkg.name?.toLowerCase()}`"
          class="btn-select"
          :class="pkg.name?.toLowerCase()"
        >
          Select {{ pkg.name }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const packages = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await $fetch('/products', {
      baseURL: config.public.apiBase,
      params: { is_package: true, status: 'publish' }
    })
    packages.value = res.data || res || []
  } catch (e) {
    console.error(e)
  }
})

const packageProducts = computed(() =>
  packages.value
    .filter((p: any) => p.is_package && p.package_data === 'holiday-lighting-package-programs')
    .sort((a: any, b: any) => a.id - b.id)
)

// Rows shown in the table (edit labels/images as needed)
const comparisonRows = [
  {
    key: 'c9',
    label: 'C-9 Lights, roofline',
    image: '/Images/inclusions/c9-lights.jpg'
  },
  {
    key: 'wreath',
    label: '24" Mixed Noble Wreath',
    image: '/Images/inclusions/wreath.jpg'
  },
  {
    key: 'bow',
    label: '12" Velvet Red Bow',
    image: '/Images/inclusions/bow.jpg'
  },
  {
    key: 'stake',
    label: 'Stake Lights, Warm White',
    image: '/Images/inclusions/stake-lights.jpg'
  },
  {
    key: 'minis',
    label: '5mm Minis, Warm White',
    image: '/Images/inclusions/mini-lights.jpg'
  },
  {
    key: 'bursts',
    label: 'Light Bursts, Warm White',
    image: '/Images/inclusions/light-bursts.jpg'
  },
]

// Map package name → values (match your real inclusions)
const packageMatrix: Record<string, Record<string, string | number | boolean>> = {
  joy: {
    c9: '✓',
    wreath: false,
    bow: false,
    stake: false,
    minis: false,
    bursts: false,
  },
  jolly: {
    c9: '✓',
    wreath: 1,
    bow: 1,
    stake: 50,
    minis: false,
    bursts: false,
  },
  merry: {
    c9: '✓',
    wreath: 1,
    bow: 1,
    stake: 50,
    minis: 15,
    bursts: 6,
  },
}

const getValue = (pkg: any, key: string) => {
  const name = pkg.name?.toLowerCase() || ''
  return packageMatrix[name]?.[key] ?? false
}

const getImageUrl = (url?: string | null) => {
  if (!url) return '/Images/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/placeholder.jpg'
}
</script>

<style scoped>
.packages-table-section {
  padding: 80px 0;
  background: #0c2340;
  color: #fff;
}

.section-title {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.section-sub {
  text-align: center;
  opacity: 0.8;
  margin-bottom: 40px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.compare-table th,
.compare-table td {
  padding: 16px 18px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.feature-col {
  text-align: left !important;
  width: 28%;
}

.pkg-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
}

.pkg-head.joy { background: #166534; }
.pkg-head.jolly { background: #c2410f; }
.pkg-head.merry { background: #991b1b; }

.pkg-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 4px;
}

.pkg-head h4 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
}

.pkg-price {
  font-size: 1.1rem;
  font-weight: 700;
}

.pkg-head small {
  font-size: 0.8rem;
  opacity: 0.85;
}

.feature-name {
  text-align: left !important;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #e2e8f0;
}

.feature-icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.1);
}

.value-cell {
  font-size: 1.1rem;
  font-weight: 700;
}

.icon-no {
  color: #f87171;
  font-size: 1.2rem;
}

.icon-yes {
  color: #4ade80;
  font-size: 1.3rem;
}

.icon-qty {
  color: #fff;
  background: rgba(255,255,255,0.15);
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.95rem;
}

.table-actions {
  display: grid;
  grid-template-columns: 28% 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
  align-items: center;
}

.table-actions .btn-select {
  display: block;
  text-align: center;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  background: #1e3a5f;
  transition: background 0.3s;
}

.table-actions .btn-select:hover {
  background: #F49322;
}

.table-actions .btn-select.joy { background: #166534; }
.table-actions .btn-select.jolly { background: #c2410f; }
.table-actions .btn-select.merry { background: #991b1b; }

.table-actions .btn-select:first-child {
  /* spacer under feature column */
  visibility: hidden;
  pointer-events: none;
}

/* Fix: actions only under the 3 packages */
.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-left: 28%;
}

@media (max-width: 768px) {
  .table-actions {
    padding-left: 0;
    flex-direction: column;
  }
}
</style>