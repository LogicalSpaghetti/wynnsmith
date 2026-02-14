import connectionsUrl from "../../../../assets/img/ability/connections.png";
import nodesUrl from "../../../../assets/img/ability/nodes.png";
import {ImageLoader} from "../../common/image_loader.ts";

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

const treeAbilityTypes = ["white", "yellow", "purple", "blue", "red", "skill"] as const;
const nodeTypes = ["white", "yellow", "purple", "blue", "red", "archer", "assassin", "mage", "shaman", "warrior"] as const;

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

export class TreeCanvas {
    static readonly columns = 9;
    static readonly cellSize = 18;
    static readonly nodeSize = 32;
    static readonly padding = 7;

    canvas;
    ctx;

    connections?: HTMLImageElement;
    nodes?: HTMLImageElement;

    tree: TreeData;

    constructor(initialState: TreeData) {
        this.tree = initialState;

        this.canvas = this.initCanvas();
        this.ctx = this.canvas.getContext('2d')!;

        void this.loadAssets();
    }

    private async loadAssets() {
        try {
            [this.connections, this.nodes] = await ImageLoader.loadMany(
                [connectionsUrl, nodesUrl]);
            this.tryDraw();
        } catch (err) {
            console.error("Failed to load assets", err);
        }
    }

    private initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = TreeCanvas.cellSize * TreeCanvas.columns + TreeCanvas.padding * 2;
        return canvas;
    }

    changeState(state: TreeData) {
        this.tree = state;
        this.tryDraw();
    }

    private tryDraw() {
        if (!this.connections || !this.nodes) return;
        const connections = this.connections;
        const nodes = this.nodes;

        this.clearCanvas();

        this.canvas.height = this.tree.properties.pages * this.tree.properties.rowsPerPage * TreeCanvas.cellSize + TreeCanvas.padding * 2;

        this.iter((row, col, cell) => {
            this.drawConnection(connections, row, col, cell.travelNode);
        });
        this.iter((row, col, cell) => {
            this.drawNode(nodes, row, col, cell);
        });
    }

    private drawConnection(
        connections: HTMLImageElement,
        row: number, col: number,
        travelNode: TravelNode,
    ) {
        const position = this.connectionSheetOffset(travelNode);
        this.drawToCell(connections, row, col, position, TreeCanvas.cellSize);
    }

    private drawNode(
        nodes: HTMLImageElement,
        row: number, col: number,
        cell: Cell,
    ) {
        if (!cell.abilityID) return;
        const position = this.abilityNodeSheetOffset(cell.abilityID);
        this.drawToCell(nodes, row, col, position, TreeCanvas.nodeSize);
    }

    private drawToCell(
        spriteSheet: HTMLImageElement,
        row: number, col: number,
        sheetOffset: { x: number, y: number },
        iconSize: number,
    ) {
        const size = TreeCanvas.cellSize;
        const offset = (iconSize - size) / 2;
        const dx = size * col;
        const dy = size * row;
        this.ctx.drawImage(
            spriteSheet,
            sheetOffset.x * iconSize, sheetOffset.y * iconSize, iconSize, iconSize,
            dx - offset + TreeCanvas.padding, dy - offset + TreeCanvas.padding, iconSize, iconSize,
        );
    }

    private connectionSheetOffset({up, down, left, right}: TravelNode) {
        return {
            x: (up + 2 * down),
            y: (left + 2 * right),
        };
    }

    private abilityNodeSheetOffset(abilityID: string) {
        const nodeType = this.tree.abilities[abilityID].type;
        return {
            x: nodeTypes.indexOf((nodeType !== "skill") ? nodeType : this.tree.properties.classs),
            y: 2,
        };
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private iter(fun: (row: number, col: number, cell: Cell) => void) {
        for (const key in this.tree.cellMap) {
            const index = parseInt(key) - 1;
            let row = Math.floor(index / TreeCanvas.columns);
            let col = index % TreeCanvas.columns;

            fun(row, col, this.tree.cellMap[key]);
        }
    }
}
