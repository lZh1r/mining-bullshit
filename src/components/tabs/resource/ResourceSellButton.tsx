import type {Resource} from "../../../util/resources/Resource.ts";
import {gameActions} from "../../../game-state.ts";

export function ResourceSellButton({amount, resource}:
                                   {amount: number, resource: Resource}) {
    return (
        <button
            className={`text-2xl w-full p-1 border-2 border-muted-foreground 
            ${gameActions.hasEnoughOf(resource, amount) ?
                "hover:border-foreground hover:bg-hover-card-background cursor-pointer" :
                "text-muted-foreground"}`}
            onClick={() => {
                gameActions.sellResource(resource, amount);
            }}>
            {amount}
        </button>
    );
}