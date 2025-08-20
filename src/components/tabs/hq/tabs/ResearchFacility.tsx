import {TreeRenderer} from "../../../misc/TreeRenderer.tsx";
import {Tree, type TreeNode} from "../../../../util/Tree.ts";
import {gameActions, money, researches, resources} from "../../../../game-state.ts";
import type {Research} from "../../../../util/upgrades/Research.ts";
import {type Ref, useMemo} from "react";
import {displayResourceRequirement} from "../../../../util/utils.ts";

export function ResearchFacility() {

    return (
        <div>
            <TreeRenderer tree={new Tree(researches.value)} nodeElement={ResearchNode} displayMode={"vertical"}/>
        </div>
    );
}

function ResearchNode(
    {node, ref}:
    { node: TreeNode<Research>, ref: Ref<HTMLDivElement> | undefined}) {
    const research = node.value;
    const canBeBought = useMemo(() => {
        return research.ancestors ? research.ancestors.every((a) => a.isBought) : true;
    }, [money.value, resources.value]);
    return (
        <div
            ref={ref}
            className={`p-2 m-4 border-2 text-xl bg-card-content-background shadow-button ${research.isBought ?
                "shadow-none border-foreground" :
                (canBeBought ? 
                (gameActions.canCompleteResearch(research) ? 
                    "cursor-pointer text-foreground bg-card-content-background" +
                    " hover:bg-hover-card-background hover:border-foreground" :
                    "text-muted-foreground") : "border-muted-foreground text-muted-foreground")}`}
            onClick={() => {
                if (canBeBought) {
                    gameActions.completeResearch(research);

                }
            }}
        >
            <h3 className="place-self-center">
                {!research.ancestors?.every((a) => !a.isBought) ? research.name : "?"}
            </h3>
            <p className="place-self-center">{(canBeBought || research.isBought) &&
                `${research.requirements[0].toString()}$ ${displayResourceRequirement(research.requirements[1])}`}</p>
            <q>{(canBeBought || research.isBought) ? research.description : "???"}</q>
        </div>
    );
}