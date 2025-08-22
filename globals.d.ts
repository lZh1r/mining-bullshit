import type {Resource} from "./src/util/resources/Resource.ts";
import type {Producer, ProducerType} from "./src/util/producers/Producer.ts";
import type {Upgrade} from "./src/util/upgrades/Upgrade.ts";

declare global {
    type SingleOrArray<T> = T | T[];
    type IDString = Lowercase<string>;
    type NameString = Capitalize<string>;
    type GameEvent =
        "moneyAdded" | "moneyRemoved" |
        "gameReset" |
        "resourceAdded" | "resourceRemoved" |
        "producerAdded" | "producerRemoved" |
        "upgradePurchased" |
        "orderCompleted"
    type EventDetails<T extends GameEvent> =
        T extends "moneyAdded" | "moneyRemoved" ? {amount: number} :
        T extends "resourceAdded" | "resourceRemoved" ? {resource: Resource | [Resource, number][], amount?: number} :
        T extends "producerAdded" | "producerRemoved" ? {producer: Producer<ProducerType>, amount: number} :
        T extends "upgradePurchased" ? {upgrade: Upgrade} :
        T extends "orderCompleted" ? null : {prestigeGain: number};
}

export {};