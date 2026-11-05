export type Video = {
    id: string;
    post_id: string | null;
    title: string | null;
    storage_path: string;
    public_url: string;
    mime_type: string | null;
    size_bytes: number | null;
    sort_order: number;
    created_at: string;
    post_count?: number;
};

export type NewVideo = {
    post_id: string | null;
    title: string | null;
    storage_path: string;
    public_url: string;
    mime_type: string | null;
    size_bytes: number | null;
};

export function formatBytes(bytes: number | null): string {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}