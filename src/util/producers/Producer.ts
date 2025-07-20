import type {IProdCapability} from "./capabilities/IProdCapability";
import {GigaNum} from "../GigaNum";
import {Resource} from "../resources/Resource";

export type ProducerType = "crafting" | "energy" | "money" | "resource";

export class Producer<T extends ProducerType> {
    private constructor(
        public readonly type: T,
        public readonly id: IDString,
        public readonly name: NameString,
        public baseCost: GigaNum,
        public costScale: GigaNum,
        public resourcesNeeded: [Resource, number][] = [],
        public costMultiplier: number = 1,
        public quantity: number = 0,
        private readonly capabilities: Map<string, IProdCapability> = new Map(),
    ) {}

    static crafting(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        quantity: number = 0,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"crafting"> {
        return new Producer("crafting", id, name, baseCost, costScale, resourcesNeeded, costMultiplier, quantity, capabilities);
    }

    static resource(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        quantity: number = 0,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"resource"> {
        return new Producer("resource", id, name, baseCost, costScale, resourcesNeeded, costMultiplier, quantity, capabilities);
    }

    static energy(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        quantity: number = 0,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"energy"> {
        return new Producer("energy", id, name, baseCost, costScale, resourcesNeeded, costMultiplier, quantity, capabilities);
    }

    static money(
        id: IDString,
        name: NameString,
        baseCost: GigaNum,
        costScale: GigaNum,
        resourcesNeeded: [Resource, number][] = [],
        costMultiplier: number = 1,
        quantity: number = 0,
        capabilities: Map<string, IProdCapability> = new Map(),
    ): Producer<"money"> {
        return new Producer("money", id, name, baseCost, costScale, resourcesNeeded, costMultiplier, quantity, capabilities);
    }

    getCost(amount: number = 1): [GigaNum, [Resource, number][]] {
        let resultNum = new GigaNum(0);
        for (let i = 0; i < amount; i++) {
            resultNum = resultNum.add(this.baseCost.multiply(this.costScale.pow(this.quantity + i)).multiply(this.costMultiplier));
        }
        const resultRes: Array<[Resource, number]> = [];
        for (const resource of this.resourcesNeeded) {
            resultRes.push([resource[0], resource[1] * amount]);
        }
        return [resultNum, resultRes];
    }

    // purchase(amount: number = 1): boolean {
    //     const required = this.getCost(amount);
    //     const currentMoney = window.gameState.money;
    //     if (currentMoney >= required[0] && window.gameState.resourceManager.hasEnoughOf(required[1])) {
    //         window.gameState.money = currentMoney.subtract(required[0]);
    //         for (const resourceNumberPair of required[1]) {
    //             window.gameState.resourceManager.withdrawResource(resourceNumberPair[0], resourceNumberPair[1]);
    //         }
    //         return true;
    //     }
    //     return false;
    // }
    //
    // sell(amount: number = 1): boolean {
    //     if (this.quantity >= amount) {
    //         this.quantity -= amount;
    //         window.gameState.money = window.gameState.money.add(this.getCost(amount)[0].divide(2));
    //         return true;
    //     }
    //     return false;
    // }

    getCapabilities() {
        return this.capabilities;
    }

}

