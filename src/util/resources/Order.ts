import type {LootTable} from "../LootTable.ts";
import type {Resource} from "./Resource.ts";
import {GigaNum} from "../GigaNum.ts";

export class Order {
    public requirements: [Resource, number][] = [];
    public baseReward: number = 0;
    public rewardMultiplier: number = 0;
    public static previousRequirement: Resource; // for tier 1 trades only
    constructor(
        public readonly tier: number,
        lootTable: LootTable,
        public difficulty: number = 1,
        public rewardMultiplierBonus: number = 0,
    ) {
        const alreadyAdded = new Array<Resource>();
        const resourceWeightPairs = new Map(lootTable.getResourceWeightPairs());
        for (let i = 0; i < tier; i++) {
            let resource = lootTable.roll()[0][0];
            if (tier === 1) {
                while (resource === Order.previousRequirement) {
                    resource = lootTable.roll()[0][0];
                }
                Order.previousRequirement = resource;
            }
            while (alreadyAdded.includes(resource)) {
                console.log(resource);
                resource = lootTable.roll()[0][0];
            }
            alreadyAdded.push(resource);
            this.requirements.push([resource, Math.ceil(resourceWeightPairs.get(resource)! * Math.random()) * difficulty]);
        }
        let reward = 0;
        for (const [resource, number] of this.requirements) {
            reward += resource.valuePer * number;
        }
        this.baseReward = reward;
        this.rewardMultiplier = tier + 1;
    }

    get reward() {
        return new GigaNum(this.baseReward).multiply(this.rewardMultiplier + this.rewardMultiplierBonus);
    }
}

export interface OrderAssistant {
    enabled: boolean,
    ticksPerAutomation: number,
    numberOfOrdersAutomated: number,
    maxAutomatedOrderTier: number,
    currentTicks: number;
}