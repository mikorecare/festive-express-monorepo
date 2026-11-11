export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('fade', {
    mounted(el: HTMLElement) {
      el.classList.add('fade-up')

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return

          if (entry.intersectionRatio >= 0.15) {
            el.classList.add('is-visible')
          } else if (
            entry.intersectionRatio === 0 &&
            entry.rootBounds &&
            entry.boundingClientRect.top >= entry.rootBounds.bottom
          ) {
            // Fully below the viewport: safe to reset and re-trigger later.
            // Leaving through the top does nothing, so it stays visible.
            el.classList.remove('is-visible')
          }
        },
        { threshold: [0, 0.15] }
      )

      observer.observe(el)
        ; (el as any)._observer = observer
    },
    unmounted(el: HTMLElement) {
      ; (el as any)._observer?.disconnect()
    }
  })
})