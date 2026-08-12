<template>
  <div class="admin-page">
  
    <main class="admin-main">
      <div class="page-header">
        <h1>Manage Packages</h1>
        <button class="btn-primary" @click="addNewPackage">+ Add New Package</button>
      </div>

      <div class="packages-grid">
        <div v-for="pkg in packages" :key="pkg.id" class="package-card">
          <h3>{{ pkg.name }}</h3>
          <div class="price">${{ pkg.price }}</div>
          <p>{{ pkg.description }}</p>

          <div class="actions">
            <button class="btn-edit" @click="editPackage(pkg)">Edit</button>
            <button class="btn-delete" @click="deletePackage(pkg.id)">Delete</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const packages = ref([])

const loadPackages = async () => {
  const res = await $fetch('/packages', { baseURL: useRuntimeConfig().public.apiBase })
  packages.value = res.data || res
}

onMounted(loadPackages)
</script>