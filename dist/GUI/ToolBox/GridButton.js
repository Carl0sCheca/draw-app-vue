import { GUIElement } from '../GUIElement';
export class GridButton extends GUIElement {
    mouseUp() {
        this.drawApp.toggleGrid();
    }
    ui() {
        const image = this.drawApp.settings.showGrid ? this.imgFilled : this.img;
        this.drawApp.ctx.drawImage(image, this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
