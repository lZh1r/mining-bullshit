import type {Resource} from "../resources/Resource.ts";
import type {Producer} from "../producers/Producer.ts";
import {batch, type Signal, signal} from "@preact/signals";
import {DisplayItem} from "../utils.ts";

export class Recipe extends DisplayItem{
    public automate: boolean = false;
    private currentTicks: Signal<number> = signal(0);
    private readonly initialResult: [Resource, number][];
    private readonly initialInputs: [Resource, number][];
    private readonly initialProducerTicksRequired: number;
    private readonly initialTickMultiplier: number;

    constructor(
        id: IDString,
        name: NameString,
        public readonly producer: Producer<"crafting">,
        public result: [Resource, number][],
        public inputs: [Resource, number][],
        public producerTicksRequired: number,
        public tickMultiplier: number = 1,
        public isActive: boolean = false,
    ) {
        super(id, name);
        this.initialResult = [...result];
        this.initialInputs = [...inputs];
        this.initialProducerTicksRequired = producerTicksRequired;
        this.initialTickMultiplier = tickMultiplier;
    }

    get craftDuration() {
        return this.producer.ticksRequired * this.producerTicksRequired * this.tickMultiplier;
    }

    tick(times: number): boolean {
        let result = false;
        batch(() => {
            this.currentTicks.value += times;
            if (this.currentTicks.value >= this.craftDuration) {
                this.currentTicks.value = 0;
                result = true;
            } else {
                result = false;
            }
        });
        return result;
    }

    getCurrentTicks() {
        return this.currentTicks;
    }

    resetCurrentTicks() {
        this.currentTicks.value = 0;
    }

    reset() {
        this.automate = false;
        this.resetCurrentTicks();
        this.result = this.initialResult;
        this.inputs = this.initialInputs;
        this.producerTicksRequired = this.initialProducerTicksRequired;
        this.tickMultiplier = this.initialTickMultiplier;
    }
}