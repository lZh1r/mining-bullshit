import type {Resource} from "./resources/Resource.ts";

interface LootInterval {
    min: number,
    max: number,
    value: Resource,
}

export class LootTable {
    private totalWeight: number = 0;
    private lootLookUpTable: LootInterval[] = [];
    constructor(
        private resourceWeightPairs: [Resource, number][]
    ) {
        this.generateLootLookUpTable(resourceWeightPairs);
    }

    private generateLootLookUpTable(resourceWeightPairs: [Resource, number][]) {
        let totalWeight = 0;
        let prevMin = 0;
        const lootLookUpTable = new Array<LootInterval>;
        for (const resourceWeightPair of resourceWeightPairs) {
            totalWeight += resourceWeightPair[1];
            lootLookUpTable.push({
                min: prevMin,
                max: totalWeight,
                value: resourceWeightPair[0]
            });
            prevMin += resourceWeightPair[1];
        }
        this.lootLookUpTable = lootLookUpTable;
        this.totalWeight = totalWeight;
    }

    roll(n: number = 1): [Resource, number][] {
        const outcome = new Map<Resource, number>();
        for (let i = 0; i < n; i++) {
            const rolledNumber = Math.floor(Math.random() * this.totalWeight);
            const resourceToAdd =
                this.lootLookUpTable.find(entry => rolledNumber >= entry.min && rolledNumber < entry.max)!.value;
            const prevCount = outcome.get(resourceToAdd) ?? 0;
            outcome.set(resourceToAdd, prevCount + 1);
        }
        return Array.from(outcome);
    }

    combine(...tables: LootTable[]): LootTable {
        const newResourceWeightPairs = this.resourceWeightPairs;
        for (const table of tables) {
            for (const [resource, weight] of table.resourceWeightPairs) {
                const existingPair =
                    newResourceWeightPairs.find((val) => val[0] === resource);
                if (existingPair) {
                    newResourceWeightPairs[newResourceWeightPairs.indexOf(existingPair)] = [existingPair[0], existingPair[1] + weight];
                } else {
                    newResourceWeightPairs.push([resource, weight]);
                }
            }
        }
        return new LootTable(newResourceWeightPairs);
    }

    getResourceWeightPairs() {
        return this.resourceWeightPairs;
    }

    expand(...tables: LootTable[]): void {
        const newResourceWeightPairs = this.resourceWeightPairs;
        for (const table of tables) {
            for (const [resource, weight] of table.resourceWeightPairs) {
                const existingPair =
                    newResourceWeightPairs.find((val) => val[0] === resource);
                if (existingPair) {
                    newResourceWeightPairs[newResourceWeightPairs.indexOf(existingPair)] = [existingPair[0], existingPair[1] + weight];
                } else {
                    newResourceWeightPairs.push([resource, weight]);
                }
            }
        }
        this.resourceWeightPairs = newResourceWeightPairs;
        this.generateLootLookUpTable(newResourceWeightPairs);
    }
}