import { GUIElement } from '../../GUIElement';
import { HSLtoString, HSVtoHSL } from '../../../Utils/Color';
import { CheckRange, Clamp, RandomNumber } from '../../../Utils/Math';
export class ColorSelectorSecondary extends GUIElement {
    _sizeHueSelector(n = 1) {
        return this.hueSelectorSize.x / this.drawApp.settings.numColors * n;
    }
    _hue(n) {
        return Math.trunc(360 / this.drawApp.settings.numColors * n);
    }
    init() {
        this.colorPickedSize = 50;
        this.hueSelectorSize = {
            x: this.size.x - this.colorPickedSize,
            y: this.size.y
        };
        this.hueSelectorPosition = {
            x: this.position.x + this.size.x - this.hueSelectorSize.x,
            y: this.position.y
        };
        for (let i = 0; i < this.drawApp.settings.numColors; i++) {
            this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({ H: this._hue(i), S: 100, V: 100 }));
            this.drawApp.ctx.fillRect(this.hueSelectorPosition.x + this._sizeHueSelector(i), this.hueSelectorPosition.y, this._sizeHueSelector(), this.hueSelectorSize.y);
        }
        this.parent.hue = this._hue(RandomNumber(0, 19));
        this.drawApp.toolSelector.colorSelected = HSLtoString(HSVtoHSL({
            H: this.parent.hue,
            S: 100,
            V: 100
        }));
        this._imageData = this.drawApp.ctx.getImageData(this.hueSelectorPosition.x, this.hueSelectorPosition.y, this.hueSelectorSize.x, this.hueSelectorSize.y);
        this.drawApp.reloadCanvas();
    }
    windowResize() {
        this.position = {
            x: this.parent.position.x,
            y: this.parent.position.y
        };
        this.hueSelectorPosition = {
            x: this.position.x + this.size.x - this.hueSelectorSize.x,
            y: this.position.y
        };
    }
    mouseUp() {
        const position = this.drawApp.mouse.realPosition;
        if (!CheckRange(position, this.position, {
            x: this.position.x + this.colorPickedSize,
            y: this.position.y + this.size.y
        })) {
            this.changeHue();
        }
    }
    changeHue() {
        const position = this.drawApp.mouse.realPosition;
        const hue = this._hue(Math.floor(Clamp(position.x - this.hueSelectorPosition.x, 0, this.hueSelectorSize.x) / this._sizeHueSelector()));
        const parent = this.parent;
        parent.hue = hue;
        parent.change = true;
    }
    ui() {
        this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected;
        this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.colorPickedSize, this.hueSelectorSize.y);
        this.drawApp.ctx.putImageData(this._imageData, this.hueSelectorPosition.x, this.hueSelectorPosition.y);
    }
}
