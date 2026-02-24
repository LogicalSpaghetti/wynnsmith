// loop through all possible equip orders
//  calculate the improper minimum SP to equip in that order
// run through properValidate, and if it works

import permuteOrders from "../../to_sort/permutation.js";
import {wynnValidate} from "./verifier.js";
import {sp_indexes} from "./skill_points.ts";

// TODO: Set bonuses

/**
 * An array of length 5 corresponding to the 5 skill points
 * @typedef {number[]} SkillPoints
 */

/**
 * @description Finds the minimum SP required to equip a given set of items
 * @param {{reqs: SkillPoints,given: SkillPoints}[]} items - In order: Boots, Leggings, Chestplate, Helmet, Ring1, Ring2, Bracelet, Necklace, Guild Tome.
 * @param {SkillPoints} [initialAssignedSP = [0, 0, 0, 0, 0]] - List of equipment names that make up the build.
 * @return {{assignedSP: SkillPoints, order: number[]}} The SP distribution with the lowest total that allows all items to be equipped.
 */
export function minimizeRequiredSP(items, initialAssignedSP = [0, 0, 0, 0, 0]) {
    let optimalAssigned;
    let optimalOrder;
    let minimumSPTotal = Infinity;

    const assignedSP = new Int32Array(5);
    const givenSP = new Int32Array(5);

    // const minimumSP = new Int32Array(5); // TODO: figure out why minimumSP is overestimating (performance increase is negligible either way though)

    function tryOrder(orderedIndexes) {
        assignedSP.set(initialAssignedSP);
        givenSP.fill(0);
        // minimumSP.fill(0);
        let totalSP = initialAssignedSP.reduce((a, b) => a + b);

        for (let i = 0; i < orderedIndexes.length; i++) {
            const item = items[orderedIndexes[i]];

            for (let j = 0; j < sp_indexes; j++)
                if (item.reqs[j] > 0 && item.reqs[j] - givenSP[j] > assignedSP[j]) {
                    const prev = assignedSP[j];
                    assignedSP[j] = Math.max(prev, item.reqs[j] - givenSP[j]);
                    totalSP += assignedSP[j] - prev;
                }
            if (totalSP >= minimumSPTotal) return;
            // equip item
            for (let j = 0; j < sp_indexes; j++) {
                if (item.given[j] !== 0) givenSP[j] += item.given[j];
                // if (minimumSP[j] > 0 && assignedSP[j] + givenSP[j] < minimumSP[j]) assignedSP[j] = minimumSP[j] - givenSP[j];
                // if (item.reqs[j] > 0) minimumSP[j] = Math.max(minimumSP[j], item.reqs[j] - givenSP[j]);
            }
        }

        for (let i = 0; i < orderedIndexes.length; i++) {
            const equippedItems = items.filter((x, j) => orderedIndexes.indexOf(j) <= i);
            if (!wynnValidate(assignedSP, equippedItems)) return;
        }

        optimalAssigned = [...assignedSP];
        optimalOrder = [...orderedIndexes];
        minimumSPTotal = totalSP;
    }

    // calls tryOrder with every possible ordering of 0 through items.length
    permuteOrders(items.length, items.length, tryOrder);
    return {assignedSP: optimalAssigned ?? [0, 0, 0, 0, 0], order: optimalOrder};
}
