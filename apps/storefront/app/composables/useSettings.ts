
export interface SiteSettings {
  contact_email?: string;
  contact_phone?: string;
  contact_phone_display?: string;
  contact_address?: string;
  fl_tax_rate?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_x?: string;
  social_youtube?: string;
  social_pinterest?: string;
  copyright_text?: string;
  [key: string]: any;
}

const SETTINGS_KEY = "site-settings";
const FETCH_KEY = "site-settings-fetch";

const DEFAULT_SETTINGS: SiteSettings = {
  contact_email: "",
  contact_phone: "",
  contact_phone_display: "",
  contact_address: "",
  fl_tax_rate: "",
  social_facebook: "",
  social_instagram: "",
  social_x: "",
  social_youtube: "",
  social_pinterest: "",
  copyright_text: "",
};

export const useSettings = () => {
  const settings = useState<SiteSettings>(SETTINGS_KEY, () => ({
    ...DEFAULT_SETTINGS,
  }));

  const { data: response, refresh } = useAsyncData(
    FETCH_KEY,
    () =>
      $fetch<{ success: boolean; data: SiteSettings | null }>("/api/settings"),
    {
      server: true,
      lazy: false,
      default: () => ({ success: false, data: null }),
      dedupe: "defer",
    }
  );

  watch(
    response,
    (val) => {
      if (val?.success && val.data) {
        settings.value = { ...DEFAULT_SETTINGS, ...val.data };
      }
    },
    { immediate: true }
  );

  const loadSettings = async () => {
    await refresh();
  };

  const telHref = computed(() => {
    const raw =
      settings.value.contact_phone ||
      settings.value.contact_phone_display ||
      "";
    const digits = String(raw).replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "tel:+19412394722";
  });

  return { settings, loadSettings, telHref };
};