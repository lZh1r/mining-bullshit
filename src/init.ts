import {gameActions} from "./game-state.ts";
import {HAMSTER_WHEEL, MINE, UNLOCK_FURNACE_UP} from "./registry.ts";

export function gameInit() {
    gameActions.addProducer(HAMSTER_WHEEL);
    gameActions.addProducer(MINE);
    gameActions.addUpgrade(UNLOCK_FURNACE_UP);
}