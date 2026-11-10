import { getAuthenticatedSupabase } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const supabase = await getAuthenticatedSupabase(event);

  try {
    // Fetch order with promo code relation
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
                *,
                promo_codes (
                    id,
                    code,
                    description,
                    discount_type,
                    discount_value,
                    applies_to,
                    min_order_amount,
                    max_discount_amount,
                    usage_limit,
                    used_count,
                    starts_at,
                    expires_at,
                    is_active
                )
            `,
      )
      .eq("id", id)
      .single();

    if (orderError) {
      console.error("Order fetch error:", orderError);
      throw createError({
        statusCode: 404,
        message: orderError.message || "Order not found",
      });
    }

    if (!order) {
      throw createError({
        statusCode: 404,
        message: "Order not found",
      });
    }

    // Fetch timeline entries
    const { data: timeline, error: timelineError } = await supabase
      .from("order_timeline")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    if (timelineError) {
      console.error("Timeline fetch error:", timelineError);
    }

    // Parse items if Supabase returned them as a JSON string
    let items: any[] = [];
    const rawItems = order.items;
    if (typeof rawItems === "string") {
      try {
        items = JSON.parse(rawItems);
      } catch {
        items = [];
      }
    } else if (Array.isArray(rawItems)) {
      items = rawItems;
    }

    return {
      success: true,
      order: {
        ...order,
        items: items,
        timeline: timeline || [],
      },
    };
  } catch (error: any) {
    console.error("Order fetch error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch order",
    });
  }
});