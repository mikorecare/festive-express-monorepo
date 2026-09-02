<template>
  <div>
    <Header />
    <NuxtPage />
    <Toaster position="top-center" richColors closeButton />
    <Footer />
    <FloatingCart />
    <CookieConsent />
    <ChatWidget ref="chatWidget" />
  </div>
</template>
<script setup lang="ts">
const chatWidget = ref();

provide("chat", {
  open: () => chatWidget.value?.open(),
  close: () => chatWidget.value?.close(),
  toggle: () => chatWidget.value?.toggle(),
});
</script>
