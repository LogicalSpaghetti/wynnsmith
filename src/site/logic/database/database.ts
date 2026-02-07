const latestDBVersion = 0;

async function loadJson<T>(fileName: string, version: number = latestDBVersion): Promise<T> {
    const result = await fetch(`${import.meta.env.BASE_URL}/data/${version}/${fileName}`);

    if (!result.ok)
        throw new Error(`Failed to load ${fileName} for version ${version} (${result.status})`);

    return (await result.json()) as T;
}

export class Database<T> {
    protected items: T;
    private readonly path: string;

    protected constructor(items: T, path: string) {
        this.items = items;
        this.path = path;
    }

    protected static async init<T>(path: string, version?: number): Promise<Database<T>> {
        const items = await loadJson<T>(path, version);
        return new Database(items, path);
    }

    get(): T {
        return this.items;
    }

    async set(version?: number): Promise<T> {
        this.items = await loadJson<T>(this.path, version);
        return this.items;
    }
}