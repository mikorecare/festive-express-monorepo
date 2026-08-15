<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <NuxtPage />
      <Toaster position="top-center" richColors closeButton />
    </main>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
  overflow: auto;
}
</style>