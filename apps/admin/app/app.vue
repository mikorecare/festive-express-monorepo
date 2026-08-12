<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>
.admin-main {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
  overflow: auto;
}
</style>

<script setup lang="ts">
// Global styles
useHead({
  style: [{
    innerHTML: `
      * { 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box; 
      }
      
      body {
        font-family: 'Poppins', system-ui, sans-serif;
      }

      .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .section-title {
        font-size: 2.6rem;
        color: #0c2340;
        text-align: center;
        margin-bottom: 50px;
      }

      .badge {
        background: #0c2340;
        color: white;
        padding: 8px 22px;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        display: inline-block;
      }

      .btn-primary {
        background: #F49322;
        color: white;
        border: none;
        padding: 14px 32px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary:hover {
        background: #0c2340;
        transform: translateY(-3px);
      }

      /* Card styles */
      .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      }

      /* Table styles */
      .table {
        width: 100%;
        border-collapse: collapse;
      }

      .table th {
        background: #0c2340;
        color: white;
        padding: 16px;
        text-align: left;
      }

      .table td {
        padding: 16px;
        border-bottom: 1px solid #eee;
      }

      .export-btn {
        background: #0c2340;
        color: white;
        border: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        font-size: 14px !important;
      }

      .export-btn:hover {
        background: #F49322;
        color: #0c2340;
        transform: translateY(-2px);
      }

      .add-btn {
        background: #F49322;
        color: white;
        border: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        font-size: 14px !important;
      }

      .add-btn:hover {
        background: #0c2340;
        transform: translateY(-2px);
      }


    `
  }]
})
</script>