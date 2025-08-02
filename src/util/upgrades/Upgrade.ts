import type {ProducerType} from "../producers/Producer.ts";
import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";

export class Upgrade {
    public isBought: boolean;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly description: string,
        public readonly type: ProducerType,
        public effect: () => void,
        public requirements: [GigaNum, [Resource, number][]],
        public repeatable: boolean = false,
        public moneyCostScale: number = 1,
        public resourceCostScale: number = 1,
    ) {
        this.isBought = false;
    }
}