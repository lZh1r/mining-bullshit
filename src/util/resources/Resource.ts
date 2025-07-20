import type {ICapability} from "./capabilities/ICapability";

export class Resource {
    constructor(
        private readonly id: IDString,
        private readonly name: NameString,
        public baseValue: number,
        public valueMultiplier: number = 1,
        private readonly capabilities: Map<IDString, ICapability> = new Map()) {}

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
}