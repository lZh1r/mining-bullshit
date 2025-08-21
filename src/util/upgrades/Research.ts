import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";
import type {Treeable} from "../Tree.ts";
import {DisplayItem} from "../utils.ts";

export class Research extends DisplayItem implements Treeable<Research>{
    public isBought: boolean = false;
    constructor(
        id: IDString,
        name: NameString,
        description: string,
        public requirements: [GigaNum, [Resource, number][]],
        public effect: () => void,
        public ancestors: Research[] | null = null,
        public repeatable: boolean = false,
    ) {
        super(id, name, description);
    }

    get isAvailable(): boolean {
        if (this.isBought && !this.repeatable) {
            return false;
        } else if (this.ancestors === null) {
            return true;
        } else {
            for (const research of this.ancestors) {
                if (!research.isBought) {
                    return false;
                }
            }
            return true;
        }
    }
}