import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class EnergyConsumptionCap implements IProdCapability {
    public id: IDString;
    public applicableToProducerOfType: ProducerType[];
    private readonly initialConsumption: GigaNum;

    constructor(
        public baseConsumption: GigaNum,
        public consumptionMultiplier: number = 1,
    ) {
        this.id = "energy_consumption";
        this.applicableToProducerOfType = ["money", "resource", "crafting"];
        this.initialConsumption = baseConsumption;
    }

    get consumption() {
        return this.baseConsumption.multiply(this.consumptionMultiplier);
    }

    reset() {
        this.baseConsumption = this.initialConsumption;
    }
}