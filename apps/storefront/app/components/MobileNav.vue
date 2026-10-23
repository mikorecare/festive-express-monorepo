<template>
  <!-- Bottom Mobile Nav -->
  <nav
    class="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-t border-slate-200/70 shadow-[0_-6px_20px_rgba(28,45,91,0.1)]"
    style="padding-bottom: env(safe-area-inset-bottom, 0)"
    role="navigation"
    aria-label="Bottom navigation"
  >
    <ul
      class="grid list-none m-0 p-0 max-w-[500px] mx-auto px-2 py-1.5"
      :style="{
        gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
      }"
    >
      <li v-for="item in navItems" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="group relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl text-[0.68rem] font-semibold tracking-wide transition-all duration-200 ease-out active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F49321]/60"
          :class="
            isActive(item.to)
              ? 'text-[#F49321] bg-[#F49321]/10'
              : 'text-[#1C2D5B] hover:text-[#F49321] hover:bg-[#F49321]/5'
          "
          :aria-label="item.label"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <!-- Active dot indicator -->
          <span
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-[#F49321] transition-all duration-300 ease-out"
            :class="
              isActive(item.to)
                ? 'opacity-100 scale-x-100'
                : 'opacity-0 scale-x-0'
            "
            aria-hidden="true"
          ></span>

          <!-- Icon: Home -->
          <IcNavHome
            v-if="item.icon === 'home'"
            class="w-[1.35rem] h-[1.35rem] transition-transform duration-200 ease-out"
            :class="isActive(item.to) ? 'scale-110' : 'group-hover:scale-110'"
          />

          <!-- Icon: Bell (Packages) -->
          <IcNavBell
            v-else-if="item.icon === 'bell'"
            class="w-[1.35rem] h-[1.35rem] transition-transform duration-200 ease-out"
            :class="isActive(item.to) ? 'scale-110' : 'group-hover:scale-110'"
          />

          <!-- Icon: FAQ -->
          <IcNavFaq
            v-else-if="item.icon === 'faq'"
            class="w-[1.35rem] h-[1.35rem] transition-transform duration-200 ease-out"
            :class="isActive(item.to) ? 'scale-110' : 'group-hover:scale-110'"
          />

          <!-- Icon: FontAwesome fallback -->
          <i
            v-else
            :class="[
              item.icon,
              'text-[1.35rem] transition-transform duration-200 ease-out',
              isActive(item.to) ? 'scale-110' : 'group-hover:scale-110',
            ]"
            aria-hidden="true"
          ></i>

          <!-- Label -->
          <span class="leading-none">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import IcNavHome from "~/components/Icons/IcNavHome.vue";
import IcNavBell from "~/components/Icons/IcNavBell.vue";
import IcNavFaq from "~/components/Icons/IcNavFaq.vue";

const route = useRoute();

interface NavItem {
  to: string;
  label: string;
  /**
   * Either a sentinel for a built-in SVG icon:
   *   "home" | "bell" | "faq"
   * or a FontAwesome class string like "fas fa-home"
   */
  icon: string;
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/packages", label: "Packages", icon: "bell" },
  { to: "/faq", label: "FAQ", icon: "faq" },
];

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

:global(body) {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
