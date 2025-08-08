import {NavBar} from "./components/header/NavBar.tsx";
import {currentTab, gameTickInterval} from "./game-state.ts";
import {useEffect} from "react";
import {gameTick} from "./util/GameTick.ts";
import {gameInit} from "./registry.ts";
import {ProducersTab} from "./components/tabs/producer/ProducersTab.tsx";
import {ResourceTab} from "./components/tabs/resource/ResourceTab.tsx";
import {HqTab} from "./components/tabs/hq/HQTab.tsx";

export type NavBarTab = "producer" | "resource" | "hq"

export function App() {

    useEffect(() => {
        gameInit();
        const tickInterval = setInterval(gameTick, gameTickInterval.value);
        return () => clearInterval(tickInterval);
    }, []);

    return (
        <div>
            <NavBar/>
            <>
                <div className={"producer" === currentTab.value ? "" : "hidden"}>
                    <ProducersTab/>
                </div>
                <div className={"resource" === currentTab.value ? "" : "hidden"}>
                    <ResourceTab/>
                </div>
                <div className={"hq" === currentTab.value ? "" : "hidden"}>
                    <HqTab/>
                </div>
            </>
        </div>
    );
}
