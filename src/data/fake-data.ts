import type { Factory } from "./Factory";
import type { Reactor } from "./Reactor";

export function createEmptyFactory(): Factory {
	return {
		buttery: 0,
		account: 0,
		lastGenElectricity: 0,
		shop: [],
		storage: [],
		reactors: [],
	};
}

export function createEmptyReactor(): Reactor {
	return {
		uid: 0,
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