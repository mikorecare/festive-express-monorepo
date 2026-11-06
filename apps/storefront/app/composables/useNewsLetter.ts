export function useNewsletter() {
    const subscribing = ref(false);
    const isSubscribed = ref(false);

    const subscribe = async (email: string, firstName: string, lastName: string, turnstileToken?: string) => {
        subscribing.value = true;
        isSubscribed.value = false;

        try {
            const response = await $fetch<{ success: boolean; message?: string }>(
                "/api/newsletter/subscribe",
                {
                    method: "POST",
                    body: {
                        email,
                        firstName,
                        lastName,
                        turnstileToken: turnstileToken,
                    },
                }
            );

            if (!response.success) {
                throw new Error(response.message || "Subscription failed");
            }

            isSubscribed.value = true;
            return { success: true };
        } catch (error: any) {
            throw error;
        } finally {
            subscribing.value = false;
        }
    };

    return {
        subscribing,
        isSubscribed,
        subscribe,
    };
}