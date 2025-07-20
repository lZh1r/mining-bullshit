import {computed, signal} from "@preact/signals";
import {GigaNum} from "./util/GigaNum.ts";
import {Resource} from "./util/resources/Resource.ts";

export const money = signal(new GigaNum(100));
export const power = signal(new GigaNum(0));
export const resources = signal(new Map<string, [Resource, number]>());
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
    }
};