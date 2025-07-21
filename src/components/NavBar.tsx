import {gameActions} from "../game-state.ts";
import {ResourceTab} from "./tabs/ResourceTab.tsx";
import {ProducersTab} from "./tabs/ProducersTab.tsx";

export function NavBar() {

    const isOpen = true;

    return (
        <nav class={`bg-navbar-background p-3 w-full text-3xl flex justify-evenly
         border-b-2 border-card-background max-sm:flex-col max-sm:space-y-2 max-sm:${isOpen ? "visible" : "hidden"}`}>
            <button onClick={() => {
                gameActions.openTab(ProducersTab);
            }}
                    className="bg-card-background p-2 text-center border-2 border-muted-foreground
             cursor-pointer px-5 max-sm:w-full w-[6em] max-sm:place-self-center">
                Producers
            </button>
            <button onClick={() => {
                gameActions.openTab(ResourceTab);
            }}
                    className="bg-card-background p-2 text-center border-2 border-muted-foreground
                    cursor-pointer px-5 max-sm:w-full w-[6em] max-sm:place-self-center">
                Resources
            </button>
            <button className="bg-card-background p-2 text-center border-2 border-muted-foreground
             cursor-pointer px-5 max-sm:w-full w-[6em] max-sm:place-self-center">
                Office
            </button>
            <button className="bg-card-background p-2 text-center border-2 border-muted-foreground
             cursor-pointer px-5 max-sm:w-full w-[6em] max-sm:place-self-center">
                Laboratory
            </button>
        </nav>
    );
}