import { Clamp } from '../Utils/Math';
import { Tool } from './Tool';
import { MouseButton, MouseScroll } from '../Mouse';
export class ZoomTool extends Tool {
    constructor(drawApp, toolType, settings) {
        super(drawApp, toolType);
        this.level = settings.level;
        this.maxLevel = settings.maxLevel;
        this.minLevel = settings.minLevel;
        this.offset = { x: 0, y: 0 };
        this.position = { x: 0, y: 0 };
        this.stepsMouseWheel = settings.stepsMouseWheel;
    }
    zoomIn() {
        this._zoomScaled(this.drawApp.mouse.scrollStep);
    }
    zoomOut() {
        this._zoomScaled(-this.drawApp.mouse.scrollStep);
    }
    _zoomScaled(zoom) {
        const position = {
            x: this.drawApp.mouse.relativeRealPosition.x / this.drawApp.canvas.width,
            y: this.drawApp.mouse.relativeRealPosition.y / this.drawApp.canvas.height
        };
        this.level = Clamp(Math.round((this.level + zoom) * 10) / 10, this.minLevel, this.maxLevel);
        this.offset = {
            x: -Clamp(((this.drawApp.canvas.width * this.level * position.x) - this.drawApp.mouse.realPosition.x), 0, (this.drawApp.canvas.width * this.level) - this.drawApp.canvas.width),
            y: -Clamp(((this.drawApp.canvas.height * this.level * position.y) - this.drawApp.mouse.realPosition.y), 0, (this.drawApp.canvas.height * this.level) - this.drawApp.canvas.height)
        };
        this.drawApp.reloadCanvas();
    }
    onAction() {
        super.onAction();
        if (!this.canRun) {
            return;
        }
        if (this.drawApp.mouse.button !== MouseButton.NONE) {
            return;
        }
        if (this.drawApp.mouse.scroll === MouseScroll.UP) {
            this.zoomIn();
        }
        else if (this.drawApp.mouse.scroll === MouseScroll.DOWN && this.drawApp.zoom.level !== this.drawApp.zoom.minLevel) {
            this.zoomOut();
        }
    }
}
