import { GUIElement } from '../GUIElement';
export class UndoButton extends GUIElement {
    mouseUp() {
        this.drawApp.data.undo();
        this.drawApp.reloadCanvas();
        this.drawApp.gui.reloadGUI();
    }
    hover() {
        if (this.drawApp.data.canUndo()) {
            super.hover();
        }
    }
    ui() {
        if (this.drawApp.data.canUndo()) {
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
