import type {Resource} from "./resources/Resource.ts";

export function displayResourceRequirement(requiredResources: [Resource, number][]): string {
    let result = "";
    const len = requiredResources.length;
    for (let i = 0; i < len; i++) {
        const resourceNumberPair = requiredResources[i];
        result += `${resourceNumberPair[0].getName()} x ${resourceNumberPair[1]}${len - i === 1 ? "" : ", "}`;
    }
    return result;
}