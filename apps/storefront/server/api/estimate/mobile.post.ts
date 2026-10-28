
import { createError, defineEventHandler, getHeader, readBody } from "h3";
import { getUserSupabase } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {

    const authHeader = getHeader(event, "authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
        throw createError({ statusCode: 401, message: "Authentication required" });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = getUserSupabase();

    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
        throw createError({ statusCode: 401, message: "Invalid session" });
    }

    const body = await readBody(event);
    const config = useRuntimeConfig();

    const {
        previewOnly,
        address,
        placeId,
        email,
        scheme,
        serviceType,
        package: packageType,
        name,
        phone,
        action,
        totalEstimate,
        packageName,
        overageFt,
        overagePrice,
        totalFt,
        imageUrl,
    } = body;

    // validate inputs (mirrors the web endpoint's implicit assumptions)
    if (!address || typeof address !== "string" || address.trim().length < 3) {
        return { ok: false, error: "address_required", message: "Address is required" };
    }
    if (!previewOnly && (!name || !email || !email.includes("@"))) {
        return { ok: false, error: "contact_required", message: "Name and valid email are required" };
    }
    if (!["render", "book", "both"].includes(action)) {
        return { ok: false, error: "invalid_action", message: "Invalid action" };
    }

    let leadResponse: any = null;
    let renderResponse: any = null;
    let bookResponse: any = null;

    const shouldSubmitLead = !previewOnly && (action === "both" || action === "render");
    const shouldRender = action === "both" || action === "render" || action === "book";
    const shouldBook = action === "book" || (action === "both" && !previewOnly);

    // ---- lead ----
    if (shouldSubmitLead) {
        try {
            leadResponse = await $fetch(`${config.estimatorApiUrl}/api/lead`, {
                method: "POST",
                body: {
                    name,
                    email,
                    phone,
                    address,
                    source: "mobile_app",
                },
                timeout: 15_000,
            });
        } catch (err: any) {
            console.error("[mobile-estimate] lead failed:", err?.message);
            // non-fatal — don't fail the whole request
        }
    }

    // ---- render ----
    if (shouldRender) {
        try {
            renderResponse = await $fetch(`${config.estimatorApiUrl}/api/render`, {
                method: "POST",
                body: {
                    previewOnly: previewOnly || action === "book",
                    address,
                    placeId: placeId || undefined,
                    email: email || undefined,
                    scheme,
                    serviceType,
                    package: packageType,
                },
                timeout: 120_000,
                retry: 0,
            });

            if (!renderResponse || renderResponse.ok === false) {
                throw createError({
                    statusCode: 502,
                    data: {
                        error: renderResponse?.error || "render_failed",
                        message: "We couldn't render that one. Please try another address or photo.",
                    },
                });
            }

            // normalize image URL
            if (renderResponse.imageUrl) {
                renderResponse.imageUrl = new URL(renderResponse.imageUrl, config.estimatorAssetUrl).toString();
            }
        } catch (err: any) {
            console.error("[mobile-estimate] render failed:", err?.message);

            const isTimeout = err?.statusCode === 504 || /timeout|504/i.test(err?.message || "");
            throw createError({
                statusCode: isTimeout ? 504 : err?.statusCode || 502,
                data: {
                    error: isTimeout ? "render_timeout" : err?.data?.error || "render_failed",
                    message: isTimeout
                        ? "The render service took too long. Please try again."
                        : err?.data?.message || "We couldn't render that one. Please try another address or photo.",
                },
            });
        }
    }

    if (shouldBook) {
        try {
            bookResponse = await $fetch(`${config.estimatorApiUrl}/api/book`, {
                method: "POST",
                body: {
                    name,
                    email,
                    phone,
                    address,
                    imageUrl: imageUrl || renderResponse?.imageUrl || "",
                    estimate: renderResponse?.stats || null,
                    package: packageType,
                    totalEstimate,
                    packageName,
                    overageFt,
                    overagePrice,
                    totalFt,
                },
            });
        } catch (err) {
            console.error("[mobile-estimate] book failed:", err);
        }
    }

    return {
        ...renderResponse,
        leadSubmitted: !!leadResponse,
        leadStatus: leadResponse,
        bookingSubmitted: !!bookResponse,
        bookingStatus: bookResponse,
    };
});