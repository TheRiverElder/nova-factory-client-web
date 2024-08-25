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

export function clipPath(path: Array<[number, number]>): string {
    const nodes: Array<string> = [];
    nodes.push(`M ${path[0][0]} ${path[0][1]}`);
    for (let i = 1; i < path.length; i++) {
        nodes.push(`L ${path[0][0]} ${path[0][1]}`);
    }
    nodes.push("Z");
    return `polygon(${nodes.join(" ")})`;
}