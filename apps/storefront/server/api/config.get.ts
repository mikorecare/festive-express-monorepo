import { defineEventHandler, H3Event } from "h3";

export default defineEventHandler(
    async (event: H3Event): Promise<any> => {
        const config = useRuntimeConfig(event);

        return await $fetch<any>(
            `${config.estimatorApiUrl}/api/config`
        );
    }
);