import type { Unique } from "./Unique";

export interface Cell extends Unique<number> {
    "id": string;
    "heat": number;
    "mass": number;
    "heatCapacity": number;
    "heatTransferFactor": number;
}