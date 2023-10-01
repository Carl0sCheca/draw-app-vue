import { Tool } from './Tool';
import { DrawApp } from '../index';
export declare enum ToolType {
    NONE = -1,
    PENCIL = 0,
    BUCKET = 1,
    COLOUR_PICKER = 2,
    MOVE = 3,
    ZOOM = 4,
    CIRCLE = 5,
    GRID = 6,
    CLEAR = 7
}
export declare class ToolSelector {
    readonly tools: Tool[];
    private selected;
    private previousSelected;
    readonly startTool: ToolType;
    colorSelected: string;
    constructor(drawApp: DrawApp);
    get tool(): Tool | undefined;
    set selectTool(toolType: ToolType);
    restoreTool(): void;
}
