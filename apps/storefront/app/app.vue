<template>
  <div class="!font-poppins overflow-x-clipped pb-16 lg:pb-0">
    <AnnouncementBar />
    <HeaderNew />
    <main id="main-content" role="main" class="relative z-0">
      <NuxtPage />
    </main>
    <Footer />
    <FloatingCart />
    <CookieConsent />

    <!-- Mobile-only bottom nav -->
    <MobileNav class="lg:hidden" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import AnnouncementBar from "./components/AnnouncementBar.vue";
import { useTracker } from "~/composables/useTracker";

const tracker = useTracker();

const ALLOWED_ORIGIN = "https://festive.express";

let trackingEnabled = false;

function handleGlobalClick(e: MouseEvent) {
  if (!trackingEnabled) return;

  const target = (e.target as HTMLElement | null)?.closest(
    "button, a, [data-track]",
  );

  if (target) {
    tracker.trackClick(target as HTMLElement);
  }
}

onMounted(async () => {
  trackingEnabled = window.location.origin === ALLOWED_ORIGIN;

  if (!trackingEnabled) return;

  await tracker.init();

  document.addEventListener("click", handleGlobalClick);
});

onUnmounted(() => {
  if (!trackingEnabled) return;

  document.removeEventListener("click", handleGlobalClick);
  tracker.destroy();

  trackingEnabled = false;
});

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
