import {gameActions} from "../game-state.ts";

export function gameTick() {
    const producersYield = gameActions.getResourceProducersYield();
    const resourceGain = producersYield[0];
    const moneyGain = producersYield[1];
    gameActions.addMoney(moneyGain);
    for (const resource of resourceGain) {
        gameActions.depositResource(resource[0], resource[1]);
    }
}