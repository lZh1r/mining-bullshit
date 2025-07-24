import {useEffect, useState} from "react";
import type {ProducerType} from "../../../util/producers/Producer.ts";

export function ProducersTabSidebarHeaderButton({src, type, currentType, callback}:
                                               {src: string, type: ProducerType, currentType: ProducerType, callback: () => void}) {

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (currentType === type) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [currentType]);

    return (
        <button
            class={`text-5xl border-2 w-full px-5 p-3 border-muted-foreground cursor-pointer
            hover:bg-hover-card-background hover:border-foreground pixelated
            ${isActive ? "bg-hover-card-background hover:border-foreground" : "border-muted-foreground"}`}
            onClick={callback}>
            <img class="w-16"
                 style="image-rendering: pixelated; image-rendering: crisp-edges;"
                 src={src} alt={type.at(0)}/>
        </button>
    );
}