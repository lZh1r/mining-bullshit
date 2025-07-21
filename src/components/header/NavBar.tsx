import {ResourceTab} from "../tabs/ResourceTab.tsx";
import {ProducersTab} from "../tabs/ProducersTab.tsx";
import {NavBarButton} from "./NavBarButton.tsx";

export function NavBar() {

    const isOpen = true;

    return (
        <header class="bg-navbar-background w-full text-3xl flex flex-col max-sm:space-y-2">
            <div class="p-3 text-center">
                <p></p>
            </div>
            <nav class={`p-3 w-full text-3xl flex justify-evenly
         border-b-2 border-card-background max-sm:flex-col max-sm:space-y-2 max-sm:${isOpen ? "visible" : "hidden"}`}>
                <NavBarButton title={"Producers"} correspondingTab={ProducersTab}/>
                <NavBarButton title={"Resources"} correspondingTab={ResourceTab}/>
            </nav>
        </header>
    );
}