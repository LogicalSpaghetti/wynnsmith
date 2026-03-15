import {treeDatabase} from "../../database/tree_database.ts";
import {type HistoryEvents, HistoryTarget} from "../../change_handling/history.ts";
import {TreeCanvas, type TreeLocation} from "./ability_tree_canvas.ts";
import {getHoverTextForAbility} from "../../hover_html/ability_description.ts";
import {hideHoverTooltip, renderHoverTooltip} from "../../hover_html/tooltip.ts";

const abilityPointsAtLevel = [
    0,
    1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
    6, 7, 8, 8, 9, 9, 10, 11, 11, 12,
    12, 13, 14, 15, 15, 16, 16, 17, 17, 18,
    18, 19, 19, 20, 20, 20, 21, 21, 22, 22,
    23, 23, 23, 24, 24, 25, 25, 26, 26, 27,
    27, 28, 28, 29, 29, 30, 30, 31, 31, 32,
    32, 33, 33, 34, 34, 34, 35, 35, 35, 36,
    36, 36, 37, 37, 37, 38, 38, 38, 38, 39,
    39, 39, 39, 40, 40, 40, 40, 41, 41, 41,
    41, 42, 42, 42, 42, 43, 43, 43, 43, 44,
    44, 44, 44, 45, 45,
];

export const wynnClasses = ["archer", "assassin", "mage", "shaman", "warrior"] as const;
export type ClassName = typeof wynnClasses[number];

const directions = ["up", "down", "left", "right"] as const;
const inverseDirs: Record<Direction, Direction> = {
    up: "down", down: "up", left: "right", right: "left",
} as const;
type Direction = "up" | "down" | "left" | "right";


export type TreeData = {
    abilities: TreeAbilities
    cellMap: CellMap
    properties: TreeProperties
    startingAbilityID: string
    archetypes: string[]
};

export type CellMap = { [key: string | number]: Cell }
export type Cell = { travelNode: TravelNode, abilityID?: string }
export type TravelNode = { up: number, down: number, left: number, right: number }


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

export type BranchState = {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
}

type NodeState = {
    readonly coordinate: string
    selected: boolean
    reachable: boolean
    blocked: boolean
    error: boolean
    unavailable: boolean
}
type NodeStates = { [key: string | number]: NodeState }

type TreeEvents = {
    change: void
} & HistoryEvents

export type NodeHighlight = "selected" | "error" | "blocked" | "available" | "unavailable"

// Handles node selection and tallying for ability trees
export class AbilityTree<Events extends TreeEvents = TreeEvents> extends HistoryTarget<Events> {
    static readonly columns = 9;
    static readonly dirOffsets = {
        up: -AbilityTree.columns,
        down: AbilityTree.columns,
        left: -1,
        right: 1,
    } as const;

    canvas: TreeCanvas;

    data: TreeData;
    wynnClass;
    level;

    private usedAP = 0;
    private maxAP = 45;

    private selectedAbilities: string[] = [];
    private archetypePoints: { [key: string]: number } = {};
    // TODO: give proper typing, i.e. "selected" | "error" | ...
    private nodeStates: { [key: string]: NodeHighlight } = {};
    private connectionHighlights: { [key: string]: BranchState } = {};

    private swipeSelects: boolean = true;
    private swipeID?: string;

    constructor(wynnClass: string, level: number) {
        super();
        this.level = level;
        this.data = treeDatabase.getTree(wynnClass);
        this.wynnClass = this.data.properties.classs;

        this.canvas = this.initCanvas();

        this.updateStates();
    }

    private initCanvas() {
        const canvas = new TreeCanvas();
        canvas.addEventListener("requestTree", () => this.canvas.tryDraw(this));
        canvas.addEventListener("startSwipe", (loc) => this.startSwipe(loc));
        canvas.addEventListener("continueSwipe", (loc) => this.continueSwipe(loc));
        canvas.addEventListener("endSwipe", () => this.endSwipe());
        canvas.addEventListener("hover", (loc) => this.hoverOver(loc));
        canvas.addEventListener("click", (loc) => this.clickCell(loc));
        return canvas;
    }

    private startSwipe(loc: TreeLocation | null) {
        if (!loc) {
            this.swipeSelects = true;
            return;
        }
        const index = loc.row * AbilityTree.columns + loc.col + 1;
        const cell = this.data.cellMap[index];
        const id = cell?.abilityID;
        this.swipeSelects = !(id != null && this.abilityIsSelected(id));
    }

    private continueSwipe(loc: TreeLocation | null) {

        const newID = loc ? this.getCellAt(loc)?.abilityID : undefined;
        if (newID === this.swipeID) return;
        this.swipeID = newID;

        if (!newID) return;
        if (this.swipeSelects) this.selectAbility(newID);
        else this.deselectAbility(newID);
    }

    private endSwipe() {
        this.swipeID = undefined;
        this.swipeSelects = true;
    }

    private clickCell(loc: TreeLocation | null) {
        if (loc == null) return;
        const id = this.getCellAt(loc)?.abilityID;
        if (!id || id === this.swipeID) return;
        this.endSwipe();
        this.toggleAbility(id);
    }

    private hoverOver(loc: TreeLocation | null) {
        const tooltip = this.getHoverText(loc);
        if (tooltip == null) hideHoverTooltip();
        else renderHoverTooltip(tooltip);
    }

    private getHoverText(loc: TreeLocation | null) {
        if (!loc) return null;
        const abilityID = this.getCellAt(loc)?.abilityID;
        if (!abilityID) return;
        return getHoverTextForAbility(this.data.abilities, this.data.abilities[abilityID]);
    }

    public getCellAt(loc: TreeLocation): Cell | undefined {
        return this.getCell(this.locationToIndex(loc));
    }

    public getCell(index: number): Cell | undefined {
        return this.data.cellMap[index];
    }

    private locationToIndex(loc: TreeLocation) {
        return loc.row * AbilityTree.columns + loc.col + 1;
    }

    public changeLevel(level: number) {
        this.level = level;
        this.updateStates();
    }

    public changeClass(wynnClass: ClassName) {
        this.changeState(() => this.setClass(wynnClass));
    }

    public abilityIsSelected(id: string) {
        return this.selectedAbilities.includes(id);
    }

    private setClass(wynnClass: ClassName) {
        if (wynnClass === this.wynnClass) return;
        this.wynnClass = wynnClass;
        this.data = treeDatabase.getTree(wynnClass);
        this.selectedAbilities = [];
        this.updateStates();
    }

    public selectAbility(id: string) {
        if (!this.abilityIsSelected(id)) this.toggleAbility(id);
    }

    public deselectAbility(id: string) {
        if (this.abilityIsSelected(id)) this.toggleAbility(id);
    }

    public toggleAbility(abilityID: string) {
        this.changeState(() => this.modifySelectedAbilities(abilityID));
    }

    public clearSelection() {
        this.changeState(() => this.selectedAbilities = []);
    }

    public clearErrors() {
        this.changeState(() => {
            this.selectedAbilities = this.selectedAbilities.filter(abilityID => this.nodeStates[abilityID] !== "error");
        });
    }

    private modifySelectedAbilities(abilityID: string) {
        if (this.selectedAbilities.includes(abilityID))
            this.selectedAbilities = this.selectedAbilities.filter(a => a !== abilityID);
        else this.selectedAbilities.push(abilityID);
    }

    public getAPState() {
        return {
            usedAP: this.usedAP,
            maxAP: this.maxAP,
        };
    }

    private getState() {
        return {
            wynnClass: this.wynnClass,
            selectedAbilities: [...this.selectedAbilities],
        };
    }

    public getStateOfNode(abilityID: string) {
        return this.nodeStates[abilityID];
    }

    public getStateOfConnection(cellIndex: string | number) {
        return this.connectionHighlights[cellIndex];
    }

    private updateStates() {
        const tree = this.data;

        this.usedAP = 0;
        const highlightState = new MapState(tree, this.selectedAbilities);
        const unvalidatedIDs = Object.keys(tree.abilities);

        this.archetypePoints = {};
        for (let archetype of tree.archetypes)
            this.archetypePoints[archetype] = 0;

        for (let i = 0; i < unvalidatedIDs.length;) {
            const id = unvalidatedIDs[i];
            const node = highlightState.getNode(id);
            const ability = tree.abilities[id];

            if (!node.selected) {
                unvalidatedIDs.splice(i, 1);
                i = 0;
            } else if (node.blocked || ability.requires !== -1 && !highlightState.getNode(ability.requires).selected) {
                node.error = true;
                unvalidatedIDs.splice(i, 1);
                i = 0;
            } else if (node.reachable && this.abilityMeetsReq(ability)) {
                highlightState.propagateHighlightFromNode(parseInt(node.coordinate));
                if (ability.archetype !== "") this.archetypePoints[ability.archetype] += 1;
                unvalidatedIDs.splice(i, 1);
                i = 0;
                this.usedAP += ability.pointsRequired;
            } else i++;
        }

        for (let nodeID in this.data.abilities) {
            const ability = this.data.abilities[nodeID];
            const state = highlightState.getNode(nodeID);

            if (!state.selected)
                if (ability.archetypePointsRequired > this.archetypePoints[ability.archetype])
                    state.unavailable = true;
        }

        for (const id of unvalidatedIDs) highlightState.getNode(id).error = true;

        this.maxAP = abilityPointsAtLevel[this.level] ?? tree.properties.maxAbilityPoints;

        for (let nodeID in this.data.abilities) {
            const ability = this.data.abilities[nodeID];
            const state = highlightState.getNode(nodeID);
            if (!state.selected && this.maxAP < this.usedAP + ability.pointsRequired) state.unavailable = true;
        }

        this.connectionHighlights = highlightState.highlights;
        this.nodeStates = highlightState.nodesToStatus();

        this.canvas.tryDraw(this);
        this.dispatchEvent("change");
    }

    private abilityMeetsReq(ability: TreeAbility) {
        return ability.archetypePointsRequired <= 0 || ability.archetypePointsRequired <= this.archetypePoints[ability.archetype];
    }

    private changeState(changeFunction: () => void) {
        const before = this.getState();
        changeFunction();
        const after = this.getState();

        if (before.wynnClass === after.wynnClass && stringArraysEqual(before.selectedAbilities, after.selectedAbilities)) return;

        this.dispatchEvent("log", {
            undo: () => this.applyState(before),
            redo: () => this.applyState(after),
        });

        this.updateStates();
    }

    private applyState(state: { wynnClass: ClassName, selectedAbilities: string[] }) {
        this.setClass(state.wynnClass);
        this.selectedAbilities = state.selectedAbilities;
        this.updateStates();
    }

    public holder() {
        return this.canvas.holder();
    }
}

class MapState {
    private readonly tree;
    readonly nodes: NodeStates;
    readonly highlights: { [key: string]: BranchState };

    constructor(treeData: TreeData, selectedAbilities: string[]) {
        this.tree = treeData;
        this.nodes = this.newNodeStates(selectedAbilities);
        this.highlights = this.newHighlightStates();
    }

    getNode(abilityID: string | number) {
        return this.nodes[abilityID];
    }

    getHighlight(mapPos: string | number) {
        return this.highlights[mapPos];
    }

    getValidDirections(sourceIndex: number, sourceDirection: Direction | null, nodeIndex: number) {
        const sourceCell = this.tree.cellMap[sourceIndex];
        return directions.filter(direction => {
            // if the node is going up
            if (!this.tree.properties.bTravesableUp && direction === "up") return false;
            // if the cell doesn't go in this direction
            if (sourceCell.travelNode[direction] === 0) return false;
            // if this is the same direction it came from
            if (sourceDirection && inverseDirs[sourceDirection] === direction) return false;

            // left on left edge or right on right edge
            if (!this.tree.properties.loopTree && sourceIndex % AbilityTree.columns === 1 && direction === "left")
                return false;
            if (!this.tree.properties.loopTree && sourceIndex % AbilityTree.columns === 0 && direction === "right")
                return false;

            let destIndex = this.getDestinationForDirection(sourceIndex, direction);

            if ((direction === "left" || direction === "right"))
                if (MapState.getRow(nodeIndex) !== MapState.getRow(destIndex))
                    return false;

            const destCell = this.tree.cellMap[destIndex];

            // if it's not an occupied cell
            if (!destCell) return false;
            // if it connects
            return destCell.travelNode[inverseDirs[direction]] !== 0;
        });
    }

    static getRow(index: number) {
        return Math.floor((index - 1) / AbilityTree.columns);
    }

    private getDestinationForDirection(sourceIndex: number, dir: Direction) {
        let destIndex = sourceIndex + AbilityTree.dirOffsets[dir];
        if (this.tree.properties.loopTree)
            if (sourceIndex % AbilityTree.columns === 1 && dir === "left") destIndex += AbilityTree.columns;
            else if (sourceIndex % AbilityTree.columns === 0 && dir === "right") destIndex -= AbilityTree.columns;
        return destIndex;
    }

    propagateHighlightFromNode(nodeIndex: number) {
        this.propagateHighlightFrom(nodeIndex, null, nodeIndex);
    }

    private propagateHighlightTo(destIndex: number, sourceDir: Direction, nodeIndex: number) {
        const cell = this.tree.cellMap[destIndex];
        const node = cell.abilityID ? this.nodes[cell.abilityID] : null;
        if (node) {
            node.reachable = true;
            return node.selected;
        } else
            return this.propagateHighlightFrom(destIndex, sourceDir, nodeIndex);
    }

    private propagateHighlightFrom(sourceIndex: number, sourceDir: Direction | null, nodeIndex: number) {
        const cell = this.getHighlight(sourceIndex);

        let success = false;

        for (const direction of this.getValidDirections(sourceIndex, sourceDir, nodeIndex)) {
            if (this.propagateHighlightTo(this.getDestinationForDirection(sourceIndex, direction), direction, nodeIndex)) {
                cell[direction] = true;
                if (sourceDir) cell[inverseDirs[sourceDir]] = true;
                success = true;
            }
        }

        return success;
    }

    private abilityIsBlocked(abilityID: string, selectedAbilities: string[]) {
        const exclusives = this.tree.abilities[abilityID].unlockingWillBlock;
        for (const id of exclusives)
            if (selectedAbilities.includes(String(id)))
                return true;
        return false;
    };

    private abilityHasParent(abilityID: string, selectedAbilities: string[]) {
        const req = this.tree.abilities[abilityID].requires;
        return req === -1 || selectedAbilities.includes(String(req));
    }

    private newNodeStates(selectedAbilities: string[]) {
        const nodes: NodeStates = {};
        for (let coordinate in this.tree.cellMap) {
            const cell = this.tree.cellMap[coordinate];
            const abilityID = cell.abilityID;
            if (!abilityID) continue;

            nodes[abilityID] = {
                coordinate: coordinate,
                selected: selectedAbilities.includes(abilityID),
                blocked: this.abilityIsBlocked(abilityID, selectedAbilities),
                reachable: abilityID === this.tree.startingAbilityID,
                error: false,
                unavailable: !this.abilityHasParent(abilityID, selectedAbilities),
            };
        }
        return nodes;
    }

    private newHighlightStates() {
        const states: { [key: string]: BranchState } = {};
        const cellMap = this.tree.cellMap;
        for (const key in cellMap) {
            states[key] = {
                up: false,
                down: false,
                left: false,
                right: false,
            };
        }
        return states;
    }

    nodesToStatus() {
        const result: { [key: string]: NodeHighlight } = {};
        for (const nodeID in this.nodes) {
            result[nodeID] = MapState.nodeToStatus(this.nodes[nodeID]);
        }
        return result;
    }

    private static nodeToStatus(node: NodeState): NodeHighlight {
        if (node.error) return "error";
        if (node.selected) return "selected";
        if (node.blocked) return "blocked";
        if (node.unavailable) return "unavailable";
        if (node.reachable) return "available";
        return "unavailable";
    }
}

function stringArraysEqual(a: string[], b: string[]) {
    return a.length === b.length &&
        a.every((value, index) => value === b[index]);
}