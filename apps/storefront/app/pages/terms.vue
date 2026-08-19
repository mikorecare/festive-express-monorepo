<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1><span class="text-brand-orange">Terms</span> of Use</h1>
            <p class="breadcrumb">
              {{ data?.subtitle || '' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="max-w-[860px] mx-auto pt-10 pb-20 text-slate-700 leading-relaxed">
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
  title?: string | null
  subtitle?: string | null
  description?: string | null
}

const supabase = useSupabaseClient()
const data = ref<TermsContent | null>(null)

const titleParts = computed(() => {
  const t = (data.value?.title || 'Terms of Use').trim().split(/\s+/)
  if (t.length < 2) return { rest: '', last: t[0] || 'Terms' }
  return { rest: t.slice(0, -1).join(' '), last: t[t.length - 1] }
})
const titleRest = computed(() => titleParts.value.rest)
const titleLast = computed(() => titleParts.value.last)

useHead({
  title: computed(() => {
    const t = data.value?.title?.trim()
    return t ? `${t}` : 'Terms of Use'
  }),
})

onMounted(async () => {
  try {
    const { data: row, error } = await supabase
      .from('terms_of_use')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()
    if (error) throw error
    data.value = row as TermsContent | null
  } catch (e) {
    console.error(e)
    data.value = null
  }
})
</script>