import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {GigaNum} from "../../GigaNum.ts";

export class MoneyProdCap implements IProdCapability{
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    private readonly initialYield: GigaNum;

    constructor(
        public moneyYield: GigaNum,
        public yieldMultiplier: number = 1,
    ) {
        this.id = "money";
        this.applicableToProducerOfType = "money";
        this.initialYield = moneyYield;
    }

    get production() {
        return this.moneyYield.multiply(this.yieldMultiplier);
    }

    reset() {
        this.moneyYield = this.initialYield;
        this.yieldMultiplier = 1;
    }
}