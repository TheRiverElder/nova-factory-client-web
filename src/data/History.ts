export type History<TRecord extends Array<number>> = Array<TRecord>;

export type FactoryRecord = [number, number, number]; // [timeByTick, powerOfTick, demandOfTick]
export type FactoryHistory = History<FactoryRecord>;

export type ReactorRecord = [number, number, number]; // [timeByTick, powerOfTick, temperature]
export type ReactorHistory = History<ReactorRecord>;