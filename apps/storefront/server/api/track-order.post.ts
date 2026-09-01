import { createClient } from "@supabase/supabase-js";

interface TrackOrderRow {
  id: string;
  order_number: string | null;
  status: string | null;
  payment_status: string | null;
  install_status: string | null;
  created_at: string | null;
  total: number | null;
  billing_email: string | null;
  preferred_install_dates: string[] | null;
  confirmed_install_date: string | null;
  items: unknown;
  customer_confirmed: boolean | null;
  confirmed_at: string | null;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const orderNumber = String(body.order_number || body.orderRef || "").trim();
  const email = String(body.email || body.billing_email || "")
    .trim()
    .toLowerCase();
  const turnstileToken = String(body.turnstile_token || "").trim();

  if (!turnstileToken) {
    console.warn("Missing Turnstile token");
    return {
      success: false,
      error: "Security verification required",
    };
  }

  try {
    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret:
            (config.turnstile as { secretKey?: string } | undefined)
              ?.secretKey ||
            process.env.NUXT_TURNSTILE_SECRET_KEY ||
            "",
          response: turnstileToken,
          remoteip: event.node.req.socket.remoteAddress || "",
        }),
      },
    );

    const turnstileResult = (await turnstileResponse.json()) as {
      success?: boolean;
    };

    if (!turnstileResult.success) {
      console.warn("Turnstile verification failed:", turnstileResult);
      return {
        success: false,
        error: "Security verification failed",
      };
    }
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return {
      success: false,
      error: "Security verification failed",
    };
  }

  if (!orderNumber || !email) {
    return {
      success: false,
      error: "Order number and email are required",
    };
  }

  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseServiceKey = config.supabaseServiceKey as string | undefined;

  if (!supabaseServiceKey) {
    console.error("Missing NUXT_SUPABASE_SECRET_KEY environment variable");
    throw createError({
      statusCode: 500,
      message: "Server configuration error",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const selectCols =
    "id, order_number, status, payment_status, install_status, created_at, total, billing_email, preferred_install_dates, confirmed_install_date, items, customer_confirmed, confirmed_at";

  const base = supabase
    .from("orders")
    .select(selectCols)
    .ilike("billing_email", email);

  const { data, error } = uuidRe.test(orderNumber)
    ? await base.eq("id", orderNumber).maybeSingle()
    : await base.eq("order_number", orderNumber).maybeSingle();

  if (error) {
    console.error("Track order lookup error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw createError({
      statusCode: 500,
      message: "Failed to look up order",
    });
  }

  if (!data) {
    return { success: false, error: "No matching order found" };
  }

  const order = data as unknown as TrackOrderRow;

  const preferredInstallDate = Array.isArray(order.preferred_install_dates)
    ? order.preferred_install_dates[0] || null
    : null;

  const { data: timeline } = await supabase
    .from("order_timeline")
    .select("id, status, notes, created_at")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  const rawItems = Array.isArray(order.items) ? (order.items as any[]) : [];

  const productIds = [
    ...new Set(
      rawItems.map((item) => item.product_id || item.id).filter(Boolean),
    ),
  ];

  let imageById: Record<string, string> = {};

  if (productIds.length) {
    const { data: products } = await supabase
      .from("products")
      .select("id, image_url")
      .in("id", productIds);

    imageById = Object.fromEntries(
      (products || []).map((p: any) => [String(p.id), p.image_url]),
    );
  }

  const itemsWithImages = rawItems.map((item) => ({
    ...item,
    image_url:
      item.image_url ||
      item.image ||
      item.options?.image_url ||
      imageById[String(item.product_id || item.id)] ||
      null,
  }));

  return {
    success: true,
    order: {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      install_status: order.install_status,
      created_at: order.created_at,
      total: order.total,
      preferred_install_dates: order.preferred_install_dates || [],
      preferred_install_date: preferredInstallDate,
      confirmed_install_date: order.confirmed_install_date || null,
      items: itemsWithImages,
      timeline: timeline || [],
      customer_confirmed: Boolean(
        order.customer_confirmed || order.confirmed_at,
      ),
      confirmed_at: order.confirmed_at || null,
    },
  };
});
