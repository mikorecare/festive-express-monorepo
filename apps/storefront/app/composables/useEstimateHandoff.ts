// composables/useEstimateHandoff.ts
import { ref } from "vue";

const STORAGE_KEY = "festive:estimate";
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

export interface EstimateSnapshot {
    overageFt: number;
    overagePrice: number;
    totalFt: number;
    packageSlug: string;
    totalEstimate: number | null;
    savedAt: number;
}

export function useEstimateHandoff() {
    // In-memory fallback (same-tab, no refresh) — shared across callers
    const overageFt = useState<number>("handoff:overageFt", () => 0);
    const overagePrice = useState<number>("handoff:overagePrice", () => 0);

    function save(snapshot: Omit<EstimateSnapshot, "savedAt">): void {
        if (typeof window === "undefined") return;
        const payload: EstimateSnapshot = { ...snapshot, savedAt: Date.now() };
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            /* private mode / quota — ignore */
        }
        // also mirror into useState for the same-tab, no-refresh path
        overageFt.value = snapshot.overageFt;
        overagePrice.value = snapshot.overagePrice;
    }

    function load(): EstimateSnapshot | null {
        if (typeof window === "undefined") return null;
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as EstimateSnapshot;
            if (Date.now() - (parsed.savedAt || 0) > MAX_AGE_MS) {
                sessionStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    }

    function clear(): void {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(STORAGE_KEY);
        overageFt.value = 0;
        overagePrice.value = 0;
    }

    return { save, load, clear, overageFt, overagePrice };
}