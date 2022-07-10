export function getChamferPath(x: number, y: number, width: number, height: number, xChamfer: number, yChanfer: number = xChamfer): Array<[number, number]> {
    return [
        [x + width, y],
        [x + width, y + height - yChanfer],
        [x + width - xChamfer, y + height],
        [x, y + height],
        [x, y + yChanfer],
        [x + xChamfer, y],
    ];
}

export function linkClosedPath(g: CanvasRenderingContext2D, path: Array<[number, number]>) {
    g.beginPath();
    g.moveTo(...path[0]);
    for (let i = 1; i < path.length; i++) {
        g.lineTo(...path[i]);
    }
    g.closePath();
}
