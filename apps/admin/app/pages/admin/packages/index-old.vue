<template>
  <div class="admin-page">
    <main class="admin-main">
      <div class="page-header">
        <h1>Holiday Lighting Packages</h1>
        <button class="btn-primary" @click="addNewPackage">+ Add New Package</button>
      </div>

      <div class="packages-grid">
        <div v-for="pkg in packages" :key="pkg.id" class="package-card" :class="{ popular: pkg.is_popular }">
          <!-- Title -->
          <div class="form-group">
            <label class="form-label">Package Name</label>
            <input 
              v-model="pkg.name" 
              class="package-title-edit"
            >
          </div>
          
          <!-- Price -->
          <div class="form-group">
            <label class="form-label">Price ($)</label>
            <div class="price-edit">
              <span class="dollar-sign">$</span>
              <input 
                v-model="pkg.price" 
                type="number" 
                step="0.01"
                class="price-input"
              >
            </div>
          </div>

          <!-- Popular Checkbox -->
          <label class="popular-checkbox">
            <input 
              type="checkbox" 
              v-model="pkg.is_popular" style="width: auto;"
            >
            Mark as Popular
          </label>

          <div class="form-group">
            <label class="form-label">Features</label>
            <div class="features-list">
              <div v-for="(feature, index) in pkg.features" :key="index" class="feature-item">
                <input 
                  v-model="pkg.features[index]" 
                  class="feature-edit mb-2"
                >
                <button class="btn-remove" @click="removeFeature(pkg.id, index)">×</button>
                <button class="btn-strike" @click="toggleStrike(pkg.id, index)">Strike</button>
              </div>
            </div>

            <input 
              v-model="newFeature[pkg.id]" 
              placeholder="Add new feature..." 
              @keyup.enter="addFeature(pkg.id)"
              class="feature-input"
            >
          </div>

          <div class="actions mt-4">
            <button class="btn-edit" @click="savePackage(pkg)">Save Changes</button>
            <button class="delete-btn" @click="deletePackage(pkg)">Delete Package</button>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { showToast } = useToast()

const packages = ref<Array<{
  id: number;
  name: string;
  price: number;
  description: string;
  max_roofline_ft: number;
  features: string[];
  is_popular: boolean;
  color: string;
}>>([])
const newFeature = ref<Record<number, string>>({})

const loadPackages = async () => {
  try {
    const res: any = await $fetch('/packages', {
      baseURL: config.public.apiBase
    })
    packages.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  }
}

const addFeature = async (packageId: number) => {
  if (!newFeature.value[packageId]) return

  try {
    await $fetch(`/packages/${packageId}/features`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { feature: newFeature.value[packageId] }
    })
    newFeature.value[packageId] = ''
    loadPackages()
  } catch (error) {
    alert('Failed to add feature')
  }
}

const removeFeature = async (packageId: number, index: number) => {
  if (!confirm('Remove this feature?')) return

  try {
    await $fetch(`/packages/${packageId}/features/${index}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE'
    })
    loadPackages()
  } catch (error) {
    alert('Failed to remove feature')
  }
}

const toggleStrike = (packageId: number, index: number) => {
  const pkg = packages.value.find(p => p.id === packageId)
  if (!pkg || !pkg.features || !pkg.features[index]) return

  const feature = pkg.features[index]

  if (feature.startsWith('<s>')) {
    pkg.features[index] = feature.replace(/<s>|<\/s>/g, '')
  } else {
    pkg.features[index] = `<s>${feature}</s>`
  }
}

const addNewPackage = () => {
  showToast('Add New Package form - coming soon', 'error')
}

const deletePackage = () => {
  showToast('Delete Package form - coming soon', 'error')
}

const savePackage = async (pkg: any) => {
  try {
    await $fetch(`/packages/${pkg.id}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: pkg
    })
    showToast('✅ Package saved successfully!', 'success')
    loadPackages()
  } catch (error) {
    showToast('Failed to save package!', 'error')
  }
}

onMounted(loadPackages)
</script>

<style scoped>
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.package-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.package-title-edit {
  font-size: 1.5rem;
  font-weight: 700;
  width: 100%;
  border: none;
  border-bottom: 2px solid #eee;
  margin-bottom: 12px;
  outline: none;
}

.price-edit {
  display: flex;
  align-items: center;
  margin: 16px 0 24px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c2340;
}

.dollar-sign {
  margin-right: 8px;
  font-size: 1.5rem;
}

.price-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c2340;
}

.popular-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  font-weight: 600;
}

/* .package-card:hover {
  transform: translateY(-8px);
} */

.popular-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #F49322;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.price {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0c2340;
  margin: 16px 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.features li, .features-list .feature-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.btn-edit{margin-right: 10px;}
</style>