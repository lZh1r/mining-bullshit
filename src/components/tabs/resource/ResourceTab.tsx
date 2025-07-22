import {ResourceCard} from "./ResourceCard.tsx";
import {resources} from "../../../game-state.ts";

export function ResourceTab() {

    return (
        <main class="grid grid-cols-6">
            {
                Array.from(resources.value).map((resource) =>
                    <ResourceCard key={resource[1][0].getId()} resource={resource[1][0]} amount={resource[1][1]} spriteSrc={""}/>
                )
            }
        </main>
    );
}