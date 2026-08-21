export interface SiteSettings {
  contact_email?: string;
  contact_phone?: string;
  contact_phone_display?: string;
  contact_address?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_x?: string;
  social_youtube?: string;
  social_pinterest?: string;
  [key: string]: any;
}

export const useSettings = () => {
  const supabase = useSupabaseClient();

  const settings = useState<SiteSettings>("site-settings", () => ({
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
  }));

  const loadSettings = async () => {
    try {
      // Cast table query to any to prevent TypeScript 'never' generic errors
      const { data, error } = await (supabase.from("settings") as any).select(
        "*",
      );

      if (error) throw error;

      if (data) {
        // If stored as key-value pairs in rows [{ key: 'contact_email', value: '...' }]
        if (Array.isArray(data) && data.length > 0 && "key" in data[0]) {
          const formatted = data.reduce(
            (acc: Record<string, any>, row: any) => {
              acc[row.key] = row.value;
              return acc;
            },
            {},
          );
          settings.value = { ...settings.value, ...formatted };
        }
        // If stored as a single settings record row
        else if (Array.isArray(data) && data.length > 0) {
          settings.value = { ...settings.value, ...data[0] };
        }
      }
    } catch (e) {
      console.error("Failed to load settings from Supabase:", e);
    }
  };

  const telHref = computed(() => {
    const raw =
      settings.value.contact_phone ||
      settings.value.contact_phone_display ||
      "";
    const digits = raw.replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "tel:+19412221012";
  });

  return { settings, loadSettings, telHref };
};
