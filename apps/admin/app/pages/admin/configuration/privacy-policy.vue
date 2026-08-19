<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">Privacy Policy</h1>
        <p class="text-slate-500 text-sm">Banner, titles & page content</p>
      </div>
      <button
        type="button"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
        :disabled="saving"
        @click="saveContent"
      >
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <form class="space-y-6" @submit.prevent="saveContent">
      <!-- Banner & Titles -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 class="text-lg font-bold text-navy">Banner & Titles</h2>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Banner Image URL</label>
          <div class="flex gap-2">
            <input
              v-model="form.banner_image_url"
              type="text"
              class="field flex-1"
              placeholder="/Images/... or full URL"
            />
            <label class="inline-flex items-center justify-center px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-800 whitespace-nowrap">
              Upload
              <input type="file" accept="image/*" class="hidden" @change="onUploadBanner" />
            </label>
          </div>
          <div
            v-if="form.banner_image_url"
            class="mt-3 rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100"
          >
            <img :src="form.banner_image_url" alt="Banner" class="w-full h-48 object-cover" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Title <span class="text-rose-500">*</span>
            </label>
            <input v-model="form.title" type="text" required class="field" placeholder="Write your title here" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Subtitle</label>
            <input
              v-model="form.subtitle"
              type="text"
              class="field"
              placeholder="Write your subtitle here"
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-bold text-navy">Description</h2>
        <RichTextEditor
          v-model="form.description"
          placeholder="Write privacy policy content…"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
type PrivacyRow = {
  id?: string
  banner_image_url: string | null
  title: string
  subtitle: string | null
  description: string | null
}

const emptyForm = (): PrivacyRow => ({
  banner_image_url: '',
  title: 'Privacy Policy',
  subtitle: '',
  description: '',
})

const supabase = useSupabaseClient()
const { showToast } = useToast()

const form = ref<PrivacyRow>(emptyForm())
const rowId = ref<string | null>(null)
const saving = ref(false)

const loadContent = async () => {
  try {
    const { data, error } = await supabase
      .from('privacy_policy')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    const row = data as PrivacyRow | null
    if (row) {
      rowId.value = (row as any).id || null
      form.value = {
        banner_image_url: row.banner_image_url || '',
        title: row.title || 'Privacy Policy',
        subtitle: row.subtitle || '',
        description: row.description || '',
      }
    } else {
      rowId.value = null
      form.value = emptyForm()
    }
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to load', 'error')
  }
}

const uploadImage = async (file: File) => {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `banner/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('about-us').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('about-us').getPublicUrl(path)
  return data.publicUrl
}

const onUploadBanner = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.value.banner_image_url = await uploadImage(file)
    showToast('Banner uploaded', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Upload failed', 'error')
  }
}

const saveContent = async () => {
  if (!form.value.title?.trim()) {
    showToast('Title is required', 'error')
    return
  }

  const payload = {
    banner_image_url: form.value.banner_image_url || null,
    title: form.value.title.trim(),
    subtitle: form.value.subtitle || null,
    description: form.value.description || null,
    is_active: true,
    updated_at: new Date().toISOString(),
  }

  saving.value = true
  try {
    if (rowId.value) {
      const { error } = await supabase.from('privacy_policy').update(payload as never).eq('id', rowId.value)
      if (error) throw error
    } else {
      const { data, error } = await supabase.from('privacy_policy').insert(payload as never).select('id').single()
      if (error) throw error
      rowId.value = (data as { id: string }).id
    }
    showToast('Privacy Policy saved', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Save failed', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(loadContent)
</script>