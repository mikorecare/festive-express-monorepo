<template>
  <div>
    <!-- Hero Banner -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>HOW IT WORKS</h1>
            <p class="breadcrumb">HOME / HOW IT WORKS</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <!-- Timeline -->
    <div class="page-main-section container">
      <div class="timeline">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="timeline-item"
          :class="{ active: visibleSteps.has(index) }"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>Step {{ index + 1 }}: {{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <h4 class="text-center">
          That’s it. One decision. Zero hassle. All the magic.<br><br>
          Powered by the same team behind Festive Lighting Pros — Florida’s trusted illumineers who create professional holiday displays year after year.
        </h4>
      </div>
    </div>

    <Newsletter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'How It Works - Festive Express'
})
import { ref, onMounted, onUnmounted } from 'vue'

const steps = [
  {
    title: "Pick your package",
    description: "Choose Joy, Jolly, or Merry based on your home size and the look you want."
  },
  {
    title: "Pay the set price",
    description: "One clear package price — no hidden fees or surprise quotes."
  },
  {
    title: "Choose install + take-down dates",
    description: "Select when we install and when we remove the lights so it fits your schedule."
  },
  {
    title: "We Review & Confirm Details",
    description: "Our team reviews your order to ensure everything is sized correctly and ready for installation. If we have questions or need clarification, we'll contact you before scheduling."
  },
  {
    title: "Professional Installation",
    description: "Our trained technicians arrive on your scheduled date and professionally install your lighting and décor using safe, non-invasive methods."
  },
  {
    title: "Enjoy the Season",
    description: "Sit back and enjoy a beautifully decorated property—no ladders, no stress, no maintenance."
  }
]

const visibleSteps = ref(new Set<number>())

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-index') || '0')
        visibleSteps.value.add(index)
      }
    })
  }, { threshold: 0.6 })

  document.querySelectorAll('.timeline-item').forEach((el, index) => {
    el.setAttribute('data-index', index.toString())
    observer.observe(el)
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
  transition: all 0.6s ease;
}

.timeline-item.active .timeline-dot {
  background: #F49322;
  border-color: #F49322;
  transform: scale(1.1);
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