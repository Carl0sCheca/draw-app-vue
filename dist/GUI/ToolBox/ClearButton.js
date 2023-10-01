import { GUIElement } from '../GUIElement';
export class ClearButton extends GUIElement {
    windowResize() {
        this.position = {
            x: this.drawApp.canvas.width - this.size.x,
            y: 0
        };
    }
    ui() {
        this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
    }
    mouseUp() {
        this.drawApp.data.clearData();
        this.drawApp.reloadCanvas();
        this.drawApp.gui.reloadGUI();
    }
}
