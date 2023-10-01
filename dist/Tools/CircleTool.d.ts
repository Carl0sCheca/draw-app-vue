import { Tool } from './Tool';
import { DrawApp } from '../index';
import { ToolType } from './ToolSelector';
export declare class CircleTool extends Tool {
    private centerCircle;
    private _circlePixels;
    fill: boolean;
    constructor(drawApp: DrawApp, toolType: ToolType);
    onAction(): void;
    private _circle;
    private _draw;
}
