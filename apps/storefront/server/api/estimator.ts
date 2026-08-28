
import { defineEventHandler, setResponseHeader, removeResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const response = await fetch(config.estimatorApiUrl);
        let html = await response.text();
        const nonce = event.context.security?.nonce || '';

        html = html
            .replace(
                /href="widget\.css"/g,
                'href="/api/estimator/widget.css"'
            )
            .replace(
                /src="widget\.js"/g,
                'src="/api/estimator/widget.js"'
            );

        if (nonce) {
            html = html
                .replace(/<style/g, `<style nonce="${nonce}"`)
                .replace(/<script/g, `<script nonce="${nonce}"`);
        }

        removeResponseHeader(event, "Content-Security-Policy");
        removeResponseHeader(event, "X-Frame-Options");
        removeResponseHeader(event, "Cross-Origin-Embedder-Policy");
        removeResponseHeader(event, "Cross-Origin-Opener-Policy");
        removeResponseHeader(event, "Cross-Origin-Resource-Policy");
        setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
        setResponseHeader(event, "Content-Security-Policy",
            "default-src 'self' data: blob: https: http:; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; " +
            "style-src 'self' 'unsafe-inline' https: http:; " +
            "img-src 'self' data: https: http:; " +
            "font-src 'self' https: http:; " +
            "connect-src 'self' https: http:; " +
            "frame-src 'self' https: http:; " +
            "frame-ancestors 'self' https: http:;"
        );
        setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");
        setResponseHeader(event, "Cross-Origin-Embedder-Policy", "unsafe-none");
        setResponseHeader(event, "Cross-Origin-Resource-Policy", "cross-origin");

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