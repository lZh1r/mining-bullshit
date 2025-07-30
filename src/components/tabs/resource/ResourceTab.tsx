import {ResourceCard} from "./ResourceCard.tsx";
import {gameActions, orders, resources} from "../../../game-state.ts";
import {displayResourceRequirement} from "../../../util/utils.ts";

export function ResourceTab() {

    return (
        <main className="grid grid-cols-5 max-sm:grid-cols-2 space-x-2 px-2 max-h-[84vh]">
            <div className="bg-card-background border-2 border-muted-foreground max-h-[84vh]">
                <h1 className="border-b-2 p-2 border-muted-foreground text-3xl text-center">Orders</h1>
                {
                    orders.value.map(order =>
                        <div key={order.requirements.toString()}
                             className={`
                             ${gameActions.canCompleteOrder(order) ? 
                                 "text-foreground hover:bg-hover-card-background hover:border-foreground cursor-pointer" :
                                 "text-muted-foreground cursor-default"}
                              bg-card-content-background border-2 border-muted-foreground flex flex-col text-xl
                        `}
                             onClick={() => {
                                 gameActions.completeOrder(order);
                             }}>
                            <h2 className="text-2xl text-center border-b-2 border-muted-foreground">
                                Tier {order.tier} Order
                            </h2>
                            <div className="flex justify-between p-1">
                                <p>
                                    {displayResourceRequirement(order.requirements)}
                                </p>
                                {/*TODO: center this mf below*/}
                                <span className=" text-center">==={">"}</span>
                                <span>
                                {order.reward.toString()}$
                            </span>
                            </div>

                        </div>)
                }
            </div>
            <div className="sm:col-span-3 overflow-x-hidden overflow-scroll
        [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-background
        [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3
        bg-card-background border-2 border-muted-foreground max-h-[84vh]">
                {
                    Array.from(resources.value).map(([id, resource]) =>
                        <ResourceCard key={id} resource={resource[0]} amount={resource[1]} spriteSrc={`/sprites/resources/${id}.png`}/>
                    )
                }
            </div>

        </main>
    );
}