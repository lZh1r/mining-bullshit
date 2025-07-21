import {NavBar} from "./components/header/NavBar.tsx";
import {currentTab, gameActions} from "./game-state.ts";
import {useEffect} from "react";
import {HAMSTER_WHEEL} from "./registry.ts";

export function App() {

    useEffect(() => {
        gameActions.addProducer(HAMSTER_WHEEL);
    }, []);

    return (
        <div>
            <NavBar/>
            {currentTab.value()}
        </div>
    );
}
