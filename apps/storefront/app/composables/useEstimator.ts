import { ref, computed, onUnmounted, onMounted, watch } from "vue";
import type {
    ColorOption,
    Suggestion,
    MultiColor,
    RenderResult,
    ApiResponse,
    PackageOption,
    IPackageRow,
    IPackageOption,
    RenderStats
} from "~/components/PreviewYourHome/types";

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
const errors = ref<{ name?: string; email?: string; address?: string }>({});
const isLoading = ref<boolean>(false);
const rendering = ref<boolean>(false);
const result = ref<RenderResult | null>(null);
const renderError = ref<string>("");
const booking = ref<boolean>(false);
const resultNote = ref<string>("");
const packages = ref<IPackageRow[]>([]);
const loadingPackages = ref<boolean>(false);
const packageError = ref<string | null>(null);
const isPreview = ref<boolean>(false);

const colorOptions: ColorOption[] = [
    { scheme: "warm-white", label: "Warm White", sw: "#fff3d6" },
    { scheme: "pure-white", label: "Pure White", sw: "#ffffff" },
    { scheme: "champagne", label: "Champagne", sw: "#e6c9a0" },
    { scheme: "candy-cane", label: "Candy Cane" },
    { scheme: "multicolor", label: "Multicolor" },
];

const packageOptions = ref<IPackageOption[]>([]);

const facts: readonly string[] = [
    'Festive Express installs your lights — you relax and enjoy the season.',
    'Professional C-9 roofline lighting, installed and removed for you.',
    'One simple rental package — no ladders, no tangled cords, no storage.',
    'We handle install, maintenance, and takedown when the season ends.',
    'Licensed & insured technicians — your home is fully protected.',
    'Finding your roofline…',
    'Placing C-9 lights along every eave and peak…',
    'Adding the festive evening glow…',
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
const PACKAGE_TOTAL_FT = 175;
const MAX_ROOFLINE_FT = 125;
const MAX_GROUND_FT = 50;
const OVERAGE_RATE = 10;

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

// Get selected package data
const selectedPackageData = computed<IPackageOption | undefined>(() => {
    return packageOptions.value.find(p => p.id === selectedPackage.value);
});

// Get total feet from stats (roofline + ground combined)
const getTotalFeet = (stats: RenderStats | null | undefined): number => {
    if (!stats) return 0;
    const rooflineFt = stats.rooflineFeet || stats.frontFeet || 0;
    const groundFt = stats.groundFeet || 0;
    return rooflineFt + groundFt;
};

// Get roofline feet only
const getRooflineFeet = (stats: RenderStats | null | undefined): number => {
    if (!stats) return 0;
    return stats.rooflineFeet || stats.frontFeet || 0;
};

// Get ground feet only
const getGroundFeet = (stats: RenderStats | null | undefined): number => {
    if (!stats) return 0;
    return stats.groundFeet || 0;
};

// Calculate overage based on total feet (roofline + ground)
const calculatedOverageFt = computed<number>(() => {
    if (!result.value?.stats) return 0;
    const totalFt = getTotalFeet(result.value.stats);
    return totalFt > PACKAGE_TOTAL_FT ? Math.max(0, totalFt - PACKAGE_TOTAL_FT) : 0;
});

// Calculate overage price at $10/ft
const calculatedOveragePrice = computed<number | null>(() => {
    const overage = calculatedOverageFt.value;
    if (overage <= 0) return null;
    return Math.round((overage * OVERAGE_RATE) / 10) * 10;
});

// Calculate total estimate (package price + overage)
const totalEstimate = computed<number | null>(() => {
    if (!selectedPackageData.value) return null;
    const basePrice = selectedPackageData.value.price;
    const overagePrice = calculatedOveragePrice.value || 0;
    return basePrice + overagePrice;
});

// Check if total is within package limits
const isWithinPackage = computed<boolean>(() => {
    if (!result.value?.stats) return true;
    const totalFt = getTotalFeet(result.value.stats);
    return totalFt <= PACKAGE_TOTAL_FT;
});

const statsCards = computed<{ label: string; value: string }[]>(() => {
    const s = result.value?.stats;
    if (!s) return [];

    const cards: { label: string; value: string }[] = [];
    const rooflineFt = getRooflineFeet(s);
    const groundFt = getGroundFeet(s);
    const totalFt = getTotalFeet(s);

    if (rooflineFt > 0) {
        cards.push({ label: "Roofline footage", value: `${Math.round(rooflineFt)} ft` });
    }
    if (groundFt > 0) {
        cards.push({ label: "Ground lights", value: `${Math.round(groundFt)} ft` });
    }
    if (totalFt > 0) {
        cards.push({ label: "Total footage", value: `${Math.round(totalFt)} ft` });
    }

    // Get selected package
    const pkg = selectedPackageData.value;
    if (pkg) {
        cards.push({
            label: `${pkg.name} — Early Bird Special`,
            value: formatMoney(pkg.price)
        });
    }

    // Show package details
    cards.push({
        label: "Package includes",
        value: `Up to ${PACKAGE_TOTAL_FT} ft total (${MAX_ROOFLINE_FT} ft roofline + ${MAX_GROUND_FT} ft ground)`
    });

    // Use calculated overage
    const overageFt = calculatedOverageFt.value;
    if (overageFt > 0) {
        cards.push({ label: "Extra footage needed", value: `+${Math.round(overageFt)} ft` });
        const overagePrice = calculatedOveragePrice.value;
        if (overagePrice !== null) {
            cards.push({ label: `Extra at $${OVERAGE_RATE}/ft`, value: formatMoney(overagePrice) });
        }
        if (totalEstimate.value !== null) {
            cards.push({ label: "Total estimate", value: formatMoney(totalEstimate.value) });
        }
    } else {
        cards.push({ label: "Package coverage", value: "✓ Your home is covered" });
    }

    return cards;
});

const showOffer = computed<boolean>((): boolean => {
    return calculatedOverageFt.value > 0;
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
    errors.value.address = undefined;
}

function updateMultiColor(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    multiColors.value[index]!.hex = input.value;
}

function validateForm(previewOnly: boolean): boolean {
    errors.value = {};

    if (!address.value.trim()) {
        errors.value.address = "Address is required";
    }

    if (!previewOnly) {
        if (!name.value.trim()) {
            errors.value.name = "Name is required";
        }
        if (!email.value || !email.value.includes("@")) {
            errors.value.email = "Valid email is required";
        }
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

const fetchPackages = async () => {
    loadingPackages.value = true;
    packageError.value = null;
    try {
        const response = await $fetch<{ packages: any[] }>('/api/packages');

        const data = response.packages || [];
        packages.value = data;

        packageOptions.value = data.map((pkg) => {
            // Use the already transformed URL from the API
            const imageUrl = pkg.title_image_url || pkg.image_url || '';

            return {
                id: pkg.slug as PackageOption,
                name: pkg.name,
                previousPrice: Math.round(Number(pkg.price) || 0),
                price: Math.round(Number(pkg.sale_price) || 0),
                includedFt: PACKAGE_TOTAL_FT,
                title: imageUrl,
                isPopular: pkg.is_popular || false,
                color: pkg.color || null,
                icon: pkg.icon_url || null,
                description: pkg.description || null,
                features: pkg.features || null,
            };
        });

        if (packageOptions.value.length > 0) {
            selectedPackage.value = packageOptions.value[0]!.id;
        }
    } catch (err: any) {
        console.error(err);
        packageError.value = err.message || "Failed to load packages.";
    } finally {
        loadingPackages.value = false;
    }
};

function updateResultStats(): void {
    if (!result.value?.stats) return;

    const overageFt = calculatedOverageFt.value;
    const overagePrice = calculatedOveragePrice.value;

    result.value.stats.packageOverageFt = overageFt;
    result.value.stats.overagePrice = overagePrice;
    result.value.stats.estimatedTotal = totalEstimate.value;
    result.value.stats.package = selectedPackage.value;
    result.value.stats.packageName = selectedPackageData.value?.name;
    result.value.stats.packageIncludedFt = PACKAGE_TOTAL_FT;
    result.value.stats.pricePerFoot = OVERAGE_RATE;
    result.value.stats.withinPackage = isWithinPackage.value;
}

async function submitRender(previewOnly: boolean, turnstileToken?: string): Promise<void> {
    error.value = "";
    isPreview.value = previewOnly;
    if (!validateForm(previewOnly)) {
        return;
    }

    rendering.value = true;
    result.value = null;
    renderError.value = "";
    startFacts();

    try {
        const body = {
            action: 'render',
            previewOnly,
            address: address.value,
            placeId: placeId.value || undefined,
            email: email.value || undefined,
            name: name.value,
            phone: phone.value,
            scheme: selectedScheme.value,
            serviceType: "christmas" as const,
            package: selectedPackage.value,
            turnstileToken: turnstileToken,
        };

        // Single API call to /api/estimate
        const response = await $fetch<RenderResult>(`/api/estimate`, {
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

        // Update stats with calculated values
        updateResultStats();

        if (previewOnly) {
            const verifiedAddress = response.streetView?.verifiedAddress || "";
            const addressPart = verifiedAddress
                ? ` (camera aimed at lot verified as ${verifiedAddress.split(",")[0]})`
                : "";
            resultNote.value = response.address
                ? `Street View for ${response.address}${addressPart}. Footage estimated from the building footprint — same method as a design quote. No lighting on this preview.`
                : "Footage estimated from the building footprint. No lighting on this preview.";
        } else {
            // Show package details in the result note
            const pkg = selectedPackageData.value;
            const totalFt = result.value?.stats ? getTotalFeet(result.value.stats) : 0;
            const overageFt = calculatedOverageFt.value;

            let note = `Estimate for ${response.address || 'your home'}. `;
            note += `Package: ${pkg?.name || 'Selected'} (up to ${PACKAGE_TOTAL_FT} ft total). `;

            if (overageFt > 0) {
                note += `Your home needs ${Math.round(totalFt)} ft total, which is ${Math.round(overageFt)} ft over the package. `;
                note += `Add ${Math.round(overageFt)} ft at $${OVERAGE_RATE}/ft = ${formatMoney(calculatedOveragePrice.value || 0)}. `;
            } else {
                note += `Your home's ${Math.round(totalFt)} ft is covered by the package. `;
            }
            note += `Final pricing confirmed at your free on-site measurement.`;

            resultNote.value = note;
        }
    } catch (err) {
        stopFacts();
        rendering.value = false;
        renderError.value = "Network hiccup. Please try again.";
    }
}

async function bookConsultation(turnstileToken?: string): Promise<void> {
    if (!email.value || !email.value.includes("@")) {
        resultNote.value = "Enter a valid email on the form so we can book your consultation.";
        return;
    }

    booking.value = true;

    try {
        const body = {
            action: 'book',
            previewOnly: false,
            address: address.value,
            placeId: placeId.value || undefined,
            email: email.value,
            name: name.value,
            phone: phone.value,
            scheme: selectedScheme.value,
            serviceType: "christmas" as const,
            package: selectedPackage.value,
            totalEstimate: totalEstimate.value,
            packageName: selectedPackageData.value?.name,
            overageFt: calculatedOverageFt.value,
            overagePrice: calculatedOveragePrice.value,
            totalFt: result.value?.stats ? getTotalFeet(result.value.stats) : 0,
            imageUrl: result.value?.imageUrl || "",
            turnstileToken: turnstileToken,
        };

        const response = await $fetch<RenderResult>(`/api/estimate`, {
            method: "POST",
            body,
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

function reset(): void {
    result.value = null;
    renderError.value = "";
    rendering.value = false;
    error.value = "";
    stopFacts();
}

function handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
        suggestionsOpen.value = false;
    }
}

// Watch for package selection changes to recalculate pricing
watch(selectedPackage, () => {
    updateResultStats();
});

// Watch for price per foot changes (though it's now constant at $10)
watch(pricePerFoot, () => {
    updateResultStats();
});

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
        isPreview,
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
        packages,
        loadingPackages,
        packageError,
        // Computed
        multiColorPreview,
        statsCards,
        showOffer,
        selectedPackageData,
        calculatedOverageFt,
        calculatedOveragePrice,
        totalEstimate,
        isWithinPackage,
        // Constants
        PACKAGE_TOTAL_FT,
        MAX_ROOFLINE_FT,
        MAX_GROUND_FT,
        OVERAGE_RATE,
        // Methods
        formatMoney,
        handleFileUpload,
        debouncedSearch,
        selectAddress,
        updateMultiColor,
        submitRender,
        reset,
        bookConsultation,
        fetchPackages,
        getTotalFeet,
        getRooflineFeet,
        getGroundFeet,
    };
}