import type {ResourceCapabilityType} from "./ICapability.js";
import {RadioactiveCap} from "./RadioactiveCap.js";

export class ReactorFuelCap extends RadioactiveCap{
    public readonly id: ResourceCapabilityType;
    constructor(
        radiation_level: number,
        public fuelValue: number,
        public heatOutput: number,
        ) {
        super(radiation_level);
        this.id = "reactor_fuel";
    }
}