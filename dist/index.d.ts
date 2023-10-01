import { Settings } from './Interfaces';
import { Mouse } from './Mouse';
import { EventCanvas } from './EventCanvas';
import { Data } from './Data';
import { ToolSelector } from './Tools/ToolSelector';
import { ZoomTool } from './Tools/ZoomTool';
import { GUI } from './GUI/GUI';
import { Vector } from './Utils/Math';
import { Touch } from './Touch';
export declare class DrawApp {
    readonly canvas: HTMLCanvasElement;
    readonly mouse: Mouse;
    readonly touch: Touch;
    readonly eventCanvas: EventCanvas;
    readonly settings: Settings;
    readonly data: Data;
    readonly toolSelector: ToolSelector;
    readonly ctx: CanvasRenderingContext2D;
    readonly gui: GUI;
    readonly zoom: ZoomTool;
    constructor(canvas: HTMLCanvasElement, settings: Settings);
    paintCanvas(position: Vector, showGrid?: boolean, color?: string, sizeWidth?: number, sizeHeight?: number): void;
    resizeWindow(): void;
    reloadCanvas(): void;
    setSizeCanvas(): void;
    toggleGrid(): void;
    private _redrawCanvas;
}
