import connectionsUrl from "../../../../assets/img/ability/connections.png";
import nodesUrl from "../../../../assets/img/ability/nodes.png";
import {ImageLoader} from "../../common/image_loader.ts";
import {getHoverTextForAbility} from "./ability_description.ts";
import {hideHoverTooltip, renderHoverTooltip} from "../../common/tooltip";
import {AbilityTree, type Cell, nodeTypes, type TravelNode} from "./ability_tree.ts";

export class TreeCanvas {
    static readonly columns = 9;

    static readonly scalar = 1.5;
    static readonly cellSize = 18;

    static readonly connectorSize = 18;
    static readonly nodeSize = 32;
    static readonly padding = 7;

    private readonly container;
    private readonly canvas;
    private ctx;

    private connections?: HTMLImageElement;
    private nodes?: HTMLImageElement;

    private tree: AbilityTree;

    private readonly rotate: boolean;

    constructor(wynnClass: string, rotate = false) {
        this.tree = new AbilityTree(wynnClass);
        this.rotate = rotate;

        this.container = this.initContainer();

        this.canvas = this.initCanvas();
        this.container.appendChild(this.canvas);
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

    private initContainer() {
        const container = document.createElement("div");
        container.classList.add("ability-tree");
        return container;
    }

    private initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.addEventListener("mousemove", (e) => {
            const tooltip = this.getHoverText(e.clientX, e.clientY);
            if (tooltip) renderHoverTooltip(tooltip);
            else hideHoverTooltip();
        });
        canvas.addEventListener("mouseleave", () => hideHoverTooltip());
        canvas.addEventListener("click", (e) => this.mouseClick(e.clientX, e.clientY));
        return canvas;
    }

    holder() {
        return this.container;
    }

    changeState(wynnClass: string) {
        this.tree.changeClass(wynnClass);
        this.tryDraw();
    }

    private tryDraw() {
        if (!this.connections || !this.nodes) return;
        const connections = this.connections;
        const nodes = this.nodes;

        this.clearCanvas();

        const totalRows = this.totalRows();
        const totalCols = TreeCanvas.columns;

        const columnPx = (totalRows * TreeCanvas.cellSize + TreeCanvas.padding * 2) * TreeCanvas.scalar;
        const rowPx = (totalCols * TreeCanvas.cellSize + TreeCanvas.padding * 2) * TreeCanvas.scalar;

        if (this.rotate) {
            this.canvas.width = columnPx;
            this.canvas.height = rowPx;
        } else {
            this.canvas.width = rowPx;
            this.canvas.height = columnPx;
        }

        this.iter((row, col, cell) => {
            const t = this.transform(row, col);
            const rotatedTravel = this.transformTravelNode(cell.travelNode);
            this.drawConnection(connections, t.row, t.col, rotatedTravel);
        });
        this.iter((row, col, cell) => {
            const t = this.transform(row, col);
            this.drawNode(nodes, t.row, t.col, cell);
        });
    }


    private transform(row: number, col: number): { row: number, col: number } {
        if (!this.rotate) return {row, col};
        return {
            row: TreeCanvas.columns - 1 - col,
            col: row,
        };
    }

    private inverseTransform(row: number, col: number): { row: number, col: number } {
        if (!this.rotate) return {row, col};
        return {
            row: col,
            col: TreeCanvas.columns - 1 - row,
        };
    }

    private transformTravelNode(node: TravelNode): TravelNode {
        if (!this.rotate) return node;

        return {
            up: node.right,
            right: node.down,
            down: node.left,
            left: node.up,
        };
    }

    private drawConnection(
        connections: HTMLImageElement,
        row: number, col: number,
        travelNode: TravelNode,
    ) {
        const position = this.connectionSheetOffset(travelNode);
        this.drawToCell(connections, row, col, position, TreeCanvas.connectorSize);
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
        const finalSize = iconSize * TreeCanvas.scalar;
        const size = TreeCanvas.cellSize * TreeCanvas.scalar;
        const offset = (finalSize - size) / 2;
        const dx = size * col;
        const dy = size * row;
        this.ctx.drawImage(
            spriteSheet,
            sheetOffset.x * iconSize, sheetOffset.y * iconSize, iconSize, iconSize,
            dx - offset + TreeCanvas.padding, dy - offset + TreeCanvas.padding, finalSize, finalSize,
        );
    }

    private connectionSheetOffset({up, down, left, right}: TravelNode) {
        return {
            x: (up + 2 * down),
            y: (left + 2 * right),
        };
    }

    private abilityNodeSheetOffset(abilityID: string) {
        const nodeType = this.tree.data.abilities[abilityID].type;
        return {
            x: nodeTypes.indexOf((nodeType !== "skill") ? nodeType : this.tree.data.properties.classs),
            y: this.tree.selectedAbilities.includes(abilityID) ? 4 : 2,
        };
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private iter(fun: (row: number, col: number, cell: Cell) => void) {
        for (const key in this.tree.data.cellMap) {
            const index = parseInt(key) - 1;
            let row = Math.floor(index / TreeCanvas.columns);
            let col = index % TreeCanvas.columns;

            if (this.isSkippedRow(row)) continue;
            const visualRow = this.toVisualRow(row);

            fun(visualRow, col, this.tree.data.cellMap[key]);
        }
    }

    private totalRows(): number {
        const total =
            this.tree.data.properties.pages *
            this.tree.data.properties.rowsPerPage;

        const skipped = Math.floor((total - 1) / this.tree.data.properties.rowsPerPage);
        return total - skipped;
    }

    private getHoverText(mouseX: number, mouseY: number) {
        const abilityID = this.getIDAtLocation(mouseX, mouseY);
        if (!abilityID) return;
        return getHoverTextForAbility(this.tree.data.abilities, abilityID);
    }

    private mouseClick(mouseX: number, mouseY: number) {
        const abilityID = this.getIDAtLocation(mouseX, mouseY);
        if (!abilityID) return;
        this.tree.selectAbility(abilityID);
        this.tryDraw();
    }

    private getIDAtLocation(mouseX: number, mouseY: number) {
        const position = this.mouseToCell(mouseX, mouseY);
        if (!position) return;

        const index = position.row * 9 + position.col + 1;
        const cell = this.tree.data.cellMap[index];
        if (!cell || !cell.abilityID) return;
        return cell.abilityID;
    }

    private mouseToCell(mouseX: number, mouseY: number) {
        const visualPosition = this.mouseToVisualCell(mouseX, mouseY);
        if (!visualPosition) return;

        let row = visualPosition.row;
        let col = visualPosition.col;

        if (!this.rotate) {
            row = this.toDataRow(row);
        } else {
            col = this.toDataRow(col);
        }

        return this.inverseTransform(row, col);
    }

    private mouseToVisualCell(mouseX: number, mouseY: number): { row: number, col: number } | null {
        const rect = this.canvas.getBoundingClientRect();

        let x = (mouseX - rect.left - TreeCanvas.padding) / TreeCanvas.scalar;
        let y = (mouseY - rect.top - TreeCanvas.padding) / TreeCanvas.scalar;

        if (x < 0 || y < 0) return null;

        const col = Math.floor(x / TreeCanvas.cellSize);
        const row = Math.floor(y / TreeCanvas.cellSize);

        if (!this.rotate) {
            if (col >= TreeCanvas.columns) return null;
            if (row >= this.totalRows()) return null;
        } else {
            if (col >= this.totalRows()) return null;
            if (row >= TreeCanvas.columns) return null;
        }

        return {row, col};
    }

    private toDataRow(visualRow: number): number {
        if (visualRow <= (this.tree.data.properties.rowsPerPage - 1)) return visualRow;

        const skippedBefore = Math.floor((visualRow - 1) / (this.tree.data.properties.rowsPerPage - 1));
        return visualRow + skippedBefore;
    }


    private toVisualRow(row: number): number {
        if (row === 0) return 0;

        // number of skipped rows before this row
        const skippedBefore = Math.floor(row / this.tree.data.properties.rowsPerPage);
        return row - skippedBefore;
    }

    private isSkippedRow(row: number): boolean {
        return row !== 0 && row % this.tree.data.properties.rowsPerPage === 0;
    }
}
