import {computed, signal} from "@preact/signals";
import {GigaNum} from "./util/GigaNum.ts";
import {Resource} from "./util/resources/Resource.ts";
import type {Producer, ProducerType} from "./util/producers/Producer.ts";

export const money = signal(new GigaNum(100));
export const power = signal(new GigaNum(0));
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

export const gameActions = {
    addMoney(amount: GigaNum | number) {
        money.value = money.value.add(amount);
    },
    removeMoney(amount: GigaNum | number) {
        money.value = money.value.subtract(amount);
    },
    addPower(amount: GigaNum | number) {
        power.value = power.value.add(amount);
    },
    removePower(amount: GigaNum | number) {
        power.value = power.value.subtract(amount);
    },
    addResource(resource: Resource) {
        resources.value = resources.value.set(resource.getId(), [resource, 0]);
    },
    hasEnoughOf(resource: Resource, amount: number): boolean {
        const currentResources = resources.value;
        return currentResources.has(resource.getId()) && currentResources.get(resource.getId())![1] >= amount!;
    },
    depositResource(resource: Resource, amount: number) {
        const prevCount = resources.value.get(resource.getId())![1];
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
        producers.value = producers.value.set(producer.id, [producer, amount]);
    },
    removeProducer(producer: Producer<ProducerType>, amount: number = 1) {
        if (!producers.value.get(producer.id)) {
            return;
        }
        const prevCount = producers.value.get(producer.id)![1];
        producers.value = producers.value.set(producer.id, [producer, prevCount - amount]);
    },
    deleteProducer(producer: Producer<ProducerType>) {
        producers.value.delete(producer.id);
    },
    getProducerCost(producer: Producer<ProducerType>, amount: number = 1): [GigaNum, [Resource, number][]] {
        let resultNum = new GigaNum(0);
        for (let i = 0; i < amount; i++) {
            resultNum = resultNum.add(producer.baseCost.multiply(producer.costScale.pow(producer.quantity + i)).multiply(producer.costMultiplier));
        }
        const resultRes: [Resource, number][] = [];
        for (const resource of producer.resourcesNeeded) {
            resultRes.push([resource[0], resource[1] * amount]);
        }
        return [resultNum, resultRes];
    },
    purchaseProducer(producer: Producer<ProducerType>, amount: number = 1) {
        const cost = this.getProducerCost(producer, amount);
        if (cost[0] <= money.value) {
            for (const resourceNumPair of cost[1]) {
                if (!this.hasEnoughOf(resourceNumPair[0], resourceNumPair[1])) {
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
            this.removeProducer(producer, amount);
        }
    }
};