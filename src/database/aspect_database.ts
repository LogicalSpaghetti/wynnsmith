import {Database} from "./database.ts";

export type AspectData = {
    name: string
    rarity: string
    descriptions: string[]
}

type DB = { [key: string] : AspectData[] }

class AspectDatabase extends Database<DB> {
    private static readonly filePath = "aspects.json";

    private constructor(items: DB) {
        super(items, AspectDatabase.filePath);
    }

    static async create(): Promise<AspectDatabase> {
        const db = await Database.init<DB>(AspectDatabase.filePath);
        return new AspectDatabase(db.get());
    }

    public getAspects(wynnClass: string) {
        const aspects = this.entries[wynnClass];
        if (!aspects) throw new Error(`Aspect data for ${wynnClass} doesn't exist!`);
        return aspects;
    }
}

export const aspectDatabase = await AspectDatabase.create();