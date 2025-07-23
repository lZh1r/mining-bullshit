import {NavBar} from "./components/header/NavBar.tsx";
import {currentTab, gameTickInterval} from "./game-state.ts";
import {useEffect} from "react";
import {gameTick} from "./util/GameTick.ts";
import {gameInit} from "./init.ts";

export function App() {

    useEffect(() => {
        gameInit();
        const tickInterval = setInterval(gameTick, gameTickInterval.value);
        return () => clearInterval(tickInterval);
    }, []);

    return (
        <div>
            <NavBar/>
            {currentTab.value()}
        </div>
    );
}
