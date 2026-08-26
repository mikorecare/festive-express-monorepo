import {
    defineEventHandler,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const html = await $fetch<string>(
            config.estimatorApiUrl
        );

        const htmlContent = html
            .replace(
                /<script\s+src=["']widget\.js["']\s*><\/script>/gi,
                '<script src="/estimator/widget.js"></script>'
            )
            .replace(
                /<link\s+rel=["']stylesheet["']\s+href=["']widget\.css["']\s*\/?>/gi,
                '<link rel="stylesheet" href="/estimator/widget.css">'
            );

        setResponseHeader(
            event,
            "Content-Type",
            "text/html; charset=utf-8"
        );

        return htmlContent;
    } catch (error) {
        console.error("Estimator proxy failed:", error);

        setResponseHeader(
            event,
            "Content-Type",
            "text/html"
        );

        return `
      <div style="padding:20px;color:red;text-align:center">
        Estimator offline
      </div>
    `;
    }
});