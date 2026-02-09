import connectionsUrl from "../../../assets/img/ability/connections.png";

type dir = number

export type Cell = { travelNode: TravelNode, abilityID?: string }
export type CellMap = { [key: string | number]: Cell }
export type TravelNode = { up: dir, down: dir, left: dir, right: dir }

export class TreeCanvas {
    static readonly columns = 9;
    static readonly rows = 6 * 8;
    static readonly tileSize: number = 18;

    canvas;
    ctx;

    connections;

    loadingComplete: boolean = false;

    state: CellMap;

    constructor(initialState: CellMap) {
        this.state = initialState;

        this.canvas = document.createElement("canvas");
        this.canvas.width = TreeCanvas.tileSize * TreeCanvas.columns;
        this.canvas.height = TreeCanvas.tileSize * TreeCanvas.rows;

        this.ctx = this.canvas.getContext('2d')!;

        this.connections = new Image();
        this.connections.src = connectionsUrl;

        if (!this.connections.complete) {
            this.connections.addEventListener('load', () => this.imageLoad());
            this.connections.addEventListener('error', () => this.imageLoad());
        }

        this.imageLoad();
    }

    private imageLoad() {
        this.loadingComplete = this.connections.complete;
        if (this.loadingComplete) {
            this.connections.removeEventListener('load', this.imageLoad);
            this.connections.removeEventListener('error', this.imageLoad);
            this.draw();
        }
    }

    changeState(state: CellMap) {
        this.erasePrevious();
        this.state = state;
        this.tryDraw();
    }

    static spritePositionToImagePosition({up, down, left, right}: TravelNode) {
        return {
            x: TreeCanvas.tileSize * (up + 2 * down),
            y: TreeCanvas.tileSize * (left + 2 * right),
        };
    }

    private tryDraw() {
        if (this.loadingComplete) {
            this.draw();
        }
    }

    private draw() {
        this.iter((row, col, cell) =>
            this.drawConnection(row, col, cell.travelNode));
    }

    private drawConnection(row: number, col: number, travelNode: TravelNode) {
        const position = TreeCanvas.spritePositionToImagePosition(travelNode);

        const size = TreeCanvas.tileSize;
        const dx = size * col;
        const dy = size * row;

        this.ctx.clearRect(dx, dy, size, size);
        this.ctx.drawImage(
            this.connections,
            position.x, position.y, size, size,
            dx, dy, size, size,
        );
    }

    private erasePrevious() {
        this.iter((row, col) => this.eraseConnection(row, col));
    }

    private eraseConnection(row: number, col: number) {
        const size = TreeCanvas.tileSize;
        const dx = size * col;
        const dy = size * row;

        this.ctx.clearRect(dx, dy, size, size);
    }

    private iter(fun: (row: number, col: number, cell: Cell) => void) {
        for (const key in this.state) {
            const index = parseInt(key) - 1;
            let row = Math.floor(index / TreeCanvas.columns);
            let col = index % TreeCanvas.columns;

            fun(row, col, this.state[key]);
        }
    }
}