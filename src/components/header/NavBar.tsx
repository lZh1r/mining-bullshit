import {NavBarButton} from "./NavBarButton.tsx";
import {money, power, powerConsumption} from "../../game-state.ts";

export function NavBar() {

    const isOpen = true;

    return (
        <header class="bg-navbar-background w-full text-3xl flex flex-col max-sm:space-y-2">
            <div class="p-3 text-center flex justify-center max-sm:flex-col space-y-2 space-x-10">
                <p>Money: {money.value.toString()}$</p>
                <p>Energy Grid Usage: {powerConsumption.value.toString()}/{power.value.toString()}GE</p>
            </div>
            <nav class={`p-3 w-full text-3xl flex justify-evenly
            border-b-2 border-card-background max-sm:flex-col max-sm:space-y-2 max-sm:${isOpen ? "visible" : "hidden"}`}>
                <NavBarButton title={"Producers"} correspondingTab={"producer"}/>
                <NavBarButton title={"Resources"} correspondingTab={"resource"}/>
                <NavBarButton title={"HQ"} correspondingTab={"hq"}/>
            </nav>
        </header>
    );
}