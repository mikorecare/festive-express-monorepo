import { getAuthenticatedSupabase } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const body = await readBody(event);
  const supabase = await getAuthenticatedSupabase(event);

  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) updateData.status = body.status;
    if (body.payment_status) updateData.payment_status = body.payment_status;
    if (body.customer_note !== undefined)
      updateData.customer_note = body.customer_note;
    if (body.admin_note !== undefined) updateData.admin_note = body.admin_note;
    if (body.preferred_install_date !== undefined)
      updateData.preferred_install_date = body.preferred_install_date;
    if (body.confirmed_install_date !== undefined)
      updateData.confirmed_install_date = body.confirmed_install_date;
    if (body.removal_date !== undefined)
      updateData.removal_date = body.removal_date;
    if (body.install_status) updateData.install_status = body.install_status;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (orderError) {
      console.error("Order update error:", orderError);
      throw createError({
        statusCode: 500,
        message: orderError.message || "Failed to update order",
      });
    }

    if (!order) {
      throw createError({
        statusCode: 404,
        message: "Order not found",
      });
    }

    if (body.status) {
      await supabase.from("order_timeline").insert({
        order_id: order.id,
        status: body.status,
        notes: `Order status updated to ${body.status}`,
      });
    }

    return {
      success: true,
      order: order,
    };
  } catch (error: any) {
    console.error("Order update error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update order",
    });
  }
});