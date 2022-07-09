import type { Unique } from "./Unique";

export interface CellPrototype extends Unique<number> {
    "name": string;
    "price": number;
}