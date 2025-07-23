import {Resource} from "./util/resources/Resource";
import {resourceFuelConfig, resourceValueConfig} from "./config/resource";
import {BurnableCap} from "./util/resources/capabilities/BurnableCap";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {producerConfig} from "./config/producer.ts";
import {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import {LootTable} from "./util/LootTable.ts";
import {oreLootTableConfig} from "./config/loottable.ts";
import {ProducerUpgrade} from "./util/upgrades/ProducerUpgrade.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {gameActions} from "./game-state.ts";
import {Recipe} from "./util/crafts/Recipe.ts";

/* RESOURCES */
/* TIER 1 */
export const ROCK = new Resource("rock", "Rocks", resourceValueConfig.rock.raw);
export const IRON_ORE = new Resource("iron_ore", "Iron Ore", resourceValueConfig.iron.ore);
export const IRON_INGOT = new Resource("iron_ingot", "Iron Ingot", resourceValueConfig.iron.ingot);
export const COPPER_ORE = new Resource("copper_ore", "Copper Ore", resourceValueConfig.copper.ore);
export const COPPER_INGOT = new Resource("copper_ingot", "Copper Ingot", resourceValueConfig.copper.ingot);
export const COAL_ORE = new Resource("coal_ore", "Coal Ore", resourceValueConfig.coal.ore);
const COAL = new Resource("coal", "Coal", resourceValueConfig.coal.processed);
COAL.addCapability(new BurnableCap(resourceFuelConfig.coal));

/* LOOT TABLES */
export const MINING_TIER1 = new LootTable([
    [ROCK, oreLootTableConfig.planetA.mining.tier1.rock],
    [COPPER_ORE, oreLootTableConfig.planetA.mining.tier1.copper],
    [COAL_ORE, oreLootTableConfig.planetA.mining.tier1.coal],
    [IRON_ORE, oreLootTableConfig.planetA.mining.tier1.iron]
]);

/* PRODUCERS */
/* ENERGY */
export const HAMSTER_WHEEL = Producer.energy("hamster_wheel", "Hamster Wheel",
    producerConfig.energy.hamsterWheel.defaultCost, producerConfig.energy.hamsterWheel.defaultCostScale);
HAMSTER_WHEEL.addCapability(new EnergyGenCap(producerConfig.energy.hamsterWheel.energyGeneration));
/* RESOURCE */
export const MINE = Producer.resource("mine", "Mine",
    producerConfig.resource.mine.defaultCost, producerConfig.resource.mine.defaultCostScale, producerConfig.resource.mine.ticksPerOperation);
MINE.addCapability(new EnergyConsumptionCap(producerConfig.resource.mine.energyConsumption));
MINE.addCapability(new MiningCap(MINING_TIER1));
/* CRAFTING */
export const FURNACE = Producer.crafting("furnace", "Furnace",
    producerConfig.crafting.furnace.defaultCost, producerConfig.crafting.furnace.defaultCostScale,
    producerConfig.crafting.furnace.ticksPerOperation, 1, [[ROCK, 10]]);
FURNACE.addCapability(new EnergyConsumptionCap(producerConfig.crafting.furnace.energyConsumption));

/* RECIPES */
const IRON_INGOT_FURNACE = new Recipe("iron_ingot_furnace", "Iron Ore to Ingot",
    FURNACE, [[IRON_INGOT, 1]], [[IRON_ORE, 2]], 5);
const COPPER_INGOT_FURNACE = new Recipe("copper_ingot_furnace", "Copper Ore to Ingot",
    FURNACE, [[COPPER_INGOT, 1]], [[COPPER_ORE, 2]], 4);
const COAL_FURNACE = new Recipe("coal_furnace", "Coal Ore to Processed",
    FURNACE, [[COAL, 1]], [[COAL_ORE, 2]], 2);

/* UPGRADES */
export const UNLOCK_FURNACE_UP = new ProducerUpgrade("unlock_furnace", "Unlock Furnace",
    "Unlocks a new building!", "crafting", () => {
        gameActions.addProducer(FURNACE);
        UNLOCK_FURNACE_UP.isBought = true;
        gameActions.addRecipe(IRON_INGOT_FURNACE);
        gameActions.addRecipe(COPPER_INGOT_FURNACE);
        gameActions.addRecipe(COAL_FURNACE);
    }, [new GigaNum(30), new Array([ROCK, 20])]);

/* INITIALIZATION */
export function gameInit() {
    gameActions.depositResource(ROCK, 30);
    gameActions.addProducer(HAMSTER_WHEEL);
    gameActions.addProducer(MINE);
    gameActions.addUpgrade(UNLOCK_FURNACE_UP);
}