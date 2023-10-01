import { DrawApp } from '../index';
import { Zoom } from '../Interfaces';
import { Vector } from '../Utils/Math';
import { Tool } from './Tool';
import { ToolType } from './ToolSelector';
export declare class ZoomTool extends Tool implements Zoom {
    level: number;
    maxLevel: number;
    minLevel: number;
    offset: Vector;
    position: Vector;
    stepsMouseWheel: number;
    constructor(drawApp: DrawApp, toolType: ToolType, settings: Zoom);
    zoomIn(): void;
    zoomOut(): void;
    private _zoomScaled;
    onAction(): void;
}
