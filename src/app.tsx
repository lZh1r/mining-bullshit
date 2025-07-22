import {NavBar} from "./components/header/NavBar.tsx";
import {currentTab, gameActions, gameTickInterval} from "./game-state.ts";
import {useEffect} from "react";
import {HAMSTER_WHEEL} from "./registry.ts";
import {gameTick} from "./util/GameTick.ts";

export function App() {

    useEffect(() => {
        gameActions.addProducer(HAMSTER_WHEEL);
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
