const preloadFestivoImages = async () => {
    if (typeof window === 'undefined') return;

    const states = ['run', 'talk', 'jump'] as const;
    const maxFrames: Record<string, number> = {
        'run': 8,
        'talk': 4,
        'jump': 5,
    };

    const imageUrls: string[] = [];

    for (const [state, frames] of Object.entries(maxFrames)) {
        for (let frame = 1; frame <= frames; frame++) {
            imageUrls.push(`/Images/Festivo/${state}-3d-${frame}.png`);
        }
    }

    for (let i = 1; i <= 9; i++) {
        imageUrls.push(`/Images/Festivo/timeline/${i}.png`);
    }
    imageUrls.push('/Images/Festivo/timeline/open.png');
    imageUrls.push('/Images/Festivo/timeline/close.png');
    imageUrls.push('/Images/Festivo/timeline/wink.png');

    try {
        for (const src of imageUrls) {
            await new Promise<void>((resolve) => {
                const img = new window.Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = src;
            });
        }
    } catch (error) {
        console.warn('Failed to preload images:', error);
    }
};