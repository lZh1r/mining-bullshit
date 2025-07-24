import type {Resource} from "./resources/Resource.ts";
import type {Producer, ProducerType} from "./producers/Producer.ts";
import type {EnergyGenCap} from "./producers/capabilities/EnergyGenCap.ts";
import type {EnergyConsumptionCap} from "./producers/capabilities/EnergyConsumptionCap.ts";

export function displayResourceRequirement(requiredResources: [Resource, number][]): string {
    let result = "";
    const len = requiredResources.length;
    for (let i = 0; i < len; i++) {
        const resourceNumberPair = requiredResources[i];
        result += `${resourceNumberPair[0].getName()} x ${resourceNumberPair[1]}${len - i === 1 ? "" : ", "}`;
    }
    return result;
}

export function displayProducerDetails(producer: Producer<ProducerType>): string {
    let result = "";
    const capabilities = producer.getCapabilities();
    capabilities.forEach((cap, id) => {
        switch (id) {
            case "energy": {
                const energyCap = cap as EnergyGenCap;
                result += `Produces ${energyCap.generation.toString()} GE(Grid Energy)\n`;
                break;
            }
            case "energy_consumption": {
                const energyConCap = cap as EnergyConsumptionCap;
                result += `Consumes ${energyConCap.consumption.toString()} GE(Grid Energy)\n`;
                break;
            }
        }
    });
    return result;
}