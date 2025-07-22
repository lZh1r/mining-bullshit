import {gameActions} from "../game-state.ts";
import {batch} from "@preact/signals";

export function gameTick() {
    const [resourceGain, moneyGain] = gameActions.getResourceProducersYield();
    batch(() => {
        gameActions.addMoney(moneyGain);
        for (const resource of resourceGain) {
            gameActions.depositResource(resource[0], resource[1]);
        }
    });
}