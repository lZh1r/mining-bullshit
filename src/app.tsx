import {gameActions, money, power} from "./game-state.ts";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {LootTable} from "./util/LootTable.ts";
import {COAL_ORE, COPPER_ORE, IRON_ORE, ROCK} from "./registry.ts";
import {oreLootTableConfig} from "./config/loottable.ts";

const generator = Producer.energy("id", "Generator", new GigaNum(10), new GigaNum(2));
const generatorCap = new EnergyGenCap(new GigaNum(10));
generator.addCapability(generatorCap);
gameActions.addProducer(generator);

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
            <p>{power.value.toString()} Energy</p>
            <p>{money.value.toString()} Money</p>
            <button onClick={() => {
                gameActions.purchaseProducer(generator, 1);
            }}>
                Add a generator {gameActions.getProducerCost(generator).toString()}
            </button>
            <button onClick={() => {
                gameActions.sellProducer(generator, 1);
            }}>
                Sell a generator
            </button>
        </div>
    );
}
