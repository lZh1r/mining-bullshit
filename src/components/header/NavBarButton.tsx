import {type JSX, useState} from "react";
import {currentTab, gameActions} from "../../game-state.ts";
import {useSignalEffect} from "@preact/signals";

export function NavBarButton({title, correspondingTab}: {title: string, correspondingTab: () => JSX.Element}) {

    const [isActive, setIsActive] = useState(false);

    useSignalEffect(() => {
        if (correspondingTab === currentTab.value) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    });

    return (
        <button
            class={`bg-card-background p-2 text-center border-2 cursor-pointer px-5 max-sm:w-full 
                w-[6em] max-sm:place-self-center hover:bg-hover-card-background hover:border-foreground
                ${isActive ? "border-foreground shadow-none bg-hover-card-background" : "border-muted-foreground shadow-button"}`}
            onClick={() => {
                gameActions.openTab(correspondingTab);
            }}>
            {title}
        </button>
    );
}