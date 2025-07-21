import {NavBar} from "./components/header/NavBar.tsx";
import {currentTab} from "./game-state.ts";

export function App() {

    return (
        <div>
            <NavBar/>
            {currentTab.value()}
        </div>
    );
}
