import {gameActions} from "../../../game-state.ts";
import {displayResourceRequirement} from "../../../util/utils.ts";
import type {Upgrade} from "../../../util/upgrades/Upgrade.ts";
import React from "react";

export const UpgradeCard = React.memo((
    {upgrade, onMouseEnter, onMouseLeave, onClick}:
    {upgrade: Upgrade, onMouseEnter: () => void, onMouseLeave: () => void, onClick: () => void}) => {
    return (<div className={`col-span-1 w-full p-2 bg-card-content-background border-2 border-muted-foreground text-xl
                            ${upgrade.isBought ? "hidden" : ""} ${gameActions.canPurchaseUpgrade(upgrade) ?
        "cursor-pointer hover:bg-hover-card-background" :
        "text-muted-foreground"}`}
                key={upgrade.id}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}>
        <h2>{upgrade.name}</h2>
        <span>{upgrade.requirements[0].toString()}$
            {upgrade.requirements[1].length > 0 ? `${displayResourceRequirement(upgrade.requirements[1])}` : ""}</span>
    </div>);
});