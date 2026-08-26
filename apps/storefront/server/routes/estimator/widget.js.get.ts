import {
    defineEventHandler,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const response = await fetch(
        `${config.estimatorApiUrl}/widget.js`
    );

    setResponseHeader(
        event,
        "Content-Type",
        "application/javascript"
    );

    return response.body;
});