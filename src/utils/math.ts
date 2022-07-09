export function isRegularNumber(num: number): boolean {
    return Number.isFinite(num) && !Number.isNaN(num);
}