import {
    defineEventHandler,
    getRequestURL,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const url = getRequestURL(event);
    const path = url.pathname.replace("/api/renders", "");
    const targetUrl =
        `${config.estimatorAssetUrl}/renders${path}${url.search}`;


    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            return new Response("Image not found", {
                status: response.status,
            });
        }

        const contentType =
            response.headers.get("content-type") ||
            "image/jpeg";

        setResponseHeader(
            event,
            "Content-Type",
            contentType
        );

        return response.body;
    } catch (error) {
        console.error("Render image proxy failed:", error);

        return new Response("Unable to load image", {
            status: 502,
        });
    }
});