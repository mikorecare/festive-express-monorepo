import * as tus from "tus-js-client";
import type { NewVideo, Video } from "~/types/video";

export function useVideoUpload() {
    const config = useRuntimeConfig();
    const progress = ref(0);
    const uploading = ref(false);
    const status = ref<"idle" | "success" | "error">("idle");

    const upload = async (
        file: File,
        title: string | null,
        postId: string | null = null,
    ): Promise<Video> => {
        uploading.value = true;
        progress.value = 0;
        status.value = "idle";

        try {
            // 1. Fetch the JWT via the server endpoint (cookie is httpOnly)
            const { accessToken } = await $fetch<{ accessToken: string }>(
                "/api/auth/token",
            );
            if (!accessToken) throw new Error("No active session. Please log in again.");

            // 2. TUS upload straight to Supabase
            const url = config.public.supabaseUrl as string;
            const projectRef = new URL(url).hostname.split(".")[0];
            const bucket = "videos";
            const safeName = file.name.replace(/[^\w.-]+/g, "_");
            const storagePath = `admin/${Date.now()}-${safeName}`;

            await new Promise<void>((resolve, reject) => {
                const tusUpload = new tus.Upload(file, {
                    endpoint: `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                        "x-upsert": "true",
                    },
                    uploadDataDuringCreation: true,
                    removeFingerprintOnSuccess: true,
                    metadata: {
                        bucketName: bucket,
                        objectName: storagePath,
                        contentType: file.type || "video/mp4",
                        cacheControl: "3600",
                    },
                    chunkSize: 6 * 1024 * 1024,
                    onError: (err) => reject(err),
                    onProgress: (uploaded, total) => {
                        progress.value = (uploaded / total) * 100;
                    },
                    onSuccess: () => resolve(),
                });
                tusUpload.start();
            });

            // 3. Persist metadata
            const publicUrl = `${url}/storage/v1/object/public/${bucket}/${storagePath}`;
            const payload: NewVideo = {
                post_id: postId,
                title,
                storage_path: storagePath,
                public_url: publicUrl,
                mime_type: file.type || "video/mp4",
                size_bytes: file.size,
            };

            const res = await $fetch<{ success: boolean; data?: Video; error?: string }>(
                "/api/blog/videos",
                { method: "POST", body: payload },
            );
            if (!res.success || !res.data) {
                throw new Error(res.error || "Failed to save metadata");
            }

            status.value = "success";
            return res.data;
        } catch (e) {
            status.value = "error";
            throw e;
        } finally {
            uploading.value = false;
        }
    };

    return { upload, uploading, progress, status };
}