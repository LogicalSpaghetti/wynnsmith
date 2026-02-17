import {Database} from "./database.ts";
import type {TreeData} from "../ability/ability_tree.ts";

type DB = { [key: string] : TreeData }

class TreeDatabase extends Database<DB> {
    private static readonly filePath = "trees.json";

    private constructor(items: DB) {
        super(items, TreeDatabase.filePath);
    }

    static async create(): Promise<TreeDatabase> {
        const db = await Database.init<DB>(TreeDatabase.filePath);
        return new TreeDatabase(db.get());
    }

    public getTree(wynnClass: string) {
        const tree = this.entries[wynnClass];
        if (!tree) throw new Error(`Ability tree data for ${wynnClass} doesn't exist!`);
        return tree;
    }
}

export const treeDatabase = await TreeDatabase.create();