import type {Resource} from "../../../util/resources/Resource.ts";
import {gameActions} from "../../../game-state.ts";
import {ResourceSellButton} from "./ResourceSellButton.tsx";
import {useState} from "react";

export function ResourceCard({resource, amount, spriteSrc}:
                             {resource: Resource, amount: number, spriteSrc: string}) {
    const [autoSell, setAutoSell] = useState(resource.autoSell);

    return (
        <div className="text-xl bg-card-background p-2 border-2 border-muted-foreground hover:border-foreground flex flex-col justify-between">
            <img className="w-32" style="image-rendering: pixelated; image-rendering: crisp-edges;" src={spriteSrc}
                 alt={resource.getId()}/>
            <div>
                <h3>{resource.getName()} ({amount.toString()})</h3>
                <p>Total value: {gameActions.getTotalValue(resource).toString()}</p>
            </div>
            <div className={`${resource.canBeAutomated ? "" : "hidden"} flex justify-between flex-row`}>
                <button className="bg-card-content-background p-1 cursor-pointer border-2 border-muted-foreground
                 hover:border-foreground hover:bg-hover-card-background"
                        onClick={() => {
                            setAutoSell(!autoSell);
                            resource.autoSell = !autoSell;
                        }}>
                    Auto-sell: {autoSell ? "On" : "Off"}
                </button>
                <div className="space-x-2">
                    <label htmlFor="cap">Cap:</label>
                    <input defaultValue={resource.autoCellCap} className="w-16" id="cap" type="number"
                           onChange={(e) => {
                               resource.autoCellCap = Number(e.currentTarget.value);
                           }}/>
                </div>
            </div>
            <div className="flex mt-2">
                <span className="place-self-center">Sell:</span>
                <ResourceSellButton amount={1} resource={resource}/>
                <ResourceSellButton amount={10} resource={resource}/>
                <ResourceSellButton amount={100} resource={resource}/>
            </div>
        </div>
    );
}