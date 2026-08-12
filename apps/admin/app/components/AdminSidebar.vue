<template>
  <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="logo">
        <img 
            src="/Images/FLP-Express-Transparent.PNG" 
            alt="FLP Admin" 
            class="admin-logo"
        >
    </div>

    <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item">
            <span class="icon">📊</span> Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/orders" class="nav-item">
            <span class="icon">📦</span> Orders
        </NuxtLink>
        <NuxtLink to="/admin/products" class="nav-item has-submenu">
            <span class="icon">🛍️</span> Products
            <div class="submenu">
                <NuxtLink to="/admin/products">All Products</NuxtLink>
                <NuxtLink to="/admin/products/create">Add New Product</NuxtLink>
                <NuxtLink to="/admin/products/categories">Categories</NuxtLink>
                <!-- <NuxtLink to="/admin/packages" class="submenu-item">Packages</NuxtLink> -->
                <NuxtLink to="/admin/package-categories" class="submenu-item">Package Categories</NuxtLink>
                <NuxtLink to="/admin/products/attributes">Attributes</NuxtLink>
            </div>
        </NuxtLink>
        <NuxtLink to="/admin/users" class="nav-item">
          <span class="icon">👤</span>
          <span v-if="!isCollapsed">Users</span>
        </NuxtLink>
        <NuxtLink to="/admin/customers" class="nav-item">
            <span class="icon">👥</span> Customers
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="nav-item">
            <span class="icon">⚙️</span> Settings
        </NuxtLink>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar-bottom">
      <button class="logout-btn" @click="showLogoutConfirm">
        <span class="icon">🚪</span>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>

    <!-- Toggle Button -->
    <!-- <button class="toggle-btn" @click="toggleSidebar">
      {{ isCollapsed ? '→' : '←' }}
    </button> -->
  </aside>

  <!-- Logout Modal -->
  <div v-if="showLogoutModal" class="logout-modal" @click.self="showLogoutModal = false">
    <div class="modal-content">
      <h3>Logout?</h3>
      <p>Are you sure you want to logout from the admin panel?</p>
      <div class="modal-buttons">
        <button class="btn-cancel" @click="showLogoutModal = false">Cancel</button>
        <button class="btn-logout" @click="logout">Yes, Logout</button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const showLogoutModal = ref(false)

const showLogoutConfirm = () => {
  showLogoutModal.value = true
}

const logout = () => {
  // if (confirm('Logout from admin panel?')) {
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigateTo('/login')
    showLogoutModal.value = false
  // }
}
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  background: #0c2340;
  color: white;
  min-height: 100vh;
  padding: 20px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.admin-sidebar.collapsed {
  width: 70px;
  min-width: 70px;
}

.toggle-btn {
  position: absolute;
  top: 20px;
  right: -12px;
  background: #F49322;
  color: #0c2340;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 10;
}

.admin-logo {
    max-height: 80px;
    width: auto;
    display: block;
    margin: 30px auto;
}

.sidebar-nav {
  flex: 1;
}

.sidebar-nav .nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: white;
  text-decoration: none;
  font-size: 1.05rem;
  transition: all 0.3s;
}

.sidebar-nav .nav-item:hover,
.sidebar-nav .nav-item.router-link-active {
  background: #F49322;
  color: #0c2340;
}

/* Submenu */
.has-submenu {
  position: relative;
}

.has-submenu:hover .submenu {
  display: block;
}

.submenu {
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  background: #1e3a5f;
  min-width: 200px;
  border-radius: 6px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  z-index: 1000;
  padding: 8px 0;
}

.submenu a {
  display: block;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  white-space: nowrap;
}

.submenu a:hover {
  background: #F49322;
  color: #0c2340;
}

.sidebar-bottom {
  padding: 20px;
  border-top: 1px solid #1e3a5f;
  margin-top: auto;
}


.logout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  max-width: 380px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-bottom: 16px;
  color: #0c2340;
}

.modal-content p {
  margin-bottom: 24px;
  color: #555;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-buttons button {
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #6b7280;
  color: white;
  border: none;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #ef4444;
}
</style>