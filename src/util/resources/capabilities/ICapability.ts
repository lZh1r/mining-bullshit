export interface ICapability {
    id: ResourceCapabilityType,
}

export type ResourceCapabilityType = "burnable_fuel" | "radioactive" | "reactor_fuel" | "decayable"