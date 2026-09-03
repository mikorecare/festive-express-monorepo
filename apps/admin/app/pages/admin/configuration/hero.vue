<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header Controls -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#1C2D5B]">Hero Section</h1>
        <p class="text-slate-500 text-sm">
          Manage storefront hero banner titles and countdown settings
        </p>
      </div>
      <button
        type="button"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition-colors"
        :disabled="saving || loading"
        @click="saveHero"
      >
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>
    </div>

    <!-- Form Container -->
    <div v-if="loading" class="text-gray-500 py-12 text-center">Loading...</div>

    <div
      v-else
      class="max-w-xl bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">
          H1 line 1 (white)
        </label>
        <input
          v-model="form.hero_h1_white"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          placeholder="RENT THE MAGIC"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">
          H1 line 2 (orange)
        </label>
        <input
          v-model="form.hero_h1_orange"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          placeholder="ENJOY THE SEASON"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">
          Short description 1
        </label>
        <input
          v-model="form.hero_description_1"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          placeholder="Giftwrapped in One Simple Package."
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">
          Short description 2
        </label>
        <input
          v-model="form.hero_description_2"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          placeholder="(No ladders. No tangled cords. No storage. No stress.)"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">
          Button label
        </label>
        <input
          v-model="form.hero_button_label"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          placeholder="Explore the Packages"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Christmas Countdown
        </label>
        <button
          type="button"
          role="switch"
          :aria-checked="form.hero_countdown_enabled === 'true'"
          class="relative h-10 w-[88px] shrink-0 rounded-full border-0 p-0 shadow-inner cursor-pointer"
          :class="
            form.hero_countdown_enabled === 'true'
              ? 'bg-green-500'
              : 'bg-slate-200'
          "
          @click="
            form.hero_countdown_enabled =
              form.hero_countdown_enabled === 'true' ? 'false' : 'true'
          "
        >
          <span
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-extrabold text-white"
            :class="
              form.hero_countdown_enabled === 'true'
                ? 'opacity-100'
                : 'opacity-0'
            "
          >
            ON
          </span>
          <span
            class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-extrabold text-slate-400"
            :class="
              form.hero_countdown_enabled === 'true'
                ? 'opacity-0'
                : 'opacity-100'
            "
          >
            OFF
          </span>
          <span
            class="absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform"
            :class="
              form.hero_countdown_enabled === 'true'
                ? 'translate-x-12'
                : 'translate-x-0'
            "
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const HERO_KEYS = [
  "hero_h1_white",
  "hero_h1_orange",
  "hero_description_1",
  "hero_description_2",
  "hero_button_label",
  "hero_countdown_enabled",
] as const;

type HeroForm = Record<(typeof HERO_KEYS)[number], string>;

const emptyForm = (): HeroForm => ({
  hero_h1_white: "",
  hero_h1_orange: "",
  hero_description_1: "",
  hero_description_2: "",
  hero_button_label: "",
  hero_countdown_enabled: "true",
});

const supabase = useSupabaseClient() as any;
const user = useSupabaseUser();
const { showToast } = useToast();

const loading = ref(true);
const saving = ref(false);
const form = ref<HeroForm>(emptyForm());

const loadHero = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [...HERO_KEYS]);
    if (error) throw error;

    const next = emptyForm();
    for (const row of data || []) {
      const k = row.key as keyof HeroForm;
      if (!(k in next)) continue;
      next[k] = String(row.value ?? "").replace(/^"|"$/g, "");
    }
    next.hero_countdown_enabled =
      next.hero_countdown_enabled === "true" ||
      next.hero_countdown_enabled === "1"
        ? "true"
        : "false";
    form.value = next;
  } catch (e: any) {
    showToast(e?.message || "Failed to load hero settings", "error");
  } finally {
    loading.value = false;
  }
};

const saveHero = async () => {
  if (!user.value) {
    showToast("Please log in.", "error");
    return;
  }
  saving.value = true;
  try {
    const rows = HERO_KEYS.map((key) => ({
      key,
      value:
        key === "hero_countdown_enabled"
          ? form.value[key] === "true"
            ? "true"
            : "false"
          : form.value[key].trim(),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw error;
    showToast("Hero settings saved", "success");
  } catch (e: any) {
    showToast(e?.message || "Failed to save hero settings", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(loadHero);
</script>
