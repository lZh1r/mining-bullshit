import type {IProdCapability} from "./IProdCapability.ts";
import type {ProducerType} from "../Producer.ts";
import type {LootTable} from "../../LootTable.ts";

export class MiningCap implements IProdCapability {
    public id: IDString;
    public applicableToProducerOfType: ProducerType;
    constructor(
        public lootTable: LootTable,
        public yieldMultiplier: number = 1,
    ) {
        this.id = "mining";
        this.applicableToProducerOfType = "resource";
    }

    expandLootTable(extraTable: LootTable) {
        this.lootTable = this.lootTable.combine(extraTable);
    }
}