import {useEffect, useMemo, useState} from "react";
import {facilities} from "../../../game-state.ts";
import {displayResourceRequirement} from "../../../util/utils.ts";

export function HqTab() {

    const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0);
    const [hasNeighbours, setHasNeighbours] = useState([false, facilities.value.length - 1 > currentFacilityIndex]);

    function changeDisplayedFacility(direction: -1 | 1) {
        const newIndex = currentFacilityIndex + direction;
        if ((0 <= newIndex) && (newIndex < facilities.value.length)) {
            setCurrentFacilityIndex(newIndex);
        }
    }

    const currentFacility = useMemo(() => {
        console.log("change");
        return facilities.value[currentFacilityIndex];
    }, [currentFacilityIndex, facilities.value]);

    useEffect(() => {
        setHasNeighbours([currentFacilityIndex !== 0, (facilities.value.length - 1) > currentFacilityIndex]);
    }, [currentFacilityIndex, facilities.value]);

    return (
        <div className="m-2 my-0 border-2 border-muted-foreground h-[84vh] flex flex-col bg-card-background">
            <div className="border-b-2 border-muted-foreground p-2 text-center">
                <h2 className="text-3xl">{currentFacility?.name}</h2>
                <p className="text-2xl">{currentFacility?.description}</p>
            </div>
            <div className="flex justify-between h-full">
                {hasNeighbours[0] ?
                    <button className="place-self-center border-2 border-muted-foreground
                 m-2 p-2 bg-card-content-background text-xl cursor-pointer hover:bg-hover-card-background"
                            onClick={() => changeDisplayedFacility(-1)}>
                    {"<<<"}
                </button> : <div className="p-4 m-2"></div>}
                <div className="p-2 border-x-2 border-muted-foreground h-full bg-card-content-background
                w-full flex flex-col justify-center">
                    <p className="text-center text-2xl">
                        {displayResourceRequirement(currentFacility?.currentRequirements ?? [])}
                    </p>
                    <button className={`place-self-center border-2 border-muted-foreground
                     m-2 p-2 bg-card-content-background text-xl text-muted-foreground shadow-button`}>
                        Construct
                    </button>
                </div>
                {hasNeighbours[1] ?
                    <button className="place-self-center border-2 border-muted-foreground
                 m-2 p-2 bg-card-content-background text-xl cursor-pointer hover:bg-hover-card-background"
                            onClick={() => changeDisplayedFacility(1)}>
                    {">>>"}
                </button> : <div className="p-4 m-2"></div>}
            </div>
        </div>
    );
}