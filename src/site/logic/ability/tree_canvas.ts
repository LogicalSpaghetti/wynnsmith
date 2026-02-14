import connectionsUrl from "../../../../assets/img/ability/connections.png";
import nodesUrl from "../../../../assets/img/ability/nodes.png";
import {ImageLoader} from "../../common/image_loader.ts";
import {getHoverTextForAbility} from "./ability_description.ts";
import {hideHoverTooltip, renderHoverTooltip} from "../../common/tooltip";
import {type Cell, nodeTypes, type TravelNode, type TreeData} from "./ability_tree.ts";

export class TreeCanvas {
    static readonly columns = 9;
    static readonly cellSize = 18;
    static readonly nodeSize = 32;
    static readonly padding = 7;

    container;
    canvas;
    ctx;

    connections?: HTMLImageElement;
    nodes?: HTMLImageElement;

    tree: TreeData;
    selectedAbilities: string[] = [];

    private readonly rotate: boolean;

    constructor(initialState: TreeData, rotate = false) {
        this.tree = initialState;
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
        canvas.width = TreeCanvas.cellSize * TreeCanvas.columns + TreeCanvas.padding * 2;
        canvas.addEventListener("mousemove", (e) => {
            const tooltip = this.getHoverText(e.clientX, e.clientY);
            if (tooltip) renderHoverTooltip(tooltip);
            else hideHoverTooltip();
        });
        canvas.addEventListener("mouseleave", () => hideHoverTooltip());
        canvas.addEventListener("click", (e) => this.mouseClick(e.clientX, e.clientY));
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

        const totalRows = this.totalRows();
        const totalCols = TreeCanvas.columns;

        const columnPx = totalRows * TreeCanvas.cellSize + TreeCanvas.padding * 2;
        const rowPx = totalCols * TreeCanvas.cellSize + TreeCanvas.padding * 2;

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

    private totalRows(): number {
        return this.tree.properties.pages *
            this.tree.properties.rowsPerPage;
    }

    private getHoverText(mouseX: number, mouseY: number) {
        const abilityID = this.getIDAtLocation(mouseX, mouseY);
        if (!abilityID) return;
        return getHoverTextForAbility(this.tree.abilities, abilityID);
    }

    private mouseClick(mouseX: number, mouseY: number) {
        const abilityID = this.getIDAtLocation(mouseX, mouseY);
        if (!abilityID) return;
        // TODO, use AbilityTree
        if (this.selectedAbilities.includes(abilityID))
            this.selectedAbilities = this.selectedAbilities.filter(a => a !== abilityID);
        else this.selectedAbilities.push(abilityID);
        console.log(this.selectedAbilities)
    }

    private getIDAtLocation(mouseX: number, mouseY: number) {
        const position = this.mouseToCell(mouseX, mouseY);
        if (!position) return;

        const index = position.row * 9 + position.col + 1;
        const cell = this.tree.cellMap[index];
        if (!cell || !cell.abilityID) return;
        return cell.abilityID;
    }

    private mouseToCell(mouseX: number, mouseY: number) {
        const visualPosition = this.mouseToVisualCell(mouseX, mouseY);
        if (!visualPosition) return;

        return this.inverseTransform(visualPosition.row, visualPosition.col);
    }

    private mouseToVisualCell(mouseX: number, mouseY: number): { row: number, col: number } | null {
        const rect = this.canvas.getBoundingClientRect();

        let x = mouseX - rect.left - TreeCanvas.padding;
        let y = mouseY - rect.top - TreeCanvas.padding;

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
}
