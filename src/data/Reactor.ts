import type { CellSlot } from "./CellSlot";

export interface Reactor {
    "size": number;
    "width": number;
    "height": number;
    "slots": Array<CellSlot>;
    "status": ReactorStatus;
    "running": boolean;
    "temperature": number;
    "breakingTemperature": number;
    "brokenTemperature": number;
}

export type ReactorStatus = "SLEEPING" | "WORKING" | "BREAKING" | "BROKEN";