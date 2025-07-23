import {gameActions, recipeQueue} from "../game-state.ts";
import {batch} from "@preact/signals";

export function gameTick() {
    const [resourceGain, moneyGain] = gameActions.getProducersYield();
    batch(() => {
        const queue = recipeQueue.value;
        queue.forEach((array, producer) => {
            const tickAdvance = gameActions.getProducerAmount(producer) / array.length;
            array.forEach((recipe) => {
                if (recipe.tick(tickAdvance)) {
                    gameActions.stopRecipe(recipe);
                    for (const [resource, number] of recipe.result) {
                        gameActions.depositResource(resource, number);
                    }
                }
            });
        });
        gameActions.addMoney(moneyGain);
        for (const resource of resourceGain) {
            gameActions.depositResource(resource[0], resource[1]);
        }
    });
}