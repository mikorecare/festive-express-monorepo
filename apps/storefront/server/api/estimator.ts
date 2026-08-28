import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        // Fetch the estimator HTML
        const response = await fetch(config.estimatorApiUrl, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

        let html = await response.text();

        html = html
            .replace(
                /<script\s+src=["']widget\.js["']\s*><\/script>/gi,
                '<script src="/estimator/widget.js"></script>'
            )
            .replace(
                /<link\s+rel=["']stylesheet["']\s+href=["']widget\.css["']\s*\/?>/gi,
                '<link rel="stylesheet" href="/estimator/widget.css">'
            )
            .replace(
                /(src|href)=["']\/(?!estimator\/)/gi,
                '$1="http://52.204.215.130/'
            );

        setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
        setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");

        return html;
    } catch (error) {
        console.error("Estimator proxy failed:", error);
        setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
        return `
      <!DOCTYPE html>
      <html>
        <head><title>Estimator Offline</title></head>
        <body style="padding:20px;text-align:center;font-family:sans-serif;">
          <h2>Estimator Offline</h2>
          <p>Please try again later.</p>
        </body>
      </html>
    `;
    }
});