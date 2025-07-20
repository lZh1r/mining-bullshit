import {ICapability, ResourceCapabilityType} from "./ICapability.js";

export class BurnableCap implements ICapability{
    public readonly id: ResourceCapabilityType;
    constructor(
        public fuelValue: number
        ) {
        this.id = "burnable_fuel";
    }
}