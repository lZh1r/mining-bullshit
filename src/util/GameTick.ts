import {automationQueue, gameActions, orderAssistant, orders, recipeQueue} from "../game-state.ts";
import {batch} from "@preact/signals";
import {GigaNum} from "./GigaNum.ts";

export function gameTick() {
    const [resGain, monGain] = gameActions.getProducersYield();
    const resourceGain = resGain.slice();
    const moneyGain = new GigaNum(0).add(monGain);
    batch(() => {
        const queue = new Map(recipeQueue.value);
        const autoQueue = automationQueue.value.slice();
        queue.forEach((recipes, producer) => {
            const tickAdvance = gameActions.getProducerAmount(producer) / recipes.length;
            recipes.forEach((recipe) => {
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
                        resourceGain.push([resource, number * producer.parallelizationFactor]);
                    }
                }
            });
        });
        if (moneyGain.compareTo(new GigaNum(0)) !== "equal") {
            gameActions.addMoney(moneyGain);
        }
        for (const [resource, number] of resourceGain) {
            gameActions.depositResource(resource, number === 0 ? 1 : number);
        }
        const recipesToRemove = new Set<IDString>();
        for (const recipe of autoQueue) {
            if (gameActions.canStartRecipe(recipe)) {
                gameActions.startRecipe(recipe);
                recipesToRemove.add(recipe.id);
            }
        }
        automationQueue.value = recipesToRemove.size > 0 ? autoQueue.filter(r => !recipesToRemove.has(r.id)) : autoQueue;
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
        orderAssistant.value = assistant;
    });
}