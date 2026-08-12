<template>
  <div>
    <!-- Hero -->
    <section class="page-hero">
        <div class="hero-overlay">
            <div class="container">
                <div class="hero-content">
                    <h1>FREQUENTLY ASKED QUESTIONS</h1>
                    <p class="breadcrumb">HOME / FAQ</p>
                </div>
            </div>
        </div>
    </section>

    <div class="page-main-section container">
        <div class="section-header">
            <h2 class="section-title">Ordering & Installation FAQS</h2>
            <p class="subtitle">
                Have questions? We've gathered the most frequently asked questions about our products, shipping, returns, and more to help you shop with confidence.
            </p>
        </div>
      

        <div class="faq-list">
            <div class="faq-column">
                <div 
                v-for="(item, index) in faqsLeft" 
                :key="index" 
                class="faq-item"
                :class="{ active: openIndex === index }"
                @click="toggleFAQ(index)"
                >
                    <div class="faq-question">
                        {{ item.question }}
                        <span class="faq-icon">{{ openIndex === index ? '−' : '+' }}</span>
                    </div>
                    <div class="faq-answer" v-if="openIndex === index">
                        {{ item.answer }}
                    </div>
                </div>
            </div>

            <div class="faq-column">
                <div 
                v-for="(item, index) in faqsRight" 
                :key="index" 
                class="faq-item"
                :class="{ active: openIndex === index + faqsLeft.length }"
                @click="toggleFAQ(index + faqsLeft.length)"
                >
                    <div class="faq-question">
                        {{ item.question }}
                        <span class="faq-icon">{{ openIndex === index + faqsLeft.length ? '−' : '+' }}</span>
                    </div>
                    <div class="faq-answer" v-if="openIndex === index + faqsLeft.length">
                        {{ item.answer }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Newsletter />
  </div>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null)

const faqsLeft = [
  { question: "How does the ordering process work?", answer: "..." },
  { question: "What measurements do I need before placing an order?", answer: "..." },
  // ... add more
]

const faqsRight = [
  { question: "Will the installation damage my roof?", answer: "..." },
  // ... add more
]

const toggleFAQ = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.faq-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
  cursor: pointer;
}

.faq-question {
  padding: 20px 24px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.faq-answer {
  padding: 0 24px 24px;
  color: #555;
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 768px) {
  .faq-list {
    grid-template-columns: 1fr;
  }
}
</style>