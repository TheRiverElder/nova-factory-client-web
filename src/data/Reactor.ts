import type { CellSlot } from "./CellSlot";
import type { Unique } from "./Unique";

export interface Reactor extends Unique<number> {
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