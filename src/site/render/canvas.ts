import connectionsUrl from "../../../assets/img/ability/connections.png";

type dir = 0 | 1
export type TravelNode = { up: dir, down: dir, left: dir, right: dir }

export class TreeCanvas {
    static readonly columns = 9;
    static readonly rows = 6 * 8;
    static readonly tileSize: number = 18;

    canvas;
    ctx;

    connections;

    loadingComplete: boolean = false;

    state: TravelNode[];

    constructor(initialState: TravelNode[]) {
        this.state = initialState;

        this.canvas = document.createElement("canvas");
        this.canvas.width = TreeCanvas.tileSize * TreeCanvas.columns;
        this.canvas.height = TreeCanvas.tileSize * TreeCanvas.rows;

        this.ctx = this.canvas.getContext('2d')!

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

    changeState(state: TravelNode[]) {
        this.state = state;
    }

    static spritePositionToImagePosition({up, down, left, right}: TravelNode) {
        return {
            x: TreeCanvas.tileSize * (up + 2 * down),
            y: TreeCanvas.tileSize * (left + 2 * right),
        };
    }

    private draw() {
        let row = -1;
        for (let i = 0; i < this.state.length; i++) {
            if (i % TreeCanvas.columns === 0) row++;
            let col = i % TreeCanvas.columns;

            this.drawConnection(row, col, this.state[i]);
        }
    }

    private drawConnection(row: number, col: number, travelNode: TravelNode) {
        const position = TreeCanvas.spritePositionToImagePosition(travelNode);
        console.log(position.x, position.y);

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
}