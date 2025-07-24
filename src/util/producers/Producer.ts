import type {IProdCapability} from "./capabilities/IProdCapability";
import {GigaNum} from "../GigaNum";
import {Resource} from "../resources/Resource";

export type ProducerType = "crafting" | "energy" | "money" | "resource";

export class Producer<T extends ProducerType> {
    private constructor(
        public readonly type: T,
        public readonly id: IDString,
        public readonly name: NameString,
        public baseCost: GigaNum,
        public costScale: GigaNum,
        public ticksPerOperation?: number,
        public ticksMultiplier: number = 1,
        public resourcesNeeded: [Resource, number][] = [],
        public costMultiplier: number = 1,
        private readonly capabilities: Map<string, IProdCapability> = new Map(),
        private currentTicks: number = 0,
    ) {}

    static crafting(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        ticksPerOperation?: number,
        ticksMultiplier: number = 1,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"crafting"> {
        return new Producer("crafting", id, name, baseCost, costScale, ticksPerOperation,
            ticksMultiplier, resourcesNeeded, costMultiplier, capabilities);
    }

    static resource(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        ticksPerOperation?: number,
        ticksMultiplier: number = 1,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"resource"> {
        return new Producer("resource", id, name, baseCost, costScale, ticksPerOperation,
            ticksMultiplier, resourcesNeeded, costMultiplier, capabilities);
    }

    static energy(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"energy"> {
        return new Producer("energy", id, name, baseCost, costScale, -1, 0, resourcesNeeded, costMultiplier, capabilities);
    }

    static money(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        ticksPerOperation?: number,
        ticksMultiplier: number = 1,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"money"> {
        return new Producer("money", id, name, baseCost, costScale, ticksPerOperation,
            ticksMultiplier, resourcesNeeded, costMultiplier, capabilities);
    }

    getCapabilities() {
        return this.capabilities;
    }

    addCapability(capability: IProdCapability) {
        if (capability.applicableToProducerOfType.includes(this.type)) {
            this.capabilities.set(capability.id, capability);
        }
    }

    get ticksRequired() {
        return this.ticksPerOperation === -1 ? 0 : this.ticksPerOperation! * this.ticksMultiplier;
    }

    tick(): boolean {
        this.currentTicks += 1;
        if (this.currentTicks >= this.ticksRequired) {
            this.currentTicks = 0;
            return true;
        }
        return false;
    }

}

