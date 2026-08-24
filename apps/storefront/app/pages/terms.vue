<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1><span class="text-brand-orange">Terms</span> and Conditions</h1>
            <p class="breadcrumb">
              {{ data?.subtitle || "" }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div
        class="max-w-[860px] mx-auto pt-10 pb-20 text-slate-700 leading-relaxed"
      >
        <!-- Intro Paragraph -->
        <div class="mb-8 p-6 bg-brand-orange/5 rounded-xl border-l-4 border-brand-orange">
          <p class="text-slate-700 text-base leading-relaxed">
            To help us improve our services and provide you with the best possible experience, 
            we encourage you to review these Terms and Conditions carefully. 
            Your use of our services constitutes acceptance of these terms. 
            If you have any questions or concerns, please don't hesitate to 
            <NuxtLink to="/contact" class="text-brand-orange hover:underline font-medium">
              contact us
            </NuxtLink>.
          </p>
        </div>

        <div
          v-if="data?.description"
          class="prose max-w-none text-slate-600"
          v-html="data.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type TermsContent = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
};

const supabase = useSupabaseClient();
const data = ref<TermsContent | null>(null);

const titleParts = computed(() => {
  const t = (data.value?.title || "Terms of Use").trim().split(/\s+/);
  if (t.length < 2) return { rest: "", last: t[0] || "Terms" };
  return { rest: t.slice(0, -1).join(" "), last: t[t.length - 1] };
});
const titleRest = computed(() => titleParts.value.rest);
const titleLast = computed(() => titleParts.value.last);

useHead({
  title: computed(() => {
    const t = data.value?.title?.trim();
    return t ? `${t}` : "Terms and Conditions";
  }),
});

onMounted(async () => {
  try {
    const { data: row, error } = await supabase
      .from("terms_of_use")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    data.value = row as TermsContent | null;
  } catch (e) {
    console.error(e);
    data.value = null;
  }
});
</script>