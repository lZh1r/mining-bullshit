import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class EnergyGenCap implements IProdCapability{
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    constructor(
        public baseEnergyGeneration: GigaNum,
        public energyGenerationMultiplier: number = 1
    ) {
        this.id = "energy";
        this.applicableToProducerOfType = "energy";
    }
    get generation() {
        return this.baseEnergyGeneration.multiply(this.energyGenerationMultiplier);
    }
}