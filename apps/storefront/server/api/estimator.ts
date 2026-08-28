import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const response = await fetch(config.estimatorApiUrl);
        let html = await response.text();

        const nonce = event.context.security?.nonce || '';

        html = html
            .replace(
                /<style>/g,
                `<style nonce="${nonce}">`
            )
            .replace(
                /<script(?!\s+src)/g,
                `<script nonce="${nonce}"`
            );

        setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
        setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");
        setResponseHeader(event, "Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
            "https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
            "style-src 'self' 'unsafe-inline' " +
            "https://fonts.googleapis.com https://fonts.gstatic.com; " +
            "frame-ancestors 'self';"
        );

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