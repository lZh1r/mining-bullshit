import type {ICapability, ResourceCapabilityType} from "./ICapability.ts";
export class MasteryCap implements ICapability {
    public readonly id: ResourceCapabilityType;
    static maxLevel: number = 100;
    constructor(
        public readonly initialRequirement: number,
        public requirementScale: number,
        public effect: () => void,
        public xp: number = 0,
        public level: number = 0,
    ) {
        this.id = "mastery";
    }

    get requirementForNextLevel() {
        return this.initialRequirement * Math.floor(Math.pow(this.requirementScale, this.level));
    }

    incrementXp(times: number = 1) {
        this.xp += times;
            while (this.requirementForNextLevel <= this.xp && this.level < MasteryCap.maxLevel) {
                this.xp = this.xp - this.requirementForNextLevel;
                this.level++;
                this.effect();
            }
    }

    reset() {
        this.xp = 0;
        this.level = 0;
    }
}