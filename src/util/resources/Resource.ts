import type {ICapability, ResourceCapabilityType} from "./capabilities/ICapability";

export class Resource {

    private onGet: () => void = () => {};
    public autoSell: boolean = false;
    public autoCellCap: number = 0;
    public canBeAutomated: boolean = false;

    constructor(
        private readonly id: IDString,
        private readonly name: NameString,
        public baseValue: number,
        public valueMultiplier: number = 1,
        private readonly capabilities: Map<ResourceCapabilityType, ICapability> = new Map()) {}

    get valuePer() {
        return this.baseValue * this.valueMultiplier;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
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