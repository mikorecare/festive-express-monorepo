import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const total = ref(0)
  const count = ref(0)
  const items = ref([])

  const loadCart = async () => {
    const res = await $fetch('/cart', {
      baseURL: useRuntimeConfig().public.apiBase
    })
    total.value = res.total || 0
    count.value = res.count || 0
    items.value = res.items || []
  }

  const removeFromCart = async (id) => {
    await $fetch(`/cart/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'DELETE'
    })
    await loadCart()
  }

  return { total, count, items, loadCart, removeFromCart }
})