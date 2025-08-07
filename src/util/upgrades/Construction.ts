import type {Resource} from "../resources/Resource.ts";
import {gameActions} from "../../game-state.ts";

export class Construction {
    public currentStage: number = 0;
    public totalStages: number;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public requirements: [Resource, number][][],
        public effect: () => void,
    ) {
        this.totalStages = requirements.length;
    }

    get currentRequirements() {
        return this.requirements[this.currentStage];
    }

    public advanceConstruction() {
        const requirements = this.currentRequirements;
        if (gameActions.hasEnoughOf(requirements)) {
            gameActions.withdrawResource(requirements);
            this.currentStage += 1;
            if (this.currentStage === this.totalStages) {
                this.effect();
            }
        }
    }
}