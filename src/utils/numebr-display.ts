import { arrayPeek } from "./lang";

export interface ShortenLevel {
    maxDigits: number;
    minDigits: number; 
    unit: string;
}

function makeShortenLevel(maxDigits: number, minDigits: number, unit: string) {
    return { maxDigits, minDigits, unit };
}


const shortenLevels = [
    makeShortenLevel(3, 0, ""),
    makeShortenLevel(6, 3, "k"),
    makeShortenLevel(9, 6, "M"),
    makeShortenLevel(12, 9, "G"),
    makeShortenLevel(15, 12, "P"),
    makeShortenLevel(18, 15, "T"),
];

export function shortenNumber(num: number, fixedDigits: number = 2): string {
    let fg = fixedDigits;
    const doubleValue = num;
    const digits: number = Math.floor(Math.log10(doubleValue));
    let shortenLevel: ShortenLevel | null = null;
    for (const sl of shortenLevels) {
        if (digits < sl.maxDigits) {
            shortenLevel = sl;
            break;
        }
    }
    if (shortenLevel == null) {
        shortenLevel = arrayPeek(shortenLevels);
    }
    if (shortenLevel == shortenLevels[0] && Number.isInteger(num)) {
        fg = 0;
    }
    return (doubleValue / Math.pow(10, shortenLevel.minDigits)).toFixed(fg) + shortenLevel.unit;
}