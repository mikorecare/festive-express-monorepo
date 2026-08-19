<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">About Us</h1>
        <p class="text-slate-500 text-sm">Banner, title, description & side image</p>
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
        <!-- Banner & Titles (same pattern as How It Works) -->
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
                <img
                    :src="form.banner_image_url"
                    alt="Banner preview"
                    class="w-full h-48 object-cover"
                />
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

        <!-- Description (rich text) -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 class="text-lg font-bold text-navy">Description</h2>
            <p class="text-slate-500 text-sm">
            Matches left column: orange intro, body text, quote block. Use the toolbar for bold, color, alignment.
            </p>
            <RichTextEditor v-model="form.description" placeholder="Write detailed description…" />
        </div>

      <!-- Description image -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-bold text-navy">Description Image</h2>
        <div class="flex gap-2">
          <input v-model="form.description_image_url" type="text" class="field flex-1" placeholder="Side / oval image URL" />
          <label class="inline-flex items-center justify-center px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-800 whitespace-nowrap">
            Upload
            <input type="file" accept="image/*" class="hidden" @change="onUploadDescImage" />
          </label>
        </div>
        <img
        v-if="form.description_image_url"
        :src="form.description_image_url"
        class="mt-2 h-28 w-28 rounded-full border-4 border-brand-orange object-cover"
        alt="Description"
        style="width: 200px; height: 200px;"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
type AboutUsRow = {
  id?: string
  banner_image_url: string
  title: string
  subtitle: string
  description: string
  description_image_url: string
}

const emptyForm = (): AboutUsRow => ({
  banner_image_url: '',
  title: 'Bringing Joy Back to the Holidays',
  subtitle: 'About Us',
  description: '',
  description_image_url: '',
})

const supabase = useSupabaseClient()
const { showToast } = useToast()

const form = ref<AboutUsRow>(emptyForm())
const rowId = ref<string | null>(null)
const saving = ref(false)
const descEditor = ref<HTMLElement | null>(null)

const loadContent = async () => {
  try {
    const { data, error } = await supabase
      .from('about_us')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    const row = data as AboutUsRow | null
    if (row) {
      rowId.value = (row as any).id || null
      form.value = {
        banner_image_url: row.banner_image_url || '',
        title: row.title || '',
        subtitle: row.subtitle || '',
        description: row.description || '',
        description_image_url: row.description_image_url || '',
      }
    } else {
      rowId.value = null
      form.value = emptyForm()
    }
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to load', 'error')
  }

  await nextTick()
  if (descEditor.value) {
    descEditor.value.innerHTML = form.value.description || ''
  }
}

const isQuoteActive = ref(false)

const onDescInput = () => {
  if (descEditor.value) {
    form.value.description = descEditor.value.innerHTML
  }
  updateQuoteActive()
}

const updateQuoteActive = () => {
  try {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount || !descEditor.value) {
      isQuoteActive.value = false
      return
    }
    let node: Node | null = sel.anchorNode
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement
    isQuoteActive.value = !!(node as HTMLElement)?.closest?.('blockquote')
  } catch {
    isQuoteActive.value = false
  }
}

const format = (cmd: string) => {
  document.execCommand(cmd, false)
  descEditor.value?.focus()
  onDescInput()
}

const setFontSize = (size: string) => {
  if (!size) return
  document.execCommand('fontSize', false, size)
  onDescInput()
}

const setColor = (color: string) => {
  document.execCommand('foreColor', false, color)
  onDescInput()
}

const applyOrangeIntro = () => {
  document.execCommand('foreColor', false, '#f49322')
  document.execCommand('bold', false)
  onDescInput()
}

const applyQuote = () => {
  const editor = descEditor.value
  if (!editor) return

  editor.focus()

  const sel = window.getSelection()
  const selected = sel?.toString()?.trim()

  // If caret is already inside a blockquote → unwrap
  let node: Node | null = sel?.anchorNode || null
  if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement
  const existing = (node as HTMLElement)?.closest?.('blockquote')

  if (existing && editor.contains(existing)) {
    const parent = existing.parentNode
    while (existing.firstChild) {
      parent?.insertBefore(existing.firstChild, existing)
    }
    parent?.removeChild(existing)
    onDescInput()
    return
  }

  const text = selected || 'Quote text here...'
  const html = `<blockquote class="about-quote">${text}</blockquote><p><br></p>`

  // Preferred
  const ok = document.execCommand('insertHTML', false, html)

  // Fallback if insertHTML fails
  if (!ok && sel && sel.rangeCount) {
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const frag = document.createDocumentFragment()
    while (wrapper.firstChild) frag.appendChild(wrapper.firstChild)
    range.insertNode(frag)
  }

  onDescInput()
}

const uploadImage = async (file: File, folder: string) => {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('about-us').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('about-us').getPublicUrl(path)
  return data.publicUrl
}

const onUploadBanner = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.value.banner_image_url = await uploadImage(file, 'banner')
    showToast('Banner uploaded', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Upload failed', 'error')
  }
}

const onUploadDescImage = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.value.description_image_url = await uploadImage(file, 'description')
    showToast('Image uploaded', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Upload failed', 'error')
  }
}

const saveContent = async () => {
  if (descEditor.value) form.value.description = descEditor.value.innerHTML
  if (!form.value.title.trim()) {
    showToast('Title is required', 'error')
    return
  }

  const payload = {
    banner_image_url: form.value.banner_image_url || null,
    title: form.value.title.trim(),
    subtitle: form.value.subtitle || null,
    description: form.value.description || null,
    description_image_url: form.value.description_image_url || null,
    is_active: true,
    updated_at: new Date().toISOString(),
  }

  saving.value = true
  try {
    if (rowId.value) {
      const { error } = await supabase.from('about_us').update(payload as never).eq('id', rowId.value)
      if (error) throw error
    } else {
      const { data, error } = await supabase.from('about_us').insert(payload as never).select('id').single()
      if (error) throw error
      rowId.value = (data as { id: string }).id
    }
    showToast('About Us saved', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Save failed', 'error')
  } finally {
    saving.value = false
  }
}

// Track selection changes for highlight
onMounted(() => {
  loadContent()
  document.addEventListener('selectionchange', updateQuoteActive)
})

onUnmounted(() => {
  document.removeEventListener('selectionchange', updateQuoteActive)
})
</script>