// loop through all possible equip orders
//  calculate the improper minimum SP to equip in that order
// run through properValidate, and if it works

import permuteOrders from "../../../common/permutation.js";
import {wynnValidate} from "./verifier.js";

const sp_count = 5;

// TODO: Set bonuses
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

            for (let j = 0; j < sp_count; j++)
                if (item.cost[j] > 0 && item.cost[j] - givenSP[j] > assignedSP[j]) {
                    const prev = assignedSP[j];
                    assignedSP[j] = Math.max(prev, item.cost[j] - givenSP[j]);
                    totalSP += assignedSP[j] - prev;
                }
            if (totalSP >= minimumSPTotal) return;
            // equip item
            for (let j = 0; j < sp_count; j++) {
                if (item.given[j] !== 0) givenSP[j] += item.given[j];
                // if (minimumSP[j] > 0 && assignedSP[j] + givenSP[j] < minimumSP[j]) assignedSP[j] = minimumSP[j] - givenSP[j];
                // if (item.cost[j] > 0) minimumSP[j] = Math.max(minimumSP[j], item.cost[j] - givenSP[j]);
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
