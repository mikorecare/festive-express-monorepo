// plugins/v-fade.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('fade', {
    mounted(el: HTMLElement) {
      // Automatically attach the base class
      el.classList.add('fade-up')

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return

          if (entry.isIntersecting) {
            el.classList.add('is-visible')
          } else {
            // Removes class when scrolling out of view to re-trigger every time
            el.classList.remove('is-visible')
          }
        },
        { threshold: 0.15 } // Triggers when 15% of the element is visible
      )

      observer.observe(el)
      ;(el as any)._observer = observer
    },
    unmounted(el: HTMLElement) {
      if ((el as any)._observer) {
        ;(el as any)._observer.disconnect()
      }
    }
  })
})