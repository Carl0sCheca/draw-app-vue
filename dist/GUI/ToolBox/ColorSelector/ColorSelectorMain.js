import { GUIElement } from '../../GUIElement';
import { Clamp } from '../../../Utils/Math';
import { HSLtoString, HSVtoHSL, RGBtoHEX } from '../../../Utils/Color';
import { ToolType } from '../../../Tools/ToolSelector';
export class ColorSelectorMain extends GUIElement {
    windowResize() {
        this.position = {
            x: this.parent.position.x + this.parent.size.x - this.size.x,
            y: this.parent.position.y + this.parent.size.y - this.size.y
        };
    }
    mouseUp() {
        const position = {
            x: Clamp(this.drawApp.mouse.realPosition.x, 0, this.position.x + this.size.x - 1),
            y: Clamp(this.drawApp.mouse.realPosition.y, 0, this.position.y + this.size.y - 1)
        };
        this.drawApp.toolSelector.colorSelected = RGBtoHEX(this.drawApp.ctx.getImageData(position.x, position.y, 1, 1).data);
        const pencilTool = this.drawApp.toolSelector.tools[ToolType.PENCIL];
        pencilTool.rainbow = false;
    }
    ui() {
        const parent = this.parent;
        if (parent.change) {
            parent.change = false;
            const colors = 10;
            let x0 = 0;
            let y0 = 0;
            const size = { x: this.size.x / 11, y: this.size.y / 11 };
            for (let y = 0; y <= this.size.y; y += this.pixelSize.y * colors) {
                x0 = 0;
                for (let x = 0; x <= this.size.x; x += this.pixelSize.x * colors) {
                    this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({
                        H: parent.hue,
                        S: x0,
                        V: 100 - y0
                    }));
                    this.drawApp.ctx.fillRect(Math.fround(this.position.x + (x0 / colors) * size.x), Math.fround(this.position.y + (y0 / colors) * size.y), size.x, size.y);
                    x0 += colors;
                }
                y0 += colors;
            }
            this._imageData = this.drawApp.ctx.getImageData(this.position.x, this.position.y, this.size.x, this.size.y);
        }
        else {
            this.drawApp.ctx.putImageData(this._imageData, this.position.x, this.position.y);
        }
    }
}
