<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">How It Works</h1>
        <p class="text-slate-500 text-sm">Manage banner, steps, and footer content</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium shadow-sm"
          :disabled="loading"
          @click="loadContent"
        >
          Refresh
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 text-sm font-medium shadow-sm disabled:opacity-60"
          :disabled="saving"
          @click="saveContent"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-500">
      Loading...
    </div>

    <form v-else class="space-y-6" @submit.prevent="saveContent">
      <!-- Banner + Titles -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 class="text-lg font-bold text-navy">Banner & Titles</h2>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Banner Image URL</label>
          <input
            v-model="form.banner_image_url"
            type="text"
            class="field"
            placeholder="/Images/how-it-works-banner.jpg or full URL"
          />
          <div
            v-if="form.banner_image_url"
            class="mt-3 rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100"
          >
            <img
              :src="form.banner_image_url"
              alt="Banner preview"
              class="w-full h-48 object-cover"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Title <span class="text-rose-500">*</span>
            </label>
            <input v-model="form.title" type="text" required class="field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Subtitle</label>
            <input v-model="form.subtitle" type="text" class="field" placeholder="Rent - Relax - Celebrate" />
          </div>
        </div>
      </div>

      <!-- Steps -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-navy">Steps</h2>
            <p class="text-slate-500 text-sm">Up to 6 steps. Add or remove as needed.</p>
          </div>
          <button
            type="button"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            :disabled="form.steps.length >= 6"
            @click="addStep"
          >
            + Add Step
          </button>
        </div>

        <div
          v-for="(step, index) in form.steps"
          :key="index"
          class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-bold uppercase tracking-wide text-brand-orange">
              Step {{ index + 1 }}
            </span>
            <button
              type="button"
              class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-xs font-medium disabled:opacity-40"
              :disabled="form.steps.length <= 1"
              @click="removeStep(index)"
            >
              Remove
            </button>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
            <input
              v-model="step.title"
              type="text"
              class="field"
              :placeholder="`Step ${index + 1}: Pick your package`"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              v-model="step.description"
              rows="3"
              class="field resize-y"
              placeholder="Short description for this step..."
            />
          </div>
        </div>
      </div>

      <!-- Footer description (rich text) -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-bold text-navy">Footer Description</h2>
        <p class="text-slate-500 text-sm">
          Supports basic formatting: bold, alignment, font size, and color.
        </p>

        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-2 p-2 border border-slate-200 rounded-lg bg-slate-50">
          <button type="button" class="toolbar-btn" title="Bold" @click="format('bold')">
            <strong>B</strong>
          </button>
          <button type="button" class="toolbar-btn" title="Italic" @click="format('italic')">
            <em>I</em>
          </button>
          <span class="w-px h-5 bg-slate-300" />
          <button type="button" class="toolbar-btn" title="Align left" @click="format('justifyLeft')">
            Left
          </button>
          <button type="button" class="toolbar-btn" title="Align center" @click="format('justifyCenter')">
            Center
          </button>
          <button type="button" class="toolbar-btn" title="Align right" @click="format('justifyRight')">
            Right
          </button>
          <span class="w-px h-5 bg-slate-300" />
          <select class="toolbar-select" @change="setFontSize(($event.target as HTMLSelectElement).value)">
            <option value="">Size</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">XL</option>
          </select>
          <input
            type="color"
            class="w-9 h-9 rounded border border-slate-200 cursor-pointer bg-white"
            title="Text color"
            @input="setColor(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div
          ref="footerEditor"
          class="field min-h-[140px] bg-white prose prose-sm max-w-none focus:outline-none"
          contenteditable="true"
          @input="onFooterInput"
        />

        <p class="text-xs text-slate-400">
          Preview on storefront will render this HTML as-is.
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
type Step = {
  title: string
  description: string
}

type HowItWorksRow = {
  id?: string
  banner_image_url: string | null
  title: string
  subtitle: string | null
  steps: Step[]
  footer_description: string | null
}

const emptyForm = (): HowItWorksRow => ({
  banner_image_url: '',
  title: 'How it Works',
  subtitle: 'Rent - Relax - Celebrate',
  steps: [
    {
      title: 'Step 1: Pick your package',
      description: 'Choose Joy, Jolly, or Merry based on the look you want.',
    },
  ],
  footer_description:
    `<p style="text-align:center">That's it. One decision. Zero hassle. All the magic.</p>
<p style="text-align:center">Powered by the same team behind Festive Lighting Pros — Florida's trusted illumineers who create professional holiday displays year after year.</p>`,
})

const supabase = useSupabaseClient() as any
const { showToast } = useToast()

const form = ref<HowItWorksRow>(emptyForm())
const rowId = ref<string | null>(null)
const loading = ref(true)
const saving = ref(false)
const footerEditor = ref<HTMLElement | null>(null)

const loadContent = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('how_it_works')
      .select('id, banner_image_url, title, subtitle, steps, footer_description')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    const row = data as HowItWorksRow | null

    if (row) {
      rowId.value = (row.id as string) || null
      form.value = {
        banner_image_url: row.banner_image_url || '',
        title: row.title || 'How it Works',
        subtitle: row.subtitle || '',
        steps:
          Array.isArray(row.steps) && row.steps.length
            ? (row.steps as Step[])
            : emptyForm().steps,
        footer_description: row.footer_description || '',
      }
    } else {
      rowId.value = null
      form.value = emptyForm()
    }
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to load content', 'error')
  } finally {
    loading.value = false
  }

  // Editor is in the DOM only after loading = false
  await nextTick()
  if (footerEditor.value) {
    footerEditor.value.innerHTML = form.value.footer_description || ''
  }
}

const addStep = () => {
  if (form.value.steps.length >= 6) return
  const n = form.value.steps.length + 1
  form.value.steps.push({
    title: `Step ${n}: `,
    description: '',
  })
}

const removeStep = (index: number) => {
  if (form.value.steps.length <= 1) return
  form.value.steps.splice(index, 1)
}

const onFooterInput = () => {
  if (footerEditor.value) {
    form.value.footer_description = footerEditor.value.innerHTML
  }
}

const format = (command: string) => {
  document.execCommand(command, false)
  footerEditor.value?.focus()
  onFooterInput()
}

const setFontSize = (size: string) => {
  if (!size) return
  document.execCommand('fontSize', false, size)
  footerEditor.value?.focus()
  onFooterInput()
}

const setColor = (color: string) => {
  document.execCommand('foreColor', false, color)
  footerEditor.value?.focus()
  onFooterInput()
}

const saveContent = async () => {
  if (!form.value.title?.trim()) {
    showToast('Title is required', 'error')
    return
  }

  // sync editor HTML
  if (footerEditor.value) {
    form.value.footer_description = footerEditor.value.innerHTML
  }

  const payload = {
    banner_image_url: form.value.banner_image_url || null,
    title: form.value.title.trim(),
    subtitle: form.value.subtitle || null,
    steps: form.value.steps.map((s) => ({
      title: s.title?.trim() || '',
      description: s.description?.trim() || '',
    })),
    footer_description: form.value.footer_description || null,
    is_active: true,
    updated_at: new Date().toISOString(),
  }

  saving.value = true
  try {
    if (rowId.value) {
        const { error } = await supabase
            .from('how_it_works')
            .update(payload as never)
            .eq('id', rowId.value)
        if (error) throw error
    } else {
        const { data, error } = await supabase
        .from('how_it_works')
        .insert(payload as never)
        .select('id')
        .single()

        if (error) throw error

        const created = data as { id: string } | null
        rowId.value = created?.id ?? null
    }

    showToast('How It Works saved successfully', 'success')
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to save', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(loadContent)
</script>

<style scoped>
[contenteditable='true']:empty:before {
  content: 'Write footer description here...';
  color: #94a3b8;
}
</style>