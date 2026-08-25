export interface Product {
  id: string;
  name: string;
  price: number | string;
  image_url?: string;
  sku?: string | null;
}

export interface CartItem {
  id: number | string;
  cart_id?: string | number;
  product_id: string | number;
  quantity: number;
  is_package?: boolean;
  options?: Record<string, any> | null;
  price?: number | string;
  product?: Product;
}

export const useCart = () => {
  const supabase = useSupabaseClient();

  const cartItems = useState<CartItem[]>("cartItems", () => []);
  const cartCount = useState<number>("cartCount", () => 0);

  /** Always derived from cartItems — floating cart stays in sync */
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => {
      const unit = Number(item.price) || Number(item.product?.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + unit * qty;
    }, 0),
  );

  const ensureCart = async (): Promise<string> => {
    if (!import.meta.client) {
      throw new Error("Cart is only available in the browser");
    }

    let guestId = localStorage.getItem("cart_guest_id");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("cart_guest_id", guestId);
    }

    // limit(1) avoids maybeSingle error when duplicate carts exist
    const { data, error } = await supabase
      .from("carts")
      .select("id")
      .eq("guest_id", guestId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) console.error("ensureCart select", error);

    const existing = data as { id: string | number } | null;
    if (existing?.id != null) return String(existing.id);

    const { data: created, error: insertError } = await supabase
      .from("carts")
      .insert({ guest_id: guestId, total: 0 } as never)
      .select("id")
      .single();

    if (insertError) throw insertError;

    return String((created as { id: string | number }).id);
  };

  const loadCart = async () => {
    if (!import.meta.client) return;

    try {
      const cartId = await ensureCart();

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          cart_id,
          product_id,
          quantity,
          price,
          product:products (
            id,
            name,
            price,
            image_url,
            sku
          )
        `,
        )
        .eq("cart_id", cartId);

      if (error) throw error;

      const items = (data as unknown as CartItem[]) || [];
      cartItems.value = items;
      cartCount.value = items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0,
      );
    } catch (error) {
      console.error("Failed to load cart:", error);
      cartItems.value = [];
      cartCount.value = 0;
    }
  };

  const addToCart = async (productId: string | number, quantity = 1) => {
    if (!import.meta.client) return false;

    try {
      const cartId = await ensureCart();
      const pid = String(productId);

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, price, sale_price")
        .eq("id", pid)
        .maybeSingle();

      if (productError) throw productError;

      const product = productData as {
        id: string | number;
        price: number | string | null;
        sale_price: number | string | null;
      } | null;

      const sale = Number(product?.sale_price);
      const base = Number(product?.price ?? 0);
      const unitPrice =
        product?.sale_price != null &&
        product.sale_price !== "" &&
        !Number.isNaN(sale) &&
        sale > 0
          ? sale
          : base;

      type CartItemRow = { id: string | number; quantity: number };

      const { data } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", pid)
        .maybeSingle();

      const row = data as CartItemRow | null;

      if (row?.id) {
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: (row.quantity || 0) + quantity,
            price: unitPrice,
          } as never)
          .eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: pid,
          quantity,
          price: unitPrice,
        } as never);
        if (error) throw error;
      }

      await loadCart();
      return true;
    } catch (e) {
      console.error("addToCart failed:", e);
      return false;
    }
  };

  const removeFromCart = async (itemId: string | number) => {
    if (!import.meta.client) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      await loadCart();
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  const updateCartItemQty = async (id: string | number, quantity: number) => {
    if (!import.meta.client) return;

    try {
      if (quantity < 1) {
        await removeFromCart(id);
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity } as never)
        .eq("id", id);

      if (error) throw error;
      await loadCart();
    } catch (error) {
      console.error("Update cart quantity failed:", error);
    }
  };

  const clearCart = async () => {
    if (!import.meta.client) return;

    try {
      const cartId = await ensureCart();

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

      if (error) throw error;
    } catch (e) {
      console.error("Clear cart failed:", e);
    }

    cartItems.value = [];
    cartCount.value = 0;
  };

  return {
    cartItems,
    cartTotal,
    cartCount,
    loadCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQty,
  };
};
