import {EventTarget} from "./event_target.ts";

export interface HistoryCommand {
    undo(): void;
    redo(): void;
}

export type HistoryEvents = {
    log: HistoryCommand;
};

export abstract class HistoryTarget<Events extends HistoryEvents = HistoryEvents> extends EventTarget<Events> {}

export class HistoryLedger {
    private history: HistoryCommand[] = [];
    private index = -1;

    maxEntries;

    constructor(maxEntries: number = 128) {
        this.maxEntries = maxEntries;
    }

    public register(...targets: HistoryTarget[]) {
        for (const target of targets)
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

export function initDocumentHistory(): HistoryLedger {
    const ledger = new HistoryLedger(100);

    function handler(e: KeyboardEvent) {
        if ((e.target as HTMLElement).classList.contains("allow-undo")) return;
        const ctrl = e.metaKey || e.ctrlKey;

        if (!ctrl) return;

        if (e.key === "z" || e.key === "Z") {
            e.preventDefault();
            if (e.shiftKey) ledger.redo();
            else ledger.undo();
        } else if (e.key === "y" || e.key === "Y") {
            e.preventDefault();
            ledger.redo();
        }
    }

    document.addEventListener("keydown", handler, {capture: true});

    return ledger;
}
