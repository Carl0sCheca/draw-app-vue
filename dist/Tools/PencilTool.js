import { Tool } from './Tool';
import { MouseButton } from '../Mouse';
import { DiscretizationDataPosition, DiscretizationPosition, LerpSteps } from '../Utils/Math';
import { HSLtoString, HSVtoHSL } from '../Utils/Color';
import { Data, Type } from '../Data';
import { CheckIfSamePositionAsLast } from '../Utils/Canvas';
export class PencilTool extends Tool {
    constructor(drawApp, toolType) {
        super(drawApp, toolType);
        this.rainbow = false;
        this.size = 1;
        this._pixelPoints = { positions: [], colors: [], type: Type.Array };
    }
    onAction() {
        super.onAction();
        if (!this.canRun) {
            return;
        }
        if (this.drawApp.mouse.button === MouseButton.LEFT) {
            if (!this._dragging) {
                this._dragging = true;
                this._pencilTool(DiscretizationDataPosition(this.drawApp.mouse.position, this.drawApp));
            }
            else if (CheckIfSamePositionAsLast(this.drawApp.mouse.position, this.drawApp.mouse.lastPosition)) {
                LerpSteps(this.drawApp, this.drawApp.mouse.position, this.drawApp.mouse.lastPosition, (currentPos) => this._pencilTool(currentPos));
            }
        }
        else {
            if (this._pixelPoints.positions.length > 0) {
                this._pixelPoints = Data.FlushDuplicatedData(this._pixelPoints, this.drawApp.settings.gridSize);
                this.drawApp.data.writeData(this._pixelPoints);
                this._pixelPoints = { positions: [], colors: [], type: Type.Array };
            }
            this._dragging = false;
        }
    }
    _pencilTool(position) {
        var _a, _b;
        this.rainbowColor++;
        if (this.rainbowColor > this.drawApp.settings.numColors - 1) {
            this.rainbowColor = 0;
        }
        let color;
        if (this.rainbow) {
            color = HSLtoString(HSVtoHSL({ H: this.rainbowColor * 360 / this.drawApp.settings.numColors, S: 100, V: 100 }));
        }
        else {
            color = this.drawApp.toolSelector.colorSelected;
        }
        this.drawApp.ctx.fillStyle = color;
        color = this.drawApp.ctx.fillStyle;
        if (this.size === 1) {
            this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color);
            (_a = this._pixelPoints.positions) === null || _a === void 0 ? void 0 : _a.push(position);
            (_b = this._pixelPoints.colors) === null || _b === void 0 ? void 0 : _b.push(color);
        }
        else {
            const positions = [
                { x: position.x - 1, y: position.y },
                { x: position.x + 1, y: position.y },
                { x: position.x, y: position.y - 1 },
                { x: position.x, y: position.y + 1 },
                { x: position.x, y: position.y }
            ];
            positions.forEach(position => {
                var _a, _b;
                (_a = this._pixelPoints.positions) === null || _a === void 0 ? void 0 : _a.push(position);
                (_b = this._pixelPoints.colors) === null || _b === void 0 ? void 0 : _b.push(color);
                this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color);
            });
        }
        this.drawApp.gui.reloadRelativeGUI();
    }
}
