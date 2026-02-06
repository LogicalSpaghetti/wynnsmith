import {expect, test} from "vitest";
import {loadItems} from "./database.ts";
import allItems from "../../../data/0/items.json";

test('test static database equals dynamic', async () => {
    expect(await loadItems(0)).toEqual(allItems);
});