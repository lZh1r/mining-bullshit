import {automationQueue, gameActions, orderAssistant, orders, recipeQueue} from "../game-state.ts";
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
        const assistant = {...orderAssistant.value};
        if (assistant.enabled) {
            assistant.currentTicks += 1;
            if (assistant.currentTicks === assistant.ticksPerAutomation) {
                assistant.currentTicks = 0;
                let completed = 0;
                for (const order of orders.value) {
                    if (gameActions.canCompleteOrder(order)) {
                        gameActions.completeOrder(order);
                        completed += 1;
                        if (completed === assistant.numberOfOrdersAutomated) {
                            break;
                        }
                    }
                }
            }
        }
    });
}