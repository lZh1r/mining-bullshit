import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";
import type {Treeable} from "../Tree.ts";

export class Research implements Treeable<Research>{
    public isBought: boolean = false;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly description: string,
        public requirements: [GigaNum, [Resource, number][]],
        public effect: () => void,
        public ancestors: Research[] | null = null,
        public repeatable: boolean = false,
    ) {}

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