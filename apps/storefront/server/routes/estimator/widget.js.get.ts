import { defineEventHandler, setResponseHeader, createError } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const response = await fetch(`${config.estimatorApiUrl}/widget.js`);

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: `Failed to fetch widget.js: ${response.statusText}`,
            });
        }

        setResponseHeader(event, "Content-Type", "application/javascript; charset=utf-8");
        setResponseHeader(event, "Access-Control-Allow-Origin", "*");
        setResponseHeader(event, "Cross-Origin-Resource-Policy", "cross-origin");

        const data = await response.arrayBuffer();
        return Buffer.from(data);
    } catch (error: any) {
        console.error("Widget JS Proxy Error:", error);
        throw createError({
            statusCode: 502,
            statusMessage: "Bad Gateway - Estimator script unreachable",
        });
    }
});