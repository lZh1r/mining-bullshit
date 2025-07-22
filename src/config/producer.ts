import {GigaNum} from "../util/GigaNum.ts";

export const producerConfig = {
    energy: {
        hamsterWheel: {
            defaultCost: new GigaNum(5),
            defaultCostScale: new GigaNum(1.5),
            energyGeneration: new GigaNum(5),
        }
    },
    resource: {
        mine: {
            defaultCost: new GigaNum(20),
            defaultCostScale: new GigaNum(2.5),
            energyConsumption: new GigaNum(10),
        }
    },
    money: {

    },
    crafting: {

    },
};