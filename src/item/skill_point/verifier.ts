import {getItemAddedSP, getItemSPReqs, sp_indexes} from "./skill_points.ts";
import type {NormalItemData} from "../item_types.ts";

type SimpleItem = {
    reqs: number[],
    given: number[]
}

// TODO: set bonuses, abnormal items (consider modifying the API item data)
export function solveSP(weaponData: NormalItemData, offhandsData: NormalItemData[], gearData: NormalItemData[], assignedSP: number[] = [0, 0, 0, 0, 0]): number[] {
    const weapon = itemToSimpleItem(weaponData);
    const offhands = offhandsData.map(item => itemToSimpleItem(item));
    const gear = gearData.map(item => itemToSimpleItem(item));
    assignedSP = [...assignedSP];

    const givenSP = sumGiven(gear);

    restrictMinimumsBy(assignedSP, givenSP, true, weapon, ...offhands);
    restrictMinimumsBy(assignedSP, givenSP, false, ...gear);

    return assignedSP;
}

function restrictMinimumsBy(assignedSP: number[], givenSP: number[], isWeapon: boolean, ...items: SimpleItem[]) {
    for (const item of items)
        applyMinimums(item, assignedSP, givenSP, isWeapon);
}

function applyMinimums(item: SimpleItem, assignedSP: number[], givenSP: number[], isWeapon = false) {
    for (let i = 0; i < sp_indexes; i++)
        if (item.reqs[i] > 0)
            assignedSP[i] = Math.max(
                assignedSP[i],
                item.reqs[i] - givenSP[i] + (isWeapon ? 0 : item.given[i]));
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

function itemToSimpleItem(item: NormalItemData) {
    const given: number[] = getItemAddedSP(item);

    const reqs: number[] = getItemSPReqs(item)

    return {reqs, given};
}
