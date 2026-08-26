import {
    defineEventHandler,
    getRequestURL,
    getHeader,
    readBody,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const url = getRequestURL(event);
    const path = url.pathname.replace("/api/estimator", "");
    const targetUrl =
        `${config.estimatorApiUrl}${path}${url.search}`;

    try {
        const body =
            event.method === "GET" || event.method === "HEAD"
                ? undefined
                : await readBody(event);

        const response = await fetch(targetUrl, {
            method: event.method,

            headers: {
                accept: getHeader(event, "accept") || "*/*",

                "content-type":
                    getHeader(event, "content-type") ||
                    "application/json",
            },

            body:
                body !== undefined
                    ? JSON.stringify(body)
                    : undefined,
        });

        const contentType = response.headers.get("content-type");

        if (contentType) {
            setResponseHeader(
                event,
                "content-type",
                contentType
            );
        }

        return response.body;
    } catch (error) {
        console.error(
            "[Estimator API Proxy Error]",
            error
        );

        return new Response(
            JSON.stringify({
                ok: false,
                error: "Estimator API unavailable",
            }),
            {
                status: 502,
                headers: {
                    "content-type": "application/json",
                },
            }
        );
    }
});