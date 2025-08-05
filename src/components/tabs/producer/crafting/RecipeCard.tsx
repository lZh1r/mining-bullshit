import {displayResourceRequirement} from "../../../../util/utils.ts";
import type {Recipe} from "../../../../util/crafts/Recipe.ts";
import {useEffect, useState} from "react";
import {automationQueue, gameActions} from "../../../../game-state.ts";

export function RecipeCard({recipe}:
                           {recipe: Recipe}) {

    const [isRunning, setIsRunning] = useState(recipe.getCurrentTicks().value !== 0);
    const [automated, setAutomated] = useState(recipe.automate);

    useEffect(() => {
        if (recipe.getCurrentTicks().value === 0) {
            setIsRunning(false);
        }
    }, [recipe.getCurrentTicks().value]);

    return (
        <div
            key={recipe.id}
            className={`bg-card-content-background border-2 border-muted-foreground grid text-center grid-cols-3
             ${gameActions.canStartRecipe(recipe) ? "text-foreground" : "text-muted-foreground"}`}>
            <div className="flex justify-evenly">
                <button className={`${recipe.producer.getCanBeAutomated() ? "cursor-pointer" : "hidden"}
                 bg-card-content-background border-2 border-muted-foreground w-8 h-8 shadow-button place-self-center
                 ${automated ? "border-foreground bg-hover-card-background hover:bg-card-content-background shadow-none"
                    : "hover:bg-hover-card-background hover:shadow-none"}`}
                        onClick={() => {
                            setAutomated(!automated);
                            recipe.automate = !automated;
                            automationQueue.value = [...automationQueue.peek(), recipe];
                        }}>
                    A
                </button>
                <span className="text-xl place-self-center">{displayResourceRequirement(recipe.inputs)}</span>
            </div>
            <div className="flex flex-col text-center">
                <span className="place-self-center">{recipe.craftDuration}s by default</span>
                <button
                    className={`w-fit h-fit place-self-center border-2 border-muted-foreground p-2 shadow-button
                    ${automated ? "cursor-default shadow-none" : isRunning ? "shadow-none bg-hover-card-background border-foreground cursor-pointer" +
                        " hover:bg-card-background hover:border-muted-foreground" 
                        : gameActions.canStartRecipe(recipe) ?
                        "cursor-pointer hover:bg-hover-card-background hover:border-foreground" :
                        ""}`}
                    onClick={() => {
                        if (automated) {
                            return;
                        }
                        if (isRunning) {
                            gameActions.stopRecipe(recipe);
                            setIsRunning(false);
                        } else {
                            if (gameActions.canStartRecipe(recipe)) {
                                setIsRunning(true);
                            }
                            gameActions.startRecipe(recipe);
                        }
                    }}>
                    <img className="place-self-center w-16 h-16" src={"/sprites/hammer16.png"} alt="progess"/>
                </button>
                <span>Progress: {recipe.getCurrentTicks().value.toFixed(3)}/{recipe.craftDuration}</span>
            </div>
            <span className="text-xl place-self-center">{displayResourceRequirement(recipe.result)}</span>
        </div>
    );
}