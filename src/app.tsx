import {gameActions, money, power, powerConsumption} from "./game-state.ts";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {LootTable} from "./util/LootTable.ts";
import {COAL_ORE, COPPER_ORE, IRON_ORE, ROCK} from "./registry.ts";
import {oreLootTableConfig} from "./config/loottable.ts";
import {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";

const generator = Producer.energy("id", "Generator", new GigaNum(10), new GigaNum(2));
const generatorCap = new EnergyGenCap(new GigaNum(10));
generator.addCapability(generatorCap);
const consumer = Producer.money("con", "Money Printer", new GigaNum(20), new GigaNum(10));
const consumerCap = new EnergyConsumptionCap(new GigaNum(25));
consumer.addCapability(consumerCap);

const testLootTable = new LootTable(
    [
        [ROCK, oreLootTableConfig.planetA.mining.tier1.rock],
        [COAL_ORE, oreLootTableConfig.planetA.mining.tier1.rock],
        [IRON_ORE, oreLootTableConfig.planetA.mining.tier1.iron],
        [COPPER_ORE, oreLootTableConfig.planetA.mining.tier1.copper]
    ]
);

console.log(testLootTable.roll(10));

export function App() {

    return (
        <div class="flex flex-col text-2xl text-center space-y-4 p-4">
            <p>{powerConsumption.value.toString()} / {power.value.toString()} Energy</p>
            <p>{money.value.toString()} Money</p>
            <div class="space-x-4">
                <button onClick={() => {
                    gameActions.purchaseProducer(generator, 1);
                }}>
                    Add a generator {gameActions.getProducerCost(generator).toString()}
                </button>
                <button onClick={() => {
                    gameActions.purchaseProducer(consumer, 1);
                }}>
                    Add a consumer {gameActions.getProducerCost(consumer).toString()}
                </button>
            </div>
            <button onClick={() => {
                gameActions.sellProducer(generator, 1);
            }}>
                Sell a generator
            </button>
        </div>
    );
}
