import type {ResourceCapabilityType} from "./ICapability.js";
import {RadioactiveCap} from "./RadioactiveCap.js";

export class ReactorFuelCap extends RadioactiveCap{
    public readonly id: ResourceCapabilityType;
    private readonly initialFuelValue: number;

    constructor(
        radiation_level: number,
        public fuelValue: number,
    ) {
        super(radiation_level);
        this.id = "reactor_fuel";
        this.initialFuelValue = fuelValue;
    }

    reset() {
        this.fuelValue = this.initialFuelValue;
    }
}