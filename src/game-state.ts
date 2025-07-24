import {computed, signal} from "@preact/signals";
import {GigaNum} from "./util/GigaNum.ts";
import {Resource} from "./util/resources/Resource.ts";
import type {Producer, ProducerType} from "./util/producers/Producer.ts";
import type {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import type {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {ProducersTab} from "./components/tabs/producer/ProducersTab.tsx";
import type {JSX} from "react";
import type {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import type {MoneyProdCap} from "./util/producers/capabilities/MoneyProdCap.ts";
import type {ProducerUpgrade} from "./util/upgrades/ProducerUpgrade.ts";
import type {Recipe} from "./util/crafts/Recipe.ts";

export const gameTickInterval = signal(1000);
export const currentTab = signal(ProducersTab);
export const money = signal(new GigaNum(10000));
export const resources = signal(new Map<string, [Resource, number]>());
export const producers = signal(new Map<string, [Producer<ProducerType>, number]>());
export const upgrades = signal(new Map<ProducerType, ProducerUpgrade[]>([
    ["energy", []],
    ["resource", []],
    ["money", []],
    ["crafting", []]
]));
export const recipes = signal(new Map<Producer<"crafting">, Recipe[]>());
export const recipeQueue = signal(new Map<Producer<"crafting">, Recipe[]>());
export const automationQueue = signal(new Array<Recipe>());
export const totalValue = computed(() => {
    let result = new GigaNum(0);
    resources.value.forEach((resourceNumberPair) => {
        const resource = resourceNumberPair[0];
        const resourceAmount = resourceNumberPair[1];
        result = result.add(new GigaNum(resource.valuePer).multiply(resourceAmount));
    });
    return result;
});
export const power = computed(() => {
    let result = new GigaNum(0);
    producers.value.forEach(([producer, amount]) => {
        if (producer.type === "energy") {
            if (producer.getCapabilities().has("energy")) {
                const cap = producer.getCapabilities().get("energy") as EnergyGenCap;
                result = result.add(cap.baseEnergyGeneration.multiply(cap.energyGenerationMultiplier).multiply(amount));
            }
        }
    });
    return result;
});
export const powerConsumption = computed(() => {
    let result = new GigaNum(0);
    producers.value.forEach((producerNumPair) => {
        const prod = producerNumPair[0];
        if (prod.type !== "energy") {
            if (prod.getCapabilities().has("energy_consumption")) {
                const cap = prod.getCapabilities().get("energy_consumption") as EnergyConsumptionCap;
                result = result.add(cap.consumption.multiply(producerNumPair[1]));
            }
        }
    });
    return result;
});

export const gameActions = {
    openTab(tabToOpen: () => JSX.Element) {
        currentTab.value = tabToOpen;
    },
    addMoney(amount: GigaNum | number) {
        money.value = money.value.add(amount);
    },
    removeMoney(amount: GigaNum | number) {
        money.value = money.value.subtract(amount);
    },
    addResource(resource: Resource) {
        resources.value = resources.value.set(resource.getId(), [resource, 0]);
    },
    hasEnoughOf(resource: Resource | [Resource, number][], amount?: number): boolean {
        if (resource instanceof Resource && amount) {
            const currentResources = resources.value;
            return currentResources.has(resource.getId()) && currentResources.get(resource.getId())![1] >= amount!;
        } else if (resource instanceof Resource && !amount) {
            throw new Error("Incorrect usage of hasEnoughOf! Can't pass Resource and null!");
        } else {
            for (const [res, amount] of resource as [Resource, number][]) {
                if (!this.hasEnoughOf(res, amount)) {
                    return false;
                }
            }
            return true;
        }

    },
    depositResource(resource: Resource, amount: number = 1) {
        const current = resources.value;
        const resPair = current.get(resource.getId());
        let prevCount = 0;
        if (resPair === undefined) {
            prevCount = 0;
            resource.performOnGet();
        } else {
            prevCount = resPair[1];
        }
        const newMap = new Map(current);
        resources.value = newMap.set(resource.getId(), [resource, prevCount + amount]);
    },
    withdrawResource(resource: Resource, amount: number) {
        const current = resources.value;
        if (!this.hasEnoughOf(resource, amount)) {
            return;
        }
        const prevCount = current.get(resource.getId())![1];
        const newMap = new Map(current);
        newMap.set(resource.getId(), [resource, prevCount - amount]);
        resources.value = newMap;
    },
    updateResource<K extends keyof Resource>(resource: Resource | string, valueToUpdate: K, value: Resource[K]): boolean {
        if (resource instanceof Resource) {
            resource = resource.getId();
        }
        const currentResources = new Map(resources.value);
        const resourceToUpdate = currentResources.get(resource);
        if (resourceToUpdate === undefined) {
            return false;
        }
        resourceToUpdate[0][valueToUpdate] = value;
        resources.value = currentResources.set(resource, resourceToUpdate);
        return true;
    },
    getTotalValue(resource?: Resource): GigaNum {
        let result = new GigaNum(0);
        const currentResources = resources.value;
        if (resource) {
            const id = resource.getId();
            if (currentResources.has(id)) {
                const target = currentResources.get(id)![0];
                const targetAmount = currentResources.get(id)![1];
                result = result.add(new GigaNum(target.valuePer).multiply(targetAmount));
            }
            return result;
        }
        return totalValue.value;
    },
    sellResource(resource: Resource, amount: number) {
        if (this.hasEnoughOf(resource, amount)) {
            this.withdrawResource(resource, amount);
            this.addMoney(resource.valuePer * amount);
        }
    },
    addProducer(producer: Producer<ProducerType>, amount: number = 0) {
        let prevCount = 0;
        if (producers.value.has(producer.id)) {
            prevCount = producers.value.get(producer.id)![1];
        }
        const newMap = new Map(producers.value);
        newMap.set(producer.id, [producer, amount + prevCount]);
        producers.value = newMap;
    },
    removeProducer(producer: Producer<ProducerType>, amount: number = 1) {
        if (!producers.value.get(producer.id)) {
            return;
        }
        const prevCount = producers.value.get(producer.id)![1];
        const newMap = new Map(producers.value);
        newMap.set(producer.id, [producer, prevCount - amount]);
        producers.value = newMap;
    },
    deleteProducer(producer: Producer<ProducerType>) {
        const newMap = new Map(producers.value);
        newMap.delete(producer.id);
        producers.value = newMap;
    },
    getProducerCost(producer: Producer<ProducerType>, amount: number = 1): [GigaNum, [Resource, number][]] {
        let resultNum = new GigaNum(0);
        const prod = producers.peek().get(producer.id);
        const currentProducerQuantity = typeof prod === "undefined" ? 0 : prod[1];
        for (let i = 0; i < amount; i++) {
            resultNum = resultNum.add(producer.baseCost.multiply(producer.costScale.pow(currentProducerQuantity + i)).multiply(producer.costMultiplier));
        }
        const resultRes: [Resource, number][] = [];
        for (const resource of producer.resourcesNeeded) {
            resultRes.push([resource[0], resource[1] * amount]);
        }
        return [resultNum, resultRes];
    },
    getProducerEnergyConsumption(producer: Producer<ProducerType>, amount: number = 1) {
        let result = new GigaNum(0);
        if (producer.type !== "energy" && producer.getCapabilities().has("energy_consumption")) {
            const cap = producer.getCapabilities().get("energy_consumption")! as EnergyConsumptionCap;
            result = result.add(cap.consumption.multiply(amount));
        }
        return result;
    },
    canPurchaseProducer(producer: Producer<ProducerType>, amount: number = 1): boolean {
        const cost = this.getProducerCost(producer, amount);
        if ((cost[0].compareTo(money.value) === "less" || cost[0].compareTo(money.value) === "equal") && this.hasEnoughOf(cost[1])) {
            return power.value.compareTo(powerConsumption.value.add(this.getProducerEnergyConsumption(producer, amount))) !== "less";
        }
        return false;
    },
    purchaseProducer(producer: Producer<ProducerType>, amount: number = 1) {
        const cost = this.getProducerCost(producer, amount);
        if (this.canPurchaseProducer(producer, amount)) {
            this.removeMoney(cost[0]);
            for (const resourceNumPair of cost[1]) {
                this.withdrawResource(resourceNumPair[0], resourceNumPair[1]);
            }
            this.addProducer(producer, amount);
            producer.checkForMilestones();
        }
    },
    canSellProducer(producer: Producer<ProducerType>, amount: number = 1): boolean {
        if (producers.value.get(producer.id) && producers.value.get(producer.id)![1] >= amount) {
            if (producer.type === "energy" && producer.getCapabilities().has("energy")) {
                const cap = producer.getCapabilities().get("energy")! as EnergyGenCap;
                return power.value.subtract(cap.generation).compareTo(powerConsumption.value) !== "less";

            }
        }
        return false;
    },
    sellProducer(producer: Producer<ProducerType>, amount: number = 1) {
        if (this.canSellProducer(producer, amount)) {
            this.removeProducer(producer, amount);
            const moneyBack = this.getProducerCost(producer, amount);
            this.addMoney(moneyBack[0].divide(2));
        }
    },
    getAllProducersOfType(type: ProducerType) {
        const newMap = new Array<[Producer<ProducerType>, number]>;
        producers.value.forEach((producer) => {
            if (producer[0].type === type) {
                newMap.push(producer);
            }
        });
        return newMap;
    },
    getProducerAmount(producer: Producer<ProducerType>): number {
        if (producers.value.has(producer.id)) {
            return producers.value.get(producer.id)![1];
        }
        return 0;
    },
    tickProducer(producer: Producer<ProducerType>): boolean {
        if (producer.type === "energy") {
            return false;
        }
        const newMap = new Map(producers.value);
        const ready = newMap.get(producer.id)![0].tick();
        producers.value = newMap;
        return ready;
    },
    //in gameTick ONLY!
    getProducersYield(): [[Resource, number][], GigaNum] {
        let resultNum = new GigaNum(0);
        const resultRes = new Array<[Resource, number]>;
        producers.value.forEach((entry) => {
            const producer = entry[0];
            const quantity = entry[1];
            if (producer.type === "resource" && this.tickProducer(producer) && producer.getCapabilities().has("mining")) {
                const cap = producer.getCapabilities().get("mining")! as MiningCap;
                const output = cap.lootTable.roll(quantity);
                if (cap.autoSell) {
                    for (const resource of output) {
                        resultNum = resultNum.add(resource.valuePer * cap.yieldMultiplier);
                    }
                } else {
                    for (const resource of output) {
                        resultRes.push([resource, cap.yieldMultiplier]);
                    }
                }
            } else if (producer.type === "money" && this.tickProducer(producer) && producer.getCapabilities().has("money")) {
                const cap = producer.getCapabilities().get("money")! as MoneyProdCap;
                resultNum = resultNum.add(cap.production.multiply(quantity));
            }
        });
        return [resultRes, resultNum];
    },
    addUpgrade(upgrade: ProducerUpgrade) {
        const newMap = new Map(upgrades.value);
        newMap.get(upgrade.type)!.push(upgrade);
        upgrades.value = newMap;
    },
    canPurchaseUpgrade(upgrade: ProducerUpgrade): boolean {
        const [moneyCost, resourceCost] = upgrade.requirements;
        return (moneyCost.compareTo(money.value) === "less" || moneyCost.compareTo(money.value) === "equal") && this.hasEnoughOf(resourceCost);

    },
    purchaseUpgrade(upgrade: ProducerUpgrade) {
        const [moneyCost, resourceCost] = upgrade.requirements;
        if (this.canPurchaseUpgrade(upgrade)) {
            this.removeMoney(moneyCost);
            for (const [resource, amount] of resourceCost) {
                this.withdrawResource(resource, amount);
            }
            upgrade.effect();
        }
    },
    registerProducerInRecipeQueue(producer: Producer<"crafting">) {
        const newMap = new Map(recipeQueue.value);
        newMap.set(producer, []);
        recipeQueue.value = newMap;
    },
    addRecipe(recipe: Recipe) {
        const newMap = new Map(recipes.value);
        const producer = recipe.producer;
        if (!newMap.has(producer)) {
            newMap.set(producer, []);
        }
        newMap.get(producer)!.push(recipe);
        recipes.value = newMap;
    },
    canStartRecipe(recipe: Recipe): boolean {
        let current = recipeQueue.value;
        const unlocked = recipes.value;
        const producer = recipe.producer;
        if (!current.has(producer)) {
            this.registerProducerInRecipeQueue(producer);
            current = recipeQueue.value;
            return false;
        }
        return !(!unlocked.has(producer) ||
            current.get(producer)!.includes(recipe) ||
            !this.hasEnoughOf(recipe.inputs) ||
            this.getProducerAmount(producer) === 0);
    },
    startRecipe(recipe: Recipe) {
        const newMap = new Map(recipeQueue.value);
        const producer = recipe.producer;
        if (!this.canStartRecipe(recipe)) {
            return;
        }
        for (const [resource, number] of recipe.inputs) {
            this.withdrawResource(resource, number);
        }
        if (!newMap.has(producer)) {
            this.registerProducerInRecipeQueue(producer);
        }
        newMap.get(recipe.producer)!.push(recipe);
        recipeQueue.value = newMap;
    },
    stopRecipe(recipe: Recipe) {
        const newMap = new Map(recipeQueue.value);
        const producer = recipe.producer;
        if (!newMap.has(producer) || !newMap.get(producer)!.includes(recipe)) {
            return;
        }
        newMap.get(recipe.producer)?.find((value) => value.id === recipe.id)!.resetCurrentTicks();
        newMap.set(recipe.producer, newMap.get(recipe.producer)!.filter((val) => val.id !== recipe.id));
        recipeQueue.value = newMap;
    }
};