// composables/useScrollAnimate.ts
import { onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimate(targetRef: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        } else {
          entry.target.classList.remove('is-visible')
        }
      },
      { threshold: 0.2 }
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}