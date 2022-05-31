import type { Cell } from "./Cell";
import type { Nullable } from "./Nullable";

export interface CellSlot {
    "number": number;
    "x": number;
    "y": number;
    "temperature": number;
    "cell": Nullable<Cell>,
    "depth": number;
}