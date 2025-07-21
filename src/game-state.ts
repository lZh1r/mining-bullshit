import {computed, signal} from "@preact/signals";
import {GigaNum} from "./util/GigaNum.ts";
import {Resource} from "./util/resources/Resource.ts";
import type {Producer, ProducerType} from "./util/producers/Producer.ts";
import type {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import type {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {ProducersTab} from "./components/tabs/producer/ProducersTab.tsx";
import type {JSX} from "react";

export const currentTab = signal(ProducersTab);
export const money = signal(new GigaNum(100));
export const resources = signal(new Map<string, [Resource, number]>());
export const producers = signal(new Map<string, [Producer<ProducerType>, number]>());
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
    producers.value.forEach((producerNumPair) => {
        const prod = producerNumPair[0];
        if (prod.type === "energy") {
            if (prod.getCapabilities().has("energy")) {
                const cap = prod.getCapabilities().get("energy") as EnergyGenCap;
                result = result.add(cap.baseEnergyGeneration.multiply(cap.energyGenerationMultiplier)).multiply(producerNumPair[1]);
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
    hasEnoughOf(resource: Resource, amount: number): boolean {
        const currentResources = resources.value;
        return currentResources.has(resource.getId()) && currentResources.get(resource.getId())![1] >= amount!;
    },
    depositResource(resource: Resource, amount: number = 1) {
        const resPair = resources.value.get(resource.getId());
        const prevCount = typeof resPair === "undefined" ? 0 : resPair[1];
        resources.value = resources.value.set(resource.getId(), [resource, prevCount + amount]);
    },
    withdrawResource(resource: Resource, amount: number) {
        if (!this.hasEnoughOf(resource, amount)) {
            return;
        }
        const prevCount = resources.value.get(resource.getId())![1];
        resources.value = resources.value.set(resource.getId(), [resource, prevCount - amount]);
    },
    updateResource<K extends keyof Resource>(resource: Resource | string, valueToUpdate: K, value: Resource[K]): boolean {
        if (resource instanceof Resource) {
            resource = resource.getId();
        }
        const currentResources = resources.value;
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
    purchaseProducer(producer: Producer<ProducerType>, amount: number = 1) {
        const cost = this.getProducerCost(producer, amount);
        if (cost[0].compareTo(money.value) === "less" || cost[0].compareTo(money.value) === "equal") {
            for (const resourceNumPair of cost[1]) {
                if (!this.hasEnoughOf(resourceNumPair[0], resourceNumPair[1])) {
                    return;
                }
            }
            if (producer.type !== "energy" && producer.getCapabilities().has("energy_consumption")) {
                const cap = producer.getCapabilities().get("energy_consumption")! as EnergyConsumptionCap;
                if (power.value.compareTo(powerConsumption.value.add(cap.consumption)) === "less") {
                    return;
                }
            }
            this.removeMoney(cost[0]);
            for (const resourceNumPair of cost[1]) {
                this.withdrawResource(resourceNumPair[0], resourceNumPair[1]);
            }
            this.addProducer(producer, amount);
        }
    },
    sellProducer(producer: Producer<ProducerType>, amount: number) {
        if (producers.value.get(producer.id) && producers.value.get(producer.id)![1] >= amount) {
            if (producer.type === "energy" && producer.getCapabilities().has("energy")) {
                const cap = producer.getCapabilities().get("energy")! as EnergyGenCap;
                if (power.value.subtract(cap.generation).compareTo(powerConsumption.value) === "less") {
                    return;
                }
            }
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
};