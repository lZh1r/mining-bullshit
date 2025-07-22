import {ProducersTabSidebarHeaderButton} from "./ProducersTabSidebarHeaderButton.tsx";
import {useState} from "react";
import {Producer, type ProducerType} from "../../../util/producers/Producer.ts";
import {gameActions} from "../../../game-state.ts";
import {displayResourceRequirement} from "../../../util/utils.ts";

export function ProducersTab() {

    const [activeProducerList, setActiveProducerList] = useState<ProducerType>("energy");
    const [buyAmount, setBuyAmount] = useState(1);
    const producerMap = new Map<ProducerType, [Producer<ProducerType>, number][]>([
        ["energy", gameActions.getAllProducersOfType("energy")],
        ["money", gameActions.getAllProducersOfType("money")],
        ["crafting", gameActions.getAllProducersOfType("crafting")],
        ["resource", gameActions.getAllProducersOfType("resource")]
    ]);

    return (
        <div class="grid grid-cols-4">
            <aside class="col-span-1 bg-card-background flex-col flex">
                <div class="flex justify-evenly">
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
                {/* Buttons to select how much to buy */}
                </div>
                {
                    producerMap.get(activeProducerList)!.map(
                        (entry) => <button
                            key={entry[0].id}
                            class={`flex justify-between py-4 px-2 text-2xl border-2
                            ${gameActions.canPurchaseProducer(entry[0], buyAmount) ?
                                "border-muted-foreground hover:bg-hover-card-background cursor-pointer hover:border-foreground" :
                                "text-muted-foreground"}`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                gameActions.sellProducer(entry[0], buyAmount);
                            }}
                            onClick={() => {
                                gameActions.purchaseProducer(entry[0], buyAmount);
                            }}>
                            <span>{entry[0].name} ({gameActions.getProducerAmount(entry[0])})</span>
                            <span>{gameActions.getProducerCost(entry[0], buyAmount)[0].toString()}$
                                {gameActions.getProducerCost(entry[0], buyAmount)[1].length > 0 ? `,  
                                ${displayResourceRequirement(gameActions.getProducerCost(entry[0], buyAmount)[1])}` : ""}</span>
                        </button>
                    )
                }
            </aside>
            <div>

            </div>
        </div>
    );
}