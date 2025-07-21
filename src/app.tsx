import {NavBar} from "./components/NavBar.tsx";
import {currentTab} from "./game-state.ts";

export function App() {

    return (
        <div>
            <NavBar/>
            {currentTab.value()}
        </div>
    );
}
