import type { Reactor } from "../data/Reactor";

export interface ReactorGraphic {
    init(canvas: HTMLCanvasElement, onSlotClick?: (slotNumber: number) => void): void;
    render(reactor: Reactor): void;
    dispose(): void;
}