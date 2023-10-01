import { Tool } from './Tool';
import { DrawApp } from '../index';
import { ToolType } from './ToolSelector';
export declare class PencilTool extends Tool {
    rainbowColor: number;
    rainbow: boolean;
    size: number;
    private _pixelPoints;
    constructor(drawApp: DrawApp, toolType: ToolType);
    onAction(): void;
    private _pencilTool;
}
