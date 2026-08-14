<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-[#0c2340]">Package SKUs</h1>
        <p class="text-slate-500 text-sm mt-1">
          Sellable package products (Joy / Jolly / Merry × color)
        </p>
      </div>
      <NuxtLink
        to="/admin/products/package-skus/create"
        class="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F49322] text-white text-sm font-semibold hover:bg-[#0c2340] no-underline"
      >
        + Add Package SKU
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:items-end">
        <div class="flex-1">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Search</label>
          <input
            v-model="searchTerm"
            type="text"
            class="field"
            placeholder="Search name or SKU..."
            @input="onSearch"
          />
        </div>
        <div class="w-full md:w-56">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Package</label>
          <select v-model="packageFilter" class="field" @change="loadSkus">
            <option value="">All packages</option>
            <option v-for="p in packages" :key="p.id" :value="String(p.id)">
              {{ p.name }}
            </option>
          </select>
        </div>
        <div class="w-full md:w-48">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Color</label>
          <select v-model="colorFilter" class="field" @change="loadSkus">
            <option value="">All colors</option>
            <option v-for="c in colorOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <button
          type="button"
          class="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          @click="clearFilters"
        >
          Clear
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-slate-500">Loading SKUs...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#0c2340] text-white text-left">
              <th class="px-4 py-3 font-semibold">Image</th>
              <th class="px-4 py-3 font-semibold">Name</th>
              <th class="px-4 py-3 font-semibold">SKU</th>
              <th class="px-4 py-3 font-semibold">Package</th>
              <th class="px-4 py-3 font-semibold">Color</th>
              <th class="px-4 py-3 font-semibold">Price</th>
              <th class="px-4 py-3 font-semibold">Stock</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sku, index) in filteredSkus"
              :key="sku.id"
              class="border-b border-slate-100"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
            >
              <td class="px-4 py-3">
                <img
                  v-if="sku.image_url"
                  :src="getImageUrl(sku.image_url)"
                  alt=""
                  class="w-12 h-12 object-contain rounded-lg border border-slate-100 bg-white"
                  @error="onImgError"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400"
                >
                  N/A
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-[#0c2340]">{{ sku.name }}</td>
              <td class="px-4 py-3 text-slate-500">{{ sku.sku || '—' }}</td>
              <td class="px-4 py-3">{{ packageName(sku.package_id) }}</td>
              <td class="px-4 py-3">{{ sku.color_label || '—' }}</td>
              <td class="px-4 py-3">${{ formatPrice(sku.price) }}</td>
              <td class="px-4 py-3" :class="Number(sku.stock) <= 0 ? 'text-red-600 font-semibold' : ''">
                {{ sku.stock ?? 0 }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  :class="sku.status === 'publish' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                >
                  {{ sku.status || 'draft' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/products/package-skus/${sku.id}`"
                  class="inline-block px-3 py-1.5 rounded-lg bg-[#0c2340] text-white text-xs font-semibold hover:bg-[#F49322] no-underline"
                >
                  Edit
                </NuxtLink>
                <button
                  type="button"
                  class="inline-block px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                  @click="confirmDelete(sku)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!filteredSkus.length" class="text-center py-12 text-slate-500">
        No package SKUs found.
      </p>
    </div>

    <!-- Delete modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-[#0c2340] mb-2">Delete package SKU?</h3>
        <p class="text-slate-600 text-sm mb-4">
          <strong class="text-[#0c2340]">{{ skuToDelete?.name }}</strong>
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
            :disabled="deleting"
            @click="executeDelete"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

type PackageRow = { id: string | number; name: string }
type SkuRow = {
  id: string | number
  name: string
  sku?: string | null
  price?: number | string | null
  stock?: number | null
  status?: string | null
  image_url?: string | null
  color_label?: string | null
  package_id?: string | number | null
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const db = supabase as any

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  try {
    // @ts-ignore
    const t = useToast?.()
    if (t?.showToast) return t.showToast(msg, type)
  } catch {}
  if (type === 'error') console.error(msg)
  else console.log(msg)
}

const colorOptions = ['Warm White', 'Pure White', 'Champagne', 'Multi', 'Cool White']

const loading = ref(true)
const skus = ref<SkuRow[]>([])
const packages = ref<PackageRow[]>([])
const searchTerm = ref('')
const packageFilter = ref(String(route.query.package_id || ''))
const colorFilter = ref('')

const showDeleteModal = ref(false)
const skuToDelete = ref<SkuRow | null>(null)
const deleting = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null

const formatPrice = (v: number | string | null | undefined) => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}

const packageName = (id: string | number | null | undefined) => {
  if (id == null || id === '') return '—'
  const p = packages.value.find((x) => String(x.id) === String(id))
  return p?.name || '—'
}

const getImageUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/')) return url
  let path = url.replace(/^\//, '').replace(/^Products\//i, '').replace(/^products\//i, '')
  const bucket = (config.public.storageBucket as string) || 'Products'
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}

const onImgError = (e: Event) => {
  const el = e.target as HTMLImageElement
  el.style.opacity = '0.3'
}

const filteredSkus = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return skus.value
  return skus.value.filter((s) => {
    return (
      s.name?.toLowerCase().includes(q) ||
      s.sku?.toLowerCase().includes(q) ||
      s.color_label?.toLowerCase().includes(q)
    )
  })
})

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    // client-side filter via computed
  }, 200)
}

const clearFilters = () => {
  searchTerm.value = ''
  packageFilter.value = ''
  colorFilter.value = ''
  router.replace({ query: {} })
  loadSkus()
}

const loadPackages = async () => {
  const { data, error } = await db
    .from('packages')
    .select('id, name')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error(error)
    return
  }
  packages.value = data || []
}

const loadSkus = async () => {
  loading.value = true
  try {
    // sync query string
    const query: Record<string, string> = {}
    if (packageFilter.value) query.package_id = packageFilter.value
    router.replace({ query })

    let q = db
      .from('products')
      .select('id, name, sku, price, stock, status, image_url, color_label, package_id')
      .eq('is_package', true)
      .order('name', { ascending: true })

    if (packageFilter.value) {
      q = q.eq('package_id', packageFilter.value)
    }
    if (colorFilter.value) {
      q = q.eq('color_label', colorFilter.value)
    }

    const { data, error } = await q
    if (error) throw error
    skus.value = data || []
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to load package SKUs', 'error')
    skus.value = []
  } finally {
    loading.value = false
  }
}

const confirmDelete = (sku: SkuRow) => {
  skuToDelete.value = sku
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  skuToDelete.value = null
}

const executeDelete = async () => {
  if (!skuToDelete.value) return
  deleting.value = true
  try {
    const { error } = await db.from('products').delete().eq('id', skuToDelete.value.id)
    if (error) throw error
    showToast(`Deleted “${skuToDelete.value.name}”`)
    showDeleteModal.value = false
    skuToDelete.value = null
    await loadSkus()
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Delete failed', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await loadPackages()
  await loadSkus()
})
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  background: white;
}
.field:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.2);
}
</style>