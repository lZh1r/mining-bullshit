import type {Resource} from "../resources/Resource.ts";
import type {Producer} from "../producers/Producer.ts";

export class Recipe {
    private currentTicks: number = 0;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly producer: Producer<"crafting">,
        public result: [Resource, number][],
        public inputs: [Resource, number][],
        public producerTicksRequired: number,
        public tickMultiplier: number = 1,
        public isActive: boolean = false,
    ) {}

    get craftDuration() {
        return this.producer.ticksRequired * this.producerTicksRequired * this.tickMultiplier;
    }

    tick(times: number): boolean {
        this.currentTicks += times;
        if (this.currentTicks >= this.craftDuration) {
            this.currentTicks = 0;
            return true;
        }
        return false;
    }
}