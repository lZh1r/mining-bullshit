import type {ICapability, ResourceCapabilityType} from "./capabilities/ICapability";
import {DisplayItem} from "../utils.ts";

export class Resource extends DisplayItem{

    private onGet: () => void = () => {};
    public autoSell: boolean = false;
    public autoCellCap: number = 0;
    public canBeAutomated: boolean = false;
    private readonly initialValue: number;
    private readonly initialCapabilities: Map<ResourceCapabilityType, ICapability>;

    constructor(
        id: IDString,
        name: NameString,
        public baseValue: number,
        public valueMultiplier: number = 1,
        private capabilities: Map<ResourceCapabilityType, ICapability> = new Map()
    ) {
        super(id, name);
        this.initialValue = baseValue;
        this.initialCapabilities = structuredClone(capabilities);
    }

    get valuePer() {
        return this.baseValue * this.valueMultiplier;
    }

    getCapabilities() {
        return this.capabilities;
    }

    addCapability(capability: ICapability) {
        this.capabilities.set(capability.id, capability);
        this.initialCapabilities.set(capability.id, capability);
    }

    addOnGet(effect: () => void) {
        this.onGet = effect;
    }

    performOnGet() {
        this.onGet();
    }

    reset() {
        this.baseValue = this.initialValue;
        for (const capability of this.capabilities.values()) {
            capability.reset();
        }
        this.capabilities = this.initialCapabilities;
        this.canBeAutomated = false;
        this.autoSell = false;
        this.autoCellCap = 0;
    }
}