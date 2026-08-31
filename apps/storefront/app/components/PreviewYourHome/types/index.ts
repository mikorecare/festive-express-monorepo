
export type PackageOption = 'joy' | 'jolly' | 'merry';

export interface Suggestion {
    placeId: string;
    full: string;
    main: string;
    secondary: string;
}

export interface ColorOption {
    scheme: string;
    label: string;
    sw?: string;
}

export interface MultiColor {
    hex: string;
    name: string;
}

export interface RenderStats {
    frontFeet?: number | null;
    rooflineFeet?: number | null;
    frontPrice?: number | null;
    packageTotalFeet?: number | null;
    packageOverageFt?: number | null;
    overagePrice?: number | null;
    wholeFeet?: number | null;
    wholePrice?: number | null;
    withinPackage?: boolean | null;
    pricePerFoot?: number | null;
    estimatedTotal?: number | null;
    package?: string | null;
    packageName?: string | null;
    groundFeet?: number | null;
    packageIncludedFt?: number | null;
    buildingSqft?: number | null;
    roofSqft?: number | null;
    sqftSource?: string | null;
    perimeterFt?: number | null;
}

export interface RenderResult {
    ok: boolean;
    imageUrl: string;
    stats?: RenderStats | null;
    address?: string | null;
    preview?: boolean | null;
    quoteId?: string | null;
    streetView?: {
        verifiedAddress?: string | null;
    } | null;
}

export interface ApiResponse {
    ok?: boolean;
    error?: string | null;
    suggestions?: Suggestion[] | null;
}