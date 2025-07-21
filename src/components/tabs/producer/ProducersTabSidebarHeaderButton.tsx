import {useEffect, useState} from "react";
import type {ProducerType} from "../../../util/producers/Producer.ts";

export function ProducersTabSidebarHeaderButton({title, type, currentType, callback}:
                                               {title: string, type: ProducerType, currentType: ProducerType, callback: () => void}) {

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
            hover:bg-hover-card-background hover:border-foreground
            ${isActive ? "bg-hover-card-background hover:border-foreground" : "border-muted-foreground"}`}
            onClick={callback}>
            {title}
        </button>
    );
}