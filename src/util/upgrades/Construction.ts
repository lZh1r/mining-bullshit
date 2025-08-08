import type {Resource} from "../resources/Resource.ts";
import {gameActions} from "../../game-state.ts";

export class Construction {
    public currentStage: number = 0;
    public totalStages: number;
    public isComplete: boolean = false;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly description: string,
        public requirements: [Resource, number][][],
        public effect: () => void,
    ) {
        this.totalStages = requirements.length;
    }

    get currentRequirements(): [Resource, number][] {
        return this.requirements[this.currentStage];
    }

    public advanceConstruction() {
        const requirements = this.currentRequirements;
        if (gameActions.hasEnoughOf(requirements)) {
            gameActions.withdrawResource(requirements);
            this.currentStage += 1;
            if (this.currentStage === this.totalStages) {
                this.effect();
                this.isComplete = true;
            }
        }
    }
}