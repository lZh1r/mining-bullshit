import {Resource} from "./Resource.js";
import {GigaNum} from "../GigaNum.js";

export class ResourceManager {
    private static instance: ResourceManager;

    //TODO: restrict K to fields that are not readonly
    updateResource<K extends keyof Resource>(resource: Resource, valueToUpdate: K, value: Resource[K]): boolean;
    updateResource<K extends keyof Resource>(resource: string, valueToUpdate: K, value: Resource[K]): boolean;
    updateResource<K extends keyof Resource>(resource: Resource | string, valueToUpdate: K, value: Resource[K]): boolean {
        if (resource instanceof Resource) {
            resource = resource.getId();
        }
        const resourceToUpdate = this.resources.get(resource);
        if (this.resources.get(resource) === undefined) {
            return false;
        }
        resourceToUpdate![0][valueToUpdate] = value;
        this.resources.set(resource, resourceToUpdate!);
        return true;
    }

    constructor(
        private resources: Map<string, [Resource, number]> = new Map()
    ) {}

    public static getInstance() {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    getResources() {
        return this.resources;
    }

    addResource(resource: Resource) {
        this.resources.set(resource.getId(), [resource, 0]);
    }

    hasEnoughOf(resource: [Resource, number][]): boolean;
    hasEnoughOf(resource: Resource, amount: number): boolean;
    hasEnoughOf(resource: Resource | [Resource, number][], amount?: number): boolean {
        const currentResources = this.getResources();
        if (resource instanceof Resource) {
            return currentResources.has(resource.getId()) && currentResources.get(resource.getId())![1] >= amount!;
        } else {
            for (const resourceNumberPair of resource) {
                const neededId = resourceNumberPair[0].getId();
                if (!currentResources.has(neededId) || currentResources.get(neededId)![1] < resourceNumberPair[1]) {
                    return false;
                }
            }
        }
        return true;
    }

    depositResource(resource: Resource, amount: number) {
        const resources = this.resources;
        if (!resources.has(resource.getId())) {
            this.addResource(resource);
        }
        const prevCount = resources.get(resource.getId())![1];
        this.resources.set(resource.getId(), [resource, prevCount + amount]);
    }

    withdrawResource(resource: Resource, amount: number) {
        if (!this.hasEnoughOf(resource, amount)) {
            return false;
        }
        const prevCount = this.resources.get(resource.getId())![1];
        this.resources.set(resource.getId(), [resource, prevCount + amount]);
        return true;
    }

    getTotalValue(resource?: Resource): GigaNum {
        let result = new GigaNum(0);
        const resources = this.resources;
        if (resource) {
            const id = resource.getId();
            if (!resources.has(id)) {
                return result;
            }
            const target = resources.get(id)![0];
            const targetAmount = resources.get(id)![1];
            result = result.add(new GigaNum(target.valuePer).multiply(targetAmount));
            return result;
        }
        resources.forEach((resourceNumberPair) => {
            const resource = resourceNumberPair[0];
            const resourceAmount = resourceNumberPair[1];
            result = result.add(new GigaNum(resource.valuePer).multiply(resourceAmount));
        });
        return result;
    }
}
