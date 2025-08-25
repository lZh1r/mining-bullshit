import {achievements, completedAchievementsNum} from "../../../../game-state.ts";
import {useState} from "react";
import type {Achievement} from "../../../../util/Achievement.ts";

export function AchievementsSubTab() {

    const [hoverTarget, setHoverTarget] = useState<Achievement | null>(null);

    return (
        <div className="text-xl h-[69vh] flex flex-col justify-between">
            <p className="p-2">Achievements completed: {completedAchievementsNum.value}/{[...achievements.value.entries()].length}</p>
            <div className="grid max-sm:grid-cols-3 grid-cols-10 border-y-2 border-muted-foreground p-2 h-full">
                {
                    [...achievements.value.entries()].map(
                        ([id, [achievement, isComplete]]) =>
                            <div className={`bg-card-content-background border-2 w-32 h-32 flex flex-col justify-center
                            ${isComplete ? "border-foreground" : "border-muted-foreground"}`}
                                 key={id}
                                 onMouseEnter={() => setHoverTarget(achievement)}
                                 onMouseLeave={() => setHoverTarget(null)}>
                                {
                                    isComplete ?
                                        <img className="place-self-center"
                                             src={`/achievement/${id}.png`}
                                             alt={`${id} icon`}/> :
                                        <p className="place-self-center text-3xl">?</p>
                                }
                            </div>
                    )
                }
            </div>
            <div className="p-2">
                {
                    hoverTarget ? (achievements.value.get(hoverTarget.id) ?? [1, false])[1] ?
                        <>
                            <h4>{hoverTarget.name}</h4>
                            <q>{hoverTarget.description}</q>
                        </>    :
                        <>
                            <h4>?</h4>
                            <q>???</q>
                        </> :
                        <h4>
                            Hover over an achievement to see the details
                        </h4>
                }
            </div>
        </div>
    );
}