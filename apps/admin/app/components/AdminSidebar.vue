<template>
  <aside
    class="bg-navy text-white min-h-screen flex flex-col flex-shrink-0 relative transition-all duration-300"
    :class="[isCollapsed ? 'w-18' : 'w-64']"
  >
    <!-- Logo -->
    <div class="p-6 flex items-center justify-center">
      <img
        src="/Images/FLP-Express-Transparent.PNG"
        alt="FLP Admin"
        class="max-h-20 w-auto my-4 block"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
        active-class="bg-brand-orange text-navy no-underline"
      >
        <span class="text-xl">📊</span>
        <span v-if="!isCollapsed">Dashboard</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/orders"
        class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
        active-class="bg-brand-orange text-navy"
      >
        <span class="text-xl">📦</span>
        <span v-if="!isCollapsed">Orders</span>
      </NuxtLink>

      <!-- Submenu Item -->
      <div class="relative group">
        <NuxtLink
          to="/admin/products"
          class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
          active-class="bg-brand-orange text-navy"
          :class="{ 'bg-brand-orange text-navy': isProductsSection }"
        >
          <span class="text-xl">🛍️</span>
          <span v-if="!isCollapsed">Products</span>
        </NuxtLink>

        <!-- Submenu Flyout -->
        <div
          class="hidden group-hover:block absolute left-full top-0 bg-slate-800 min-w-52 rounded-md shadow-xl z-50 py-2 border border-slate-700"
        >
          <NuxtLink
            to="/admin/products"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >All Products</NuxtLink
          >
          <NuxtLink
            to="/admin/products/create"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >Add New Product</NuxtLink
          >
          <NuxtLink
            to="/admin/products/packages"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >Package Programs</NuxtLink
          >
          <NuxtLink
            to="/admin/products/package-skus"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >Package SKUs</NuxtLink
          >
          <NuxtLink
            to="/admin/products/inclusions"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >Inclusion Items</NuxtLink
          >

          <NuxtLink
            to="/admin/products/categories"
            class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline"
            >Categories</NuxtLink
          >
          <!-- <NuxtLink to="/admin/package-categories" class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline">Package Categories</NuxtLink>
          <NuxtLink to="/admin/products/attributes" class="block px-6 py-2.5 text-white hover:bg-brand-orange hover:text-navy transition-colors whitespace-nowrap no-underline">Attributes</NuxtLink> -->
        </div>
      </div>

      <NuxtLink
        to="/admin/users"
        class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
        active-class="bg-brand-orange text-navy"
      >
        <span class="text-xl">👤</span>
        <span v-if="!isCollapsed">Users</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/customers"
        class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
        active-class="bg-brand-orange text-navy"
      >
        <span class="text-xl">👥</span>
        <span v-if="!isCollapsed">Customers</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/settings"
        class="flex items-center gap-3 px-6 py-3.5 text-white hover:bg-brand-orange hover:text-navy font-medium transition-colors text-base no-underline"
        active-class="bg-brand-orange text-navy"
      >
        <span class="text-xl">⚙️</span>
        <span v-if="!isCollapsed">Settings</span>
      </NuxtLink>
    </nav>

    <div v-if="user" class="p-4 bg-slate-50 rounded-lg">
      <p class="font-semibold text-slate-800">Logged in as: {{ user.email }}</p>
      <p class="text-xs text-slate-500">User ID: {{ user.UID }}</p>
    </div>

    <!-- Logout Button -->
    <div class="p-5 border-t border-slate-700/60 mt-auto">
      <button
        @click="showLogoutConfirm"
        class="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer text-base no-underline"
      >
        <span class="text-xl">🚪</span>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>

  <!-- Logout Modal -->
  <div
    v-if="showLogoutModal"
    @click.self="showLogoutModal = false"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl border border-slate-100"
    >
      <h3 class="text-navy text-xl font-bold mb-2">Logout?</h3>
      <p class="text-slate-600 mb-6 text-sm">
        Are you sure you want to logout from the admin panel?
      </p>

      <div class="flex gap-3 justify-center">
        <button
          @click="showLogoutModal = false"
          class="px-6 py-2.5 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="logout"
          class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isCollapsed = ref(false);
const showLogoutModal = ref(false);

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
</script>
