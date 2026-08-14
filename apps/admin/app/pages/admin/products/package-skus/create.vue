<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-[#0c2340]">Add Package SKU</h1>
        <p class="text-slate-500 text-sm mt-1">Create a sellable package × color product</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink
          to="/admin/products/package-skus"
          class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
        >
          Cancel
        </NuxtLink>
        <button
          type="button"
          class="px-5 py-2 rounded-lg bg-[#F49322] text-white text-sm font-semibold hover:bg-[#0c2340] disabled:opacity-60"
          :disabled="saving"
          @click="saveSku"
        >
          {{ saving ? 'Saving...' : 'Save SKU' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Name <span class="text-red-500">*</span>
        </label>
        <input v-model="form.name" type="text" class="field" placeholder="e.g. Joy – Warm White" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">SKU</label>
          <input v-model="form.sku" type="text" class="field" placeholder="JOY-WW" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Package <span class="text-red-500">*</span>
          </label>
          <select v-model="form.package_id" class="field">
            <option value="">Select package</option>
            <option v-for="p in packages" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Color</label>
          <select v-model="form.color" class="field">
            <option value="">Select color</option>
            <option v-for="c in colorOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price ($)</label>
          <input v-model.number="form.price" type="number" step="0.01" min="0" class="field" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Stock</label>
          <input v-model.number="form.stock" type="number" min="0" class="field" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
        <select v-model="form.status" class="field">
          <option value="draft">Draft</option>
          <option value="publish">Publish</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
        <textarea v-model="form.description" rows="4" class="field" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Image</label>
        <div
          class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#F49322]"
          @click="fileInput?.click()"
        >
          <img
            v-if="previewUrl || form.image_url"
            :src="previewUrl || getImageUrl(form.image_url)"
            alt=""
            class="mx-auto max-h-28 object-contain mb-2"
          />
          <p class="text-sm text-slate-500">
            {{ form.image_url || previewUrl ? 'Click to replace' : 'Click to upload' }}
          </p>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        <input v-model="form.image_url" type="text" class="field mt-2" placeholder="Or paste path / URL" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

type PackageRow = { id: string | number; name: string; base_price?: number | string | null }

const route = useRoute()
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
const packages = ref<PackageRow[]>([])
const saving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const form = ref({
  name: '',
  sku: '',
  package_id: String(route.query.package_id || ''),
  color: '',
  price: 0,
  stock: 0,
  status: 'publish',
  description: '',
  image_url: '',
})

const getImageUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/')) return url
  let path = url.replace(/^\//, '').replace(/^Products\//i, '').replace(/^products\//i, '')
  const bucket = (config.public.storageBucket as string) || 'Products'
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  imageFile.value = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = file ? URL.createObjectURL(file) : null
}

const uploadImage = async (): Promise<string | null> => {
  if (!imageFile.value) return form.value.image_url?.trim() || null
  const file = imageFile.value
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `package-skus/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
  const bucket = (config.public.storageBucket as string) || 'Products'
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || `image/${ext}`,
  })
  if (error) throw error
  return path
}

const loadPackages = async () => {
  const { data, error } = await db
    .from('packages')
    .select('id, name, base_price')
    .order('sort_order', { ascending: true })
  if (error) throw error
  packages.value = data || []

  // prefill price from package base_price when package chosen from query
  if (form.value.package_id) {
    const p = packages.value.find((x) => String(x.id) === form.value.package_id)
    if (p?.base_price != null && !form.value.price) {
      form.value.price = Number(p.base_price) || 0
    }
  }
}

watch(
  () => form.value.package_id,
  (id) => {
    const p = packages.value.find((x) => String(x.id) === String(id))
    if (p?.base_price != null) form.value.price = Number(p.base_price) || 0
  }
)

const saveSku = async () => {
  if (!form.value.name.trim()) {
    showToast('Name is required', 'error')
    return
  }
  if (!form.value.package_id) {
    showToast('Package is required', 'error')
    return
  }

  saving.value = true
  try {
    const image_url = await uploadImage()

    const payload = {
      name: form.value.name.trim(),
      sku: form.value.sku.trim() || null,
      package_id: form.value.package_id,
      color: form.value.color || null,
      price: Number(form.value.price) || 0,
      stock: Number(form.value.stock) || 0,
      status: form.value.status || 'draft',
      description: form.value.description?.trim() || null,
      image_url: image_url,
      is_package: true,
      is_active: true,
    }

    const { data, error } = await db.from('products').insert(payload).select('id').limit(1)
    if (error) throw error
    if (!data?.length) throw new Error('Insert returned 0 rows (check RLS)')

    showToast('Package SKU created')
    navigateTo(`/admin/products/package-skus/${data[0].id}`)
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Save failed', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(loadPackages)
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
}
.field:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.2);
}
</style>