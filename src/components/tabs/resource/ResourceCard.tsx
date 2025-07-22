import type {Resource} from "../../../util/resources/Resource.ts";
import {gameActions} from "../../../game-state.ts";
import {ResourceSellButton} from "./ResourceSellButton.tsx";

export function ResourceCard({resource, amount, spriteSrc}:
                             {resource: Resource, amount: number, spriteSrc: string}) {
    return (
        <div class="text-xl bg-card-background p-2 border-2 border-muted-foreground hover:border-foreground flex flex-col">
            <img src={spriteSrc} alt={resource.getId()}/>
            <h3>{resource.getName()} ({amount.toString()})</h3>
            <p>Total value: {gameActions.getTotalValue(resource).toString()}</p>
            <div class="flex mt-2">
                <span class="place-self-center">Sell:</span>
                <ResourceSellButton amount={1} resource={resource}/>
                <ResourceSellButton amount={10} resource={resource}/>
                <ResourceSellButton amount={100} resource={resource}/>
            </div>
        </div>
    );
}