import type {ProducerType} from "../producers/Producer.ts";
import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";
import {DisplayItem} from "../utils.ts";

export class Upgrade extends DisplayItem{
    public isBought: boolean = false;
    constructor(
        id: IDString,
        name: NameString,
        description: string,
        public readonly type: ProducerType,
        public effect: () => void,
        public requirements: [GigaNum, [Resource, number][]],
    ) {
        super(id, name, description);
    }
}