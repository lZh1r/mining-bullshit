import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import {LootTable} from "../../LootTable.ts";

export class MiningCap implements IProdCapability {
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    private readonly initialLootTable: LootTable;

    constructor(
        public lootTable: LootTable,
        public yieldMultiplier: number = 1,
    ) {
        this.id = "mining";
        this.applicableToProducerOfType = "resource";
        this.initialLootTable = new LootTable(lootTable.getResourceWeightPairs());
    }

    expandLootTable(extraTable: LootTable) {
        this.lootTable = this.lootTable.combine(extraTable);
    }

    reset() {
        this.lootTable = this.initialLootTable;
    }
}