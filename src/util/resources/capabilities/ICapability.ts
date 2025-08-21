export interface ICapability {
    id: ResourceCapabilityType,
    reset: () => void,
}

export type ResourceCapabilityType = "burnable_fuel" | "radioactive" | "reactor_fuel" | "decayable" | "mastery"