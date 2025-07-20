import {Resource} from "../Resource.js";
import {ICapability, ResourceCapabilityType} from "./ICapability.js";

export class DecayCap implements ICapability{
    public readonly id: ResourceCapabilityType;
    constructor(
        public readonly decaysInto: Resource,
        public decayTime: number
    ) {
        this.id = "decayable";
    }
}