// loop through all possible equip orders
//  calculate the improper minimum SP to equip in that order
// run through properValidate, and if it works

import permuteOrders from "../../../common/permutation.js";
import {properValidate} from "./verifier.js";

// TODO: Set bonuses
export function minimizeRequiredSP(items, initialAssignedSP = [0, 0, 0, 0, 0]) {
    let optimalAssigned;
    let minimumSPTotal = Infinity;

    const assignedSP = new Int32Array(5);
    const givenSP = new Int32Array(5);

    function tryOrder(orderedIndexes) {
        assignedSP.set(initialAssignedSP);
        givenSP.fill(0);
        let totalSP = initialAssignedSP.reduce((a, b) => a + b);

        for (let i = 0; i < orderedIndexes.length; i++) {
            const item = items[orderedIndexes[i]];

            let canEquip = true;
            for (let i = 0; i < 5; i++)
                if (item.cost[i] > 0 && item.cost[i] - assignedSP[i] - givenSP[i] > 0) canEquip = false;

            if (!canEquip)
                for (let j = 0; j < 5; j++)
                    if (item.cost[j] > 0 && item.cost[j] - givenSP[j] > assignedSP[j]) {
                        const prev = assignedSP[j];
                        assignedSP[j] = Math.max(prev, item.cost[j] - givenSP[j]);
                        totalSP += assignedSP[j] - prev;
                    }
            if (totalSP >= minimumSPTotal) return;
            // equip item
            for (let j = 0; j < 5; j++) if (item.given[j] > 0)
                givenSP[j] += item.given[j];
        }
        if (properValidate(assignedSP, items)) {
            optimalAssigned = [...assignedSP];
            minimumSPTotal = totalSP;
        }
    }

    // calls tryOrder with every possible ordering of 0 through items.length
    permuteOrders(items.length, items.length, tryOrder);

    return {assignedSP: optimalAssigned};
}
