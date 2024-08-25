import type { Reactor } from "../data/Reactor";
import type { ReactorGraphic } from "./ReactorGraphic";
import { constraints, makeColor, toHeatColorInfinity, toHeatInfinity } from "./utils";

export class Context2dReactorGraphic implements ReactorGraphic {

    private mouseHoverSlot: [number, number] | null = null;
    private selectedSlot: [number, number] | null = null;
    private canvas: HTMLCanvasElement;
    private lastCellSize: number = 0;
    private lastReactor: Reactor | null = null;
    private onSlotClick: (slotNumber: number) => void;
    private colorMap: Uint8ClampedArray;

    init(canvas: HTMLCanvasElement, onSlotClick?: (slotNumber: number) => void): void {
        this.canvas = canvas;
        this.setupColorMap();
        this.onSlotClick = onSlotClick;
        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mouseleave", this.onMouseLeave);
        canvas.addEventListener("click", this.onMouseClick);
    }

    setupColorMap () {
        const c = document.createElement("canvas");
        const width = 0x0100;
        const height = 1;
        c.width = width;
        c.height = height;
        const g = c.getContext('2d');

        const gradient = g.createLinearGradient(0, 0, width - 1, 0);
        gradient.addColorStop(0.00, "#0000ff");
        gradient.addColorStop(0.75, "#00ff00");
        gradient.addColorStop(1.00, "#ff0000");
        g.fillStyle = gradient;
        g.fillRect(0, 0, width, height);

        const imageData = g.getImageData(0, 0, width, height);
        this.colorMap = imageData.data.slice();
    }

    // value is in [0, 0xff]
    mapColor(value: number, data: Uint8ClampedArray, index: number, keepAlpha: boolean = true) {
        const v = constraints(Math.floor(value), 0, 0xff);
        const colorIndex = v * 4;
        data[index] = this.colorMap[colorIndex];
        data[index + 1] = this.colorMap[colorIndex + 1];
        data[index + 2] = this.colorMap[colorIndex + 2];
        data[index + 3] = keepAlpha ? v : this.colorMap[colorIndex + 3];
    }

    onMouseMove = (ev: MouseEvent) => {
        this.mouseHoverSlot = this.tryParsePos(ev);
        this.tryRerender();
    }

    onMouseLeave = (ev: MouseEvent) => {
        this.mouseHoverSlot = null;
        this.tryRerender();
    }

    onMouseClick = (ev: MouseEvent) => {
        const pos = this.tryParsePos(ev);
        if (!pos) {
            this.mouseHoverSlot = null;
            this.tryRerender();
            return;
        }

        const [x, y] = pos;
        const displaySlotInfoNumber = y * this.lastReactor.width + x;
        const selectedSlot = this.selectedSlot;
        if (selectedSlot && selectedSlot[0] === x && selectedSlot[1] === y) {
            this.selectedSlot = null;
            if (this.onSlotClick) this.onSlotClick(-1);
        } else {
            this.selectedSlot = [x, y];
            if (this.onSlotClick) this.onSlotClick(displaySlotInfoNumber);
        }
    }

    tryParsePos(ev: MouseEvent): [number, number] | null {
        if (!this.lastReactor) return;
        const x = Math.floor(ev.offsetX / this.lastCellSize);
        const y = Math.floor(ev.offsetY / this.lastCellSize);
        if (x < 0 || x >= this.lastReactor.width || y < 0 || y >= this.lastReactor.height) return null;
        else return [x, y];
    }

    tryRerender() {
        if (this.lastReactor) {
            this.render(this.lastReactor);
        }
    }

    render(reactor: Reactor): void {
        const { width, height } = reactor;
        // const canvasRect = this.canvas.getBoundingClientRect();
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        // this.canvas.width = Math.floor(canvasWidth);
        // this.canvas.height = Math.floor(canvasHeight);

        const cellSize = Math.min(canvasWidth / width, canvasHeight / height);
        this.lastCellSize = cellSize;

        const g = this.canvas.getContext("2d");

        g.clearRect(0, 0, canvasWidth, canvasHeight);

        for (const slot of reactor.slots) {
            const { number, x, y, temperature, cell } = slot;
            const cxp = (x + 0.5) * cellSize;
            const cyp = (y + 0.5) * cellSize;
            if (cell) {
                let colorNum = toHeatColorInfinity(temperature, 1 / 1000.0);
                colorNum -= colorNum % 0x0100;
                const ratio = toHeatInfinity(temperature, 1 / 1000.0);
                const radius = cellSize;
                // const gradient = g.createRadialGradient(cxp, cyp, cellSize / 8, cxp, cyp, Math.max(cellSize / 4, cellSize * ratio));
                const gradient = g.createRadialGradient(cxp, cyp, (0.1 + 0.1 * ratio) * radius, cxp, cyp, radius);
                gradient.addColorStop(0.0, makeColor(colorNum + Math.floor(0xff * ratio)));
                gradient.addColorStop(1.0, makeColor(colorNum));
                g.fillStyle = gradient;
                g.fillRect(cxp - radius, cyp - radius, 2 * radius, 2 * radius);
            }
        }

        const imageData = g.getImageData(0, 0, canvasWidth, canvasHeight);
        const imageDataData = imageData.data;
        for (let i = 0; i < imageDataData.length; i += 4) {
            const alpha = imageDataData[i + 3];
            this.mapColor(alpha, imageDataData, i, true);
        }
        g.putImageData(imageData, 0, 0);

        this.renderSelectFrame(g, cellSize, this.selectedSlot, "#ffff00");
        this.renderSelectFrame(g, cellSize, this.mouseHoverSlot, "#ffff007f");

        this.lastReactor = reactor;
    }

    renderSelectFrame(g: CanvasRenderingContext2D, cellSize: number, slotPos: [number, number] | null, color: string) {
        if (!slotPos) return;

        const lineWidth = Math.max(1, 0.05 * cellSize);
        const halfLineWidth = lineWidth / 2;
        const innerGap = halfLineWidth;
        const [mx, my] = slotPos;
        g.strokeStyle = color;
        g.lineWidth = lineWidth;
        g.strokeRect(
            mx * cellSize + halfLineWidth + innerGap,
            my * cellSize + halfLineWidth + innerGap,
            cellSize - lineWidth - innerGap * 2,
            cellSize - lineWidth - innerGap * 2
        );
    }

    dispose(): void {
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mouseleave", this.onMouseLeave);
        this.canvas.removeEventListener("click", this.onMouseClick);
    }

}