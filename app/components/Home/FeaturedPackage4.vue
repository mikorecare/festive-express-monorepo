<template>
  <section class="packages-table-section">
    <div class="container">
      <h2 class="section-title">Package Comparison</h2>
      <p class="section-sub">See exactly what’s included in each plan</p>

      <div class="table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
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
                  <small>up to 125 ft</small>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIndex) in comparisonRows" :key="rIndex">
              <td
                v-for="pkg in packageProducts"
                :key="pkg.id"
                class="value-cell"
              >
                <!-- Has value: show feature image + qty -->
                <div v-if="hasValue(pkg, row.key)" class="cell-content">
                  <img
                    :src="row.image"
                    :alt="row.label"
                    class="check-img"
                    @error="handleImgError"
                  >
                  <span v-if="isQty(pkg, row.key)" class="qty">
                    {{ getValue(pkg, row.key) }}
                  </span>
                </div>
                <!-- No value: leave blank -->
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

const comparisonRows = [
  { key: 'c9',     label: 'C-9 Lights',        image: '/Images/Holiday-Lighting-Package/c9lights.png' },
  { key: 'wreath', label: '24" Noble Wreath',   image: '/Images/Holiday-Lighting-Package/mixed-noble-wreath.png' },
  { key: 'bow',    label: '12" Velvet Bow',     image: '/Images/Holiday-Lighting-Package/velvet-red-bow.png' },
  { key: 'stake',  label: 'Stake Lights',       image: '/Images/Holiday-Lighting-Package/ground-lights.png' },
  { key: 'minis',  label: '5mm Minis',          image: '/Images/Holiday-Lighting-Package/5mm-minis.png' },
  { key: 'bursts', label: 'Light Bursts',       image: '/Images/Holiday-Lighting-Package/light-bursts.png' },
]

const packageMatrix: Record<string, Record<string, string | number | boolean>> = {
  joy:   { c9: true, wreath: false, bow: false, stake: false, minis: false, bursts: false },
  jolly: { c9: true, wreath: 1,     bow: 1,     stake: 50,    minis: false, bursts: false },
  merry: { c9: true, wreath: 1,     bow: 1,     stake: 50,    minis: 15,    bursts: 6 },
}

const getValue = (pkg: any, key: string) => {
  const name = pkg.name?.toLowerCase() || ''
  return packageMatrix[name]?.[key]
}

const hasValue = (pkg: any, key: string) => {
  const val = getValue(pkg, key)
  return val !== false && val !== null && val !== undefined && val !== 'x'
}

const isQty = (pkg: any, key: string) => {
  const val = getValue(pkg, key)
  return typeof val === 'number'
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
}

.compare-table th,
.compare-table td {
  padding: 18px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  width: 33.33%;
}

.pkg-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: 12px;
}

.pkg-head.joy   { background: #166534; }
.pkg-head.jolly { background: #c2410f; }
.pkg-head.merry { background: #991b1b; }

.pkg-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
}

.pkg-head h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.pkg-price {
  font-size: 1.15rem;
  font-weight: 700;
}

.pkg-head small {
  font-size: 0.8rem;
  opacity: 0.85;
}

.value-cell {
  vertical-align: middle;
  height: 80px;
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.check-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
}

.qty {
  font-size: 0.9rem;
  font-weight: 700;
  background: rgba(255,255,255,0.15);
  padding: 2px 10px;
  border-radius: 50px;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.btn-select {
  display: inline-block;
  text-align: center;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  min-width: 160px;
  transition: background 0.3s;
}

.btn-select.joy   { background: #166534; }
.btn-select.jolly { background: #c2410f; }
.btn-select.merry { background: #991b1b; }

.btn-select:hover {
  background: #F49322 !important;
  color: #fff;
}
</style>