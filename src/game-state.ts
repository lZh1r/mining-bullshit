import {computed, signal} from "@preact/signals";
import {GigaNum} from "./util/GigaNum.ts";
import {Resource} from "./util/resources/Resource.ts";
import type {Producer, ProducerType} from "./util/producers/Producer.ts";
import type {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import type {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import type {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import type {MoneyProdCap} from "./util/producers/capabilities/MoneyProdCap.ts";
import type {Upgrade} from "./util/upgrades/Upgrade.ts";
import type {Recipe} from "./util/crafts/Recipe.ts";
import type {MasteryCap} from "./util/resources/capabilities/MasteryCap.ts";
import {Order, type OrderAssistant} from "./util/resources/Order.ts";
import {LootTable} from "./util/LootTable.ts";
import {
    ALUMINUM_INGOT,
    BRICK,
    BRONZE_INGOT,
    COAL,
    COKE,
    CONSTANTAN_INGOT,
    COPPER_INGOT,
    CREOSOTE,
    ELECTRUM_INGOT,
    EMERALD,
    EXCAVATION_TIER1,
    GLASS,
    GOLD_INGOT,
    IRON_INGOT,
    MINING_TIER1,
    MINING_TIER2,
    MINING_TIER3,
    NICKEL_INGOT,
    RUBY,
    SAPPHIRE,
    SAWMILL_TABLE,
    SILICON,
    SILVER_INGOT,
    STEEL_INGOT,
    TIN_INGOT,
    TOPAZ
} from "./registry.ts";
import type {Research} from "./util/upgrades/Research.ts";
import type {Construction} from "./util/upgrades/Construction.ts";
import type {NavBarTab} from "./app.tsx";

export const gameTickInterval = signal(1000);
export const currentTab = signal<NavBarTab>("producer");
export const money = signal(new GigaNum(103));
export const resources = signal(new Map<string, [Resource, number]>());
export const producers = signal(new Map<string, [Producer<ProducerType>, number]>());
export const producerMap = computed(() => {
    const energyProducers = gameActions.getAllProducersOfType("energy");
    const moneyProducers = gameActions.getAllProducersOfType("money");
    const craftingProducers = gameActions.getAllProducersOfType("crafting");
    const resourceProducers = gameActions.getAllProducersOfType("resource");
    return new Map([
        ["energy", energyProducers],
        ["money", moneyProducers],
        ["crafting", craftingProducers],
        ["resource", resourceProducers],
        ["all", [...energyProducers, ...moneyProducers, ...craftingProducers, ...resourceProducers]]
    ]);
});
export const upgrades = signal(new Map<ProducerType, Upgrade[]>([
    ["energy", []],
    ["resource", []],
    ["money", []],
    ["crafting", []]
]));
export const recipes = signal(new Map<Producer<"crafting">, Recipe[]>());
export const recipeQueue = signal(new Map<Producer<"crafting">, Recipe[]>());
export const automationQueue = signal(new Array<Recipe>());
export const orderLootTable = signal<LootTable>(MINING_TIER1);
export const orders = signal<Order[]>([]);
export const ordersCount = signal(0);
export const maxOrderTier = signal<number>(1);
export const orderAssistant = signal<OrderAssistant>({
    enabled: false,
    ticksPerAutomation: 10,
    numberOfOrdersAutomated: 1,
    maxAutomatedOrderTier: 1,
    currentTicks: 0,
});
export const researches = signal(new Map<IDString, Research>());
export const facilities = signal<Construction[]>([]);
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
    addFacility(facility: Construction) {
        facilities.value = [...facilities.value.slice(), facility];
    },
    openTab(tabToOpen: NavBarTab) {
        currentTab.value = tabToOpen;
    },
    addMoney(amount: GigaNum | number) {
        money.value = money.peek().add(amount);
    },
    removeMoney(amount: GigaNum | number) {
        money.value = money.peek().subtract(amount);
    },
    addResource(resource: Resource) {
        resources.value = resources.peek().set(resource.getId(), [resource, 0]);
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
    //TODO: add [Resource, number][] support
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
        if (resource.getCapabilities().has("mastery")) {
            const masteryCap = resource.getCapabilities().get("mastery")! as MasteryCap;
            masteryCap.incrementXp(amount);
        }
        const newMap = new Map(current);
        resources.value = newMap.set(resource.getId(), [resource, prevCount + amount]);
    },
    withdrawResource(resource: Resource | [Resource, number][], amount?: number) {
        const current = resources.value;
        if (!this.hasEnoughOf(resource, amount)) {
            return;
        }
        const newMap = new Map(current);
        if (resource instanceof Resource && amount) {
            const prevCount = current.get(resource.getId())![1];
            newMap.set(resource.getId(), [resource, prevCount - amount]);
        } else if (resource instanceof Resource && !amount) {
            throw new Error("Incorrect usage of withdrawResource! Can't pass Resource and null!");
        } else {
            (resource as [Resource, number][]).forEach(([res, quantity]) => {
                const prevCount = current.get(res.getId())![1];
                newMap.set(res.getId(), [res, prevCount - quantity]);
            });
        }
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
        const newMap = new Map(producers.value);
        const prevCount = newMap.has(producer.id) ? newMap.get(producer.id)![1] : 0;
        newMap.set(producer.id, [producer, amount + prevCount]);
        producers.value = newMap;
    },
    removeProducer(producer: Producer<ProducerType>, amount: number = 1) {
        if (!producers.value.get(producer.id)) {
            return;
        }
        const newMap = new Map(producers.value);
        const prevCount = newMap.get(producer.id)![1];
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
            resultNum = resultNum.add(producer.baseCost.multiply(producer.costScale.pow(currentProducerQuantity + i)).
            multiply(producer.costMultiplier));
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
        if ((cost[0].compareTo(money.value) === "less" ||
            cost[0].compareTo(money.value) === "equal") &&
            this.hasEnoughOf(cost[1])) {
            return power.value.compareTo(powerConsumption.value.add(
                this.getProducerEnergyConsumption(producer, amount))) !== "less";
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
        return producers.value.has(producer.id) ? producers.value.get(producer.id)![1] : 0;
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
                for (const [resource, amount] of output) {
                    let amountToDeposit = amount * cap.yieldMultiplier;
                    if (resource.autoSell) {
                        let amountToSell = 0;
                        const sellCap = resource.autoCellCap;
                        const prevCount = resources.value.get(resource.getId()) ?? [resource, 0];
                        if (amountToDeposit + prevCount[1] > sellCap) {
                            amountToSell = amountToDeposit + prevCount[1] - sellCap;
                            amountToDeposit -= amountToSell;
                            resultNum = resultNum.add(amountToSell * resource.valuePer);
                        }
                    }
                    resultRes.push([resource, amountToDeposit]);
                }
            } else if (producer.type === "money" && this.tickProducer(producer) && producer.getCapabilities().has("money")) {
                const cap = producer.getCapabilities().get("money")! as MoneyProdCap;
                resultNum = resultNum.add(cap.production.multiply(quantity));
            }
        });
        return [resultRes, resultNum];
    },
    addUpgrade(upgrade: Upgrade) {
        const newMap = new Map(upgrades.value);
        newMap.get(upgrade.type)!.push(upgrade);
        upgrades.value = newMap;
    },
    canPurchaseUpgrade(upgrade: Upgrade): boolean {
        const [moneyCost, resourceCost] = upgrade.requirements;
        return (moneyCost.compareTo(money.value) === "less" || moneyCost.compareTo(money.value) === "equal") &&
            this.hasEnoughOf(resourceCost);
    },
    purchaseUpgrade(upgrade: Upgrade) {
        const [moneyCost, resourceCost] = upgrade.requirements;
        if (this.canPurchaseUpgrade(upgrade)) {
            this.removeMoney(moneyCost);
            for (const [resource, amount] of resourceCost) {
                this.withdrawResource(resource, amount);
            }
            upgrade.effect();
            upgrade.isBought = true;
        }
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
        const current = recipeQueue.value;
        const unlocked = recipes.value;
        const producer = recipe.producer;
        if (!current.has(producer)) {
            current.set(producer, []);
            recipeQueue.value = new Map(current);
            return false;
        }
        return !(!unlocked.has(producer) ||
            current.get(producer)!.includes(recipe) ||
            !this.hasEnoughOf(recipe.inputs) ||
            this.getProducerAmount(producer) === 0);
    },
    startRecipe(recipe: Recipe) {
        if (!this.canStartRecipe(recipe)) {
            return;
        }
        const newMap = new Map(recipeQueue.value);
        const producer = recipe.producer;
        for (const [resource, number] of recipe.inputs) {
            this.withdrawResource(resource, number);
        }
        if (!newMap.has(producer)) {
            newMap.set(producer, []);
        }
        const existing = newMap.get(recipe.producer)!;
        newMap.set(producer, [...existing, recipe]);
        recipeQueue.value = newMap;
    },
    stopRecipe(recipe: Recipe) {
        const newMap = new Map(recipeQueue.value);
        const producer = recipe.producer;
        const existing = newMap.get(producer);
        if (!existing || !existing.includes(recipe)) {
            return;
        }
        existing.find((value) => value.id === recipe.id)!.resetCurrentTicks();
        newMap.set(producer, existing.filter((val) => val.id !== recipe.id));
        recipeQueue.value = newMap;
    },
    addOrder() {
        orders.value = [...orders.value, new Order(Math.ceil(Math.random() * maxOrderTier.value), orderLootTable.value)];
    },
    removeOrder(order: Order) {
        orders.value = orders.value.filter(o => o !== order);
    },
    canCompleteOrder(order: Order) {
        const requirements = order.requirements;
        return this.hasEnoughOf(requirements);
    },
    completeOrder(order: Order) {
        if (this.canCompleteOrder(order)) {
            this.removeOrder(order);
            this.addOrder();
            for (const [resource, amount] of order.requirements) {
                this.withdrawResource(resource, amount);
            }
            this.addMoney(order.reward);
            this.incrementOrderCount();
        }
    },
    expandOrderLootTable(resources: [Resource, number][] | LootTable) {
        let newTable = orderLootTable.value;
        if (resources instanceof LootTable) {
            newTable = newTable.combine(resources);
        } else {
            for (const [resource, weight] of resources) {
                newTable = newTable.push(resource, weight);
            }
        }
        orderLootTable.value = newTable;
    },
    shrinkOrderLootTable(loot: Resource | LootTable) {
        orderLootTable.value = orderLootTable.value.remove(loot);
    },
    incrementOrderCount() {
        ordersCount.value += 1;
        const count = ordersCount.value;
        switch (count) {
            case 5:
                this.expandOrderLootTable([[COAL, 5], [COPPER_INGOT, 3], [IRON_INGOT, 2]]);
                break;
            case 20:
                this.expandOrderLootTable(EXCAVATION_TIER1);
                this.shrinkOrderLootTable(MINING_TIER1);
                break;
            case 30:
                this.expandOrderLootTable(MINING_TIER2);
                this.shrinkOrderLootTable(MINING_TIER1);
                this.expandOrderLootTable([[GLASS, 2]]);
                break;
            case 40:
                this.expandOrderLootTable([
                    [STEEL_INGOT, 4], [TIN_INGOT, 6], [NICKEL_INGOT, 4],
                    [SILICON, 6], [COPPER_INGOT, 4], [IRON_INGOT, 3]
                ]);
                break;
            case 50:
                this.expandOrderLootTable(SAWMILL_TABLE);
                maxOrderTier.value += 1;
                break;
            case 70:
                this.expandOrderLootTable(MINING_TIER3);
                this.shrinkOrderLootTable(MINING_TIER2);
                this.shrinkOrderLootTable(MINING_TIER1);
                break;
            case 85:
                this.expandOrderLootTable([
                    [ALUMINUM_INGOT, 4], [SILVER_INGOT, 2], [GOLD_INGOT, 1], [COPPER_INGOT, 1],
                    [GLASS, 2], [IRON_INGOT, 1], [RUBY, 1], [SAPPHIRE, 1], [TOPAZ, 1], [EMERALD, 1]
                ]);
                break;
            case 100:
                this.shrinkOrderLootTable(MINING_TIER3);
                this.expandOrderLootTable([
                    [BRONZE_INGOT, 2], [CONSTANTAN_INGOT, 2], [ELECTRUM_INGOT, 1], [BRICK, 3]
                ]);
                break;
            case 110:
                this.expandOrderLootTable([
                    [COKE, 2], [CREOSOTE, 3]
                ]);
                break;
        }
    },
};