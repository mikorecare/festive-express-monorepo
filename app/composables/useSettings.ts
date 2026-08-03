export const useSettings = () => {
  const config = useRuntimeConfig()

  const settings = useState('site-settings', () => ({
    contact_email: '',
    contact_phone: '+19412221012',
    contact_phone_display: '(941) 222-1012',
    contact_address: '',
    social_facebook: '',
    social_instagram: '',
    social_x: '',
    social_youtube: '',
    social_pinterest: '',
  }))

  const loadSettings = async () => {
    try {
      const res: any = await $fetch('/settings/public', {
        baseURL: config.public.apiBase
      })
      settings.value = { ...settings.value, ...res }
    } catch (e) {
      console.error('Failed to load settings', e)
    }
  }

  const telHref = computed(() => {
    const raw = settings.value.contact_phone || settings.value.contact_phone_display || ''
    const digits = raw.replace(/[^\d+]/g, '')
    return digits ? `tel:${digits}` : 'tel:+19412221012'
  })

  return { settings, loadSettings, telHref }
}