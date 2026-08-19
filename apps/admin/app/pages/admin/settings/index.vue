<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-[#0c2340]">Site Settings</h1>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-[#F49322] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c2340] disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="saving || loading"
        @click="saveSettings"
      >
        {{ saving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>

    <div v-if="loading" class="text-gray-500 py-12 text-center">
      Loading settings...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Contact -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-[#0c2340] mb-5">Contact Us</h2>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            v-model="form.contact_email"
            type="email"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
            placeholder="info@example.com"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone (tel link)</label>
          <input
            v-model="form.contact_phone"
            type="text"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
            placeholder="+19412221012"
          >
          <p class="mt-1 text-xs text-slate-500">Used in href="tel:..." — digits preferred</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone (display)</label>
          <input
            v-model="form.contact_phone_display"
            type="text"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
            placeholder="(941) 222-1012"
          >
          <p class="mt-1 text-xs text-slate-500">Shown on “Call Us Now” button</p>
        </div>

        <div class="mb-1">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
          <textarea
            v-model="form.contact_address"
            rows="3"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
            placeholder="Sarasota, FL"
          />
        </div>

        <div class="mb-1">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Opening hours
          </label>
          <textarea
            v-model="form.opening_hours"
            rows="3"
            class="field"
            placeholder="Mon - Sat: 7:00 am - 8:00 pm&#10;Sunday: 8:00 am - 6:00 pm"
          />
          <p class="text-xs text-slate-400 mt-1">Shown on contact / footer</p>
        </div>

        <div class="mb-1">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Footer copyright text
          </label>
          <textarea
            v-model="form.copyright_text"
            rows="3"
            class="field"
            placeholder="Add Copyright text here.."
          />
          <p class="text-xs text-slate-400 mt-1">Shown at the bottom of the storefront footer.</p>
        </div>

      </div>

      <!-- Social -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-[#0c2340] mb-5">Social Media Links</h2>

        <div
          v-for="field in socialFields"
          :key="field.key"
          class="mb-4 last:mb-0"
        >
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">
            {{ field.label }}
          </label>
          <input
            v-model="form[field.key]"
            type="url"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49322]/30 focus:border-[#F49322]"
            :placeholder="field.placeholder"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth',
// })

type SettingsForm = {
  contact_email: string
  contact_phone: string
  contact_phone_display: string
  contact_address: string
  opening_hours: string
  copyright_text: string

  social_facebook: string
  social_instagram: string
  social_x: string
  social_youtube: string
  social_pinterest: string
}

type SocialKey = keyof Pick<
  SettingsForm,
  'social_facebook' | 'social_instagram' | 'social_x' | 'social_youtube' | 'social_pinterest'
>

type SettingRow = {
  id?: number
  key: string
  value: string | null
}

const SETTING_KEYS: (keyof SettingsForm)[] = [
  'contact_email',
  'contact_phone',
  'contact_phone_display',
  'contact_address',
  'opening_hours',
  'copyright_text',
  
  'social_facebook',
  'social_instagram',
  'social_x',
  'social_youtube',
  'social_pinterest',
]

const supabase = useSupabaseClient()
const db = supabase as any
const user = useSupabaseUser()
const { showToast } = useToast()

const loading = ref(true)
const saving = ref(false)
const initialized = ref(false)

const form = ref<SettingsForm>({
  contact_email: '',
  contact_phone: '',
  contact_phone_display: '',
  contact_address: '',
  opening_hours: '',
  copyright_text: '',
  
  social_facebook: '',
  social_instagram: '',
  social_x: '',
  social_youtube: '',
  social_pinterest: '',
})

const socialFields: { key: SocialKey; label: string; placeholder: string }[] = [
  { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'social_x', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
  { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
  { key: 'social_pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
]

const emptyForm = (): SettingsForm => ({
  contact_email: '',
  contact_phone: '',
  contact_phone_display: '',
  contact_address: '',
  opening_hours: '',
  copyright_text: '',

  social_facebook: '',
  social_instagram: '',
  social_x: '',
  social_youtube: '',
  social_pinterest: '',
})

/** Load all key/value rows → form */
const loadSettings = async () => {
  loading.value = true
  try {
    const { data, error } = await db
      .from('settings')
      .select('id, key, value')

    if (error) throw error

    const rows = (data || []) as SettingRow[]
    const next = emptyForm()

    for (const row of rows) {
      const k = row.key as keyof SettingsForm
      if (SETTING_KEYS.includes(k)) {
        next[k] = row.value ?? ''
      }
    }

    form.value = next
  } catch (e: any) {
    console.error('loadSettings', e)
    showToast(e?.message || 'Failed to load settings', 'error')
  } finally {
    loading.value = false
  }
}

/** Upsert each key */
const saveSettings = async () => {
  if (!user.value) {
    showToast('Please log in.', 'error')
    return
  }

  saving.value = true
  try {
    const rows = SETTING_KEYS.map((key) => ({
      key,
      value: form.value[key] ?? '',
      updated_at: new Date().toISOString(),
    }))

    const { error } = await db
      .from('settings')
      .upsert(rows, { onConflict: 'key' })

    if (error) throw error

    showToast('Settings saved', 'success')
  } catch (e: any) {
    console.error('saveSettings', e)
    showToast(e?.message || 'Failed to save settings', 'error')
  } finally {
    saving.value = false
  }
}

// Wait for auth, then load
watch(
  user,
  async (u) => {
    if (!u || initialized.value) return
    initialized.value = true
    await loadSettings()
  },
  { immediate: true }
)
</script>