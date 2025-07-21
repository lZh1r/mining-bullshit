import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class EnergyConsumptionCap implements IProdCapability {
    public id: IDString;
    public applicableToProducerOfType: ProducerType[];
    constructor(
        public baseConsumption: GigaNum,
        public consumptionMultiplier: number = 1,
    ) {
        this.id = "energy_consumption";
        this.applicableToProducerOfType = ["money", "resource", "crafting"];
    }

    get consumption() {
        return this.baseConsumption.multiply(this.consumptionMultiplier);
    }
}