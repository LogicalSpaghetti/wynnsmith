type EventMap = Record<string, any>;

export class EventTarget<Events extends EventMap> {
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