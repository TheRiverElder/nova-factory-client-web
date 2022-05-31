import type { Factory } from "./Factory";
import type { Reactor } from "./Reactor";

export function createEmptyFactory(): Factory {
    return {
		buttery: 0,
		account: 0,
		shop: [],
		storage: [],
		levelInfo: "",
		reactors: [],
    };
}

export function createEmptyReactor(): Reactor {
    return {
		size: 0,
		width: 0,
		height: 0,
		slots: [],
		status: "SLEEPING",
		running: false,
		temperature: 0,
        breakingTemperature: 0,
        brokenTemperature: 0,
    };
}