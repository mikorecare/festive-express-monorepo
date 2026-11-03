import { defineEventHandler, readBody } from "h3";
import { getSupabase } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body.name || body.name.trim() === "") {
        return { success: false, error: "Name is required" };
    }

    if (
        !body.email ||
        body.email.trim() === "" ||
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(body.email)
    ) {
        return { success: false, error: "Valid email is required" };
    }

    if (!body.turnstileToken) {
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
                        config.turnstile?.secretKey ||
                        process.env.NUXT_TURNSTILE_SECRET_KEY ||
                        "",
                    response: body.turnstileToken,
                    remoteip: event.node.req.socket.remoteAddress || "",
                }),
            },
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn("Turnstile verification failed:", turnstileResult);
            return { success: false, error: "Security verification failed" };
        }
    } catch (error) {
        console.error("Turnstile verification error:", error);
        return { success: false, error: "Security verification failed" };
    }

    try {
        const supabase = getSupabase();

        const { data, error } = await supabase.rpc("handle_voucher_form", {
            p_name: body.name.trim(),
            p_email: body.email.trim(),
        });

        if (error) {
            console.error("Supabase RPC error:", error);
            return {
                success: false,
                error: "Failed to send voucher. Please try again.",
            };
        }

        return data;
    } catch (error) {
        console.error("Error calling Supabase function:", error);
        return {
            success: false,
            error: "Failed to send voucher. Please try again.",
        };
    }
});