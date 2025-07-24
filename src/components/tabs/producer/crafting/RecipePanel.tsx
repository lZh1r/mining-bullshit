import {recipes} from "../../../../game-state.ts";
import {RecipeCard} from "./RecipeCard.tsx";

export function RecipePanel() {
    return (
        <div class="bg-card-background border-2 border-muted-foreground col-span-2 mr-2">
            <h1 class="text-3xl text-center p-2 border-b-2 border-b-muted-foreground">Recipes</h1>
            {
                Array.from(recipes.value).map(([producer, recipes]) =>
                    <div class="flex flex-col max-h-[78vh] overflow-x-hidden overflow-scroll" key={`${producer.id}_recipes`}>
                        <h2 class="text-2xl text-center">{producer.name}</h2>
                        {recipes.map(recipe =>
                            <RecipeCard recipe={recipe}/>
                        )}
                    </div>
                )
            }
        </div>
    );
}