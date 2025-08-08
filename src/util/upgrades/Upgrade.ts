import type {ProducerType} from "../producers/Producer.ts";
import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";

export class Upgrade {
    public isBought: boolean = false;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly description: string,
        public readonly type: ProducerType,
        public effect: () => void,
        public requirements: [GigaNum, [Resource, number][]],
    ) {}
}