export const useCart = () => {
  const config = useRuntimeConfig()

  // Shared across all components
  const cartItems = useState<any[]>('cartItems', () => [])
  const cartTotal = useState<number>('cartTotal', () => 0)
  const cartCount = useState<number>('cartCount', () => 0)

  const loadCart = async () => {
    try {
      const res: any = await $fetch('/cart', {
        baseURL: config.public.apiBase
      })

      cartItems.value = res.items || []
      cartTotal.value = Number(res.total) || 0
      cartCount.value = Number(res.count) || 0
    } catch (error) {
      console.error('Failed to load cart:', error)
      cartItems.value = []
      cartTotal.value = 0
      cartCount.value = 0
    }
  }

  const addToCart = async (
    productId: number,
    quantity: number = 1,
    isPackage: boolean = false,
    options?: Record<string, any>
  ) => {
    try {
      await $fetch('/cart/add', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          product_id: productId,
          quantity,
          is_package: isPackage,
          options: options || null
        }
      })

      await loadCart() // ← refresh shared state
      return true
    } catch (error) {
      console.error('Add to cart failed:', error)
      return false
    }
  }

  const removeFromCart = async (itemId: number) => {
    await $fetch(`/cart/${itemId}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE'
    })
    await loadCart()
  }

  const clearCart = async () => {
    try {
      await $fetch('/cart/clear', {
        baseURL: config.public.apiBase,
        method: 'DELETE'
      })
    } catch (e) {
      console.error(e)
    }

    // Reset shared state immediately
    cartItems.value = []
    cartTotal.value = 0
    cartCount.value = 0
  }

  const updateCartItemQty = async (id: number | string, quantity: number) => {
    await $fetch(`/cart/${id}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: { quantity },
    })
  }

  return {
    cartItems,
    cartTotal,
    cartCount,
    loadCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQty,
  }
}