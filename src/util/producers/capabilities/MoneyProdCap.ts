import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class MoneyProdCap implements IProdCapability{
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    constructor(
        public moneyYield: GigaNum,
        public yieldMultiplier: number = 1,
    ) {
        this.id = "money";
        this.applicableToProducerOfType = "money";
    }

    get production() {
        return this.moneyYield.multiply(this.yieldMultiplier);
    }
}