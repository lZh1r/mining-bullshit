import type {JSX} from "react";
import {gameActions} from "../../game-state.ts";

export function NavBarButton({title, correspondingTab}: {title: string, correspondingTab: () => JSX.Element}) {
    return (
        <button
            className="bg-card-background p-2 text-center border-2 border-muted-foreground
                cursor-pointer px-5 max-sm:w-full w-[6em] max-sm:place-self-center shadow-button
                focus:bg-hover-card-background hover:border-foreground focus:border-foreground focus:shadow-none"
            onClick={() => {
            gameActions.openTab(correspondingTab);
            }}>
            {title}
        </button>
    );
}