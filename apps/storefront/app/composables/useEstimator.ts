import { ref, computed, onUnmounted, onMounted } from "vue";
import type { ColorOption, Suggestion, MultiColor, RenderResult, ApiResponse, PackageOption } from "~/components/PreviewYourHome/types";

const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string>("");
const imageBase64 = ref<string>("");
const address = ref<string>("");
const placeId = ref<string>("");
const suggestions = ref<Suggestion[]>([]);
const suggestionsOpen = ref<boolean>(false);
const pricePerFoot = ref<number>(10);
const selectedScheme = ref<string>("warm-white");
const selectedPackage = ref<PackageOption>("joy");
const multiColors = ref<MultiColor[]>([
    { hex: "#e21d1d", name: "Color 1" },
    { hex: "#1ea832", name: "Color 2" },
    { hex: "#1d6fe2", name: "Color 3" },
    { hex: "#f2c14e", name: "Color 4" },
    { hex: "#9b4dca", name: "Color 5" },
]);
const name = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const error = ref<string>("");
const errors = ref<{ name?: string; email?: string }>({});
const isLoading = ref<boolean>(false);
const rendering = ref<boolean>(false);
const result = ref<RenderResult | null>(null);
const renderError = ref<string>("");
const booking = ref<boolean>(false);
const resultNote = ref<string>("");

const colorOptions: ColorOption[] = [
    { scheme: "warm-white", label: "Warm White", sw: "#fff3d6" },
    { scheme: "pure-white", label: "Pure White", sw: "#ffffff" },
    { scheme: "champagne", label: "Champagne", sw: "#e6c9a0" },
    { scheme: "candy-cane", label: "Candy Cane" },
    { scheme: "multicolor", label: "Multicolor" },
];

const packageOptions = [
    { id: "joy" as const, name: "Joy", price: 999, includedFt: 125 },
    { id: "jolly" as const, name: "Jolly", price: 1999, includedFt: 175 },
    { id: "merry" as const, name: "Merry", price: 2999, includedFt: 175 },
];

const facts: readonly string[] = [
    "Permanent lighting works every night of the year — not just December.",
    "One app changes your whole roofline: warm white, team colors, or full holiday.",
    "The lights tuck into a discreet track, so they disappear in daylight.",
    "Homeowners who see a render book 3× more design consultations.",
    "Finding your roofline…",
    "Placing the lights along every eave and peak…",
    "Balancing the evening glow…",
];

const progressSteps: readonly string[] = [
    "Finding your house…",
    "Reading the roofline…",
    "Placing the lights…",
    "Setting the evening glow…",
    "Almost there…",
];

let factInterval: ReturnType<typeof setInterval> | null = null;
const currentFact = ref<string>(facts[0] || "");
const progressText = ref<string>(progressSteps[0] || "");

// Computed
const multiColorPreview = computed<string[]>((): string[] => {
    const preview: string[] = [];
    for (let cycle = 0; cycle < 2; cycle++) {
        multiColors.value.forEach((color: MultiColor) => {
            for (let n = 0; n < 3; n++) {
                preview.push(color.hex);
            }
        });
    }
    return preview;
});

const statsCards = computed<{ label: string; value: string }[]>(() => {
    const s = result.value?.stats;
    if (!s) return [];

    const cards: { label: string; value: string }[] = [];
    const frontFt = s.frontFeet ?? s.rooflineFeet ?? null;
    const displayFt = s.packageTotalFeet ?? frontFt ?? null;

    if (displayFt !== null) {
        cards.push({ label: "Estimated footage", value: `${Math.round(displayFt)} ft` });
    }
    if (s.frontPrice !== null && s.frontPrice !== undefined) {
        cards.push({ label: "Estimate", value: formatMoney(s.frontPrice) });
    }
    if (s.wholeFeet !== null && s.wholeFeet !== undefined) {
        cards.push({ label: "Whole-house footage", value: `${Math.round(s.wholeFeet)} ft` });
    }
    if (s.wholePrice !== null && s.wholePrice !== undefined) {
        cards.push({ label: "Whole-house quote", value: formatMoney(s.wholePrice) });
    }

    if (s.packageOverageFt !== null && s.packageOverageFt !== undefined && s.packageOverageFt > 0) {
        cards.push({ label: "Extra footage", value: `+${Math.round(s.packageOverageFt)} ft` });
        if (s.overagePrice !== null && s.overagePrice !== undefined) {
            cards.push({ label: "Extra to add", value: formatMoney(s.overagePrice) });
        }
    } else if (s.withinPackage) {
        cards.push({ label: "175 ft package", value: "Covered" });
    }

    return cards;
});

const showOffer = computed<boolean>((): boolean => {
    const overage = result.value?.stats?.packageOverageFt;
    return overage !== null && overage !== undefined && overage > 0;
});

// Methods
function formatMoney(n: number): string {
    return "$" + Number(n).toLocaleString("en-US");
}

function downscaleImage(file: File, maxDim: number = 1280): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = (): void => {
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const cw = Math.round(img.width * scale);
            const ch = Math.round(img.height * scale);
            const canvas = document.createElement("canvas");
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, cw, ch);
            }
            URL.revokeObjectURL(url);
            try {
                resolve(canvas.toDataURL("image/jpeg", 0.85));
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = (): void => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };
        img.src = url;
    });
}

async function handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    error.value = "";
    try {
        const dataUrl = await downscaleImage(file);
        imageBase64.value = dataUrl;
        imagePreview.value = dataUrl;
    } catch (err) {
        error.value = "Could not read that image. Try a different photo.";
    }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSearch(): void {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(async (): Promise<void> => {
        const q = address.value.trim();
        if (q.length < 3) {
            suggestions.value = [];
            return;
        }

        try {
            const response = await $fetch<ApiResponse>(
                `/api/places/autocomplete?q=${encodeURIComponent(q)}`
            );
            suggestions.value = response.suggestions || [];
        } catch (err) {
            suggestions.value = [];
        }
    }, 250);
}

function selectAddress(suggestion: Suggestion): void {
    placeId.value = suggestion.placeId;
    address.value = suggestion.full;
    suggestions.value = [];
    suggestionsOpen.value = false;
}

function updateMultiColor(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    multiColors.value[index]!.hex = input.value;
}

function validateForm(previewOnly: boolean): boolean {
    errors.value = {};

    if (!previewOnly) {
        if (!name.value.trim()) {
            errors.value.name = "Name is required";
        }
        if (!email.value || !email.value.includes("@")) {
            errors.value.email = "Valid email is required";
        }
    }

    if (!imageBase64.value && !address.value) {
        error.value = "Upload a photo of your home or enter your address.";
        return false;
    }

    return Object.keys(errors.value).length === 0;
}

function startFacts(): void {
    let factIndex = 0;
    let progressIndex = 0;
    currentFact.value = facts[0] || "Finding your roofline…";
    progressText.value = progressSteps[0] || "Finding your house…";

    if (factInterval) {
        clearInterval(factInterval);
    }

    factInterval = setInterval((): void => {
        factIndex = (factIndex + 1) % facts.length;
        currentFact.value = facts[factIndex] || "Lighting up…";
        progressIndex = Math.min(progressIndex + 1, progressSteps.length - 1);
        progressText.value = progressSteps[progressIndex] || "Almost there…";
    }, 2600);
}

function stopFacts(): void {
    if (factInterval) {
        clearInterval(factInterval);
        factInterval = null;
    }
}

async function submitRender(previewOnly: boolean): Promise<void> {
    error.value = "";

    if (!validateForm(previewOnly)) {
        return;
    }

    if (!previewOnly) {
        try {
            await $fetch(`/api/lead`, {
                method: "POST",
                body: {
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    address: address.value,
                    source: "render_widget",
                },
            });
        } catch (err) {
            // Ignore lead submission errors
        }
    }

    rendering.value = true;
    result.value = null;
    renderError.value = "";
    startFacts();

    try {
        const body = {
            previewOnly,
            address: address.value,
            placeId: placeId.value || undefined,
            imageBase64: imageBase64.value || undefined,
            email: email.value || undefined,
            pricePerFoot: pricePerFoot.value,
            scheme: selectedScheme.value,
            customColors: selectedScheme.value === "multicolor" ? multiColors.value : [],
            landscape: true,
            decor: "none",
            serviceType: "christmas" as const,
            package: selectedPackage.value,
        };

        const response = await $fetch<RenderResult>(`/api/render`, {
            method: "POST",
            body,
        });

        stopFacts();
        rendering.value = false;

        if (!response.ok) {
            const errorResponse = response as unknown as { error?: string };
            const code = errorResponse.error;
            let msg = "We couldn't render that one. Please try another photo or address.";
            if (code === "bad_image" || code === "no_photo") {
                msg = "That photo didn't come through. Try uploading a different one.";
            } else if (code === "no_house_found") {
                msg = "No house found at this location. The view may show mostly street or empty area — try a different address or upload a photo of your home.";
            } else if (code === "address_not_found" || code === "no_streetview") {
                msg = "We couldn't find a street view for that address. Try a different address or upload a photo.";
            } else if (code === "server_not_configured") {
                msg = "The render service isn't configured yet. Please add your API keys.";
            }
            renderError.value = msg;
            return;
        }

        result.value = response;

        if (previewOnly) {
            const verifiedAddress = response.streetView?.verifiedAddress || "";
            const addressPart = verifiedAddress
                ? ` (camera aimed at lot verified as ${verifiedAddress.split(",")[0]})`
                : "";
            resultNote.value = response.address
                ? `Street View for ${response.address}${addressPart}. Footage estimated from the building footprint — same method as a design quote. No lighting on this preview.`
                : "Footage estimated from the building footprint. No lighting on this preview.";
        } else {
            resultNote.value = response.address
                ? `Estimate for ${response.address}. Final pricing confirmed at your free on-site measurement.`
                : "Estimate only. Final pricing confirmed at your free on-site measurement.";
        }
    } catch (err) {
        stopFacts();
        rendering.value = false;
        renderError.value = "Network hiccup. Please try again.";
    }
}

function reset(): void {
    result.value = null;
    renderError.value = "";
    rendering.value = false;
    error.value = "";
    stopFacts();
}

async function bookConsultation(): Promise<void> {
    if (!email.value || !email.value.includes("@")) {
        resultNote.value = "Enter a valid email on the form so we can book your consultation.";
        return;
    }

    booking.value = true;

    try {
        const response = await $fetch<{ ok: boolean }>(`/api/book`, {
            method: "POST",
            body: {
                name: name.value,
                email: email.value,
                phone: phone.value,
                address: address.value,
                imageUrl: result.value?.imageUrl || "",
                estimate: result.value?.stats || null,
            },
        });

        if (!response.ok) {
            throw new Error("Booking failed");
        }

        resultNote.value = "Thanks — we received your design and contact info. We'll be in touch.";
    } catch (err) {
        resultNote.value = "Could not send your request. Please try again.";
    } finally {
        booking.value = false;
    }
}

function handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
        suggestionsOpen.value = false;
    }
}

// Lifecycle
onMounted((): void => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted((): void => {
    stopFacts();
    document.removeEventListener("click", handleClickOutside);
});

export function useEstimator() {
    return {
        // State
        fileInput,
        imagePreview,
        imageBase64,
        address,
        placeId,
        suggestions,
        suggestionsOpen,
        pricePerFoot,
        selectedScheme,
        selectedPackage,
        packageOptions,
        multiColors,
        name,
        email,
        phone,
        error,
        errors,
        isLoading,
        rendering,
        result,
        renderError,
        booking,
        resultNote,
        currentFact,
        progressText,
        colorOptions,
        // Computed
        multiColorPreview,
        statsCards,
        showOffer,
        // Methods
        formatMoney,
        handleFileUpload,
        debouncedSearch,
        selectAddress,
        updateMultiColor,
        submitRender,
        reset,
        bookConsultation,
    };
}