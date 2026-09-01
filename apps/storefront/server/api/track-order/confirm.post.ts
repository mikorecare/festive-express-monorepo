import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const orderNumber = String(body.order_number || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const turnstileToken = String(body.turnstile_token || "").trim();

  if (!turnstileToken) {
    return { success: false, error: "Security verification required" };
  }

  try {
    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      return { success: false, error: "Security verification failed" };
    }
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return { success: false, error: "Security verification failed" };
  }

  if (!orderNumber || !email) {
    return { success: false, error: "Order number and email are required" };
  }

  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseServiceKey = config.supabaseServiceKey as string | undefined;
  if (!supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      message: "Server configuration error",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, billing_email, billing_first_name, billing_last_name, billing_phone, total, preferred_install_dates, confirmed_install_date, customer_confirmed, confirmed_at",
    )
    .eq("order_number", orderNumber)
    .ilike("billing_email", email)
    .maybeSingle();

  if (error) {
    console.error("Confirm lookup error:", error);
    return { success: false, error: "Could not look up order" };
  }

  if (!data) {
    return { success: false, error: "No matching order found" };
  }

  if (String(data.status || "").toLowerCase() === "completed") {
    return { success: false, error: "Order is already completed" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toYmd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const dates = Array.isArray(data.preferred_install_dates)
    ? data.preferred_install_dates
    : [];

  const parsed = dates
    .map((d: string) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    })
    .filter((d: Date) => !Number.isNaN(d.getTime()))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  const currentConfirmed = data.confirmed_install_date
    ? new Date(data.confirmed_install_date)
    : null;
  if (currentConfirmed) currentConfirmed.setHours(0, 0, 0, 0);

  if (currentConfirmed && currentConfirmed.getTime() >= today.getTime()) {
    return {
      success: false,
      already_confirmed: true,
      error: "Already confirmed",
      order: {
        customer_confirmed: true,
        confirmed_at: data.confirmed_at,
        status: data.status,
        preferred_install_dates: data.preferred_install_dates || [],
        confirmed_install_date: data.confirmed_install_date,
      },
    };
  }

  const after = currentConfirmed
    ? currentConfirmed.getTime()
    : today.getTime() - 1;
  const next = parsed.find(
    (d) => d.getTime() > after && d.getTime() >= today.getTime(),
  );

  if (!next) {
    return { success: false, error: "No upcoming install date to confirm" };
  }

  const windowStart = next.getTime() - 48 * 60 * 60 * 1000;
  if (currentConfirmed && Date.now() < windowStart) {
    return {
      success: false,
      error: "You can confirm this date starting 48 hours before it",
    };
  }

  const nextDate = toYmd(next);

  const confirmedAt = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      customer_confirmed: true,
      confirmed_at: confirmedAt,
      status: "confirmed",
      confirmed_install_date: nextDate,
    })
    .eq("id", data.id)
    .select(
      "id, status, customer_confirmed, confirmed_at, preferred_install_dates, confirmed_install_date",
    )
    .maybeSingle();

  if (updateError) {
    console.error("Confirm update error:", updateError);
    return { success: false, error: "Could not confirm order" };
  }

  if (!updated) {
    return {
      success: false,
      already_confirmed: true,
      error: "Already confirmed",
    };
  }

  await supabase.from("order_timeline").insert({
    order_id: data.id,
    status: "confirmed",
    notes: `Customer confirmed install date ${nextDate}`,
  });

  // GHL is sent by trigger on_installation_date_confirmed — do not POST here.

  return {
    success: true,
    order: {
      customer_confirmed: true,
      confirmed_at: confirmedAt,
      status: updated.status || "confirmed",
      preferred_install_dates: data.preferred_install_dates,
      confirmed_install_date: updated.confirmed_install_date || nextDate,
    },
  };
});
