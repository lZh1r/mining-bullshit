import type {GigaNum} from "../GigaNum.ts";
import type {Resource} from "../resources/Resource.ts";

export class Research {
    public isBought: boolean = false;
    constructor(
        public readonly id: IDString,
        public readonly name: NameString,
        public readonly description: string,
        public requirements: [GigaNum, [Resource, number][]],
        public effect: () => void,
        public prerequisites: Research[] | null = null,
        public repeatable: boolean = false,
    ) {}

    get isAvailable(): boolean {
        if (this.isBought && !this.repeatable) {
            return false;
        } else if (this.prerequisites === null) {
            return true;
        } else {
            for (const research of this.prerequisites) {
                if (!research.isBought) {
                    return false;
                }
            }
            return true;
        }
    }
}