import {ResourceCard} from "./ResourceCard.tsx";
import {resources} from "../../../game-state.ts";

export function ResourceTab() {

    return (
        <main class="grid grid-cols-5 max-sm:grid-cols-2 overflow-x-hidden overflow-scroll
        [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-background
        [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3">
            {
                Array.from(resources.value).map(([id, resource]) =>
                    <ResourceCard key={id} resource={resource[0]} amount={resource[1]} spriteSrc={`/sprites/resources/${id}.png`}/>
                )
            }
        </main>
    );
}