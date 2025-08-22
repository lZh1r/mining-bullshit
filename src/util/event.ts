const eventListeners = new Map<GameEvent, ((details?: EventDetails<GameEvent>) => boolean)[]>();

export function emitEvent(event: GameEvent, details?: EventDetails<typeof event>) {
    const functions = eventListeners.get(event);
    const toBeRemoved = new Set<(details?: EventDetails<typeof event>) => boolean>();
    functions?.forEach((func) => {
        if (func(details)) toBeRemoved.add(func);
    });
    eventListeners.set(event, functions?.filter(f => !toBeRemoved.has(f)) ?? []);
}

export function addGameEventListener(
    event: GameEvent,
    callback: (details?: EventDetails<typeof event>) => boolean
) {
    eventListeners.set(event, [...(eventListeners.get(event) ?? []), callback]);
}