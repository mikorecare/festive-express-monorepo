export interface Product {
  id: string
  name: string
  price: number | string
  image_url?: string
  sku?: string | null
}

export interface CartItem {
  id: number | string
  cart_id?: string | number
  product_id: string | number
  quantity: number
  is_package?: boolean
  options?: Record<string, any> | null
  price?: number | string
  product?: Product
}

export const useCart = () => {
  const cartItems = useState<CartItem[]>("cartItems", () => [])
  const cartCount = useState<number>("cartCount", () => 0)
  const cartId = useState<string | null>("cartId", () => null)

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => {
      const unit = Number(item.price) || Number(item.product?.price) || 0
      const qty = Number(item.quantity) || 1
      return sum + unit * qty
    }, 0),
  )

  const ensureCart = async (): Promise<string> => {
    if (!import.meta.client) {
      throw new Error("Cart is only available in the browser")
    }

    if (cartId.value) {
      return cartId.value
    }

    let guestId = localStorage.getItem("cart_guest_id")
    if (!guestId) {
      guestId = crypto.randomUUID()
      localStorage.setItem("cart_guest_id", guestId)
    }

    try {
      const response = await $fetch<{ success: boolean; cartId: string }>('/api/cart/ensure', {
        method: 'POST',
        body: { guestId }
      })

      if (response.success) {
        cartId.value = response.cartId
        return response.cartId
      }

      throw new Error('Failed to ensure cart')
    } catch (error) {
      console.error('Ensure cart error:', error)
      throw error
    }
  }

  const loadCart = async () => {
    if (!import.meta.client) return

    try {
      const id = await ensureCart()

      const response = await $fetch<{ success: boolean; items: CartItem[]; count: number }>(`/api/cart/${id}`)

      if (response.success) {
        cartItems.value = response.items || []
        cartCount.value = response.count || 0
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
      cartItems.value = []
      cartCount.value = 0
    }
  }

  const { isEarlyBirdActive } = useEarlyBirdSpecial()

  const addToCart = async (productId: string | number, quantity = 1) => {
    if (!import.meta.client) return false

    try {
      const id = await ensureCart()

      const response = await $fetch<{ success: boolean; error?: string }>('/api/cart/add', {
        method: 'POST',
        body: {
          cartId: id,
          productId: String(productId),
          quantity
        }
      })

      if (!response.success) {
        console.error('Add to cart failed:', response.error)
        return false
      }

      await loadCart()
      return true
    } catch (e) {
      console.error("addToCart failed:", e)
      return false
    }
  }

  const removeFromCart = async (itemId: string | number) => {
    if (!import.meta.client) return

    try {
      const id = await ensureCart()

      await $fetch(`/api/cart/remove`, {
        method: 'DELETE',
        body: {
          cartId: id,
          itemId: String(itemId)
        }
      })

      await loadCart()
    } catch (error) {
      console.error("Remove from cart failed:", error)
    }
  }

  const updateCartItemQty = async (id: string | number, quantity: number) => {
    if (!import.meta.client) return

    try {
      if (quantity < 1) {
        await removeFromCart(id)
        return
      }

      const cartIdValue = await ensureCart()

      await $fetch('/api/cart/update', {
        method: 'PUT',
        body: {
          cartId: cartIdValue,
          itemId: String(id),
          quantity
        }
      })

      await loadCart()
    } catch (error) {
      console.error("Update cart quantity failed:", error)
    }
  }

  const clearCart = async () => {
    if (!import.meta.client) return

    try {
      const id = await ensureCart()

      await $fetch(`/api/cart/clear`, {
        method: 'DELETE',
        body: { cartId: id }
      })
    } catch (e) {
      console.error("Clear cart failed:", e)
    }

    cartItems.value = []
    cartCount.value = 0
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