export const isEarlyBirdActive = (enabled?: boolean, expiresAt?: string | null) => {
    if (!enabled) return false;
    if (!expiresAt) return true;
    return new Date(expiresAt).getTime() > Date.now();
}