import {recipes} from "../../../../game-state.ts";
import {RecipeCard} from "./RecipeCard.tsx";

export function RecipePanel() {
    return (
        <div className="bg-card-background border-2 border-muted-foreground col-span-2 mr-2 max-h-[75vh]">
            <h1 className="text-3xl text-center p-2 border-b-2 border-b-muted-foreground">Recipes</h1>
            <div className="[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-background
         [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3 overflow-x-hidden overflow-scroll max-h-[69vh]">
                {
                    Array.from(recipes.value).map(([producer, recipes]) =>
                        <div>
                            <h2 className="text-2xl text-center">{producer.name}</h2>
                            {recipes.map(recipe =>
                                <RecipeCard recipe={recipe}/>
                            )}
                        </div>
                    )
                }
            </div>

        </div>
    );
}