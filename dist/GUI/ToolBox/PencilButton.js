import { GUIElement } from '../GUIElement';
import { ToolType } from '../../Tools/ToolSelector';
import { PencilTool } from '../../Tools/PencilTool';
import { ColorSelectorButton } from './ColorSelector/ColorSelectorButton';
export class PencilButton extends GUIElement {
    constructor() {
        super(...arguments);
        this._rainbowSelectorTime = 1000;
    }
    init() {
        this._pencilTool = this.drawApp.toolSelector.tools.find(tool => tool.toolType === ToolType.PENCIL);
    }
    mouseDown() {
        this._startTime = new Date().getTime();
    }
    mouseUp() {
        if (this.drawApp.toolSelector.tool instanceof PencilTool) {
            if (new Date().getTime() - this._startTime > this._rainbowSelectorTime) {
                this._pencilTool.rainbowColor = (this.parent.child.find(element => element instanceof ColorSelectorButton).hue / (360 / this.drawApp.settings.numColors) - 1);
                this._pencilTool.rainbow = !this._pencilTool.rainbow;
            }
            else {
                this._pencilTool.size = this._pencilTool.size === 1 ? 2 : 1;
            }
        }
        else {
            this.drawApp.toolSelector.selectTool = ToolType.PENCIL;
        }
    }
    ui() {
        let img;
        if (this._pencilTool.size === 1) {
            img = this.img;
        }
        else {
            img = this.imgAlternative;
        }
        if (this.active) {
            if (this._pencilTool.rainbow) {
                this.setActive(img, 120);
            }
            else {
                this.setActive(img);
            }
        }
        else {
            this.drawApp.ctx.drawImage(img, this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }
}
