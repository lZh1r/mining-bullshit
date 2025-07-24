import {Resource} from "./util/resources/Resource";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import {LootTable} from "./util/LootTable.ts";
import {ProducerUpgrade} from "./util/upgrades/ProducerUpgrade.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {gameActions} from "./game-state.ts";
import {Recipe} from "./util/crafts/Recipe.ts";

/* RESOURCES */
/* TIER 1 */
export const ROCK = new Resource("rock", "Rocks", 1);
export const IRON_ORE = new Resource("iron_ore", "Iron Ore", 5);
export const IRON_INGOT = new Resource("iron_ingot", "Iron Ingot", 15);
export const COPPER_ORE = new Resource("copper_ore", "Copper Ore", 3);
export const COPPER_INGOT = new Resource("copper_ingot", "Copper Ingot", 9);
export const COAL_ORE = new Resource("coal_ore", "Coal Ore", 2);
export const COAL = new Resource("coal", "Coal", 6);



/* LOOT TABLES */
export const MINING_TIER1 = new LootTable([
    [ROCK, 10],
    [COPPER_ORE, 3],
    [COAL_ORE, 5],
    [IRON_ORE, 2]
]);



/* PRODUCERS */
/* ENERGY */
export const HAMSTER_WHEEL = Producer.energy("hamster_wheel", "Hamster Wheel",
    new GigaNum(5), new GigaNum(1.2));
HAMSTER_WHEEL.addCapability(new EnergyGenCap(new GigaNum(5)));

/* RESOURCE */
export const MINE = Producer.resource("mine", "Mine",
    new GigaNum(20), new GigaNum(1.7), 5);
MINE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
MINE.addCapability(new MiningCap(MINING_TIER1));

/* CRAFTING */
export const FURNACE = Producer.crafting("furnace", "Furnace",
    new GigaNum(30), new GigaNum(1.5), 2, 1, [[ROCK, 10]]);
FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));



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
    }, [new GigaNum(30), new Array([ROCK, 10])]);



/* INITIALIZATION */
export function gameInit() {
    gameActions.addProducer(HAMSTER_WHEEL);
    gameActions.addProducer(MINE);
    gameActions.addUpgrade(UNLOCK_FURNACE_UP);
}