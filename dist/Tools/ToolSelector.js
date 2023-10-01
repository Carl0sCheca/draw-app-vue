import { PencilTool } from './PencilTool';
import { BucketTool } from './BucketTool';
import { ColourPickerTool } from './ColourPickerTool';
import { MoveTool } from './MoveTool';
import { ZoomTool } from './ZoomTool';
import { CircleTool } from './CircleTool';
export var ToolType;
(function (ToolType) {
    ToolType[ToolType["NONE"] = -1] = "NONE";
    ToolType[ToolType["PENCIL"] = 0] = "PENCIL";
    ToolType[ToolType["BUCKET"] = 1] = "BUCKET";
    ToolType[ToolType["COLOUR_PICKER"] = 2] = "COLOUR_PICKER";
    ToolType[ToolType["MOVE"] = 3] = "MOVE";
    ToolType[ToolType["ZOOM"] = 4] = "ZOOM";
    ToolType[ToolType["CIRCLE"] = 5] = "CIRCLE";
    ToolType[ToolType["GRID"] = 6] = "GRID";
    ToolType[ToolType["CLEAR"] = 7] = "CLEAR";
})(ToolType || (ToolType = {}));
export class ToolSelector {
    constructor(drawApp) {
        this.startTool = ToolType.PENCIL;
        this.selected = -1;
        this.previousSelected = -1;
        this.colorSelected = '000000';
        this.tools = [];
        this.tools.push(new PencilTool(drawApp, ToolType.PENCIL));
        this.tools.push(new BucketTool(drawApp, ToolType.BUCKET));
        this.tools.push(new ColourPickerTool(drawApp, ToolType.COLOUR_PICKER));
        this.tools.push(new MoveTool(drawApp, ToolType.MOVE));
        this.tools.push(new ZoomTool(drawApp, ToolType.ZOOM, {
            level: 1,
            minLevel: 1,
            maxLevel: 8,
            stepsMouseWheel: 0.1
        }));
        this.tools.push(new CircleTool(drawApp, ToolType.CIRCLE));
    }
    get tool() {
        return this.selected >= 0 ? this.tools[this.selected] : undefined;
    }
    set selectTool(toolType) {
        if (this.selected !== toolType.valueOf()) {
            this.previousSelected = this.selected;
            this.selected = toolType.valueOf();
        }
    }
    restoreTool() {
        if (this.previousSelected !== -1) {
            this.selected = this.previousSelected;
            this.previousSelected = -1;
        }
    }
}
