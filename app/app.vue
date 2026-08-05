<template>
  <div>
    <Header />
    <NuxtPage />   
    <Toaster position="top-center" richColors closeButton />  <!-- This loads index.vue, contact.vue, etc. -->
    <Footer />

    <!-- Floating Cart rendered on every page -->
    <FloatingCart />
  </div>
</template>