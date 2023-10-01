import { GUIElement } from '../GUIElement';
export class RedoButton extends GUIElement {
    mouseUp() {
        this.drawApp.data.redo();
        this.drawApp.reloadCanvas();
        this.drawApp.gui.reloadGUI();
    }
    hover() {
        if (this.drawApp.data.canRedo()) {
            super.hover();
        }
    }
    ui() {
        if (this.drawApp.data.canRedo()) {
            this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
        }
        else {
            this.drawApp.ctx.filter = 'grayscale(100%) hue-rotate(180deg)';
            this.drawApp.ctx.globalAlpha = 0.5;
            this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
            this.drawApp.ctx.globalAlpha = 1;
            this.drawApp.ctx.filter = 'none';
        }
    }
}
