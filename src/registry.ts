import {Resource} from "./util/resources/Resource";
import {resourceFuelConfig, resourceValueConfig} from "./config/resource";
import {BurnableCap} from "./util/resources/capabilities/BurnableCap";

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