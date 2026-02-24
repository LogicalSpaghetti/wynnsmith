import {Database} from "./database.ts";

type DB = { [key: string | number] : MajorId }
type MajorId = {
    name: string;
    description: string;
}

class MajorIdDatabase extends Database<DB> {
    private static readonly filePath = "major_ids.json";

    private constructor(items: DB) {
        super(items, MajorIdDatabase.filePath);
    }

    static async create(): Promise<MajorIdDatabase> {
        const db = await Database.init<DB>(MajorIdDatabase.filePath);
        return new MajorIdDatabase(db.get());
    }

    public getMajorId(idName: string) {
        const idId = Object.keys(this.entries).find(key => this.entries[key].name === idName);
        if (!idId) return null;
        return this.entries[idId];
    }
}

export const majorIdDatabase = await MajorIdDatabase.create();