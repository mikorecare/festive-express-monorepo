export interface Product {
  id: string
  name: string
  price: number | string
  image_url?: string
}

export interface CartItem {
  id: number | string
  product_id: string | number
  quantity: number
  is_package?: boolean
  options?: Record<string, any> | null
  price?: number | string
  product?: Product
}

export const useCart = () => {
  const supabase = useSupabaseClient()

  const cartItems = useState<CartItem[]>('cartItems', () => [])
  const cartTotal = useState<number>('cartTotal', () => 0)
  const cartCount = useState<number>('cartCount', () => 0)

  const loadCart = async () => {
    try {
      const { data, error } = await (supabase.from('cart_items') as any)
        .select(`
          *,
          product:products(*)
        `)

      if (error) throw error

      const items = (data as CartItem[]) || []
      cartItems.value = items

      cartCount.value = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
      cartTotal.value = items.reduce((sum, item) => {
        const itemPrice = Number(item.price) || Number(item.product?.price) || 0
        return sum + itemPrice * (Number(item.quantity) || 1)
      }, 0)
    } catch (error) {
      console.error('Failed to load cart:', error)
      cartItems.value = []
      cartTotal.value = 0
      cartCount.value = 0
    }
  }

  const addToCart = async (
    productId: string | number,
    quantity: number = 1,
    isPackage: boolean = false,
    options?: Record<string, any>
  ) => {
    try {
      const { error } = await (supabase.from('cart_items') as any).insert({
        product_id: productId,
        quantity,
        is_package: isPackage,
        options: options || null
      })

      if (error) throw error

      await loadCart()
      return true
    } catch (error) {
      console.error('Add to cart failed:', error)
      return false
    }
  }

  const removeFromCart = async (itemId: string | number) => {
    try {
      const { error } = await (supabase.from('cart_items') as any)
        .delete()
        .eq('id', itemId)

      if (error) throw error

      await loadCart()
    } catch (error) {
      console.error('Remove from cart failed:', error)
    }
  }

  const clearCart = async () => {
    try {
      const { error } = await (supabase.from('cart_items') as any)
        .delete()
        .neq('id', 0)

      if (error) throw error
    } catch (e) {
      console.error('Clear cart failed:', e)
    }

    cartItems.value = []
    cartTotal.value = 0
    cartCount.value = 0
  }

  const updateCartItemQty = async (id: string | number, quantity: number) => {
    try {
      const { error } = await (supabase.from('cart_items') as any)
        .update({ quantity })
        .eq('id', id)

      if (error) throw error

      await loadCart()
    } catch (error) {
      console.error('Update cart quantity failed:', error)
    }
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