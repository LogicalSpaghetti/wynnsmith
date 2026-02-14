export class ImageLoader {
    private static cache = new Map<string, Promise<HTMLImageElement>>();

    static load(src: string): Promise<HTMLImageElement> {
        if (!this.cache.has(src)) {
            const promise = new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    if (img.naturalWidth === 0) {
                        reject(new Error(`Failed to load image: ${src}`));
                    } else {
                        resolve(img);
                    }
                };

                img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
                img.src = src;
            });

            this.cache.set(src, promise);
        }

        return this.cache.get(src)!;
    }


    static loadMany(sources: string[]) {
        return Promise.all(sources.map(src => this.load(src)));
    }
}