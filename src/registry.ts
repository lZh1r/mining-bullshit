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
ROCK.addOnGet(() => {
    gameActions.addProducer(FURNACE);
});
export const IRON_ORE = new Resource("iron_ore", "Iron Ore", 5);
export const IRON_INGOT = new Resource("iron_ingot", "Iron Ingot", 15);
IRON_INGOT.addOnGet(() => {
    gameActions.addUpgrade(MINE_IRON_DRILLS);
});
export const COPPER_ORE = new Resource("copper_ore", "Copper Ore", 3);
export const COPPER_INGOT = new Resource("copper_ingot", "Copper Ingot", 9);
COPPER_INGOT.addOnGet(() => {
    gameActions.addProducer(EXCAVATOR);
});
export const COAL_ORE = new Resource("coal_ore", "Coal Ore", 2);
export const COAL = new Resource("coal", "Coal", 6);
COAL.addOnGet(() => {
    gameActions.addProducer(COMBUSTION_GENERATOR);
    gameActions.addUpgrade(HAMSTER_WHEEL_CARBS);
});
export const SAND = new Resource("sand", "Sand", 1);
export const CLAY = new Resource("clay", "Clay", 1);
/* TIER 2 */
export const QUARTZ = new Resource("quartz", "Quartz", 2);
QUARTZ.addOnGet(() => {
    gameActions.addRecipe(GLASS_FURNACE);
    gameActions.addRecipe(SILICON_FURNACE);
});
export const TIN_ORE = new Resource("tin_ore", "Tin Ore", 4);
export const TIN_INGOT = new Resource("tin_ingot", "Tin Ingot", 12);
export const NICKEL_ORE = new Resource("nickel_ore", "Nickel Ore", 6);
export const NICKEL_INGOT = new Resource("nickel_ingot", "Nickel Ingot", 18);
export const STEEL_INGOT = new Resource("steel_ingot", "Steel Ingot", 25);
export const GLASS = new Resource("glass", "Glass", 4);
export const SILICON = new Resource("silicon", "Silicon", 12);
SILICON.addOnGet(() => {
    //Add solar panel
});



/* LOOT TABLES */
export const MINING_TIER1 = new LootTable([
    [ROCK, 10],
    [COPPER_ORE, 3],
    [COAL_ORE, 5],
    [IRON_ORE, 2]
]);
export const MINING_TIER2 = new LootTable([
    [ROCK, 6],
    [IRON_ORE, 2],
    [QUARTZ, 5],
    [NICKEL_ORE, 2],
    [TIN_ORE, 3],
    [COPPER_ORE, 1],
    [COAL, 1],
]);
export const EXCAVATION_TIER1 = new LootTable([
    [SAND, 3],
    [CLAY, 1],
]);



/* PRODUCERS */
/* ENERGY */
export const HAMSTER_WHEEL = Producer.energy("hamster_wheel", "Hamster Wheel",
    "Who knew that hamsters are so good at power generation?",
    new GigaNum(5), new GigaNum(1.2));
HAMSTER_WHEEL.addCapability(new EnergyGenCap(new GigaNum(5)));
export const COMBUSTION_GENERATOR = Producer.energy("combustion_generator", "Combustion Generator",
    "Watch the world burn.", new GigaNum(25), new GigaNum(2), [[COAL, 5]]);
COMBUSTION_GENERATOR.addCapability(new EnergyGenCap(new GigaNum(25)));

/* RESOURCE */
export const MINE = Producer.resource("mine", "Mine",
"Send your enemies to work for you in this beautiful resort!",
    new GigaNum(20), new GigaNum(1.7), 5);
MINE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
MINE.addCapability(new MiningCap(MINING_TIER1));
export const EXCAVATOR = Producer.resource("excavator", "Excavator",
    "That big yellow car.", new GigaNum(25), new GigaNum(1.8), 3, 1, [[COPPER_INGOT, 2]]);
EXCAVATOR.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
EXCAVATOR.addCapability(new MiningCap(EXCAVATION_TIER1));

/* CRAFTING */
export const FURNACE = Producer.crafting("furnace", "Furnace",
    "Smelts things on the most primitive level.",
    new GigaNum(30), new GigaNum(1.5), 2, 1, [[ROCK, 10]]);
FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(IRON_INGOT_FURNACE);
    gameActions.addRecipe(COPPER_INGOT_FURNACE);
    gameActions.addRecipe(COAL_FURNACE);
});
export const BLAST_FURNACE = Producer.crafting("blast_furnace", "Blast Furnace",
    "Makes steel and some other alloys.", new GigaNum(50), new GigaNum(1.7), 5, 1,
    [[ROCK, 20], [NICKEL_INGOT, 2]]);
BLAST_FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(40)));
BLAST_FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(STEEL_BLAST_FURNACE);
});

/* MONEY */



/* RECIPES */
const IRON_INGOT_FURNACE = new Recipe("iron_ingot_furnace", "Iron Ore to Ingot",
    FURNACE, [[IRON_INGOT, 1]], [[IRON_ORE, 2]], 5);
const COPPER_INGOT_FURNACE = new Recipe("copper_ingot_furnace", "Copper Ore to Ingot",
    FURNACE, [[COPPER_INGOT, 1]], [[COPPER_ORE, 2]], 4);
const COAL_FURNACE = new Recipe("coal_furnace", "Coal Ore to Processed",
    FURNACE, [[COAL, 1]], [[COAL_ORE, 2]], 2);
const STEEL_BLAST_FURNACE = new Recipe("steel_blast_furnace", "Iron and Coal into Steel", BLAST_FURNACE,
    [[STEEL_INGOT, 1]], [[IRON_INGOT, 1], [COAL, 1]], 4);
const TIN_INGOT_FURNACE = new Recipe("tin_ingot_furnace", "Tin Ore to Ingot",
    FURNACE, [[TIN_INGOT, 1]], [[TIN_ORE, 2]], 3);
const NICKEL_INGOT_FURNACE = new Recipe("nickel_ingot_furnace", "Nickel Ore to Ingot",
    FURNACE, [[NICKEL_INGOT, 1]], [[NICKEL_ORE, 2]], 5);
const GLASS_FURNACE = new Recipe("glass_furnace", "Sand into Glass", FURNACE, [[GLASS, 1]], [[SAND, 2]], 2);
const SILICON_FURNACE = new Recipe("silicon_furnace", "Quartz and Coal into Silicon",
    FURNACE, [[SILICON, 1]], [[QUARTZ, 2], [COAL, 1]], 6);



/* UPGRADES */
export const HAMSTER_WHEEL_CARBS = new ProducerUpgrade("hamster_wheel_carbs", "Carboloading",
    "Changes hamsters' diet to make them run faster.", "energy", () => {
        const cap = HAMSTER_WHEEL.getCapabilities().get("energy") as EnergyGenCap;
        cap.energyGenerationMultiplier *= 1.5;
        HAMSTER_WHEEL.updateCapability(cap);
        HAMSTER_WHEEL_CARBS.isBought = true;
    }, [new GigaNum(100), [[COAL, 10]]]);
export const MINE_IRON_DRILLS = new ProducerUpgrade("mine_iron_drills", "Iron Drills",
    "What were you drilling with before? Mines now give new ores.", "resource", () => {
        const cap = MINE.getCapabilities().get("mining") as MiningCap;
        cap.expandLootTable(MINING_TIER2);
        MINE.updateCapability(cap);
        gameActions.addRecipe(TIN_INGOT_FURNACE);
        gameActions.addRecipe(NICKEL_INGOT_FURNACE);
        MINE_IRON_DRILLS.isBought = true;
    }, [new GigaNum(50), [[IRON_INGOT, 4]]]);



/* INITIALIZATION */
export function gameInit() {
    gameActions.addProducer(HAMSTER_WHEEL);
    gameActions.addProducer(MINE);
}