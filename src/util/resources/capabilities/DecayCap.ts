import {Resource} from "../Resource.js";
import type {ICapability, ResourceCapabilityType} from "./ICapability.js";

export class DecayCap implements ICapability{
    public readonly id: ResourceCapabilityType;
    private readonly initialDecayTime: number;

    constructor(
        public readonly decaysInto: Resource,
        public decayTime: number
    ) {
        this.id = "decayable";
        this.initialDecayTime = decayTime;
    }

    reset() {
        this.decayTime = this.initialDecayTime;
    }
}