<template>
  <div class="admin-page">

    <main class="admin-main">
      <div class="page-header">
        <h1>Users Management</h1>
      </div>

      <div class="content-grid">
        <!-- Left: Add / Edit User -->
        <div class="add-form">
          <h3>{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
          <form @submit.prevent="saveUser">
            <div class="form-section mt-4">
              <label class="form-label">Full Name <span class="required">*</span></label>
              <input v-model="form.full_name" type="text" required>
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Username</label>
              <input v-model="form.username" type="text">
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Email Address <span class="required">*</span></label>
              <input v-model="form.email" type="email" required>
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Password <span v-if="!editingUser" class="required">*</span></label>
              <input v-model="form.password" type="password" :required="!editingUser">
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Company</label>
              <input v-model="form.company" type="text">
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Address Line 1</label>
              <input v-model="form.address_line1" type="text">
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Address Line 2</label>
              <input v-model="form.address_line2" type="text">
            </div>

            <div class="form-row">
              <div class="form-section mt-4">
                <label class="form-label">City</label>
                <input v-model="form.city" type="text">
              </div>
              <div class="form-section mt-4">
                <label class="form-label">Postcode / ZIP</label>
                <input v-model="form.postcode" type="text">
              </div>
            </div>

            <div class="form-row">
              <div class="form-section mt-4">
                <label class="form-label">Country / Region</label>
                <input v-model="form.country" type="text">
              </div>
              <div class="form-section mt-4">
                <label class="form-label">State / County</label>
                <input v-model="form.state" type="text">
              </div>
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Phone</label>
              <input v-model="form.phone" type="text">
            </div>

            <div class="form-section mt-4">
              <label class="form-label">User Role</label>
              <select v-model="form.role">
                <option value="administrator">Administrator</option>
                <option value="super_admin">Super Admin</option>
                <option value="customer">Customer</option>
                <option value="shop_manager">Shop Manager</option>
                <option value="editor">Editor</option>
                
              </select>
            </div>

            <div class="form-actions mt-4">
              <button type="button" class="btn-secondary" @click="cancelEdit">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : editingUser ? 'Update User' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Users List -->
        <div class="users-list">
          <h3>Existing Users ({{ users.length }})</h3>
          
          <div v-for="(user, index) in users" :key="user.id" class="user-item" :class="{ 'even-row': index % 2 === 0 }">
            <div class="user-info">
              <strong>{{ user.full_name || user.name }}</strong>
              <small>{{ user.email }}</small>
              <span class="role-badge">{{ user.role }}</span>
            </div>
            <div class="user-actions">
              <button @click="editUser(user)" class="btn-edit">Edit</button>
              <button @click="deleteUser(user.id)" class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { showToast } = useToast()

const users = ref([])
const form = ref({
  id: null as number | null,
  full_name: '',
  username: '',
  email: '',
  password: '',
  company: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postcode: '',
  country: '',
  state: '',
  phone: '',
  role: 'customer'
})
const editingUser = ref(null)
const isSaving = ref(false)

const loadUsers = async () => {
  try {
    const res: any = await $fetch('/users', {
      baseURL: config.public.apiBase
    })
    users.value = res.data || res
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

const saveUser = async () => {
  if (!form.value.email || !form.value.full_name) return

  isSaving.value = true

  try {
    if (editingUser.value) {
      await $fetch(`/users/${form.value.id}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body: form.value
      })
      showToast('User updated successfully!', 'success')
    } else {
      await $fetch('/users', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: form.value
      })
      showToast('User created successfully!', 'success')
    }
    loadUsers()
    cancelEdit()
  } catch (error) {
    showToast('Failed to save user!', 'error')
  } finally {
    isSaving.value = false
  }
}

const editUser = (user: any) => {
  editingUser.value = user
  form.value = { ...user }
}

const cancelEdit = () => {
  editingUser.value = null
  form.value = {
    id: null,
    full_name: '',
    username: '',
    email: '',
    password: '',
    company: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    country: '',
    state: '',
    phone: '',
    role: 'customer'
  }
}

const deleteUser = async (id: number) => {
  if (confirm('Delete this user?')) {
    try {
      await $fetch(`/users/${id}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE'
      })
      loadUsers()
      showToast('User deleted successfully!', 'success')
      
    } catch (error) {
      showToast('Failed to delete user!', 'error')
    }
  }
}

onMounted(loadUsers)
</script>

<style scoped>
/* Same style as categories page */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.add-form, .users-list {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.user-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.user-item.even-row {
  background: #f8fafc;
}

.role-badge {
  background: #F49322;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

input, textarea, select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.1);
}

.btn-primary, .btn-secondary {
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-right: 10px;
}

.btn-primary { background: #F49322; color: white; }
.btn-secondary { background: #6b7280; color: white; }
.btn-edit { background: #3b82f6; color: white; }
.btn-delete { background: #ef4444; color: white; }

.btn-edit, .btn-delete {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 8px;
}

</style>