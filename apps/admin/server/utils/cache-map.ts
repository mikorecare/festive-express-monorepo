export const CACHE_MAP = {
    EARLY_BIRD: 'earlyBirdSettings',
    GALLERY: 'gallery_landing_cache',
    PACKAGES_PUBLIC: 'packages_list_cache',
    PACKAGES_ADMIN: 'admin_packages_list_cache',
    SKUS: 'skus_list_cache',
    HOW_IT_WORKS: 'how_it_works_cache',
    FAQS: 'faqs_list_cache',
    PRIVACY_POLICY: 'privacy_policy_cache',
    COOKIE_POLICY: 'cookie_policy_cache',
    GLOBAL_SETTINGS: 'global_settings_cache',
    HERO_SUBTITLE: 'hero_subtitle_cache',
    ABOUT_US: 'about_us_cache',
    INCLUSION_ITEMS: 'inclusion_items_cache'
} as const

export type CacheKey = typeof CACHE_MAP[keyof typeof CACHE_MAP]
