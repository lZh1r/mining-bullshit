import type {Resource} from "./resources/Resource.ts";

interface LootInterval {
    min: number,
    max: number,
    value: Resource,
}

export class LootTable {
    private totalWeight: number;
    private lootLookUpTable: LootInterval[];
    constructor(
        private resourceWeightPairs: [Resource, number][]
    ) {
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

    roll(n: number = 1): Resource[] {
        const outcome = new Array<Resource>;
        for (let i = 0; i < n; i++) {
            const rolledNumber = Math.floor(Math.random() * this.totalWeight);
            outcome.push(
                this.lootLookUpTable.find(entry => rolledNumber >= entry.min && rolledNumber < entry.max)!.value
            );
        }
        return outcome;
    }

    combine(...tables: LootTable[]): LootTable {
        let newResourceWeightPairs = new Array<[Resource, number]>;
        for (const table of tables) {
            newResourceWeightPairs = newResourceWeightPairs.concat(table.resourceWeightPairs);
        }
        return new LootTable(newResourceWeightPairs);
    }
}