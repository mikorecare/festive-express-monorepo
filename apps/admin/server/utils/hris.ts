export const getHrisPortal = () => {
    const config = useRuntimeConfig()

    return {
        apiUrl: config.hris.apiUrl,
        apikey: config.hris.apiKey
    }
}