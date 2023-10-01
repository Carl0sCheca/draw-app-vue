import { DrawApp } from '../index';
import { ToolType } from './ToolSelector';
export declare abstract class Tool {
    protected readonly drawApp: DrawApp;
    name: string;
    event: Event;
    toolType: ToolType;
    protected _dragging: boolean;
    protected canRun: boolean;
    constructor(drawApp: DrawApp, toolType: ToolType);
    onAction(): void;
}
