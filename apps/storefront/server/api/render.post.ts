import {
    defineEventHandler,
    readBody,
} from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const result = await $fetch<any>(
        `${config.estimatorApiUrl}/api/render`,
        {
            method: "POST",
            body,
        }
    );

    if (result?.imageUrl) {
        result.imageUrl = new URL(
            result.imageUrl,
            config.estimatorAssetUrl
        ).toString();
    }

    return result;
});