import type {ProducerType} from "../Producer";

export interface IProdCapability {
    id: IDString,
    applicableToProducerOfType: SingleOrArray<ProducerType>
    reset: () => void
}