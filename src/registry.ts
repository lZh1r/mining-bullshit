import {Resource} from "./util/resources/Resource";
import {resourceFuelConfig, resourceValueConfig} from "./config/resource";
import {BurnableCap} from "./util/resources/capabilities/BurnableCap";

/* RESOURCES */
const IRON_ORE = new Resource("iron_ore", "Iron Ore", resourceValueConfig.iron.ore);
const IRON_INGOT = new Resource("iron_ingot", "Iron Ingot", resourceValueConfig.iron.ingot);
const COPPER_ORE = new Resource("copper_ore", "Copper Ore", resourceValueConfig.copper.ore);
const COPPER_INGOT = new Resource("copper_ingot", "Copper Ingot", resourceValueConfig.copper.ingot);
const COAL_ORE = new Resource("coal_ore", "Coal Ore", resourceValueConfig.coal.ore);
const COAL = new Resource("coal", "Coal", resourceValueConfig.coal.processed);
COAL.addCapability(new BurnableCap(resourceFuelConfig.coal));
console.log(COAL.getCapabilities());