import { Tool } from './Tool';
import { MouseButton } from '../Mouse';
import { RecursiveFillColor } from '../Utils/Canvas';
import { Type } from '../Data';
export class BucketTool extends Tool {
    onAction() {
        var _a;
        super.onAction();
        if (!this.canRun) {
            return;
        }
        if (this.drawApp.mouse.button === MouseButton.NONE) {
            if (this._dragging) {
                this._dragging = false;
                this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected;
                const filledPixels = { positions: [], color: this.drawApp.ctx.fillStyle, type: Type.Array };
                const position = this.drawApp.mouse.dataPosition;
                (_a = filledPixels.positions) === null || _a === void 0 ? void 0 : _a.push(position);
                RecursiveFillColor(position, this.drawApp, filledPixels.positions, this.drawApp.data.pixels[position.x][position.y]);
                this.drawApp.data.writeData(filledPixels);
                this.drawApp.reloadCanvas();
            }
        }
        else if (this.drawApp.mouse.button === MouseButton.LEFT) {
            if (!this._dragging) {
                this._dragging = true;
            }
            else if (this._dragging) {
            }
        }
    }
}
