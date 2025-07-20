import {GigaNum} from "./src/util/GigaNum";
import {ResourceManager} from "./src/util/resources/ResourceManager";

declare global {
    interface Window {
        gameState: {
            money: GigaNum,
            energyGridPower: GigaNum,
            resourceManager: ResourceManager,
        }
    }
    type SingleOrArray<T> = T | T[];
    type IDString = Lowercase<string>;
    type NameString = Capitalize<string>;
}



export {};