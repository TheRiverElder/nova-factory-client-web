

export function constraints(num: number, min: number, max: number): number {
    return Math.max(min, Math.min(num, max));
}

export function toHeatInfinity(temperature: number, scalar: number): number {
    return Math.tanh(temperature * scalar);
}

export function toHeatColorInfinity1(temperature: number, scalar: number): number {
    const v = Math.floor(toHeatInfinity(temperature, scalar) * 0x0300);
    let r = 0, g = 0, b = 0;
    if (v >= 0x0200) {
        r = v - 0x0200;
        g = 0xff - r;
    } else if (v >= 0x0100) {
        g = v - 0x0100;
        b = 0xff - g;
    } else {
        b = v;
    }
    const result = r * 0x01000000 + g * 0x010000 + b * 0x0100 + 0xff;
    return result;
}

export function toHeatColorInfinity(temperature: number, scalar: number): number {
    const v = constraints(Math.floor(toHeatInfinity(temperature, scalar) * 0x01ff), 0, 0x01ff);
    const result = constraints(Math.floor(v - 0x0100), 0, 0xff) * 0x01000000 + constraints(v < 0x0100 ? v : (0xff - v % 0x0100), 0, 0xff) * 0x0100 + 0xff;
    return result;
}

export function makeColor(num: number): string {
    return "#" + constraints(Math.floor(num), 0, 0xffffffff).toString(16).padStart(8, "0");
}
