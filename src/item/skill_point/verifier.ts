import {getItemAddedSP, getItemSPReqs, sp_indexes} from "./skill_points.ts";
import type {ItemData} from "../item_types.ts";

type SimpleItem = {
    reqs: number[],
    given: number[]
}

// TODO: set bonuses, abnormal items (consider modifying the API item data)

/**
 *
 * @param weaponData
 * The primary weapon of a build
 * @param offhandsData
 * All offhands for a build
 * @param gearData
 * The Helmet, Chestplate, Leggings, Boots, Rings, Bracelet, Necklace, and Guild Tome for a build
 * @param assignedSP
 * Initial Skill Points assigned by the user
 *
 * @returns A new SP assignment array that meets all item requirements.
 */
export function solveSP(weaponData: ItemData, offhandsData: ItemData[], gearData: ItemData[], assignedSP: number[] = [0, 0, 0, 0, 0]): {
    assigned: number[]
    given: number[]
} {
    const weapon = itemToSimpleItem(weaponData);
    const offhands = offhandsData.map(itemToSimpleItem);
    const gear = gearData.map(itemToSimpleItem);
    assignedSP = [...assignedSP];

    const givenSP = sumGiven(gear);

    restrictMinimumsBy(assignedSP, givenSP, false, weapon, ...offhands);
    restrictMinimumsBy(assignedSP, givenSP, true, ...gear);

    const postWeaponGiven = givenSP.map((x, i) => x + weapon.given[i]);

    return {
        assigned: assignedSP,
        given: postWeaponGiven,
    };
}

function restrictMinimumsBy(assignedSP: number[], givenSP: number[], givesRealSP: boolean, ...items: SimpleItem[]) {
    for (const item of items)
        applyMinimums(item, assignedSP, givenSP, givesRealSP);
}

function applyMinimums(item: SimpleItem, assignedSP: number[], givenSP: number[], givesRealSP = false) {
    for (let i = 0; i < sp_indexes; i++)
        if (item.reqs[i] !== 0)
            assignedSP[i] = Math.max(
                assignedSP[i],
                item.reqs[i] - givenSP[i] + (givesRealSP ? item.given[i] : 0));
}

function sumGiven(items: SimpleItem[]): number[] {
    return items.reduce(
        (acc, {given}) => {
            for (let i = 0; i < sp_indexes; i++)
                acc[i] += given[i];
            return acc;
        },
        [0, 0, 0, 0, 0],
    );
}

function itemToSimpleItem(item: ItemData): SimpleItem {
    return {
        reqs: getItemSPReqs(item),
        given: getItemAddedSP(item),
    };
}
