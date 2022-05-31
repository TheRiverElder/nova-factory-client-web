import type { Reactor } from "../data/Reactor";
import type { ReactorGraphic } from "./ReactorGraphic";

export class ContextWebGLReactorGraphic implements ReactorGraphic {

    private mouseHoverSlot: [number, number] | null = null;
    private selectedSlot: [number, number] | null = null;
    private canvas: HTMLCanvasElement;
    private lastCellSize: number = 0;
    private lastReactorWidth: number = 0;
    private onSlotClick: (slotNumber: number) => void;

    init(canvas: HTMLCanvasElement, onSlotClick?: (slotNumber: number) => void): void {
        this.canvas = canvas;
        this.onSlotClick = onSlotClick;
        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mouseleave", this.onMouseLeave);
        canvas.addEventListener("click", this.onMouseClick);
        
        const g = this.canvas.getContext("webgl");

        // TODO
    }

    onMouseMove = (ev: MouseEvent) => {
        this.mouseHoverSlot = [Math.floor(ev.offsetX / this.lastCellSize), Math.floor(ev.offsetY / this.lastCellSize)];
    }

    onMouseLeave = (ev: MouseEvent) => {
        this.mouseHoverSlot = null;
    }

    onMouseClick = (ev: MouseEvent) => {
        const x = Math.floor(ev.offsetX / this.lastCellSize);
        const y = Math.floor(ev.offsetY / this.lastCellSize);
        const displaySlotInfoNumber = y * this.lastReactorWidth + x;
        const selectedSlot = this.selectedSlot;
        if (selectedSlot && selectedSlot[x] === x && selectedSlot[y] === y) {
            this.selectedSlot = null;
            if (this.onSlotClick) this.onSlotClick(-1);
        } else {
            this.selectedSlot = [x, y];
            if (this.onSlotClick) this.onSlotClick(displaySlotInfoNumber);
        }
    }
    
    render(reactor: Reactor): void {
        const { width, height } = reactor;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.lastReactorWidth = width;

        const cellSize = Math.min(canvasWidth / width, canvasHeight / height);
        this.lastCellSize = cellSize;

        const g = this.canvas.getContext("webgl");

        // TODO

        const ctx = this.canvas.getContext("2d");
        this.renderSelectFrame(ctx, cellSize, this.mouseHoverSlot);
        this.renderSelectFrame(ctx, cellSize, this.selectedSlot);
    }

    renderSelectFrame(g: CanvasRenderingContext2D, cellSize: number, slotPos: [number, number] | null) {
        if (!slotPos) return;

        const lineWidth = Math.max(1, 0.05 * cellSize);
        const halfLineWidth = lineWidth / 2;
        const innerGap = halfLineWidth;
        const [mx, my] = slotPos;
        g.strokeStyle = "#ffff00";
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