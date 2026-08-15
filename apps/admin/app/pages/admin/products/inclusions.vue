<template>
    <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-[#0c2340]">Inclusion Items</h1>
                <p class="text-slate-500 text-sm mt-1">
                <!-- Shared catalog (C-9, Wreath, Bow…) used by Joy / Jolly / Merry -->
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- LEFT: Add / Edit form -->
            <div class="lg:col-span-5">
                <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h2 class="text-lg font-bold text-[#0c2340] mb-4">
                    {{ editingId ? 'Edit inclusion' : 'Add inclusion' }}
                </h2>

                <div class="space-y-4">
                    <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                        Name <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="form.name"
                        type="text"
                        class="field"
                        placeholder='e.g. C-9 Roofline Lights'
                        @input="onNameInput"
                    />
                    </div>

                    <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Slug</label>
                    <input
                        v-model="form.slug"
                        type="text"
                        class="field"
                        placeholder="c9-roofline"
                    />
                    </div>

                    <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                        v-model="form.description"
                        rows="3"
                        class="field"
                        placeholder="Optional short description"
                    />
                    </div>

                    <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Sort order</label>
                    <input v-model.number="form.sort_order" type="number" class="field" min="0" />
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
                        {{ form.image_url || previewUrl ? 'Click to replace image' : 'Click to upload image' }}
                        </p>
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onFileChange"
                    />
                    <input
                        v-model="form.image_url"
                        type="text"
                        class="field mt-2"
                        placeholder="Or paste path / URL"
                    />
                    </div>

                    <div class="flex flex-wrap gap-2 pt-2">
                    <button
                        type="button"
                        class="px-5 py-2.5 rounded-lg bg-[#F49322] text-white text-sm font-semibold hover:bg-[#0c2340] disabled:opacity-60"
                        :disabled="saving"
                        @click="saveItem"
                    >
                        {{ saving ? 'Saving...' : editingId ? 'Update' : 'Add item' }}
                    </button>
                    <button
                        v-if="editingId"
                        type="button"
                        class="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        @click="resetForm"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <!-- RIGHT: List -->
            <div class="lg:col-span-7">
                <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 class="font-bold text-[#0c2340]">
                    Existing items ({{ items.length }})
                    </h2>
                </div>

                <div v-if="loading" class="p-8 text-center text-slate-500">Loading...</div>

                <ul v-else class="divide-y divide-slate-100">
                    <li
                    v-for="(item, index) in items"
                    :key="item.id"
                    class="flex items-center gap-3 px-5 py-3"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
                    >
                    <img
                        v-if="item.image_url"
                        :src="getImageUrl(item.image_url)"
                        alt=""
                        class="w-12 h-12 object-contain rounded-lg bg-white border border-slate-100"
                    />
                    <div
                        v-else
                        class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs"
                    >
                        N/A
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="font-semibold text-[#0c2340] truncate">{{ item.name }}</div>
                        <div class="text-xs text-slate-400">/{{ item.slug }} · order {{ item.sort_order }}</div>
                        <p v-if="item.description" class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {{ item.description }}
                        </p>
                    </div>

                    <div class="flex gap-2 shrink-0">
                        <button
                        type="button"
                        class="px-3 py-1.5 rounded-lg bg-[#0c2340] text-white text-xs font-semibold hover:bg-[#F49322]"
                        @click="startEdit(item)"
                        >
                        Edit
                        </button>
                        <button
                        type="button"
                        class="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                        @click="confirmDelete(item)"
                        >
                        Delete
                        </button>
                    </div>
                    </li>
                </ul>

                <p v-if="!loading && !items.length" class="p-8 text-center text-slate-500">
                    No inclusion items yet.
                </p>
                </div>
            </div>

            <!-- Delete confirm modal -->
            <div
                v-if="showDeleteModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                @click.self="cancelDelete"
                >
                <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <h3 class="text-lg font-bold text-[#0c2340] mb-2">Delete inclusion?</h3>
                    <p class="text-slate-600 text-sm mb-1">
                    Are you sure you want to delete this item?
                    </p>
                    <p class="font-semibold text-[#0c2340] mb-4">
                    {{ itemToDelete?.name }}
                    </p>
                    <p class="text-xs text-slate-500 mb-6">
                    Packages using it will lose this link.
                    </p>
                    <div class="flex justify-end gap-2">
                    <button
                        type="button"
                        class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
    </div>
</template>

<script setup lang="ts">
// definePageMeta({ middleware: 'auth' })

type InclusionItem = {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  sort_order?: number | null
}

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const db = supabase as any

// use your toast helper if different
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  try {
    // @ts-ignore
    const t = useToast?.()
    if (t?.showToast) return t.showToast(msg, type)
  } catch {}
  if (type === 'error') console.error(msg)
  else console.log(msg)
}

const loading = ref(true)
const saving = ref(false)
const items = ref<InclusionItem[]>([])
const editingId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const form = ref({
  name: '',
  slug: '',
  description: '',
  image_url: '',
  sort_order: 0,
})

const getImageUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  if (url.startsWith('/')) return url

  let path = url.replace(/^\//, '')
  path = path.replace(/^Products\//i, '').replace(/^products\//i, '')

  const bucket = (config.public.storageBucket as string) || 'Products'

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data?.publicUrl || ''
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

const onNameInput = () => {
  // Auto slug only when creating
  if (!editingId.value) {
    form.value.slug = slugify(form.value.name)
  }
}

const resetForm = () => {
  editingId.value = null
  form.value = { name: '', slug: '', description: '', image_url: '', sort_order: items.value.length }
  imageFile.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const startEdit = (item: InclusionItem) => {
  editingId.value = item.id
  form.value = {
    name: item.name || '',
    slug: item.slug || '',
    description: item.description || '',
    image_url: item.image_url || '',
    sort_order: item.sort_order ?? 0,
  }
  imageFile.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  console.log('File selected:', file?.name, file?.size)

  if (!file) return
  imageFile.value = file
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

const uploadImage = async (): Promise<string | null> => {
  // Keep existing image when editing and no new file chosen
  if (!imageFile.value) {
    const existing = form.value.image_url?.trim()
    return existing || null
  }

  const file = imageFile.value
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `inclusions/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
  const bucket = (config.public.storageBucket as string) || 'Products'

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || `image/${ext}`,
  })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(error.message || 'Image upload failed')
  }

  // THIS string must go into the DB
  return path
}

const saveItem = async () => {
  if (!form.value.name.trim()) {
    showToast('Name is required', 'error')
    return
  }
  if (!form.value.slug.trim()) {
    form.value.slug = slugify(form.value.name)
  }

  saving.value = true
  try {
    const uploadedPath = await uploadImage()
    console.log('uploadedPath:', uploadedPath)

    if (uploadedPath) {
      form.value.image_url = uploadedPath
    }

    const payload: Record<string, unknown> = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim(),
      description: form.value.description?.trim() || null,
      sort_order: Number(form.value.sort_order) || 0,
    }
    if (uploadedPath) {
      payload.image_url = uploadedPath
    }

    console.log('editingId:', editingId.value)
    console.log('payload:', payload)

    if (editingId.value) {
      // UPDATE without .single() first
      const { data, error, count } = await db
        .from('inclusion_items')
        .update(payload)
        .eq('id', editingId.value)
        .select('id, name, image_url')

      if (error) throw error

      console.log('update result:', data, 'count-ish:', data?.length)

      if (!data || data.length === 0) {
        throw new Error(
          'Update matched 0 rows. Check id and RLS UPDATE policy on inclusion_items.'
        )
      }

      showToast('Inclusion updated')
    } else {
      const { data, error } = await db
        .from('inclusion_items')
        .insert({ ...payload, image_url: uploadedPath || null })
        .select('id, name, image_url')

      if (error) throw error

      if (!data || data.length === 0) {
        throw new Error('Insert returned 0 rows. Check RLS INSERT policy.')
      }

      console.log('insert result:', data[0])
      showToast('Inclusion added')
    }

    imageFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }

    resetForm()
    await loadItems()
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Save failed', 'error')
  } finally {
    saving.value = false
  }
}

const loadItems = async () => {
  loading.value = true
  try {
    const { data, error } = await db
      .from('inclusion_items')
      .select('id, name, slug, description, image_url, sort_order')
      .order('sort_order', { ascending: true })

    if (error) throw error
    items.value = data || []
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to load inclusions', 'error')
  } finally {
    loading.value = false
  }
}

// const saveItem = async () => {
//   if (!form.value.name.trim()) {
//     showToast('Name is required', 'error')
//     return
//   }
//   if (!form.value.slug.trim()) {
//     form.value.slug = slugify(form.value.name)
//   }

//   saving.value = true
//   try {
//     const image_url = await uploadImage()

//     const payload = {
//       name: form.value.name.trim(),
//       slug: form.value.slug.trim(),
//       description: form.value.description?.trim() || null,
//       image_url,
//       sort_order: Number(form.value.sort_order) || 0,
//     }

//     if (editingId.value) {
//       const { error } = await db
//         .from('inclusion_items')
//         .update(payload)
//         .eq('id', editingId.value)
//       if (error) throw error
//       showToast('Inclusion updated')
//     } else {
//       const { error } = await db.from('inclusion_items').insert(payload)
//       if (error) throw error
//       showToast('Inclusion added')
//     }

//     resetForm()
//     await loadItems()
//   } catch (e: any) {
//     console.error(e)
//     showToast(e?.message || 'Save failed', 'error')
//   } finally {
//     saving.value = false
//   }
// }

// const confirmDelete = async (item: InclusionItem) => {
//   if (!confirm(`Delete “${item.name}”? Packages using it will lose this link.`)) return
//   try {
//     const { error } = await db.from('inclusion_items').delete().eq('id', item.id)
//     if (error) throw error
//     showToast('Deleted')
//     if (editingId.value === item.id) resetForm()
//     await loadItems()
//   } catch (e: any) {
//     console.error(e)
//     showToast(e?.message || 'Delete failed (item may be linked to packages)', 'error')
//   }
// }

const showDeleteModal = ref(false)
const itemToDelete = ref<InclusionItem | null>(null)
const deleting = ref(false)

const confirmDelete = (item: InclusionItem) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const executeDelete = async () => {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    const { error } = await db
      .from('inclusion_items')
      .delete()
      .eq('id', itemToDelete.value.id)

    if (error) throw error

    showToast(`Deleted “${itemToDelete.value.name}”`)
    if (editingId.value === itemToDelete.value.id) resetForm()

    showDeleteModal.value = false
    itemToDelete.value = null
    await loadItems()
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Delete failed (item may be linked to packages)', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await loadItems()
  form.value.sort_order = items.value.length
})
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