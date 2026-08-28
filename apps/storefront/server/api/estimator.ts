import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const response = await fetch(config.estimatorApiUrl);
        let html = await response.text();

        const nonce = event.context.security?.nonce || '';

        html = html
            .replace(/<style>/g, `<style nonce="${nonce}">`)
            .replace(/<script(?!\s+src)/g, `<script nonce="${nonce}"`);

        setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
        setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");
        setResponseHeader(event, "Cross-Origin-Embedder-Policy", "unsafe-none");

        setResponseHeader(event, "Content-Security-Policy",
            "default-src 'self' data: blob: https: http:; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; " +
            "style-src 'self' 'unsafe-inline' https: http:; " +
            "frame-ancestors 'self';"
        );

        return html;
    } catch (error) {
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