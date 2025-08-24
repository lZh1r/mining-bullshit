import {DisplayItem} from "./utils.ts";

export class Achievement extends DisplayItem{
    constructor(
        id: IDString,
        name: NameString,
        description: string,
    ) {
        super(id, name, description);
    }
}