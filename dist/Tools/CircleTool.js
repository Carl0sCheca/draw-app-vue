import { Tool } from './Tool';
import { MouseButton } from '../Mouse';
import { DiscretizationPosition } from '../Utils/Math';
import { PushIfNotExists } from '../Utils/Util';
import { RecursiveFillPosition } from '../Utils/Canvas';
import { Type } from '../Data';
export class CircleTool extends Tool {
    constructor(drawApp, toolType) {
        super(drawApp, toolType);
        this._circlePixels = [];
        this.fill = false;
    }
    onAction() {
        var _a;
        super.onAction();
        if (!this.canRun) {
            return;
        }
        if (this.drawApp.mouse.button === MouseButton.NONE) {
            if (this._dragging) {
                if (this._circlePixels.length > 1) {
                    this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected;
                    this.drawApp.data.writeData({
                        positions: this._circlePixels,
                        color: this.drawApp.ctx.fillStyle,
                        type: Type.Array
                    });
                }
                this.drawApp.reloadCanvas();
                this._dragging = false;
            }
        }
        else if (this.drawApp.mouse.button === MouseButton.LEFT) {
            if (!this._dragging) {
                this.centerCircle = this.drawApp.mouse.dataPosition;
                this._draw(this.centerCircle);
                this._dragging = true;
            }
            else if (this._dragging) {
                if (this.drawApp.mouse.position.x !== ((_a = this.drawApp.mouse.lastPosition) === null || _a === void 0 ? void 0 : _a.x) || this.drawApp.mouse.position.y !== this.drawApp.mouse.lastPosition.y) {
                    this.drawApp.reloadCanvas();
                    this._circle();
                }
            }
        }
    }
    _circle() {
        if (!this._dragging)
            return;
        const radius = Math.max(Math.abs(this.centerCircle.x - this.drawApp.mouse.dataPosition.x), Math.abs(this.centerCircle.y - this.drawApp.mouse.dataPosition.y));
        if (radius < 1) {
            this._draw(this.centerCircle);
        }
        else {
            let d = (5 - radius * 4) / 4;
            let y = radius;
            this._circlePixels = [];
            for (let x = 0; x <= y; x++) {
                PushIfNotExists({ x: this.centerCircle.x + x, y: this.centerCircle.y + y }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x + x, y: this.centerCircle.y - y }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x - x, y: this.centerCircle.y + y }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x - x, y: this.centerCircle.y - y }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x + y, y: this.centerCircle.y + x }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x + y, y: this.centerCircle.y - x }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x - y, y: this.centerCircle.y + x }, this._circlePixels);
                PushIfNotExists({ x: this.centerCircle.x - y, y: this.centerCircle.y - x }, this._circlePixels);
                if (d < 0) {
                    d += 2 * x + 1;
                }
                else {
                    d += 2 * (x - y) + 1;
                    y--;
                }
            }
            if (this.fill) {
                PushIfNotExists(this.centerCircle, this._circlePixels);
                RecursiveFillPosition(this.centerCircle, this.drawApp, this._circlePixels);
            }
            this._circlePixels.forEach(position => this._draw(position));
        }
    }
    _draw(position) {
        this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid);
        this.drawApp.gui.reloadRelativeGUI();
    }
}
