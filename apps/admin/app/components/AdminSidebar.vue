<template>
  <aside
    class="bg-navy font-poppins text-white h-screen flex flex-col flex-shrink-0 sticky top-0 overflow-hidden transition-all duration-300"
    :class="[isCollapsed ? 'w-18' : 'w-64']"
  >
    <!-- Logo -->
    <div class="p-6 flex items-center justify-center flex-shrink-0">
      <img
        loading="lazy"
        src="/Images/FLP-Express-Transparent.png"
        alt="FLP Admin"
        class="max-h-20 w-auto my-4 block"
      />
    </div>

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto px-2 space-y-1">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg"
        active-class="bg-brand-orange text-navy no-underline"
      >
        <ChartBarIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Dashboard</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/orders"
        class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg"
        active-class="bg-brand-orange text-navy"
      >
        <ShoppingBagIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Orders</span>
      </NuxtLink>

      <!-- Products with Submenu -->
      <div class="relative">
        <div
          @click="toggleProducts"
          class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg cursor-pointer select-none"
          :class="{ 'bg-brand-orange text-navy': isProductsSection }"
        >
          <CubeIcon class="h-5 w-5" />
          <span v-if="!isCollapsed" class="flex-1">Products</span>
          <span
            v-if="!isCollapsed"
            class="text-xs transition-transform duration-300"
            :class="{ 'rotate-180': isProductsOpen }"
          >
            ▼
          </span>
        </div>

        <!-- Submenu with smooth animation -->
        <div
          v-if="!isCollapsed"
          class="ml-4 mt-1 space-y-1 border-l-2 border-brand-orange/30 pl-3 overflow-hidden transition-all duration-300 ease-in-out"
          :class="isProductsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
        >
          <NuxtLink
            to="/admin/products"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            All Products
          </NuxtLink>
          <NuxtLink
            to="/admin/products/create"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/create'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Add New Product
          </NuxtLink>
          <NuxtLink
            to="/admin/products/packages"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/packages'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Package Programs
          </NuxtLink>
          <NuxtLink
            to="/admin/products/package-skus"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/package-skus'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Package SKUs
          </NuxtLink>
          <NuxtLink
            to="/admin/products/inclusions"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/inclusions'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Inclusion Items
          </NuxtLink>
          <NuxtLink
            to="/admin/products/colors"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/colors'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Colors
          </NuxtLink>
          <NuxtLink
            to="/admin/products/promo-codes"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/products/promo-codes')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Promo Codes
          </NuxtLink>
          <!-- <NuxtLink
            to="/admin/products/categories"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path === '/admin/products/categories'
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Categories
          </NuxtLink> -->
        </div>
      </div>

      <NuxtLink
        to="/admin/users"
        class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg"
        active-class="bg-brand-orange text-navy"
      >
        <UserIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Users</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/customers"
        class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg"
        active-class="bg-brand-orange text-navy"
      >
        <UsersIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Customers</span>
      </NuxtLink>

      <!-- Configuration with Submenu -->
      <div class="relative">
        <div
          @click="toggleConfiguration"
          class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg cursor-pointer select-none"
          :class="{ 'bg-brand-orange text-navy': isConfigurationSection }"
        >
          <WrenchScrewdriverIcon class="h-5 w-5" />
          <span v-if="!isCollapsed" class="flex-1">Configuration</span>
          <span
            v-if="!isCollapsed"
            class="text-xs transition-transform duration-300"
            :class="{ 'rotate-180': isConfigurationOpen }"
          >
            ▼
          </span>
        </div>

        <div
          v-if="!isCollapsed"
          class="ml-4 mt-1 space-y-1 border-l-2 border-brand-orange/30 pl-3 overflow-hidden transition-all duration-300 ease-in-out"
          :class="
            isConfigurationOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          "
        >
          <NuxtLink
            to="/admin/configuration/how-it-works"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/how-it-works')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            How It Works
          </NuxtLink>

          <NuxtLink
            to="/admin/configuration/about-us"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/about-us')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            About Us
          </NuxtLink>

          <NuxtLink
            to="/admin/configuration/privacy-policy"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/privacy-policy')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Privacy Policy
          </NuxtLink>

          <NuxtLink
            to="/admin/configuration/terms-of-use"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/terms-of-use')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Terms of Use
          </NuxtLink>

          <NuxtLink
            to="/admin/configuration/faq"
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/faq')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            FAQ's
          </NuxtLink>
          <NuxtLink
            to="/admin/configuration/gallery"
            class="block px-3 py-2 text-sm rounded-lg transition-colors no-underline"
            :class="
              route.path.startsWith('/admin/configuration/gallery')
                ? 'bg-brand-orange/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-brand-orange/20'
            "
          >
            Gallery
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        to="/admin/settings"
        class="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline rounded-lg"
        active-class="bg-brand-orange text-navy"
      >
        <Cog6ToothIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Settings</span>
      </NuxtLink>
    </nav>

    <!-- User Info -->
    <div
      v-if="user"
      class="flex-shrink-0 px-4 py-3 bg-slate-800/50 mx-3 rounded-lg mb-2"
    >
      <p class="font-semibold text-sm text-white truncate">{{ user.email }}</p>
      <!-- <p class="text-xs text-slate-400 truncate">
        ID: {{ user.UID?.substring(0, 8) }}
      </p> -->
    </div>

    <!-- Logout Button - Fixed at bottom -->
    <div class="flex-shrink-0 p-4 border-t border-slate-700/60">
      <button
        @click="showLogoutConfirm"
        class="w-full flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer text-base no-underline"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5" />
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>

  <!-- Logout Confirmation Modal -->
  <div
    v-if="showLogoutModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="showLogoutModal = false"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5 text-red-600" />
        </div>
        <h3 class="text-lg font-bold text-navy">Confirm Logout</h3>
      </div>
      <p class="text-slate-600 text-sm mb-6">
        Are you sure you want to logout? You will need to sign in again to
        access the admin panel.
      </p>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          @click="showLogoutModal = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isCollapsed = ref(false);
const showLogoutModal = ref(false);
const isProductsOpen = ref(true);

const toggleProducts = () => {
  isProductsOpen.value = !isProductsOpen.value;
};

const showLogoutConfirm = () => {
  showLogoutModal.value = true;
};

const logout = async () => {
  try {
    await supabase.auth.signOut();
    await $fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout process error:", error);
  } finally {
    showLogoutModal.value = false;
    navigateTo("/login");
  }
};

const isProductsSection = computed(() =>
  [
    "/admin/products",
    "/admin/packages",
    "/admin/package-skus",
    "/admin/inclusions",
  ].some((p) => route.path.startsWith(p)),
);

const isConfigurationOpen = ref(true); // closed by default

const toggleConfiguration = () => {
  isConfigurationOpen.value = !isConfigurationOpen.value;
};

const isConfigurationSection = computed(() =>
  route.path.startsWith("/admin/configuration"),
);
</script>
