type EventMap = Record<string, any>;

export abstract class TypedEventTarget<Events extends EventMap> {
    private listeners: {
        [K in keyof Events]?: ((payload: Events[K]) => void)[];
    } = {};

    addEventListener<K extends keyof Events>(
        type: K,
        listener: (payload: Events[K]) => void,
    ) {
        (this.listeners[type] ??= []).push(listener);
    }

    removeEventListener<K extends keyof Events>(
        type: K,
        listener: (payload: Events[K]) => void,
    ) {
        const arr = this.listeners[type];
        if (!arr) return;
        this.listeners[type] = arr.filter(l => l !== listener);
    }

    dispatchEvent<K extends keyof Events>(
        type: K,
    ): Events[K] extends void ? void : never;
    dispatchEvent<K extends keyof Events>(
        type: K,
        payload: Events[K],
    ): void;
    dispatchEvent<K extends keyof Events>(
        type: K,
        payload?: Events[K],
    ) {
        this.listeners[type]?.forEach(listener => {
            (listener as any)(payload);
        });
    }
}

export interface HistoryCommand {
    undo(): void;
    redo(): void;
}

export type HistoryEvents = {
    log: HistoryCommand;
};

export abstract class HistoryTarget<Events extends HistoryEvents = HistoryEvents>
    extends TypedEventTarget<Events> {}

export class HistoryLedger {
    private history: HistoryCommand[] = [];
    private index = -1;

    maxEntries;

    constructor(maxEntries: number) {
        this.maxEntries = maxEntries;
    }

    public register(target: HistoryTarget) {
        target.addEventListener("log", this.handleLog);
    }

    private handleLog = (command: HistoryCommand) => {
        // Remove redo branch
        this.history = this.history.slice(0, this.index + 1);

        this.history.push(command);

        // Trim overflow
        if (this.history.length > this.maxEntries) {
            const overflow = this.history.length - this.maxEntries;
            this.history.splice(0, overflow);
            this.index -= overflow;
        }

        this.index = this.history.length - 1;
    };

    public undo() {
        if (this.index < 0) return;

        this.history[this.index].undo();
        this.index--;
    }

    public redo() {
        if (this.index >= this.history.length - 1) return;

        this.index++;
        this.history[this.index].redo();
    }
}
