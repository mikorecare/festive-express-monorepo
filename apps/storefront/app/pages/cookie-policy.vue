<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>
              <span class="text-brand-orange">{{
                data?.title || "Cookie"
              }}</span>
              Policy
            </h1>
            {{ data?.subtitle || "" }}
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div
        class="max-w-[860px] mx-auto pt-10 pb-20 text-slate-700 leading-relaxed"
      >
        <div
          v-if="data?.description"
          class="privacy-body prose max-w-none text-navy"
          v-html="data.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Cookie Policy" });

type CookieContent = {
  banner_image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
};

const supabase = useSupabaseClient();
const data = ref<CookieContent | null>(null);

onMounted(async () => {
  try {
    const { data: row, error } = await supabase
      .from("cookie_policy")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    data.value = row as CookieContent | null;
  } catch (e) {
    console.error(e);
    data.value = null;
  }
});
</script>
