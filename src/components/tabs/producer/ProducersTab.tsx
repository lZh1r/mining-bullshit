import {ProducersTabSidebarHeaderButton} from "./ProducersTabSidebarHeaderButton.tsx";
import {useState} from "react";
import {Producer, type ProducerType} from "../../../util/producers/Producer.ts";
import {gameActions} from "../../../game-state.ts";

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
                    <ProducersTabSidebarHeaderButton title={"P"} type={"energy"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("energy")}/>
                    <ProducersTabSidebarHeaderButton title={"R"} type={"resource"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("resource")}/>
                    <ProducersTabSidebarHeaderButton title={"M"} type={"money"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("money")}/>
                    <ProducersTabSidebarHeaderButton title={"C"} type={"crafting"} currentType={activeProducerList}
                                                     callback={() => setActiveProducerList("crafting")}/>
                </div>
                <div class="flex justify-evenly">
                {/* Buttons to select how much to buy */}
                </div>
                {
                    producerMap.get(activeProducerList)!.map(
                        (entry) => <button
                            class="flex justify-between py-4 px-2 text-2xl border-2 border-muted-foreground cursor-pointer
                            hover:bg-hover-card-background hover:border-foreground"
                            onClick={() => {
                                gameActions.purchaseProducer(entry[0], buyAmount);
                            }}>
                            <span>{entry[0].name}</span>
                            <span>{gameActions.getProducerCost(entry[0], buyAmount)[0].toString()}</span>
                        </button>
                    )
                }
            </aside>
            <div>

            </div>
        </div>
    );
}