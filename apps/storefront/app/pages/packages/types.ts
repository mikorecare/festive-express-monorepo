export type InclusionItem = {
    id: string;
    name: string;
    slug?: string;
    image_url?: string | null;
};

export type PackageInclusion = {
    quantity: number;
    is_included: boolean;
    label_override?: string | null;
    sort_order?: number;
    inclusion_items?: InclusionItem | null;
};

export type PackageRow = {
    id: string | number;
    name: string;
    slug: string;
    description?: string | null;
    price?: number | string | null;
    sale_price?: number | string | null;
    title_image_url?: string | null;
    icon_url?: string | null;
    package_inclusions?: PackageInclusion[];
};

export type SkuRow = {
    id: string | number;
    name: string;
    price?: number | string | null;
    sale_price?: number | string | null;
    image_url?: string | null;
    package_id: string | number;
    color_key?: string | null;
    color_label?: string | null;
};

export type ApiResponse<T> = { success: boolean; data: T };

export type Hotspot = {
  key: string;
  top: string;
  left: string;
  label: string;
  thumb?: string;
};

export type InclusionSpec = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_options: string[] | any;
  features: string[] | any;
  specifications: Record<string, string> | any;
  sort_order: number;
};

