import type {Resource} from "../../../util/resources/Resource.ts";
import {gameActions} from "../../../game-state.ts";

export function ResourceCard({resource, amount, spriteSrc}:
                             {resource: Resource, amount: number, spriteSrc: string}) {
    return (
        <div class="bg-card-background p-2 border-2 border-muted-foreground hover:border-foreground flex flex-col">
            <img src={spriteSrc} alt={resource.getId()}/>
            <h3>{resource.getName()} ({amount.toString()})</h3>
            <p>Total value: {gameActions.getTotalValue(resource).toString()}</p>
        </div>
    );
}