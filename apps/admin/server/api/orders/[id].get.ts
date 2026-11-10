import { getAuthenticatedSupabase } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Order ID is required" });
  }

  const supabase = await getAuthenticatedSupabase(event);

  try {
    // 1. Fetch order with promo code relation
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        promo_codes (
          id, code, description, discount_type, discount_value,
          applies_to, min_order_amount, max_discount_amount,
          usage_limit, used_count, starts_at, expires_at, is_active, product_ids
        )
      `)
      .eq("id", id)
      .single();

    if (orderError) {
      console.error("Order fetch error:", orderError);
      throw createError({ statusCode: 404, message: orderError.message || "Order not found" });
    }
    if (!order) {
      throw createError({ statusCode: 404, message: "Order not found" });
    }

    // 2. Timeline
    const { data: timeline, error: timelineError } = await supabase
      .from("order_timeline")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    if (timelineError) console.error("Timeline fetch error:", timelineError);

    // 3. Parse items AND parse each item's options string
    let items: any[] = [];
    const rawItems = order.items;
    if (typeof rawItems === "string") {
      try { items = JSON.parse(rawItems); } catch { items = []; }
    } else if (Array.isArray(rawItems)) {
      items = rawItems;
    }

    // Parse nested options if it's a string
    items = items.map((item) => {
      if (item.options && typeof item.options === "string") {
        try {
          item.options = JSON.parse(item.options);
        } catch (e) {
          item.options = null;
        }
      }
      return item;
    });

    // 4. Calculate discount dynamically from promo_codes
    let calculatedDiscount = 0;
    // Supabase returns relations as arrays when using *, even for 1:1
    const promo = Array.isArray(order.promo_codes) ? order.promo_codes[0] : order.promo_codes;

    if (promo) {
      // Determine which items the discount applies to
      let eligibleSubtotal = Number(order.subtotal);

      if (promo.applies_to === "packages") {
        eligibleSubtotal = items
          .filter((i) => i.is_package)
          .reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
      } else if (promo.applies_to === "products") {
        eligibleSubtotal = items
          .filter((i) => !i.is_package)
          .reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
      } else if (promo.applies_to === "specific" && Array.isArray(promo.product_ids) && promo.product_ids.length > 0) {
        eligibleSubtotal = items
          .filter((i) => promo.product_ids.includes(String(i.product_id)))
          .reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
      }

      // Apply the discount
      if (promo.discount_type === "percent") {
        calculatedDiscount = (eligibleSubtotal * Number(promo.discount_value)) / 100;
        if (promo.max_discount_amount && calculatedDiscount > Number(promo.max_discount_amount)) {
          calculatedDiscount = Number(promo.max_discount_amount);
        }
      } else {
        // Fixed amount
        calculatedDiscount = Number(promo.discount_value);
      }

      // Never discount more than the eligible subtotal
      if (calculatedDiscount > eligibleSubtotal) {
        calculatedDiscount = eligibleSubtotal;
      }
    }

    // 5. Fetch origin from service_zips
    const { data: origin } = await supabase
      .from("service_zips")
      .select("lat, lng, place_id, formatted_address")
      .eq("is_origin", true)
      .single();

    // 6. Compute directions
    let directions = null;
    const destinationPlaceId = items?.[0]?.options?.place_id;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (origin && destinationPlaceId && apiKey) {
      try {
        const routesRes = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
            },
            body: JSON.stringify({
              origin: origin.place_id
                ? { placeId: origin.place_id }
                : { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
              destination: { placeId: destinationPlaceId },
              travelMode: "DRIVE",
              routingPreference: "TRAFFIC_UNAWARE",
            }),
          }
        );

        if (routesRes.ok) {
          const routeData = await routesRes.json();
          const route = routeData.routes?.[0];
          if (route) {
            directions = {
              distance_miles: Number((route.distanceMeters / 1609.344).toFixed(1)),
              duration_minutes: route.duration
                ? Math.round(parseInt(route.duration.replace("s", ""), 10) / 60)
                : null,
              origin: {
                address: origin.formatted_address,
                place_id: origin.place_id,
                lat: origin.lat,
                lng: origin.lng,
              },
            };
          }
        } else {
          console.error("Routes API non-OK:", await routesRes.text());
        }
      } catch (e) {
        console.error("Routes API error:", e);
      }
    }

    return {
      success: true,
      order: {
        ...order,
        discount_amount: calculatedDiscount,
        items,
        timeline: timeline || [],
        directions,
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