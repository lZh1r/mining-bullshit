import {ProducersTabSidebarHeaderButton} from "./ProducersTabSidebarHeaderButton.tsx";
import {useEffect, useMemo, useState} from "react";
import {Producer, type ProducerType} from "../../../util/producers/Producer.ts";
import {gameActions, producerMap, upgrades} from "../../../game-state.ts";
import {displayProducerDetails, displayResourceRequirement} from "../../../util/utils.ts";
import {BuyAmountButton} from "./BuyAmountButton.tsx";
import {RecipePanel} from "./crafting/RecipePanel.tsx";
import {GigaNum} from "../../../util/GigaNum.ts";
import {Upgrade} from "../../../util/upgrades/Upgrade.ts";
import {UpgradeCard} from "./UpgradeCard.tsx";

export function ProducersTab() {

    const [hoverTarget, setHoverTarget] = useState<Producer<ProducerType> | Upgrade>();
    const [activeProducerList, setActiveProducerList] = useState<ProducerType | "all">("all");
    const [buyAmount, setBuyAmount] = useState(1);

    const allUpgradesArray = useMemo(() => {
        return Array.from(upgrades.value.values()).flat();
    }, [upgrades.value]);

    const [upgradesToDisplay, setUpgradesToDisplay] = useState<Upgrade[]>([]);

    useEffect(() => {
        if (activeProducerList === "all") {
            setUpgradesToDisplay(allUpgradesArray);
        } else {
            setUpgradesToDisplay(upgrades.value.get(activeProducerList)!);
        }
    }, [allUpgradesArray, activeProducerList]);

    const currentProducers = useMemo(() => {
        return producerMap.value.get(activeProducerList);
    }, [producerMap.value, activeProducerList]);

    const displayedProducers = useMemo(() => {
        return currentProducers?.map(
            ([producer, amount]) => <button
                onMouseEnter={() => {
                    setHoverTarget(producer);
                }}
                key={producer.id}
                onMouseLeave={() => {
                    setHoverTarget(undefined);
                }}
                class={`flex justify-between py-4 px-2 text-2xl border-2 w-full 
                            ${gameActions.canPurchaseProducer(producer, buyAmount) ?
                    "border-muted-foreground hover:bg-hover-card-background cursor-pointer hover:border-foreground" :
                    "text-muted-foreground"}`}
                onClick={() => {
                    gameActions.purchaseProducer(producer, buyAmount);
                }}>
                <span>{producer.name} ({amount})</span>
                <span>{gameActions.getProducerCost(producer, buyAmount)[0].toString()}$
                    {gameActions.getProducerEnergyConsumption(producer, buyAmount).compareTo(new GigaNum(0)) === "equal" ?
                        "" : ` ${gameActions.getProducerEnergyConsumption(producer, buyAmount).toString()}GE`}
                    {gameActions.getProducerCost(producer, buyAmount)[1].length > 0 ? `,  
                                ${displayResourceRequirement(gameActions.getProducerCost(producer, buyAmount)[1])}` : ""}</span>
            </button>
        );
    }, [currentProducers, buyAmount]);

    const displayedUpgrades = useMemo(() => {
        return  upgradesToDisplay.map((entry) =>
            <UpgradeCard key={entry.id} upgrade={entry} onMouseEnter={() => setHoverTarget(entry)}
                         onMouseLeave={() => setHoverTarget(undefined)}
                         onClick={() => gameActions.purchaseUpgrade(entry)}/>
        );
    }, [upgradesToDisplay]);

    return (
        <div class="grid grid-cols-4 space-x-2">
            <aside class="col-span-1 bg-card-background flex-col flex ml-2 border-2 border-muted-foreground max-h-[75vh]">
                <div class="flex justify-evenly">
                    <ProducersTabSidebarHeaderButton src={"/sprites/all16.png"} type={"all"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("all")}/>
                    <ProducersTabSidebarHeaderButton src={"/sprites/lightning16.png"} type={"energy"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("energy")}/>
                    <ProducersTabSidebarHeaderButton src={"/sprites/pickaxe16.png"} type={"resource"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("resource")}/>
                    <ProducersTabSidebarHeaderButton src={"/sprites/money16.png"} type={"money"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("money")}/>
                    <ProducersTabSidebarHeaderButton src={"/sprites/wrench16.png"} type={"crafting"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("crafting")}/>
                </div>
                <div class="flex justify-evenly">
                    <BuyAmountButton amount={1}
                                     callback={() => {setBuyAmount(1);}} currentAmount={buyAmount}/>
                    <BuyAmountButton amount={10}
                                     callback={() => {setBuyAmount(10);}} currentAmount={buyAmount}/>
                    <BuyAmountButton amount={100}
                                     callback={() => {setBuyAmount(100);}} currentAmount={buyAmount}/>
                </div>
                <div className="[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-background
                    [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3 overflow-x-hidden overflow-scroll">
                    {
                        displayedProducers
                    }
                </div>
            </aside>
            <div className="col-span-1 bg-card-background border-2 border-muted-foreground">
                <h1 className="text-3xl text-center p-2 border-b-2 border-b-muted-foreground">Upgrades</h1>
                <div className="grid grid-cols-2 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-background
                    [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3
                     overflow-x-hidden overflow-scroll max-h-[68vh]">
                    {
                        displayedUpgrades
                    }
                </div>
            </div>
            {activeProducerList === "crafting" || activeProducerList === "all" ? <RecipePanel/> : <h1>WIP</h1>}
            <div className="fixed bottom-0 p-4 border-t-2 border-muted-foreground bg-navbar-background w-full">
                {
                    hoverTarget ? <div className="flex flex-col">
                        <span className="text-2xl">{hoverTarget instanceof Upgrade ? hoverTarget.name :
                            displayProducerDetails(hoverTarget)}</span>
                        <q className="text-xl">{hoverTarget.description}</q>
                    </div> : <p className="text-2xl">Hover over stuff to see its description</p>
                }
            </div>
        </div>
    );
}