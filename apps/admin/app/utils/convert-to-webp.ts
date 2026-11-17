export const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        if (
            file.type === "image/webp" ||
            file.type === "image/gif" ||
            file.type === "image/svg+xml"
        ) {
            return resolve(file);
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");

            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) return reject(new Error("Canvas context not available"));

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error("WebP conversion failed"));

                    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const webpFile = new File([blob], newName, { type: "image/webp" });
                    resolve(webpFile);
                },
                "image/webp",
                0.85,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image for conversion"));
        };

        img.src = url;
    });
};