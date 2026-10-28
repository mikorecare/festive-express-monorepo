import { createError, defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body.turnstileToken) {
        console.warn('Missing Turnstile token');
        return {
            success: false,
            error: 'Security verification required'
        };
    }

    try {
        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: config.turnstile?.secretKey || process.env.NUXT_TURNSTILE_SECRET_KEY || "",
                    response: body.turnstileToken,
                    remoteip: event.node.req.socket.remoteAddress || '',
                }),
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn('Turnstile verification failed:', turnstileResult);
            return {
                success: false,
                error: 'Security verification failed'
            };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return {
            success: false,
            error: 'Security verification failed'
        };
    }

    delete body.turnstileToken;

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
        imageUrl
    } = body;

    let leadResponse = null;
    let renderResponse = null;
    let bookResponse = null;

    const shouldSubmitLead = !previewOnly && (action === 'both' || action === 'render');
    const shouldRender = action === 'both' || action === 'render' || action === 'book';
    const shouldBook = action === 'book' || (action === 'both' && !previewOnly);

    if (shouldSubmitLead) {
        const payload = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            source: "render_widget",
        };

        console.log("Submitting lead with payload:", payload);

        try {
            leadResponse = await $fetch<any>(
                `${config.estimatorApiUrl}/api/lead`,
                {
                    method: "POST",
                    body: payload,
                    timeout: 15_000,
                }
            );
        } catch (err: any) {
            console.error("Lead submission failed:", {
                status: err.status,
                message: err.message,
                data: err.data,
                response: err.response?._data,
                payload,
            });
        }
    }

    if (shouldRender) {
        try {
            renderResponse = await $fetch<any>(
                `${config.estimatorApiUrl}/api/render`,
                {
                    method: "POST",
                    body: {
                        previewOnly: previewOnly || action === 'book',
                        address, placeId: placeId || undefined, email: email || undefined,
                        scheme, serviceType, package: packageType,
                    },
                    timeout: 120_000,
                    retry: 0,
                }
            );

            if (!renderResponse || renderResponse.ok === false) {
                throw createError({
                    statusCode: 502,
                    statusMessage: "Render failed",
                    data: {
                        error: renderResponse?.error || "render_failed",
                        message: "We couldn't render that one. Please try another address or photo."
                    },
                });
            }

            if (renderResponse.imageUrl) {
                renderResponse.imageUrl = new URL(renderResponse.imageUrl, config.estimatorAssetUrl).toString();
            }
        } catch (err: any) {
            console.error("Render call failed:", {
                statusCode: err?.statusCode,
                statusMessage: err?.statusMessage,
                message: err?.message,
                name: err?.name,
                cause: err?.cause,
                data: err?.data,
            });

            const isTimeout = err?.statusCode === 504 || /timeout|504/i.test(err?.message || "");
            throw createError({
                statusCode: isTimeout ? 504 : (err?.statusCode || 502),
                statusMessage: isTimeout ? "Render timed out" : "Render failed",
                data: {
                    error: isTimeout ? "render_timeout" : (err?.data?.error || "render_failed"),
                    message: isTimeout
                        ? "The render service took too long. Please try again."
                        : (err?.data?.message || "We couldn't render that one. Please try another address or photo."),
                },
            });
        }
    }

    if (shouldBook) {
        try {
            bookResponse = await $fetch<any>(
                `${config.estimatorApiUrl}/api/book`,
                {
                    method: "POST",
                    body: {
                        name: name,
                        email: email,
                        phone: phone,
                        address: address,
                        imageUrl: imageUrl || renderResponse?.imageUrl || "",
                        estimate: renderResponse?.stats || null,
                        package: packageType,
                        totalEstimate: totalEstimate,
                        packageName: packageName,
                        overageFt: overageFt,
                        overagePrice: overagePrice,
                        totalFt: totalFt,
                    },
                }
            );
        } catch (err) {
            console.error("Booking failed:", err);
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