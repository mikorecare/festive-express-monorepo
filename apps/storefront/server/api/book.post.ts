import {
    defineEventHandler,
    readBody,
} from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    return await $fetch<any>(
        `${config.estimatorApiUrl}/api/book`,
        {
            method: "POST",
            body,
        }
    );
});