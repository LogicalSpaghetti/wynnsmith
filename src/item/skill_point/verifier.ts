import {sp_indexes} from "./skill_points.ts";

type SimpleItem = {
    reqs: number[],
    given: number[]
}

// TODO: take in weapons, gear, and modified SP, output total SP assignment and remaining SP

export function optimizeGear(items: SimpleItem[], assignedSP = [0, 0, 0, 0, 0]): number[] {
    const minimum = [...assignedSP];

    const given = sumGiven(items);
    for (const item of items)
        for (let i = 0; i < sp_indexes; i++)
            if (item.reqs[i] > 0)
                minimum[i] = Math.max(minimum[i], item.reqs[i] + item.given[i] - given[i]);

    return minimum;
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
