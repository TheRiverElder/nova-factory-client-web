import type { Cell } from "./Cell";
import type { CellPrototype } from "./CellPrototype";

export interface Factory {
    "buttery": number;
    "account": number;
    "shop":  Array<CellPrototype>;
    "storage": Array<Cell>;
    "levelInfo": string;
    "reactors": Array<ReactorBrief>;
}

export interface ReactorBrief {
    "index": number;
    "size": number;
    "running": boolean;
    "temperature": number;
}