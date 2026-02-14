import {treeDatabase} from "./tree_database.ts";

type dir = number

export const wynnClasses = ["archer", "assassin", "mage", "shaman", "warrior"] as const;

export type TreeData = { abilities: TreeAbilities, cellMap: CellMap, properties: TreeProperties };

export type CellMap = { [key: string | number]: Cell }
export type Cell = { travelNode: TravelNode, abilityID?: string }
export type TravelNode = { up: dir, down: dir, left: dir, right: dir }


export type TreeAbilities = {
    [key: string | number]: TreeAbility
}

export type TreeAbility = {
    readonly name: string,
    readonly _plainname: string,
    readonly description: string,
    readonly unlockingWillBlock: readonly number[],
    readonly archetype: string,
    readonly pointsRequired: number,
    readonly archetypePointsRequired: number,
    readonly type: typeof treeAbilityTypes[number],
    readonly requires: number
}

export const treeAbilityTypes = ["white", "yellow", "purple", "blue", "red", "skill"] as const;
export const nodeTypes = ["white", "yellow", "purple", "blue", "red", "archer", "assassin", "mage", "shaman", "warrior"] as const;

export type TreeProperties = {
    classs: ClassName,
    maxAbilityPoints: number,
    pages: number,
    horizontalPages: number,
    rowsPerPage: number,
    loopTree: boolean,
    bTravesableUp: boolean,
    useAlternativeAbilityIcons: boolean,
}

type ClassName = typeof wynnClasses[number];

// Handles node selection and tallying for ability trees
export class AbilityTree {
    data: TreeData;

    selectedAbilities: string[] = [];
    archetypePoints: { [key: string]: number } = {};

    constructor(wynnClass: string) {
        this.data = treeDatabase.getTree(wynnClass);
    }

    changeClass(wynnClass: string) {
        this.data = treeDatabase.getTree(wynnClass);
        // TODO: refresh
    }

    selectAbility(abilityID: string) {
        if (this.selectedAbilities.includes(abilityID))
            this.selectedAbilities = this.selectedAbilities.filter(a => a !== abilityID);
        else this.selectedAbilities.push(abilityID);
    }
}