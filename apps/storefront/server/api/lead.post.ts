import {
    defineEventHandler,
    readBody,
} from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const result = await $fetch<any>(
        `${config.estimatorApiUrl}/api/lead`,
        {
            method: "POST",
            body,
        }
    );

    return result;
});