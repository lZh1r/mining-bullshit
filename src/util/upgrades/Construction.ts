import type {Resource} from "../resources/Resource.ts";
import {gameActions} from "../../game-state.ts";
import {DisplayItem} from "../utils.ts";

export class Construction extends DisplayItem{
    public currentStage: number = 0;
    public totalStages: number;
    public isComplete: boolean = false;
    constructor(
        id: IDString,
        name: NameString,
        description: string,
        public requirements: [Resource, number][][],
        public effect: () => void,
    ) {
        super(id, name, description);
        this.totalStages = requirements.length;
    }

    get currentRequirements(): [Resource, number][] {
        return this.requirements[this.currentStage];
    }

    get canAdvance() {
        return gameActions.hasEnoughOf(this.currentRequirements);
    }

    public advanceConstruction() {
        if (this.canAdvance) {
            gameActions.withdrawResource(this.currentRequirements);
            this.currentStage += 1;
            if (this.currentStage === this.totalStages) {
                this.effect();
                this.isComplete = true;
            }
        }
    }
}