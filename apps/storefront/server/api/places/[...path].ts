import {
    defineEventHandler,
    getRequestURL,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const url = getRequestURL(event);
    const path = url.pathname.replace("/api/places", "");
    const target =
        `${config.estimatorApiUrl}/api/places${path}${url.search}`;


    try {
        const response = await fetch(target);

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
        console.error("[Places Proxy Error]", error);

        return new Response(
            JSON.stringify({
                ok: false,
                error: "Places API unavailable",
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