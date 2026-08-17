<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">Users Management</h1>
        <p class="text-slate-500 text-sm">Manage user profiles</p>
      </div>
      <button
        type="button"
        class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium shadow-sm"
        @click="loadUsers"
      >
        Refresh
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Form -->
      <div class="xl:col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 class="text-lg font-bold text-navy mb-4">
          {{ editingUser ? 'Edit User' : 'Add New User' }}
        </h3>

        <form class="space-y-4" @submit.prevent="saveUser">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Display Name</label>
            <input v-model="form.display_name" type="text" class="field" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                First Name <span class="text-rose-500">*</span>
              </label>
              <input v-model="form.first_name" type="text" required class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
              <input v-model="form.last_name" type="text" class="field" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Email <span class="text-rose-500">*</span>
            </label>
            <input v-model="form.email" type="email" required class="field" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <input v-model="form.department" type="text" class="field" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
            <select v-model="form.role" class="field">
              <option value="customer">Customer</option>
              <option value="editor">Editor</option>
              <option value="shop_manager">Shop Manager</option>
              <option value="administrator">Administrator</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
            <input v-model="form.phone" type="text" class="field" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Phone</label>
            <input v-model="form.mobile_phone" type="text" class="field" />
          </div>

          <div class="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Saving...' : editingUser ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="xl:col-span-2">
        <FestiveTable
          :columns="columns"
          :data="users"
          :loading="loading"
          :server-pagination="true"
          :total-items="totalItems"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          search-placeholder="Search name, email, department..."
          :search-fields="['display_name', 'first_name', 'last_name', 'email', 'department']"
          row-key="id"
          @page-change="onPageChange"
          @search="onSearch"
        >
          <template #cell-display_name="{ item }">
            <div>
              <div class="font-semibold text-navy">
                {{ item.display_name || [item.first_name, item.last_name].filter(Boolean).join(' ') || '—' }}
              </div>
              <div class="text-xs text-slate-500">
                {{ item.first_name }} {{ item.last_name }}
              </div>
            </div>
          </template>

          <template #cell-role="{ item }">
            <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
              {{ (item.role || 'customer').replaceAll('_', ' ') }}
            </span>
          </template>

          <template #cell-actions="{ item }">
            <div class="text-right space-x-2">
              <button
                type="button"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                @click="editUser(item)"
              >
                Edit
              </button>
              <button
                type="button"
                class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-xs font-medium"
                @click="showDeleteConfirm(item)"
              >
                Delete
              </button>
            </div>
          </template>
        </FestiveTable>
      </div>
    </div>

    <!-- Delete modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-bold text-slate-900 mb-2">Confirm Delete</h3>
        <p class="text-sm text-slate-600 mb-4">
          Delete
          <strong>{{ userToDelete?.display_name || userToDelete?.email }}</strong>?
        </p>
        <div class="space-y-2 mb-4">
          <label class="block text-xs font-medium text-slate-500">
            Type <strong class="text-rose-600">DELETE</strong> to confirm:
          </label>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="DELETE"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-center font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
            :disabled="deleteConfirmText !== 'DELETE'"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column } from '~/components/FestiveTable.vue'

type UserProfile = {
  id: number | string
  display_name?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  department?: string | null
  role?: string | null
  phone?: string | null
  mobile_phone?: string | null
}

const emptyForm = () => ({
  id: null as number | string | null,
  display_name: '',
  first_name: '',
  last_name: '',
  email: '',
  department: '',
  role: 'customer',
  phone: '',
  mobile_phone: '',
})

const supabase = useSupabaseClient() as any
const { showToast } = useToast()

const columns: Column[] = [
  { key: 'display_name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'phone', label: 'Phone' },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const users = ref<UserProfile[]>([])
const form = ref(emptyForm())
const editingUser = ref<UserProfile | null>(null)
const isSaving = ref(false)
const loading = ref(true)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const searchTerm = ref('')

const showModal = ref(false)
const userToDelete = ref<UserProfile | null>(null)
const deleteConfirmText = ref('')

const loadUsers = async () => {
  loading.value = true
  try {
    const from = (currentPage.value - 1) * itemsPerPage.value
    const to = from + itemsPerPage.value - 1

    let query = supabase
      .from('user_profiles')
      .select(
        'id, display_name, first_name, last_name, email, department, role, phone, mobile_phone',
        { count: 'exact' }
      )
      .order('id', { ascending: false })
      .range(from, to)

    const q = searchTerm.value.trim()
    if (q) {
      query = query.or(
        `display_name.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,department.ilike.%${q}%`
      )
    }

    const { data, error, count } = await query
    if (error) throw error

    users.value = (data || []) as UserProfile[]
    totalItems.value = count || 0
  } catch (e) {
    console.error(e)
    users.value = []
    totalItems.value = 0
    showToast('Failed to load users', 'error')
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadUsers()
}

const onSearch = (term: string) => {
  searchTerm.value = term
  currentPage.value = 1
  loadUsers()
}

const saveUser = async () => {
  if (!form.value.first_name?.trim() || !form.value.email?.trim()) {
    showToast('First name and email are required', 'error')
    return
  }

  isSaving.value = true
  try {
    const payload = {
      display_name:
        form.value.display_name ||
        [form.value.first_name, form.value.last_name].filter(Boolean).join(' '),
      first_name: form.value.first_name,
      last_name: form.value.last_name || null,
      email: form.value.email,
      department: form.value.department || null,
      role: form.value.role || 'customer',
      phone: form.value.phone || null,
      mobile_phone: form.value.mobile_phone || null,
    }

    if (editingUser.value && form.value.id != null) {
      const { error } = await supabase
        .from('user_profiles')
        .update(payload)
        .eq('id', form.value.id)
      if (error) throw error
      showToast('User updated successfully', 'success')
    } else {
      const { error } = await supabase.from('user_profiles').insert(payload)
      if (error) throw error
      showToast('User created successfully', 'success')
    }

    cancelEdit()
    await loadUsers()
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to save user', 'error')
  } finally {
    isSaving.value = false
  }
}

const editUser = (user: UserProfile) => {
  editingUser.value = user
  form.value = {
    id: user.id,
    display_name: user.display_name || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    department: user.department || '',
    role: user.role || 'customer',
    phone: user.phone || '',
    mobile_phone: user.mobile_phone || '',
  }
}

const cancelEdit = () => {
  editingUser.value = null
  form.value = emptyForm()
}

const showDeleteConfirm = (user: UserProfile) => {
  userToDelete.value = user
  deleteConfirmText.value = ''
  showModal.value = true
}

const cancelDelete = () => {
  showModal.value = false
  userToDelete.value = null
  deleteConfirmText.value = ''
}

const executeDelete = async () => {
  if (!userToDelete.value || deleteConfirmText.value !== 'DELETE') return
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userToDelete.value.id)
    if (error) throw error
    showToast('User deleted successfully', 'success')
    cancelDelete()
    await loadUsers()
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete user', 'error')
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
}
.field:focus {
  outline: none;
  border-color: #f49322;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.2);
}
</style>