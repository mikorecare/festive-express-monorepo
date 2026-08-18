<template>
  <div>
    <!-- Hero Banner -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade class="">How It <span class="text-brand-orange">Works</span></h1>
            <p v-fade class="breadcrumb">{{ data?.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <!-- Timeline -->
    <div class="page-main-section container">
      <div class="timeline" v-if="steps.length">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="timeline-item"
          :class="{ active: visibleSteps.has(index) }"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>


      <div class="mt-5">
        <!-- <h4 class="text-center">
          That’s it. One decision. Zero hassle. All the magic.<br><br>
          Powered by the same team behind Festive Lighting Pros — Florida’s trusted illumineers who create professional holiday displays year after year.
        </h4> -->

        <div
          v-if="footerHtml"
          class="footer-description"
          v-html="footerHtml"
        />

        
      </div>
    </div>

    <!-- <Newsletter /> -->
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'How It Works - Festive Express'
})

type HowItWorksContent = {
  id?: string
  banner_image_url?: string | null
  title?: string | null
  subtitle?: string | null
  steps?: { title: string; description: string }[] | null
  footer_description?: string | null
}

const supabase = useSupabaseClient()
const data = ref<HowItWorksContent | null>(null)
const steps = computed(() => data.value?.steps ?? [])
const footerHtml = computed(() => data.value?.footer_description || '')

const visibleSteps = ref(new Set<number>())
const activeStep = ref(0)

const load = async () => {
  try {
    const { data: row, error } = await supabase
      .from('how_it_works')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) throw error
    data.value = (row ?? null) as HowItWorksContent | null
  } catch (e) {
    console.error(e)
    data.value = null
  }
}

onMounted(async () => {
  await load()
  await nextTick() // wait for timeline items to render

  const items = Array.from(document.querySelectorAll('.timeline-item'))
  if (!items.length) return

  const updateActive = () => {
    const centerY = window.innerHeight / 2
    let bestIndex = 0
    let bestDistance = Infinity

    items.forEach((el, index) => {
      const rect = el.getBoundingClientRect()
      const itemCenter = rect.top + rect.height / 2
      const distance = Math.abs(itemCenter - centerY)

      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    })

    activeStep.value = bestIndex
    visibleSteps.value = new Set(
      Array.from({ length: bestIndex + 1 }, (_, i) => i)
    )
  }

  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', updateActive)

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActive)
    window.removeEventListener('resize', updateActive)
  })
})
</script>

<style scoped>
.timeline {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: #ddd;
}

.timeline-item {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  position: relative;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border: 5px solid #0c2340;
  border-radius: 50%;
  flex-shrink: 0;
  background: white;
  z-index: 2;
  /* transition: all 0.6s ease; */

  /* Initial state before active */
  transform: scale(0.8);
  opacity: 0.5;

  /* Slower transition with a smooth ease-out curve */
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 1.4s ease,
              border-color 1.4s ease,
              opacity 1.4s ease;
  will-change: transform, background-color, border-color, opacity;

}

.timeline-item.active .timeline-dot {
  background: #F49322;
  border-color: #F49322;
  transform: scale(1.4);
  opacity: 1;
}

.timeline-content h3 {
  font-size: 1.45rem;
  margin-bottom: 12px;
  color: #0c2340;
}

.timeline-content p {
  color: #555;
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline-item {
    gap: 20px;
  }
  .timeline-dot {
    width: 50px;
    height: 50px;
  }
}
</style>