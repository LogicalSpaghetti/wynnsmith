import {sp_indexes} from "./skill_points.js";
import {increaseBranchCount, itemCanEquip} from "./verifier.js";

/**
 * @description Finds the minimum SP required to equip a given set of items according to Wynncraft.
 * @param {{reqs: SkillPoints,given: SkillPoints}[]} items - In order: Boots, Leggings, Chestplate, Helmet, Ring1, Ring2, Bracelet, Necklace, Guild Tome.
 * @param {Int16Array} [initialAssignedSP = [0, 0, 0, 0, 0]] - List of equipment names that make up the build.
 * @return {{assignedSP: SkillPoints, order: number[]}} The SP distribution with the lowest total that allows all items to be equipped.
 */
export function WEOMinimizer(items, initialAssignedSP = new Int16Array(sp_indexes)) {

    // simulate the "second" reversed loop
    const givenTotal = new Int16Array(sp_indexes);
    // merge all given sp
    for (let i = 0; i < items.length; i++) for (let j = 0; j < sp_indexes; j++)
        givenTotal[j] += items[i].given[j];
    // set the minimum assigned SP to be what the item would need in the inverse loop
    for (let item of items)
        for (let j = 0; j < sp_indexes; j++)
            if (item.reqs[j] > 0)
                initialAssignedSP[j] = Math.max(initialAssignedSP[j], item.reqs[j] - (givenTotal[j] - item.given[j]));

    const providingItems = items.filter(item => item.given.some(x => x !== 0));

    return WEOMinimizerLoop(providingItems, initialAssignedSP);
}

/**
 * @description Given a set of items, follows the Wynncraft Equip Order to find the minimum skill points necessary to assign to equip all items.
 * @param items
 * @param {Int16Array} assignedSP
 * @param {*} givenSP
 * @param verify
 * @param currentIndex
 * @param equipped
 * @param {SkillPoints[]} upperBounds - Used to track lower bounds on possible skill point assignments when rejecting to equip an item.
 * @return The optimal SP assignment to satisfy a WEO for a given set of items.
 */
function WEOMinimizerLoop(items, assignedSP = new Int16Array(sp_indexes), givenSP = new Int16Array(sp_indexes), verify = false, currentIndex = 0, equipped = new Array(items.length).fill(false), upperBounds = []) {

    while (verify || currentIndex < items.length) {
        if (currentIndex >= items.length) {
            verify = false;
            currentIndex = 0;
        }

        for (; currentIndex < items.length; currentIndex++) {
            if (equipped[currentIndex]) continue;

            const item = items[currentIndex];

            if (itemCanEquip(item, assignedSP, givenSP))
                equipItem();
            else {
                increaseBranchCount();

                return minimalBranch(
                    addUpperBound(item, items, assignedSP, givenSP, verify, currentIndex, equipped, upperBounds),
                    raiseAssigned(item, items, assignedSP, givenSP, verify, currentIndex, equipped, upperBounds),
                );
            }
        }
    }

    return (equipped.some(x => x !== true)) ? null
        : {assignedSP};

    function equipItem() {
        verify = true;
        equipped[currentIndex] = true;
        for (let i = 0; i < sp_indexes; i++)
            givenSP[i] += items[currentIndex].given[i];
    }
}

function minimalBranch(a, b) {
    if (!a) return b;
    if (!b) return a;
    const aPar = a.assignedSP.reduce((a, b) => a + b) - b.assignedSP.reduce((a, b) => a + b);
    return aPar < 0 ? a : b;
}

function addUpperBound(item, items, assignedSP, givenSP, verify, currentIndex, equipped, upperBounds) {
    const newUpperBound = item.reqs.map((req, i) =>
        (req > 0 && req > assignedSP[i] + givenSP[i])
            ? req - givenSP[i] - 1 : -1);
    return WEOMinimizerLoop(items, [...assignedSP], [...givenSP], verify, currentIndex + 1, [...equipped], [...upperBounds, newUpperBound]);
}

function raiseAssigned(item, items, assignedSP, givenSP, verify, currentIndex, equipped, upperBounds) {
    const newAssigned = item.reqs.map((req, i) => {
        return req === 0 ? assignedSP[i] : Math.max(assignedSP[i], req - givenSP[i]);
    });

    boundLoop: for (let i = 0; i < upperBounds.length; i++) {
        for (let j = 0; j < sp_indexes; j++) {
            if (upperBounds[i][j] === -1) continue;
            if (upperBounds[i][j] >= newAssigned[j])
                continue boundLoop;
        }
        return null;
    }

    return WEOMinimizerLoop(items, newAssigned, [...givenSP], verify, currentIndex, [...equipped], [...upperBounds]);
}
