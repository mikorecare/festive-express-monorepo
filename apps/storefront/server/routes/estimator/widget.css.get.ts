import {
    defineEventHandler,
    setResponseHeader,
} from "h3";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const response = await fetch(
        `${config.estimatorApiUrl}/widget.css`
    );

    setResponseHeader(
        event,
        "Content-Type",
        "text/css"
    );

    return response.body;
});