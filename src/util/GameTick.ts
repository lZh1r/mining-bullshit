import {automationQueue, gameActions, recipeQueue} from "../game-state.ts";
import {batch} from "@preact/signals";

export function gameTick() {
    const [resourceGain, moneyGain] = gameActions.getProducersYield();
    batch(() => {
        const queue = recipeQueue.value;
        let autoQueue = automationQueue.value;
        queue.forEach((array, producer) => {
            const tickAdvance = gameActions.getProducerAmount(producer) / array.length;
            array.forEach((recipe) => {
                if (recipe.tick(tickAdvance)) {
                    if (recipe.automate) {
                        if (!gameActions.canStartRecipe(recipe)) {
                            autoQueue.push(recipe);
                            gameActions.stopRecipe(recipe);
                        }
                    } else {
                        gameActions.stopRecipe(recipe);
                    }
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
        for (const recipe of autoQueue) {
            if (gameActions.canStartRecipe(recipe)) {
                gameActions.startRecipe(recipe);
                autoQueue = autoQueue.filter(r => r.id !== recipe.id);
            }
        }
        automationQueue.value = Array.from(autoQueue);
    });
}