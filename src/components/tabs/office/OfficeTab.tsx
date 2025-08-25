import {type JSX, useState} from "react";
import {AchievementsSubTab} from "./subtabs/AchievementsSubTab.tsx";
import {ExecutiveSubTab} from "./subtabs/ExecutiveSubTab.tsx";

type OfficeSubTab = "achievements" | "executive";

const subTabs = new Map<OfficeSubTab, JSX.Element>([
    ["achievements", <AchievementsSubTab/>],
    ["executive", <ExecutiveSubTab/>],
]);

export function OfficeTab() {

    const [currentSubTab, setCurrentSubTab] = useState<OfficeSubTab>("achievements");

    return (
        <div className="m-2 bg-card-background border-2 border-muted-foreground h-full">
            <div className="grid grid-cols-4 text-2xl">
                <div className="col-span-1 p-2">
                    CEO info
                </div>
                <div className="col-span-3 p-2 text-xl">
                    Some info I guess
                </div>
            </div>
            <div className="flex justify-evenly p-3 border-y-2 border-muted-foreground">
                {
                    [...subTabs.entries()].map(([subTab, _]) =>
                        <button className={`border-2 text-foreground p-2 text-2xl shadow-button
                            ${currentSubTab === subTab ?
                            "border-foreground bg-hover-card-background shadow-none" :
                            "cursor-pointer border-muted-foreground bg-card-background" +
                            " hover:border-foreground hover:bg-hover-card-background"}`}
                                onClick={() => setCurrentSubTab(subTab)}
                                id={subTab + "_subtab_button"}>
                            {subTab.charAt(0).toUpperCase() + subTab.substring(1)}
                        </button>
                    )
                }
            </div>
            {subTabs.get(currentSubTab)}
        </div>
    );
}