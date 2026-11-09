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

  // item.price already includes add-ons + overage (server-side baked in)
  const lineUnitPrice = (item: CartItem): number =>
    Number(item.price) || Number(item.product?.price) || 0;

  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (sum, item) => sum + lineUnitPrice(item) * (Number(item.quantity) || 1),
      0,
    ),
  );

  const ensureCart = async (): Promise<string> => {
    if (!import.meta.client) throw new Error("Cart is only available in the browser")
    if (cartId.value) return cartId.value

    let guestId = localStorage.getItem("cart_guest_id")
    if (!guestId) {
      guestId = crypto.randomUUID()
      localStorage.setItem("cart_guest_id", guestId)
    }

    const response = await $fetch<{ success: boolean; cartId: string }>('/api/cart/ensure', {
      method: 'POST',
      body: { guestId }
    })

    if (response.success) {
      cartId.value = response.cartId
      return response.cartId
    }
    throw new Error('Failed to ensure cart')
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
    }
  }

  const addToCart = async (
    productId: string | number,
    quantity = 1,
    options?: Record<string, any> | null
  ) => {
    if (!import.meta.client) return false
    try {
      const id = await ensureCart()
      const response = await $fetch<{ success: boolean; error?: string }>('/api/cart/add', {
        method: 'POST',
        body: { cartId: id, productId: String(productId), quantity, options: options || null }
      })
      if (!response.success) return false
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

      // Optimistic Remove
      const oldItems = [...cartItems.value]
      const itemToRemove = cartItems.value.find(i => String(i.id) === String(itemId))
      if (itemToRemove) cartCount.value -= itemToRemove.quantity
      cartItems.value = cartItems.value.filter(i => String(i.id) !== String(itemId))

      const res = await $fetch(`/api/cart/remove`, {
        method: 'DELETE',
        body: { cartId: id, itemId: String(itemId) }
      })

      // If API fails, restore
      if (!res) {
        cartItems.value = oldItems
        await loadCart()
      }
    } catch (error) {
      console.error("Remove from cart failed:", error)
      await loadCart()
    }
  }

  // 👇 Optimistic Quantity Update
  const updateCartItemQty = async (id: string | number, quantity: number) => {
    if (!import.meta.client) return
    if (quantity < 1) return // Block this! Don't delete on minus click.

    try {
      const cartIdValue = await ensureCart()

      // 1. Update UI immediately
      const item = cartItems.value.find(i => String(i.id) === String(id))
      if (item) {
        const diff = quantity - item.quantity
        item.quantity = quantity
        cartCount.value += diff
      }

      // 2. Send to API
      await $fetch('/api/cart/update', {
        method: 'PUT',
        body: { cartId: cartIdValue, itemId: String(id), quantity }
      })
    } catch (error) {
      console.error("Update cart quantity failed:", error)
      // If it fails, resync with server
      await loadCart()
    }
  }

  const clearCart = async () => {
    if (!import.meta.client) return
    try {
      const id = await ensureCart()
      await $fetch(`/api/cart/clear`, { method: 'DELETE', body: { cartId: id } })
    } catch (e) {
      console.error("Clear cart failed:", e)
    }
    cartItems.value = []
    cartCount.value = 0
  }

  return {
    cartItems, cartTotal, cartCount, loadCart, addToCart, removeFromCart, clearCart, updateCartItemQty, lineUnitPrice,
  }
}