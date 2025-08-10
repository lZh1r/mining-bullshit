import type {ICapability, ResourceCapabilityType} from "./capabilities/ICapability";
import {DisplayItem} from "../utils.ts";

export class Resource extends DisplayItem{

    private onGet: () => void = () => {};
    public autoSell: boolean = false;
    public autoCellCap: number = 0;
    public canBeAutomated: boolean = false;

    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public baseValue: number,
        public valueMultiplier: number = 1,
        private readonly capabilities: Map<ResourceCapabilityType, ICapability> = new Map()) {
        super(id, name);
    }

    get valuePer() {
        return this.baseValue * this.valueMultiplier;
    }

    getCapabilities() {
        return this.capabilities;
    }

    addCapability(capability: ICapability) {
        this.capabilities.set(capability.id, capability);
    }

    addOnGet(effect: () => void) {
        this.onGet = effect;
    }

    performOnGet() {
        this.onGet();
    }
}