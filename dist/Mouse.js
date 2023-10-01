import { ToolType } from './Tools/ToolSelector';
import { DiscretizationDataPosition, DiscretizationPosition } from './Utils/Math';
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["NONE"] = -1] = "NONE";
    MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
    MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
    MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
})(MouseButton || (MouseButton = {}));
export var MouseScroll;
(function (MouseScroll) {
    MouseScroll[MouseScroll["NONE"] = -1] = "NONE";
    MouseScroll[MouseScroll["UP"] = 0] = "UP";
    MouseScroll[MouseScroll["DOWN"] = 1] = "DOWN";
})(MouseScroll || (MouseScroll = {}));
export class Mouse {
    constructor(_drawApp) {
        this._drawApp = _drawApp;
        this.button = MouseButton.NONE;
        this.scroll = MouseScroll.NONE;
        this.moving = false;
        this.realPosition = { x: 0, y: 0 };
        this.lastPosition = undefined;
        this.scrollStep = 0.1;
    }
    get position() {
        return DiscretizationPosition(this.dataPosition, this._drawApp);
    }
    get relativeRealPosition() {
        const position = { x: this.realPosition.x, y: this.realPosition.y };
        position.x -= this._drawApp.zoom.offset.x;
        position.x /= this._drawApp.zoom.level;
        position.y -= this._drawApp.zoom.offset.y;
        position.y /= this._drawApp.zoom.level;
        return position;
    }
    get dataPosition() {
        return DiscretizationDataPosition(this.relativeRealPosition, this._drawApp);
    }
    mouseDownLeft() {
        this.button = MouseButton.LEFT;
    }
    mouseDownRight() {
        this.button = MouseButton.RIGHT;
        this._drawApp.gui.toolbox.toggle();
    }
    mouseUpLeft() {
        this.button = MouseButton.NONE;
    }
    mouseUpRight() {
        this.button = MouseButton.NONE;
    }
    mouseWheelButtonDown() {
        this.button = MouseButton.MIDDLE;
        this._drawApp.toolSelector.selectTool = ToolType.MOVE;
    }
    mouseWheelButtonUp() {
        this.button = MouseButton.NONE;
    }
    mouseWheelDown() {
        if (this.button !== MouseButton.NONE) {
            return;
        }
        this.scroll = MouseScroll.DOWN;
        this._drawApp.toolSelector.selectTool = ToolType.ZOOM;
    }
    mouseWheelUp() {
        if (this.button !== MouseButton.NONE) {
            return;
        }
        this.scroll = MouseScroll.UP;
        this._drawApp.toolSelector.selectTool = ToolType.ZOOM;
    }
    mouseMove(position) {
        this.realPosition = position;
    }
    mouseLeave() {
        this.button = MouseButton.NONE;
    }
}
