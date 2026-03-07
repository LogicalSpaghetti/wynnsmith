import connectionsUrl from "../../../assets/img/ability/connections.png";
import activeUrl from "../../../assets/img/ability/active_connections.png";
import nodesUrl from "../../../assets/img/ability/nodes.png";
import {ImageLoader} from "../../database/image_loader.ts";
import {hideHoverTooltip} from "../../hover_html/tooltip";
import {
    AbilityTree,
    type BranchState,
    type Cell,
    nodeTypes,
    type TravelNode,
} from "./ability_tree.ts";
import {EventTarget} from "../../change_handling/event_target.ts";

const nodeStateOffsets = ["blocked", "unavailable", "available", "error", "selected"] as const;

export type TreeLocation = { row: number, col: number };

type TreeCanvasEvents = {
    requestTree: void
    startSwipe: TreeLocation | null
    continueSwipe: TreeLocation | null;
    endSwipe: void
    hover: TreeLocation | null;
    click: TreeLocation | null;
};

// TODO: this class is doing way too much, make a deeper layer, holding the displays and computers for all parts of the tree/aspects
//  Make Aspects first
export class TreeCanvas extends EventTarget<TreeCanvasEvents> {
    static readonly scalar = 1;
    static readonly cellSize = 18;

    static readonly connectorSize = 18;
    static readonly nodeSize = 32;
    static readonly padding = 7;

    private readonly container;
    private readonly canvas;
    private ctx;

    private connections?: HTMLImageElement;
    private activeConnections?: HTMLImageElement;
    private nodes?: HTMLImageElement;

    pages: number = 0;
    rowsPerPage: number = 0;

    constructor() {
        super();

        this.container = this.initContainer();

        this.canvas = this.initCanvas();
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;

        void this.loadAssets();
    }

    private async loadAssets() {
        try {
            [this.connections, this.activeConnections, this.nodes] = await ImageLoader.loadMany(
                [connectionsUrl, activeUrl, nodesUrl]);
            this.dispatchEvent("requestTree");
        } catch (err) {
            console.error("Failed to load assets", err);
        }
    }

    private initContainer() {
        const container = document.createElement("div");
        container.classList.add("ability-tree");
        return container;
    }

    private initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.addEventListener("mousemove", (e) =>
            this.dispatchEvent("hover", this.mouseToCell(e.clientX, e.clientY)));
        canvas.addEventListener("mouseleave", () => hideHoverTooltip());

        canvas.addEventListener("mousedown", (e) =>
            this.dispatchEvent("startSwipe", this.mouseToCell(e.clientX, e.clientY)));
        canvas.addEventListener("mousemove", (e) => e.buttons === 1 // 1 indicates left-click
            ? this.dispatchEvent("continueSwipe", this.mouseToCell(e.clientX, e.clientY))
            : this.dispatchEvent("endSwipe"));

        canvas.addEventListener("click", (e) =>
            this.dispatchEvent("click", this.mouseToCell(e.clientX, e.clientY)));

        return canvas;
    }

    public tryDraw(tree: AbilityTree) {
        if (!this.connections || !this.nodes || !this.activeConnections) return;

        this.rowsPerPage = tree.data.properties.rowsPerPage;
        this.pages = tree.data.properties.pages;

        const connections = this.connections;
        const selected = this.activeConnections;
        const nodes = this.nodes;

        this.clearCanvas();

        const totalRows = this.totalRows();
        const totalCols = AbilityTree.columns;

        this.canvas.height = (totalRows * TreeCanvas.cellSize + TreeCanvas.padding * 2) * TreeCanvas.scalar;
        this.canvas.width = (totalCols * TreeCanvas.cellSize + TreeCanvas.padding * 2) * TreeCanvas.scalar;

        this.iter((loc, cellIndex) => {
            const cell = tree.getCell(cellIndex);
            console.log(loc, cellIndex);
            if (cell) this.drawConnection(connections, loc, cell.travelNode);
        });
        this.iter((loc, cellIndex) => {
            const cell = tree.getStateOfConnection(cellIndex);
            if (cell) this.drawConnection(selected, loc, this.branchToTravelNode(cell));
        });
        this.iter((loc, cellIndex) => {
            const cell = tree.getCell(cellIndex);
            if (cell) this.drawNode(tree, nodes, loc, cell);
        });
    }

    private drawConnection(
        connections: HTMLImageElement,
        loc: TreeLocation,
        travelNode: TravelNode,
    ) {
        const position = this.connectionSheetOffset(travelNode);
        this.drawToCell(connections, loc, position, TreeCanvas.connectorSize);
    }

    private drawNode(
        tree: AbilityTree,
        nodes: HTMLImageElement,
        loc: TreeLocation,
        cell: Cell,
    ) {
        if (!cell.abilityID) return;
        const position = this.abilityNodeSheetOffset(tree, cell.abilityID);
        this.drawToCell(nodes, loc, position, TreeCanvas.nodeSize);
    }

    private drawToCell(
        spriteSheet: HTMLImageElement,
        loc: TreeLocation,
        sheetOffset: { x: number, y: number },
        iconSize: number,
    ) {
        const finalSize = iconSize * TreeCanvas.scalar;
        const size = TreeCanvas.cellSize * TreeCanvas.scalar;
        const offset = (finalSize - size) / 2;
        const dx = size * loc.col;
        const dy = size * loc.row;
        this.ctx.drawImage(
            spriteSheet,
            sheetOffset.x * iconSize, sheetOffset.y * iconSize, iconSize, iconSize,
            dx - offset + TreeCanvas.padding, dy - offset + TreeCanvas.padding, finalSize, finalSize,
        );
    }

    private connectionSheetOffset({up, down, left, right}: TravelNode) {
        return {
            x: (2 * left + right),
            y: (2 * up + down),
        };
    }

    private branchToTravelNode(node: TravelNode | BranchState) {
        return {
            up: node.up ? 1 : 0,
            down: node.down ? 1 : 0,
            left: node.left ? 1 : 0,
            right: node.right ? 1 : 0,
        };
    }

    private abilityNodeSheetOffset(tree: AbilityTree, abilityID: string) {
        const nodeType = tree.data.abilities[abilityID].type;
        return {
            x: nodeTypes.indexOf((nodeType !== "skill") ? nodeType : tree.data.properties.classs),
            y: nodeStateOffsets.indexOf(tree.getStateOfNode(abilityID)),
        };
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private iter(fun: (location: TreeLocation, cellIndex: number) => void) {
        for (let i = 0; i < this.pages * this.rowsPerPage * AbilityTree.columns; i++) {
            let row = Math.floor(i / AbilityTree.columns);
            let col = i % AbilityTree.columns;

            if (this.isSkippedRow(row)) continue;
            const visualRow = this.toVisualRow(row);

            fun({row: visualRow, col: col}, i + 1);
        }
    }

    private totalRows(): number {
        const total = this.pages * this.rowsPerPage;
        const skipped = Math.floor((total - 1) / this.rowsPerPage);
        return total - skipped;
    }

    private mouseToCell(mouseX: number, mouseY: number) {
        const visualPosition = this.mouseToVisualCell(mouseX, mouseY);
        if (!visualPosition) return null;

        let row = visualPosition.row;
        let col = visualPosition.col;

        row = this.toDataRow(row);

        return {row, col};
    }

    // TODO: may be out of bounds
    private mouseToVisualCell(mouseX: number, mouseY: number): { row: number, col: number } | null {
        const rect = this.canvas.getBoundingClientRect();

        let x = (mouseX - rect.left - TreeCanvas.padding) / TreeCanvas.scalar;
        let y = (mouseY - rect.top - TreeCanvas.padding) / TreeCanvas.scalar;

        if (x < 0 || y < 0) return null;

        const col = Math.floor(x / TreeCanvas.cellSize);
        const row = Math.floor(y / TreeCanvas.cellSize);

        if (col >= AbilityTree.columns) return null;

        return {row, col};
    }

    private toDataRow(visualRow: number): number {
        if (visualRow <= (this.rowsPerPage - 1)) return visualRow;

        const skippedBefore = Math.floor((visualRow - 1) / (this.rowsPerPage - 1));
        return visualRow + skippedBefore;
    }

    private toVisualRow(row: number): number {
        if (row === 0) return 0;

        // number of skipped rows before this row
        const skippedBefore = Math.floor(row / this.rowsPerPage);
        return row - skippedBefore;
    }

    private isSkippedRow(row: number): boolean {
        return row !== 0 && row % this.rowsPerPage === 0;
    }

    public holder() {
        return this.container;
    }
}
