import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class EnergyGenCap implements IProdCapability{
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    private readonly initialEnergyGeneration: GigaNum;

    constructor(
        public baseEnergyGeneration: GigaNum,
        public energyGenerationMultiplier: number = 1
    ) {
        this.id = "energy";
        this.applicableToProducerOfType = "energy";
        this.initialEnergyGeneration = baseEnergyGeneration;
    }
    get generation() {
        return this.baseEnergyGeneration.multiply(this.energyGenerationMultiplier);
    }

    reset() {
        this.baseEnergyGeneration = this.initialEnergyGeneration;
        this.energyGenerationMultiplier = 1;
    }
}