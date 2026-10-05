<template>
  <div class="font-poppins overflow-x-hidden pb-16 lg:pb-0">
    <HeaderNew />
    <main id="main-content" role="main">
      <NuxtPage />
    </main>
    <Footer />
    <FloatingCart />
    <CookieConsent />
    <ChatWidget ref="chatWidget" />

    <!-- Mobile-only bottom nav -->
    <MobileNav class="lg:hidden" />
  </div>
</template>

<script setup lang="ts">
const chatWidget = ref();

provide("chat", {
  open: () => chatWidget.value?.open(),
  close: () => chatWidget.value?.close(),
  toggle: () => chatWidget.value?.toggle(),
});

useHead({
  meta: [
    {
      property: "og:image",
      content: "https://festive.express/Images/FE-Logo-2.png",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Festive Express - Premium Holiday Lighting",
    },
    {
      name: "twitter:image",
      content: "https://festive.express/Images/FE-Logo-2.png",
    },
  ],
});
</script>
