<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Site Settings</h1>
        <p class="text-slate-500 text-sm">
          Contact, social links, tax rate, and footer content
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-[#F49321] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1C2D5B] disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="saving || loading"
        @click="saveSettings"
      >
        {{ saving ? "Saving..." : "Save Settings" }}
      </button>
    </div>

    <div v-if="loading" class="text-gray-500 py-12 text-center">
      Loading settings...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Contact -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-[#1C2D5B] mb-5">Contact Us</h2>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5"
            >Email</label
          >
          <input
            v-model="form.contact_email"
            type="email"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
            placeholder="info@example.com"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5"
            >Phone (tel link)</label
          >
          <input
            v-model="form.contact_phone"
            type="text"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
            placeholder="+19412221012"
          />
          <p class="mt-1 text-xs text-slate-500">
            Used in href="tel:..." — digits preferred
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5"
            >Phone (display)</label
          >
          <input
            v-model="form.contact_phone_display"
            type="text"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
            placeholder="(941) 222-1012"
          />
          <p class="mt-1 text-xs text-slate-500">
            Shown on “Call Us Now” button
          </p>
        </div>

        <div class="mb-1">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5"
            >Address</label
          >
          <textarea
            v-model="form.contact_address"
            rows="3"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
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
          <p class="text-xs text-slate-400 mt-1">
            Shown at the bottom of the storefront footer.
          </p>
        </div>
      </div>

      <!-- Social -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-[#1C2D5B] mb-5">
          Social Media Links
        </h2>

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
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
            :placeholder="field.placeholder"
          />
        </div>
      </div>

      <!-- Checkout / Tax -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-[#1C2D5B] mb-5">Checkout</h2>

        <div class="mb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">
            Florida tax rate (%)
          </label>
          <input
            v-model="form.fl_tax_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]/30 focus:border-[#F49321]"
            placeholder="7"
          />
          <p class="mt-1 text-xs text-slate-500">
            Enter percent (e.g. <strong>7</strong> for 7%). Storefront converts
            to decimal (0.07).
          </p>
        </div>

        <div class="form-section mt-5">
          <label class="form-label mb-2 block"
            >Early Bird Special / Sale Price</label
          >

          <button
            type="button"
            role="switch"
            :aria-checked="form.early_bird_enabled === 'true'"
            class="relative h-10 w-[88px] shrink-0 rounded-full border-0 p-0 shadow-inner transition-colors duration-250 cursor-pointer"
            :class="
              form.early_bird_enabled === 'true'
                ? 'bg-green-500'
                : 'bg-slate-200'
            "
            @click="
              form.early_bird_enabled =
                form.early_bird_enabled === 'true' ? 'false' : 'true'
            "
          >
            <span
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-extrabold tracking-wide text-white transition-opacity duration-200"
              :class="
                form.early_bird_enabled === 'true' ? 'opacity-100' : 'opacity-0'
              "
            >
              ON
            </span>
            <span
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-extrabold tracking-wide text-slate-400 transition-opacity duration-200"
              :class="
                form.early_bird_enabled === 'true' ? 'opacity-0' : 'opacity-100'
              "
            >
              OFF
            </span>
            <span
              class="absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-250"
              :class="
                form.early_bird_enabled === 'true'
                  ? 'translate-x-12'
                  : 'translate-x-0'
              "
            />
          </button>
        </div>

        <div v-show="form.early_bird_enabled === 'true'" class="space-y-4">
          <div class="form-section">
            <label class="form-label">Early Bird Expires At</label>
            <input
              v-model="form.early_bird_expires_at"
              type="datetime-local"
              class="form-date"
            />
            <small class="text-slate-500">
              After this date, sale/early bird prices are hidden and base price
              is used.
            </small>
          </div>

          <div class="form-section">
            <label class="form-label">Early Bird Title</label>
            <input
              v-model="form.early_bird_title"
              type="text"
              placeholder="Early Bird Special Pricing"
            />
          </div>

          <div class="form-section">
            <label class="form-label">Early Bird Description</label>
            <textarea
              v-model="form.early_bird_description"
              rows="3"
              placeholder="Short description for the storefront banner"
            />
          </div>
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
  contact_email: string;
  contact_phone: string;
  contact_phone_display: string;
  contact_address: string;
  opening_hours: string;
  copyright_text: string;
  fl_tax_rate: string;
  early_bird_expires_at: string;
  early_bird_enabled: string; // "true" | "false"
  early_bird_title: string;
  early_bird_description: string;

  social_facebook: string;
  social_instagram: string;
  social_x: string;
  social_youtube: string;
  social_pinterest: string;
};

type SocialKey = keyof Pick<
  SettingsForm,
  | "social_facebook"
  | "social_instagram"
  | "social_x"
  | "social_youtube"
  | "social_pinterest"
>;

type SettingRow = {
  id?: number;
  key: string;
  value: string | null;
};

const SETTING_KEYS: (keyof SettingsForm)[] = [
  "contact_email",
  "contact_phone",
  "contact_phone_display",
  "contact_address",
  "opening_hours",
  "copyright_text",
  "fl_tax_rate",
  "early_bird_enabled",
  "early_bird_expires_at",
  "early_bird_title",
  "early_bird_description",

  "social_facebook",
  "social_instagram",
  "social_x",
  "social_youtube",
  "social_pinterest",
];

const supabase = useSupabaseClient();
const db = supabase as any;
const user = useSupabaseUser();
const { showToast } = useToast();

const loading = ref(true);
const saving = ref(false);
const initialized = ref(false);

const form = ref<SettingsForm>({
  contact_email: "",
  contact_phone: "",
  contact_phone_display: "",
  contact_address: "",
  opening_hours: "",
  copyright_text: "",
  fl_tax_rate: "",
  early_bird_expires_at: "",
  early_bird_enabled: "",
  early_bird_title: "",
  early_bird_description: "",

  social_facebook: "",
  social_instagram: "",
  social_x: "",
  social_youtube: "",
  social_pinterest: "",
});

const socialFields: { key: SocialKey; label: string; placeholder: string }[] = [
  {
    key: "social_facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/...",
  },
  {
    key: "social_instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/...",
  },
  { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/..." },
  {
    key: "social_youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/...",
  },
  {
    key: "social_pinterest",
    label: "Pinterest",
    placeholder: "https://pinterest.com/...",
  },
];

const emptyForm = (): SettingsForm => ({
  contact_email: "",
  contact_phone: "",
  contact_phone_display: "",
  contact_address: "",
  opening_hours: "",
  copyright_text: "",
  fl_tax_rate: "",
  early_bird_enabled: "false",
  early_bird_expires_at: "",
  early_bird_title: "",
  early_bird_description: "",

  social_facebook: "",
  social_instagram: "",
  social_x: "",
  social_youtube: "",
  social_pinterest: "",
});

const earlyBirdEnabled = ref(false);
const earlyBirdExpiresAt = ref(""); // datetime-local string
const earlyBirdTitle = ref("");
const earlyBirdDescription = ref("");

/** Load all key/value rows → form */
const loadSettings = async () => {
  loading.value = true;
  try {
    const { data, error } = await db.from("settings").select("id, key, value");
    if (error) throw error;

    const rows = (data || []) as SettingRow[];
    const next = emptyForm();

    for (const row of rows) {
      const k = row.key as keyof SettingsForm;
      if (SETTING_KEYS.includes(k as any)) {
        next[k] = row.value ?? "";
      }
    }

    // Tax: 0.07 → 7
    if (next.fl_tax_rate) {
      const n = Number(next.fl_tax_rate);
      if (!Number.isNaN(n) && n > 0 && n <= 1) {
        next.fl_tax_rate = String(n * 100);
      }
    }

    // datetime-local needs "YYYY-MM-DDTHH:mm"
    if (next.early_bird_expires_at) {
      next.early_bird_expires_at = next.early_bird_expires_at.slice(0, 16);
    }

    // normalize enable flag
    next.early_bird_enabled =
      next.early_bird_enabled === "true" ||
      next.early_bird_enabled === "1" ||
      next.early_bird_enabled === "yes"
        ? "true"
        : "false";

    form.value = next;
  } catch (e: any) {
    console.error("loadSettings", e);
    showToast(e?.message || "Failed to load settings", "error");
  } finally {
    loading.value = false;
  }
};

/** Upsert each key */
const saveSettings = async () => {
  if (!user.value) {
    showToast("Please log in.", "error");
    return;
  }

  saving.value = true;
  try {
    const rows = SETTING_KEYS.map((key) => {
      let value = form.value[key] ?? "";

      if (key === "fl_tax_rate") {
        const pct = Number(value);
        value = !Number.isNaN(pct) ? String(pct / 100) : "0.07";
      }

      if (key === "early_bird_enabled") {
        value = value === "true" || value === "1" ? "true" : "false";
      }

      if (key === "early_bird_expires_at" && value) {
        // datetime-local → ISO for storefront compare
        value = new Date(value).toISOString();
      }

      return {
        key,
        value,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await db
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    if (error) throw error;
    showToast("Settings saved", "success");
  } catch (e: any) {
    console.error("saveSettings", e);
    showToast(e?.message || "Failed to save settings", "error");
  } finally {
    saving.value = false;
  }
};

// Wait for auth, then load
watch(
  user,
  async (u) => {
    if (!u || initialized.value) return;
    initialized.value = true;
    await loadSettings();
  },
  { immediate: true },
);
</script>
