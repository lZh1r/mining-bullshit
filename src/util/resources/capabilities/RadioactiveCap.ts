import type {ICapability, ResourceCapabilityType} from "./ICapability.js";

export class RadioactiveCap implements ICapability{
    public readonly id: ResourceCapabilityType;
    constructor(
        public readonly radiationLevel: number) {
        this.id = "radioactive";
    }

    reset() {

    }
}