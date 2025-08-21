const eventListeners = new Map<GameEvent, (() => boolean)[]>();

export function emitEvent(event: GameEvent) {
    const functions = eventListeners.get(event);
    const toBeRemoved = new Set<() => boolean>();
    functions?.forEach((func) => {
        if (func()) toBeRemoved.add(func);
    });
    eventListeners.set(event, functions?.filter(f => !toBeRemoved.has(f)) ?? []);
}

export function addGameEventListener(event: GameEvent, callback: () => boolean) {
    eventListeners.set(event, [...(eventListeners.get(event) ?? []), callback]);
}