import {ResourceCard} from "./ResourceCard.tsx";
import {resources} from "../../../game-state.ts";

export function ResourceTab() {

    return (
        <main class="grid grid-cols-5 max-sm:grid-cols-2">
            {
                Array.from(resources.value).map(([id, resource]) =>
                    <ResourceCard key={id} resource={resource[0]} amount={resource[1]} spriteSrc={`/sprites/resources/${id}.png`}/>
                )
            }
        </main>
    );
}