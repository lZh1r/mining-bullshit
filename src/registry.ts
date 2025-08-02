import {Resource} from "./util/resources/Resource";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import {LootTable} from "./util/LootTable.ts";
import {Upgrade} from "./util/upgrades/Upgrade.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {gameActions, orderAssistant} from "./game-state.ts";
import {Recipe} from "./util/crafts/Recipe.ts";
import {MasteryCap} from "./util/resources/capabilities/MasteryCap.ts";

/* RESOURCES */
/* TIER 1 */
export const ROCK = new Resource("rock", "Rocks", 1);
ROCK.addOnGet(() => {
    gameActions.addProducer(FURNACE);
});
const IRON_ORE = new Resource("iron_ore", "Iron Ore", 5);
export const IRON_INGOT = new Resource("iron_ingot", "Iron Ingot", 15);
IRON_INGOT.addOnGet(() => {
    gameActions.addUpgrade(MINE_IRON_DRILLS);
    gameActions.addUpgrade(MINE_AUTOCLICKER_TIER1);
    gameActions.addUpgrade(AGGRESSIVE_MARKETING_TIER1);
});
const COPPER_ORE = new Resource("copper_ore", "Copper Ore", 3);
export const COPPER_INGOT = new Resource("copper_ingot", "Copper Ingot", 9);
COPPER_INGOT.addOnGet(() => {
    gameActions.addProducer(EXCAVATOR);
});
const COAL_ORE = new Resource("coal_ore", "Coal Ore", 2);
export const COAL = new Resource("coal", "Coal", 6);
COAL.addOnGet(() => {
    gameActions.addProducer(COMBUSTION_GENERATOR);
    gameActions.addUpgrade(HAMSTER_WHEEL_CARBS);
    gameActions.addUpgrade(FURNACE_OVERCLOCK_TIER1);
});
const SAND = new Resource("sand", "Sand", 1);
const CLAY = new Resource("clay", "Clay", 1);
/* TIER 2 */
const QUARTZ = new Resource("quartz", "Quartz", 2);
QUARTZ.addOnGet(() => {
    gameActions.addRecipe(GLASS_FURNACE);
    gameActions.addRecipe(SILICON_FURNACE);
});
const TIN_ORE = new Resource("tin_ore", "Tin Ore", 4);
export const TIN_INGOT = new Resource("tin_ingot", "Tin Ingot", 12);
TIN_INGOT.addOnGet(() => {
    gameActions.addUpgrade(FURNACE_AUTOCLICKER);
});
const NICKEL_ORE = new Resource("nickel_ore", "Nickel Ore", 6);
export const NICKEL_INGOT = new Resource("nickel_ingot", "Nickel Ingot", 18);
NICKEL_INGOT.addOnGet(() => {
    gameActions.addProducer(BLAST_FURNACE);
});
export const STEEL_INGOT = new Resource("steel_ingot", "Steel Ingot", 25);
STEEL_INGOT.addCapability(new MasteryCap(100, 1.1, () => {
    BLAST_FURNACE.ticksMultiplier *= 0.99;
}));
STEEL_INGOT.addOnGet(() => {
    gameActions.addProducer(SAWMILL);
});
export const GLASS = new Resource("glass", "Glass", 4);
export const SILICON = new Resource("silicon", "Silicon", 12);
SILICON.addOnGet(() => {
    gameActions.addProducer(SOLAR_PANEL);
});
const WOOD = new Resource("wood", "Wood", 2);
WOOD.addOnGet(() => {
    gameActions.addRecipe(CHARCOAL_FURNACE);
});
const SAWDUST = new Resource("sawdust", "Sawdust", 1);
export const CHARCOAL = new Resource("charcoal", "Charcoal", 5);
CHARCOAL.addOnGet(() => {
    gameActions.addRecipe(CAST_IRON_BLAST_FURNACE);
});
export const CAST_IRON_INGOT = new Resource("cast_iron_ingot", "Cast Iron Ingot", 20);
/* TIER 3 */
const SILVER_ORE = new Resource("silver_ore", "Silver Ore", 10);
export const SILVER_INGOT = new Resource("silver_ingot", "Silver Ingot", 30);
const GOLD_ORE = new Resource("gold_ore", "Gold Ore", 100);
export const GOLD_INGOT = new Resource("gold_ingot", "Gold Ingot", 300);
const ALUMINUM_ORE = new Resource("aluminum_ore", "Aluminum Ore", 7);
export const ALUMINUM_INGOT = new Resource("aluminum_ingot", "Aluminum Ingot", 21);
ALUMINUM_INGOT.addOnGet(() => {
    gameActions.addProducer(ALLOY_FURNACE);
});
export const RUBY = new Resource("ruby", "Ruby", 100);
export const SAPPHIRE = new Resource("sapphire", "Sapphire", 100);
export const EMERALD = new Resource("emerald", "Emerald", 100);
EMERALD.addOnGet(() => {
    gameActions.addProducer(ASSEMBLER);
});
export const TOPAZ = new Resource("topaz", "Topaz", 100);
export const BRONZE_INGOT = new Resource("bronze_ingot", "Bronze Ingot", 14);
export const CONSTANTAN_INGOT = new Resource("constantan_ingot", "Constantan Ingot", 20);
export const ELECTRUM_INGOT = new Resource("electrum_ingot", "Electrum Ingot", 170);
export const CIRCUIT_TIER1 = new Resource("circuit_tier1", "Tier I Circuit", 50);
export const GEM_LATTICE = new Resource("gem_lattice", "Gem Lattice", 500);

/* TIER 4 */
const LEAD_ORE = new Resource("lead_ore", "Lead Ore", 10);
export const LEAD_INGOT = new Resource("lead_ingot", "Lead Ingot", 30);
export const DIAMOND = new Resource("diamond", "Diamond", 750);
export const ZINC_ORE = new Resource("zinc_ore", "Zinc Ore", 8);
export const ZINC_INGOT = new Resource("zinc_ingot", "Zinc Ingot", 24);
export const BRASS_INGOT = new Resource("brass_ingot", "Brass Ingot", 30);
export const CIRCUIT_TIER2 = new Resource("circuit_tier2", "Tier II Circuit", 75);



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
export const MINING_TIER3 = new LootTable([
    [ROCK, 4],
    [SILVER_ORE, 2],
    [GOLD_ORE, 1],
    [ALUMINUM_ORE, 4],
    [RUBY, 1],
    [SAPPHIRE, 1],
    [EMERALD, 1],
    [TOPAZ, 1],
    [IRON_ORE, 2],
    [NICKEL_ORE, 2],
    [TIN_ORE, 1],
]);
export const EXCAVATION_TIER1 = new LootTable([
    [SAND, 9],
    [CLAY, 3],
]);
export const SAWMILL_TABLE = new LootTable([
    [WOOD, 10],
    [SAWDUST, 5],
]);



/* PRODUCERS */
/* ENERGY */
const HAMSTER_WHEEL = Producer.energy("hamster_wheel", "Hamster Wheel",
    "Who knew that hamsters are so good at power generation?",
    new GigaNum(5), new GigaNum(1.2));
HAMSTER_WHEEL.addCapability(new EnergyGenCap(new GigaNum(5)));
const COMBUSTION_GENERATOR = Producer.energy("combustion_generator", "Combustion Generator",
    "Watch the world burn.", new GigaNum(25), new GigaNum(2), [[COAL, 5]]);
COMBUSTION_GENERATOR.addCapability(new EnergyGenCap(new GigaNum(25)));
const SOLAR_PANEL = Producer.energy("solar_panel", "Solar Panel",
    "Eco-friendly energy production.", new GigaNum(100), new GigaNum(1.1), [[SILICON, 2], [GLASS, 4]]);
SOLAR_PANEL.addCapability(new EnergyGenCap(new GigaNum(20)));

/* RESOURCE */
const MINE = Producer.resource("mine", "Mine",
"Send your enemies to work for you in this beautiful resort!",
    new GigaNum(20), new GigaNum(1.45), 5);
MINE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
MINE.addCapability(new MiningCap(MINING_TIER1));
const EXCAVATOR = Producer.resource("excavator", "Excavator",
    "That big yellow car.", new GigaNum(25), new GigaNum(1.8), 3, 1, [[COPPER_INGOT, 2]]);
EXCAVATOR.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
EXCAVATOR.addCapability(new MiningCap(EXCAVATION_TIER1));
const SAWMILL = Producer.resource("sawmill", "Sawmill",
    "TREES! THEY ARE EVERYWHERE!", new GigaNum(250), new GigaNum(2), 2, 1,
    [[STEEL_INGOT, 5], [COPPER_INGOT, 10]]);
SAWMILL.addCapability(new MiningCap(SAWMILL_TABLE));
SAWMILL.addCapability(new EnergyConsumptionCap(new GigaNum(30)));

/* CRAFTING */
const FURNACE = Producer.crafting("furnace", "Furnace",
    "Smelts things on the most primitive level.",
    new GigaNum(30), new GigaNum(1.5), 2, 1, [[ROCK, 10]]);
FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(IRON_INGOT_FURNACE);
    gameActions.addRecipe(COPPER_INGOT_FURNACE);
    gameActions.addRecipe(COAL_FURNACE);

});
const BLAST_FURNACE = Producer.crafting("blast_furnace", "Blast Furnace",
    "Makes steel and some other alloys.", new GigaNum(50), new GigaNum(1.7), 5, 1,
    [[ROCK, 20], [NICKEL_INGOT, 2]]);
BLAST_FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(40)));
BLAST_FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(STEEL_BLAST_FURNACE);
});
const ALLOY_FURNACE = Producer.crafting("alloy_furnace", "Alloy Furnace",
    "Mother of all alloys.", new GigaNum(1000), new GigaNum(1.65), 4, 1,
    [[ROCK, 25], [NICKEL_INGOT, 4], [ALUMINUM_INGOT, 4]]);
ALLOY_FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(100)));
ALLOY_FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(BRONZE_ALLOY_FURNACE);
    gameActions.addRecipe(CONSTANTAN_ALLOY_FURNACE);
    gameActions.addRecipe(ELECTRUM_ALLOY_FURNACE);
});
//UNUSED
const ASSEMBLER = Producer.crafting("assembler", "Assembler",
    "Creates a whole lotta things.", new GigaNum(5000), new GigaNum(1.7), 5, 2,
    [[ELECTRUM_INGOT, 4], [STEEL_INGOT, 8], [BRONZE_INGOT, 8], [EMERALD, 1]]);
ASSEMBLER.addCapability(new EnergyConsumptionCap(new GigaNum(100)));

/* MONEY */



/* RECIPES */
const IRON_INGOT_FURNACE = new Recipe("iron_ingot_furnace", "Iron Ore to Ingot",
    FURNACE, [[IRON_INGOT, 1]], [[IRON_ORE, 2]], 5);
const COPPER_INGOT_FURNACE = new Recipe("copper_ingot_furnace", "Copper Ore to Ingot",
    FURNACE, [[COPPER_INGOT, 1]], [[COPPER_ORE, 2]], 4);
const COAL_FURNACE = new Recipe("coal_furnace", "Coal Ore to Processed",
    FURNACE, [[COAL, 1]], [[COAL_ORE, 2]], 2);
const STEEL_BLAST_FURNACE = new Recipe("steel_blast_furnace", "Iron and Coal into Steel", BLAST_FURNACE,
    [[STEEL_INGOT, 4]], [[IRON_INGOT, 4], [COAL, 1]], 8);
const TIN_INGOT_FURNACE = new Recipe("tin_ingot_furnace", "Tin Ore to Ingot",
    FURNACE, [[TIN_INGOT, 1]], [[TIN_ORE, 2]], 3);
const NICKEL_INGOT_FURNACE = new Recipe("nickel_ingot_furnace", "Nickel Ore to Ingot",
    FURNACE, [[NICKEL_INGOT, 1]], [[NICKEL_ORE, 2]], 5);
const GLASS_FURNACE = new Recipe("glass_furnace", "Sand into Glass", FURNACE, [[GLASS, 1]], [[SAND, 2]], 2);
const SILICON_FURNACE = new Recipe("silicon_furnace", "Quartz and Coal into Silicon",
    FURNACE, [[SILICON, 1]], [[QUARTZ, 2], [COAL, 1]], 6);
const CHARCOAL_FURNACE = new Recipe("charcoal_furnace", "Wood to Charcoal", FURNACE, [[CHARCOAL, 1]], [[WOOD, 2]], 2);
const CAST_IRON_BLAST_FURNACE = new Recipe("cast_iron_blast_furnace", "Iron and Charcoal to Cast Iron",
    BLAST_FURNACE, [[CAST_IRON_INGOT, 1]], [[IRON_INGOT, 1], [CHARCOAL, 1]], 4);
const SILVER_INGOT_FURNACE = new Recipe("silver_ingot_furnace", "Silver Ore to Ingot",
    FURNACE, [[SILVER_INGOT, 1]], [[SILVER_ORE, 2]], 5);
const GOLD_INGOT_FURNACE = new Recipe("gold_ingot_furnace", "Gold Ore to Ingot",
    FURNACE, [[GOLD_INGOT, 1]], [[GOLD_ORE, 2]], 5);
const ALUMINUM_INGOT_FURNACE = new Recipe("aluminum_ingot_furnace", "Aluminum Ore to Ingot",
    FURNACE, [[ALUMINUM_INGOT, 1]], [[ALUMINUM_ORE, 1]], 8);
const BRONZE_ALLOY_FURNACE = new Recipe("bronze_alloy_furnace", "Copper and Tin into Bronze",
    ALLOY_FURNACE, [[BRONZE_INGOT, 4]], [[COPPER_INGOT, 3], [TIN_INGOT, 1]], 8);
const CONSTANTAN_ALLOY_FURNACE = new Recipe("constantan_alloy_furnace", "Copper and Nickel into Constantan",
    ALLOY_FURNACE, [[CONSTANTAN_INGOT, 2]], [[NICKEL_INGOT, 1], [IRON_INGOT, 1]], 10);
const ELECTRUM_ALLOY_FURNACE = new Recipe("electrum_alloy_furnace", "Gold and Silver into Electrum",
    ALLOY_FURNACE, [[ELECTRUM_INGOT, 2]], [[SILVER_INGOT, 1], [GOLD_INGOT, 1]], 5);



/* UPGRADES */
const HAMSTER_WHEEL_CARBS = new Upgrade("hamster_wheel_carbs", "Carboloading",
    "Changes hamsters' diet to make them run faster.", "energy", () => {
    const cap = HAMSTER_WHEEL.getCapabilities().get("energy") as EnergyGenCap;
    cap.energyGenerationMultiplier *= 1.5;
    HAMSTER_WHEEL.updateCapability(cap);
    HAMSTER_WHEEL_CARBS.isBought = true;
    }, [new GigaNum(100), [[COAL, 10]]]);
const MINE_IRON_DRILLS = new Upgrade("mine_iron_drills", "Iron Drills",
    "What were you drilling with before? Mines now give new ores.", "resource", () => {
    const cap = MINE.getCapabilities().get("mining") as MiningCap;
    cap.expandLootTable(MINING_TIER2);
    MINE.updateCapability(cap);
    gameActions.addRecipe(TIN_INGOT_FURNACE);
    gameActions.addRecipe(NICKEL_INGOT_FURNACE);
    MINE_IRON_DRILLS.isBought = true;
    }, [new GigaNum(50), [[IRON_INGOT, 4]]]);
const MINE_STEEL_DRILLS = new Upgrade("mine_steel_drills", "Composite Steel Drills",
    "Mines now go even deeper and yield new resources.", "resource", () => {
    const cap = MINE.getCapabilities().get("mining") as MiningCap;
    cap.expandLootTable(MINING_TIER3);
    MINE.updateCapability(cap);
    gameActions.addUpgrade(FURNACE_BELLOWS_TIER1);
    MINE_STEEL_DRILLS.isBought = true;
    }, [new GigaNum(250), [[STEEL_INGOT, 16], [CAST_IRON_INGOT, 16], [TIN_INGOT, 4]]]);
const FURNACE_AUTOCLICKER = new Upgrade("furnace_autoclicker", "Furnace Autoclicker",
    "Automates furnaces", "crafting", () => {
    FURNACE.setCanBeAutomated(true);
    FURNACE_AUTOCLICKER.isBought = true;
    }, [new GigaNum(150), [[TIN_INGOT, 2], [IRON_INGOT, 1]]]);
const FURNACE_OVERCLOCK_TIER1 = new Upgrade("furnace_overclock_tier1", "Furnace Overclock I",
    "Speeds up furnaces by 25%.", "crafting", () => {
    FURNACE.ticksPerOperation! *= 0.75;
    FURNACE_OVERCLOCK_TIER1.isBought = true;
    }, [new GigaNum(200), [[COAL, 15]]]);
const AGGRESSIVE_MARKETING_TIER1 = new Upgrade("aggressive_marketing_tier1", "Aggressive Marketing I",
    "We now have billboards outside Ebbing. Adds another trade slot.", "money", () => {
    gameActions.addOrder();
    AGGRESSIVE_MARKETING_TIER1.isBought = true;
    }, [new GigaNum(100), []]);
const FURNACE_BELLOWS_TIER1 = new Upgrade("furnace_bellows_tier1", "Furnace Bellows I",
    "Enables furnaces to smelt more ores.", "crafting", () => {
    gameActions.addRecipe(ALUMINUM_INGOT_FURNACE);
    gameActions.addRecipe(SILVER_INGOT_FURNACE);
    gameActions.addRecipe(GOLD_INGOT_FURNACE);
    FURNACE_BELLOWS_TIER1.isBought = true;
    }, [new GigaNum(500), [[STEEL_INGOT, 12], [WOOD, 25]]]);
const MINE_AUTOCLICKER_TIER1 = new Upgrade("mine_autoclicker_tier1", "Mine Autoclicker I",
    "Gives you an ability to automatically sell items from tier I mining pool.", "resource", () => {
    ROCK.canBeAutomated = true;
    COAL_ORE.canBeAutomated = true;
    IRON_ORE.canBeAutomated = true;
    COPPER_ORE.canBeAutomated = true;
    MINE_AUTOCLICKER_TIER1.isBought = true;
    }, [new GigaNum(45), [[COPPER_INGOT, 2], [IRON_INGOT, 1]]]);
const ORDER_ASSISTANT_TIER1 = new Upgrade("order_assistant_tier1", "Order Assistants I",
    "Somewhat automates orders.", "money", () => {
    orderAssistant.value.enabled = true;
    ORDER_ASSISTANT_TIER1.isBought = true;
    }, [new GigaNum(1000), []]);



/* INITIALIZATION */
export function gameInit() {
    gameActions.addProducer(HAMSTER_WHEEL);
    gameActions.addProducer(MINE);
    gameActions.addOrder();
}