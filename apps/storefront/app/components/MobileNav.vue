<template>
  <!-- Bottom Mobile Nav — 3 links -->
  <nav
    class="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(28,45,91,0.08)]"
    style="padding-bottom: env(safe-area-inset-bottom, 0)"
    role="navigation"
    aria-label="Bottom navigation"
  >
    <ul class="grid grid-cols-3 list-none m-0 p-0 max-w-[500px] mx-auto">
      <li>
        <NuxtLink
          to="/"
          class="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors"
          :class="
            isActive('/')
              ? 'text-[#F49321]'
              : 'text-[#1C2D5B] hover:text-[#F49321]'
          "
          aria-label="Home"
        >
          <i class="fas fa-home text-[1.35rem]" aria-hidden="true"></i>
          <span>Home</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/packages"
          class="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors"
          :class="
            isActive('/packages')
              ? 'text-[#F49321]'
              : 'text-[#1C2D5B] hover:text-[#F49321]'
          "
          aria-label="Packages"
        >
          <i class="fas fa-box-open text-[1.35rem]" aria-hidden="true"></i>
          <span>Packages</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/faq"
          class="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors"
          :class="
            isActive('/faq')
              ? 'text-[#F49321]'
              : 'text-[#1C2D5B] hover:text-[#F49321]'
          "
          aria-label="FAQ"
        >
          <i
            class="fas fa-question-circle text-[1.35rem]"
            aria-hidden="true"
          ></i>
          <span>FAQ</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>

<style scoped>
nav {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
</style>
