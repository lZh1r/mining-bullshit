import {DisplayItem} from "./utils.ts";

export class Achievement extends DisplayItem{
    constructor(
        id: IDString,
        name: NameString,
        description: string,
    ) {
        super(id, name, description);
        Achievement.allAchievements.set(id, [this, false]);
    }

    public static allAchievements = new Map<IDString, [Achievement, boolean]>();
}