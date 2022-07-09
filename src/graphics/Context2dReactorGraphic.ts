import type { Reactor } from "../data/Reactor";
import type { ReactorGraphic } from "./ReactorGraphic";
import { makeColor, toHeatColorInfinity, toHeatInfinity } from "./utils";

export class Context2dReactorGraphic implements ReactorGraphic {

    private mouseHoverSlot: [number, number] | null = null;
    private selectedSlot: [number, number] | null = null;
    private canvas: HTMLCanvasElement;
    private lastCellSize: number = 0;
    private lastReactor: Reactor | null = null;
    private onSlotClick: (slotNumber: number) => void;

    init(canvas: HTMLCanvasElement, onSlotClick?: (slotNumber: number) => void): void {
        this.canvas = canvas;
        this.onSlotClick = onSlotClick;
        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mouseleave", this.onMouseLeave);
        canvas.addEventListener("click", this.onMouseClick);
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

        function genColorNum(t: number) {
            return toHeatColorInfinity(t, 1 / 500.0);
        }

        function genColorStyle(t: number) {
            return makeColor(genColorNum(t));
        }

        g.fillStyle = genColorStyle(0);
        g.fillRect(0, 0, width * cellSize, height * cellSize);

        for (const slot of reactor.slots) {
            const { number, x, y, temperature, cell } = slot;
            const cxp = (x + 0.5) * cellSize;
            const cyp = (y + 0.5) * cellSize;
            if (cell) {
                let colorNum = genColorNum(temperature);
                colorNum -= colorNum % 0x0100;
                const ratio = toHeatInfinity(temperature, 1 / 100.0);
                const gradient = g.createRadialGradient(cxp, cyp, cellSize / 8, cxp, cyp, Math.max(cellSize / 4, cellSize * ratio));
                gradient.addColorStop(0.0, makeColor(colorNum + 0xff));
                // gradient.addColorStop(0.75, makeColor(colorNum + 0x7f));
                gradient.addColorStop(1.0, makeColor(colorNum));
                g.fillStyle = gradient;
                g.fillRect(0, 0, canvasWidth, canvasHeight);
            }
        }

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