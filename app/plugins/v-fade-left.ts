// plugins/v-fade-left.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('fade-left', {
    mounted(el: HTMLElement) {
      el.classList.add('fade-left')

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return

          if (entry.isIntersecting) {
            el.classList.add('is-visible')
          } else {
            el.classList.remove('is-visible')
          }
        },
        { threshold: 0.15 }
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