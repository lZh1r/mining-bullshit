import {Resource} from "./util/resources/Resource";
import {Producer} from "./util/producers/Producer.ts";
import {EnergyGenCap} from "./util/producers/capabilities/EnergyGenCap.ts";
import {EnergyConsumptionCap} from "./util/producers/capabilities/EnergyConsumptionCap.ts";
import {MiningCap} from "./util/producers/capabilities/MiningCap.ts";
import {LootTable} from "./util/LootTable.ts";
import {Upgrade} from "./util/upgrades/Upgrade.ts";
import {GigaNum} from "./util/GigaNum.ts";
import {
    gameActions,
    initialFacilities,
    initialProducers,
    maxOrderTier,
    orderAssistant,
    researches
} from "./game-state.ts";
import {Recipe} from "./util/crafts/Recipe.ts";
import {MasteryCap} from "./util/resources/capabilities/MasteryCap.ts";
import {MoneyProdCap} from "./util/producers/capabilities/MoneyProdCap.ts";
import {Construction} from "./util/upgrades/Construction.ts";
import {Research} from "./util/upgrades/Research.ts";
import {gameTick} from "./util/GameTick.ts";

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
    gameActions.addUpgrade(MINE_STEEL_DRILLS);
    gameActions.addUpgrade(MINE_AUTOCLICKER_TIER2);
    gameActions.addUpgrade(EXCAVATOR_AUTOCLICKER_TIER1);
    gameActions.addUpgrade(ORDER_ASSISTANT_TIER1);
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
CAST_IRON_INGOT.addOnGet(() => {
    gameActions.addUpgrade(FURNACE_PARALLELIZATION);
});
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
    gameActions.addProducer(MONEY_PRINTER);
});
export const TOPAZ = new Resource("topaz", "Topaz", 100);
export const BRONZE_INGOT = new Resource("bronze_ingot", "Bronze Ingot", 14);
BRONZE_INGOT.addOnGet(() => {
    gameActions.addUpgrade(MINE_AUTOCLICKER_TIER3);
});
export const CONSTANTAN_INGOT = new Resource("constantan_ingot", "Constantan Ingot", 20);
export const ELECTRUM_INGOT = new Resource("electrum_ingot", "Electrum Ingot", 170);
export const PAPER = new Resource("paper", "Paper", 1);
export const CIRCUIT_TIER1 = new Resource("circuit_tier1", "Tier I Circuit", 50);
CIRCUIT_TIER1.addOnGet(() => {
    gameActions.addUpgrade(BLAST_FURNACE_AUTOCLICKER);
    gameActions.addUpgrade(TERRAIN_SCANNERS);
    gameActions.addUpgrade(ORDER_ASSISTANT_TIER2);
    gameActions.addUpgrade(HAMSTER_FITNESS_TRACKERS);
    gameActions.addFacility(RESEARCH_FACILITY);
    gameActions.addProducer(WATER_PUMP);
});
export const BRICK = new Resource("brick", "Bricks", 4);
BRICK.addOnGet(() => {
    gameActions.addProducer(COKE_OVEN);
});
export const COKE = new Resource("coke", "Coke Coal", 24);
export const CREOSOTE = new Resource("creosote", "Creosote Oil", 2);
export const GEM_LATTICE = new Resource("gem_lattice", "Gem Lattice", 500);
GEM_LATTICE.addOnGet(() => {
    gameActions.addUpgrade(MINE_GEM_DRILLS);
    gameActions.addProducer(PRECIOUS_QUARRY);
});
export const WROUGHT_IRON_INGOT = new Resource("wrought_iron_ingot", "Wrought Iron Ingot", 24);
WROUGHT_IRON_INGOT.addOnGet(() => {
    gameActions.addRecipe(GEM_LATTICE_ASSEMBLER);
});
const WATER = new Resource("water", "Water", 1);

/* TIER 4 */
export const LEAD_ORE = new Resource("lead_ore", "Lead Ore", 10);
export const LEAD_INGOT = new Resource("lead_ingot", "Lead Ingot", 30);
export const DIAMOND = new Resource("diamond", "Diamond", 750);
export const ZINC_ORE = new Resource("zinc_ore", "Zinc Ore", 8);
export const ZINC_INGOT = new Resource("zinc_ingot", "Zinc Ingot", 24);
export const MAGNESITE_ORE = new Resource("magnesite_ore", "Magnesite Ore", 8);
export const MAGNESIUM_INGOT = new Resource("magnesium_ingot", "Magnesium Ingot", 24);
export const URANIUM_ORE = new Resource("uranium_ore", "Uranium Ore", 10);
export const URANIUM = new Resource("uranium", "Uranium Chunk", 30);
export const THORIUM_ORE = new Resource("thorium_ore", "Thorium Ore", 9);
export const THORIUM = new Resource("thorium", "Thorium Chunk", 27);
export const INVAR_INGOT = new Resource("invar_ingot", "Invar Ingot", 22);
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
export const MINING_TIER4 = new LootTable([
    [ROCK, 2],
    [IRON_ORE, 2],
    [NICKEL_ORE, 2],
    [ALUMINUM_ORE, 1],
    [SILVER_ORE, 1],
    [GOLD_ORE, 1],
    [LEAD_ORE, 3],
    [ZINC_ORE, 3],
    [MAGNESITE_ORE, 4],
    [DIAMOND, 1],
    [THORIUM_ORE, 3],
    [URANIUM_ORE, 2],
]);
export const EXCAVATION_TIER1 = new LootTable([
    [SAND, 9],
    [CLAY, 3],
]);
export const SAWMILL_TABLE = new LootTable([
    [WOOD, 10],
    [SAWDUST, 5],
]);
export const PRECIOUS_TIER1 = new LootTable([
    [SILVER_ORE, 4],
    [GOLD_ORE, 2],
    [EMERALD, 1],
    [RUBY, 1],
    [TOPAZ, 1],
    [SAPPHIRE, 1]
]);



/* PRODUCERS */
/* ENERGY */
const HAMSTER_WHEEL = Producer.energy("hamster_wheel", "Hamster Wheel",
    "Who knew that hamsters are so good at power generation?",
    new GigaNum(5), 1.2);
HAMSTER_WHEEL.addCapability(new EnergyGenCap(new GigaNum(5)));
const COMBUSTION_GENERATOR = Producer.energy("combustion_generator", "Combustion Generator",
    "Watch the world burn.", new GigaNum(25), 2, [[COAL, 5]]);
COMBUSTION_GENERATOR.addCapability(new EnergyGenCap(new GigaNum(25)));
const SOLAR_PANEL = Producer.energy("solar_panel", "Solar Panel",
    "Eco-friendly energy production.", new GigaNum(50),
    1.1, [[SILICON, 2], [GLASS, 4]]);
SOLAR_PANEL.addCapability(new EnergyGenCap(new GigaNum(20)));

/* RESOURCE */
const MINE = Producer.resource("mine", "Mine",
"Send your enemies to work for you in this beautiful resort!",
    new GigaNum(20), 1.45, 5);
MINE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
MINE.addCapability(new MiningCap(MINING_TIER1));
const EXCAVATOR = Producer.resource("excavator", "Excavator",
    "That big yellow car.", new GigaNum(25), 1.8,
    3, 1, [[COPPER_INGOT, 2]]);
EXCAVATOR.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
EXCAVATOR.addCapability(new MiningCap(EXCAVATION_TIER1));
const SAWMILL = Producer.resource("sawmill", "Sawmill",
    "TREES! THEY ARE EVERYWHERE!", new GigaNum(250),
    2, 2, 1,
    [[STEEL_INGOT, 5], [COPPER_INGOT, 10]]);
SAWMILL.addCapability(new MiningCap(SAWMILL_TABLE));
SAWMILL.addCapability(new EnergyConsumptionCap(new GigaNum(30)));
const PRECIOUS_QUARRY = Producer.resource("precious_quarry", "Precious Quarry",
    "A quarry capable of mining only the most expensive resources.",
    new GigaNum(10000), 10, 10, 6,
    [[GEM_LATTICE, 3], [CIRCUIT_TIER1, 2], [STEEL_INGOT, 12], [CONSTANTAN_INGOT, 8]]);
PRECIOUS_QUARRY.addCapability(new MiningCap(PRECIOUS_TIER1));
PRECIOUS_QUARRY.addCapability(new EnergyConsumptionCap(new GigaNum(200)));
const WATER_PUMP = Producer.resource("water_pump", "Water Pump",
    "Drains nearest bodies of water.",
    new GigaNum(2650), 1.5, 1, 1,
    [[CONSTANTAN_INGOT, 6], [CIRCUIT_TIER1, 1]]);
WATER_PUMP.addCapability(new MiningCap(new LootTable([[WATER, 1]])));
WATER_PUMP.addCapability(new EnergyConsumptionCap(new GigaNum(100)));

/* CRAFTING */
const FURNACE = Producer.crafting("furnace", "Furnace",
    "Smelts things on the most primitive level.",
    new GigaNum(30), 1.5, 2, 1, [[ROCK, 10]]);
FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(10)));
FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(IRON_INGOT_FURNACE);
    gameActions.addRecipe(COPPER_INGOT_FURNACE);
    gameActions.addRecipe(COAL_FURNACE);
});
const BLAST_FURNACE = Producer.crafting("blast_furnace", "Blast Furnace",
    "Makes steel and some other alloys.", new GigaNum(50), 1.7,
    5, 1, [[ROCK, 20], [NICKEL_INGOT, 2]]);
BLAST_FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(40)));
BLAST_FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(STEEL_BLAST_FURNACE);
});
const ALLOY_FURNACE = Producer.crafting("alloy_furnace", "Alloy Furnace",
    "Mother of all alloys.", new GigaNum(1000), 1.65,
    4, 1, [[ROCK, 25], [NICKEL_INGOT, 4], [ALUMINUM_INGOT, 4]]);
ALLOY_FURNACE.addCapability(new EnergyConsumptionCap(new GigaNum(50)));
ALLOY_FURNACE.addMilestone(1, () => {
    gameActions.addRecipe(BRONZE_ALLOY_FURNACE);
    gameActions.addRecipe(CONSTANTAN_ALLOY_FURNACE);
    gameActions.addRecipe(ELECTRUM_ALLOY_FURNACE);
});
const ASSEMBLER = Producer.crafting("assembler", "Assembler",
    "Creates a whole lotta things.", new GigaNum(5000), 1.7,
    5, 2, [[ELECTRUM_INGOT, 4], [STEEL_INGOT, 8], [BRONZE_INGOT, 8], [EMERALD, 1]]);
ASSEMBLER.addCapability(new EnergyConsumptionCap(new GigaNum(100)));
ASSEMBLER.addMilestone(1, () => {
    gameActions.addRecipe(PAPER_ASSEMBLER);
    gameActions.addRecipe(CIRCUIT_TIER1_ASSEMBLER);
});
const COKE_OVEN = Producer.crafting("coke_oven", "Coke Oven",
    "Im in love with the koko-cola! Produces coke coal.", new GigaNum(1250), 2,
    3, 1, [[BRICK, 10], [BRONZE_INGOT, 8]]);
COKE_OVEN.addCapability(new EnergyConsumptionCap(new GigaNum(30)));
COKE_OVEN.addMilestone(1, () => {
    gameActions.addRecipe(COKE_COKE_OVEN);
    gameActions.addRecipe(STEEL_COKE_BLAST_FURNACE);
    gameActions.addUpgrade(COKE_OVEN_AUTOCLICKER);
});

/* MONEY */
const MONEY_PRINTER = Producer.money("money_printer", "Money Printer",
    "That's how economy works!", new GigaNum(10000), 10,
    10, 1, [[PAPER, 80]]);
MONEY_PRINTER.addCapability(new MoneyProdCap(new GigaNum(100)));
MONEY_PRINTER.addCapability(new EnergyConsumptionCap(new GigaNum(25)));



/* RECIPES */
//Furnace
const IRON_INGOT_FURNACE = new Recipe("iron_ingot_furnace", "Iron Ore to Ingot",
    FURNACE, [[IRON_INGOT, 1]], [[IRON_ORE, 2]], 5);
const COPPER_INGOT_FURNACE = new Recipe("copper_ingot_furnace", "Copper Ore to Ingot",
    FURNACE, [[COPPER_INGOT, 1]], [[COPPER_ORE, 2]], 4);
const COAL_FURNACE = new Recipe("coal_furnace", "Coal Ore to Processed",
    FURNACE, [[COAL, 1]], [[COAL_ORE, 2]], 2);
const TIN_INGOT_FURNACE = new Recipe("tin_ingot_furnace", "Tin Ore to Ingot",
    FURNACE, [[TIN_INGOT, 1]], [[TIN_ORE, 2]], 3);
const NICKEL_INGOT_FURNACE = new Recipe("nickel_ingot_furnace", "Nickel Ore to Ingot",
    FURNACE, [[NICKEL_INGOT, 1]], [[NICKEL_ORE, 2]], 5);
const GLASS_FURNACE = new Recipe("glass_furnace", "Sand into Glass",
    FURNACE, [[GLASS, 1]], [[SAND, 2]], 2);
const SILICON_FURNACE = new Recipe("silicon_furnace", "Quartz and Coal into Silicon",
    FURNACE, [[SILICON, 1]], [[QUARTZ, 2], [COAL, 1]], 6);
const CHARCOAL_FURNACE = new Recipe("charcoal_furnace", "Wood to Charcoal",
    FURNACE, [[CHARCOAL, 1]], [[WOOD, 2]], 2);
const SILVER_INGOT_FURNACE = new Recipe("silver_ingot_furnace", "Silver Ore to Ingot",
    FURNACE, [[SILVER_INGOT, 1]], [[SILVER_ORE, 2]], 5);
const GOLD_INGOT_FURNACE = new Recipe("gold_ingot_furnace", "Gold Ore to Ingot",
    FURNACE, [[GOLD_INGOT, 1]], [[GOLD_ORE, 2]], 5);
const ALUMINUM_INGOT_FURNACE = new Recipe("aluminum_ingot_furnace", "Aluminum Ore to Ingot",
    FURNACE, [[ALUMINUM_INGOT, 1]], [[ALUMINUM_ORE, 1]], 8);
const BRICK_FURNACE = new Recipe("brick_furnace", "Clay into Bricks",
    FURNACE, [[BRICK, 1]], [[CLAY, 2]], 1);
const ZINC_INGOT_FURNACE = new Recipe("zinc_ingot_furnace", "Zinc Ore to Ingot",
    FURNACE, [[ZINC_INGOT, 1]], [[ZINC_ORE, 2]], 3);
const MAGNESIUM_INGOT_FURNACE = new Recipe("magnesium_ingot_furnace", "Magnesite Ore to Magnesium Ingot",
    FURNACE, [[MAGNESIUM_INGOT, 1]], [[MAGNESITE_ORE, 2]], 4);
const LEAD_INGOT_FURNACE = new Recipe("lead_ingot_furnace", "Lead Ore to Ingot",
    FURNACE, [[LEAD_INGOT, 1]], [[LEAD_ORE, 2]], 5);
const URANIUM_FURNACE = new Recipe("uranium_furnace", "Uranium Ore to Chunk",
    FURNACE, [[URANIUM, 1]], [[URANIUM_ORE, 4]], 12);
const THORIUM_FURNACE = new Recipe("thorium_furnace", "Thorium Ore to Chunk",
    FURNACE, [[THORIUM, 1]], [[THORIUM_ORE, 4]], 10);
//Blast Furnace
const STEEL_BLAST_FURNACE = new Recipe("steel_blast_furnace", "Iron and Coal into Steel",
    BLAST_FURNACE, [[STEEL_INGOT, 4]], [[IRON_INGOT, 4], [COAL, 1]], 8);
const CAST_IRON_BLAST_FURNACE = new Recipe("cast_iron_blast_furnace", "Iron and Charcoal to Cast Iron",
    BLAST_FURNACE, [[CAST_IRON_INGOT, 1]], [[IRON_INGOT, 1], [CHARCOAL, 1]], 4);
const STEEL_COKE_BLAST_FURNACE = new Recipe("steel_coke_blast_furnace", "Iron and Coke into Steel",
    BLAST_FURNACE, [[STEEL_INGOT, 8]], [[IRON_INGOT, 8], [COKE, 1]], 4);
const WROUGHT_IRON_BLAST_FURNACE = new Recipe("wrought_iron_blast_furnace", "Cast Iron into Wrought Iron",
    BLAST_FURNACE, [[WROUGHT_IRON_INGOT, 1]], [[CAST_IRON_INGOT, 1]], 2);
//Alloy Furnace
const BRONZE_ALLOY_FURNACE = new Recipe("bronze_alloy_furnace", "Copper and Tin into Bronze",
    ALLOY_FURNACE, [[BRONZE_INGOT, 4]], [[COPPER_INGOT, 3], [TIN_INGOT, 1]], 8);
const CONSTANTAN_ALLOY_FURNACE = new Recipe("constantan_alloy_furnace", "Copper and Nickel into Constantan",
    ALLOY_FURNACE, [[CONSTANTAN_INGOT, 2]], [[NICKEL_INGOT, 1], [COPPER_INGOT, 1]], 10);
const ELECTRUM_ALLOY_FURNACE = new Recipe("electrum_alloy_furnace", "Gold and Silver into Electrum",
    ALLOY_FURNACE, [[ELECTRUM_INGOT, 2]], [[SILVER_INGOT, 1], [GOLD_INGOT, 1]], 5);
const INVAR_ALLOY_FURNACE = new Recipe("invar_alloy_furnace", "Iron and Nickel into Invar",
    ALLOY_FURNACE, [[INVAR_INGOT, 2]], [[IRON_INGOT, 1], [NICKEL_INGOT, 1]], 12);
const BRASS_ALLOY_FURNACE = new Recipe("brass_alloy_furnace", "Copper and Zinc into Brass",
    ALLOY_FURNACE, [[BRASS_INGOT, 3]], [[ZINC_INGOT, 1], [COPPER_INGOT, 2]], 10);
//Assembler
const PAPER_ASSEMBLER = new Recipe("paper_assembler", "Wood into Paper",
    ASSEMBLER, [[PAPER, 8]], [[SAWDUST, 3], [WATER, 10]], 1);
const CIRCUIT_TIER1_ASSEMBLER = new Recipe("circuit_tier1_assembler", "Circuit Tier I",
    ASSEMBLER, [[CIRCUIT_TIER1, 1]], [[ELECTRUM_INGOT, 1], [GLASS, 5], [WOOD, 10]], 10);
const GEM_LATTICE_ASSEMBLER = new Recipe("gem_lattice_assembler", "Gem Lattice Assembly",
    ASSEMBLER, [[GEM_LATTICE, 1]], [
        [EMERALD, 1], [TOPAZ, 1], [RUBY, 1], [SAPPHIRE, 1], [WROUGHT_IRON_INGOT, 5]
    ], 6);
//One off
const COKE_COKE_OVEN = new Recipe("coke_coke_oven", "Coal to Coke",
    COKE_OVEN, [[COKE, 1], [CREOSOTE, 5]], [[COAL, 2]], 5);



/* UPGRADES */
//Hamster wheel
const HAMSTER_WHEEL_CARBS = new Upgrade("hamster_wheel_carbs", "Carboloading",
    "Changes hamsters' diet to make them run faster.", "energy", () => {
        const cap = HAMSTER_WHEEL.getCapabilities().get("energy") as EnergyGenCap;
        cap.energyGenerationMultiplier *= 1.5;
        HAMSTER_WHEEL.updateCapability(cap);
    }, [new GigaNum(100), [[COAL, 10]]]);
const HAMSTER_FITNESS_TRACKERS = new Upgrade("hamster_fitness_tracker", "Hamster Fitness Trackers",
    "Tells your hamsters how much they've been running for. Maybe this will boost their morale." +
    " Increases base hamster wheel production", "energy", () => {
        const cap = HAMSTER_WHEEL.getCapabilities().get("energy") as EnergyGenCap;
        cap.baseEnergyGeneration = cap.baseEnergyGeneration.add(1);
        HAMSTER_WHEEL.updateCapability(cap);
    }, [new GigaNum(2500), [[CIRCUIT_TIER1, 1], [IRON_INGOT, 7]]]);
//Mine
const MINE_IRON_DRILLS = new Upgrade("mine_iron_drills", "Iron Drills",
    "What were you drilling with before? Mines now give new ores.", "resource", () => {
        const cap = MINE.getCapabilities().get("mining") as MiningCap;
        cap.expandLootTable(MINING_TIER2);
        MINE.updateCapability(cap);
        gameActions.addRecipe(TIN_INGOT_FURNACE);
        gameActions.addRecipe(NICKEL_INGOT_FURNACE);
    }, [new GigaNum(50), [[IRON_INGOT, 4]]]);
const MINE_STEEL_DRILLS = new Upgrade("mine_steel_drills", "Composite Steel Drills",
    "Mines now go even deeper and yield new resources.", "resource", () => {
        const cap = MINE.getCapabilities().get("mining") as MiningCap;
        cap.expandLootTable(MINING_TIER3);
        MINE.updateCapability(cap);
        gameActions.addUpgrade(FURNACE_BELLOWS_TIER1);
    }, [new GigaNum(250), [[STEEL_INGOT, 16], [CAST_IRON_INGOT, 5], [TIN_INGOT, 4]]]);
const MINE_GEM_DRILLS = new Upgrade("mine_gem_drills", "Gem Composite Drills",
    "Reinforces mining drills with tough gem lattices to allow going even deeper.", "resource", () => {
        const cap = MINE.getCapabilities().get("mining") as MiningCap;
        cap.expandLootTable(MINING_TIER4);
        MINE.updateCapability(cap);
        gameActions.addUpgrade(FURNACE_BELLOWS_TIER2);
    }, [new GigaNum(10000), [[GEM_LATTICE, 5], [CIRCUIT_TIER1, 2], [CONSTANTAN_INGOT, 20]]]);
const MINE_AUTOCLICKER_TIER1 = new Upgrade("mine_autoclicker_tier1", "Mine Autoclicker I",
    "Gives you an ability to automatically sell items from tier I mining pool.", "resource", () => {
        ROCK.canBeAutomated = true;
        COAL_ORE.canBeAutomated = true;
        IRON_ORE.canBeAutomated = true;
        COPPER_ORE.canBeAutomated = true;
    }, [new GigaNum(45), [[COPPER_INGOT, 2], [IRON_INGOT, 1]]]);
const MINE_AUTOCLICKER_TIER2 = new Upgrade("mine_autoclicker_tier2", "Mine Autoclicker II",
    "Expands the ability to auto-sell mined resources to tier II.", "resource", () => {
        NICKEL_ORE.canBeAutomated = true;
        TIN_ORE.canBeAutomated = true;
        QUARTZ.canBeAutomated = true;
    }, [new GigaNum(100), [[STEEL_INGOT, 4], [TIN_INGOT, 2]]]);
const MINE_AUTOCLICKER_TIER3 = new Upgrade("mine_autoclicker_tier3", "Mine Autoclicker III",
    "Tier III ores can be auto-sold now! If you need it for some reason...", "resource", () => {
        SILVER_ORE.canBeAutomated = true;
        GOLD_ORE.canBeAutomated = true;
        ALUMINUM_ORE.canBeAutomated = true;
        EMERALD.canBeAutomated = true;
        SAPPHIRE.canBeAutomated = true;
        RUBY.canBeAutomated = true;
        TOPAZ.canBeAutomated = true;
    }, [new GigaNum(750), [[BRONZE_INGOT, 8], [ALUMINUM_INGOT, 4]]]);
const TERRAIN_SCANNERS = new Upgrade("terrain_scanner", "Terrain Scanner",
    "Better intel makes mines faster at their job.", "resource", () => {
        MINE.ticksPerOperation! -= 1;
    }, [new GigaNum(7500), [[CIRCUIT_TIER1, 1]]]);
//Furnace
const FURNACE_AUTOCLICKER = new Upgrade("furnace_autoclicker", "Furnace Autoclicker",
    "Automates furnaces", "crafting", () => {
        FURNACE.setCanBeAutomated(true);
    }, [new GigaNum(150), [[TIN_INGOT, 2], [IRON_INGOT, 1]]]);
const FURNACE_OVERCLOCK_TIER1 = new Upgrade("furnace_overclock_tier1", "Furnace Overclock I",
    "Speeds up furnaces by 25%.", "crafting", () => {
        FURNACE.ticksPerOperation! *= 0.75;
    }, [new GigaNum(200), [[COAL, 15]]]);
const FURNACE_BELLOWS_TIER1 = new Upgrade("furnace_bellows_tier1", "Furnace Bellows I",
    "Enables furnaces to smelt more ores.", "crafting", () => {
        gameActions.addRecipe(ALUMINUM_INGOT_FURNACE);
        gameActions.addRecipe(SILVER_INGOT_FURNACE);
        gameActions.addRecipe(GOLD_INGOT_FURNACE);
        gameActions.addRecipe(BRICK_FURNACE);
    }, [new GigaNum(500), [[STEEL_INGOT, 12], [WOOD, 25]]]);
const FURNACE_BELLOWS_TIER2 = new Upgrade("furnace_bellows_tier2", "Furnace Bellows II",
    "Furnaces can smelt even more ores now.", "crafting", () => {
        gameActions.addRecipe(ZINC_INGOT_FURNACE);
        gameActions.addRecipe(MAGNESIUM_INGOT_FURNACE);
        gameActions.addRecipe(LEAD_INGOT_FURNACE);
    }, [new GigaNum(12000), [[WROUGHT_IRON_INGOT, 8], [DIAMOND, 1]]]);
const FURNACE_PARALLELIZATION = new Upgrade("furnace_parallelization", "Extra Furnace Chambers",
    "Allows furnaces to smelt two times more items at once!", "crafting", () => {
        FURNACE.parallelizationFactor += 1;
    }, [new GigaNum(2000), [[CAST_IRON_INGOT, 10], [STEEL_INGOT, 16], [TIN_INGOT, 20], [ROCK, 200]]]);
//Excavator
const EXCAVATOR_AUTOCLICKER_TIER1 = new Upgrade("excavator_autoclicker_tier1", "Excavator Autoclicker Tier I",
    "Allows you to automatically sell resources from tier I excavation pool.", "resource", () => {
        SAND.canBeAutomated = true;
        CLAY.canBeAutomated = true;
    }, [new GigaNum(150), [[STEEL_INGOT, 6], [GLASS, 10]]]);
//Blast Furnace
const BLAST_FURNACE_AUTOCLICKER = new Upgrade("blast_furnace_autoclicker", "Blast Furnace Autoclicker",
    "Installing special control systems into blast furnaces allows automating them.", "crafting", () => {
        BLAST_FURNACE.setCanBeAutomated(true);
    }, [new GigaNum(2500), [[IRON_INGOT, 15], [CIRCUIT_TIER1, 1]]]);
//Coke Oven
const COKE_OVEN_AUTOCLICKER = new Upgrade("coke_oven_autoclicker", "Coke Oven Autoclicker",
    "Allows you to automate everything related to coke oven.", "crafting", () => {
        COKE_OVEN.setCanBeAutomated(true);
        CREOSOTE.canBeAutomated = true;
        COKE.canBeAutomated = true;
    }, [new GigaNum(3000), [[CIRCUIT_TIER1, 1], [BRICK, 8]]]);
//Misc
const AGGRESSIVE_MARKETING_TIER1 = new Upgrade("aggressive_marketing_tier1", "Aggressive Marketing I",
    "We now have billboards outside Ebbing. Adds another trade slot.", "money", () => {
        gameActions.addOrder();
    }, [new GigaNum(100), []]);
const ORDER_ASSISTANT_TIER1 = new Upgrade("order_assistant_tier1", "Order Assistants I",
    "Somewhat automates orders.", "money", () => {
        const newAssistants = {...orderAssistant.value};
        newAssistants.enabled = true;
        orderAssistant.value = newAssistants;
    }, [new GigaNum(1000), []]);
const ORDER_ASSISTANT_TIER2 = new Upgrade("order_assistant_tier2", "Order Assistants II",
    "Automatic coffee machines for your assistants to work better.", "money", () => {
        const newAssistants = {...orderAssistant.value};
        newAssistants.numberOfOrdersAutomated += 1;
        orderAssistant.value = newAssistants;
    }, [new GigaNum(10000), [[CIRCUIT_TIER1, 1], [PAPER, 32]]]);



/* RESEARCH */
const INITIAL_RESEARCH = new Research("init_research", "Initiale",
    "Final lab setup before you can start cooking up new inventions.", [new GigaNum(2000), []], () => {});
const WROUGHT_IRON_RESEARCH = new Research("wrought_iron_research", "Wrought Iron",
    "Wrought iron ingot will become craftable via blast furnace.",
    [new GigaNum(4000), [[CAST_IRON_INGOT, 10], [IRON_INGOT, 20], [STEEL_INGOT, 8]]], () => {
        gameActions.addRecipe(WROUGHT_IRON_BLAST_FURNACE);
    }, [INITIAL_RESEARCH]);
const HAMSTER_FOOD1_RESEARCH = new Research("hamster_food1_research", "Hamster Food I",
    "Apparently, your hamsters have been fed coal this whole time." +
    " Maybe giving them water will help with digestion of those ancient carbs.", [new GigaNum(7500), [[WATER, 100]]],
    () => {
        const cap = HAMSTER_WHEEL.getCapabilities().get("energy") as EnergyGenCap;
        cap.baseEnergyGeneration = cap.baseEnergyGeneration.add(1);
        HAMSTER_WHEEL.updateCapability(cap);
    }, [INITIAL_RESEARCH]);
const BILLBOARD_RESEARCH = new Research("billboard_research", "Billboards",
    "Our scientists concluded that our current means of marketing are not sufficient, so they built a billboard. " +
    "Increases max order tier.", [new GigaNum(10000), [[WOOD, 200], [ALUMINUM_INGOT, 25]]], () => {
        maxOrderTier.value += 1;
    }, [INITIAL_RESEARCH]);
const NUCULAR_PROCESSING_RESEARCH = new Research("nucular_processing_research",
    "Nucular Resource Processing",
    "Give our scientists some uranium and thorium, maybe they'll find a way to process them into something useful",
    [new GigaNum(25000), [[URANIUM_ORE, 20], [THORIUM_ORE, 30]]], () => {
        gameActions.addRecipe(URANIUM_FURNACE);
        gameActions.addRecipe(THORIUM_FURNACE);
    }, [WROUGHT_IRON_RESEARCH]);
const MORE_ALLOYS_RESEARCH = new Research("more_alloys_research", "More Alloys",
    "Our scientists have prototyped new alloys for you to use, but they need some resources to test their properties",
    [new GigaNum(30000), [[ZINC_INGOT, 20], [NICKEL_INGOT, 30], [IRON_INGOT, 35], [COPPER_INGOT, 35]]],
    () => {
        gameActions.addRecipe(INVAR_ALLOY_FURNACE);
        gameActions.addRecipe(BRASS_ALLOY_FURNACE);
    }, [WROUGHT_IRON_RESEARCH]);



/* FACILITIES */
export const RESEARCH_FACILITY = new Construction("research_facility", "Research Facility",
    "Dark magic powering everything is going on in there...", [
        [[WOOD, 50], [BRICK, 16], [GLASS, 10]],
        [[IRON_INGOT, 12], [CONSTANTAN_INGOT, 8]],
        [[CIRCUIT_TIER1, 2], [PAPER, 80]]
    ], () => {
        initialFacilities.push(RESEARCH_FACILITY);
    });



/* INITIALIZATION */
export function gameInit() {
    initialProducers.set(HAMSTER_WHEEL.id, [HAMSTER_WHEEL, 0]);
    initialProducers.set(MINE.id, [MINE, 0]);
    gameActions.addOrder();
    researches.value = [INITIAL_RESEARCH, BILLBOARD_RESEARCH,
        WROUGHT_IRON_RESEARCH, HAMSTER_FOOD1_RESEARCH, MORE_ALLOYS_RESEARCH, NUCULAR_PROCESSING_RESEARCH];
    gameTick();
}