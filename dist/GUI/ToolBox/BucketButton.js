import { GUIElement } from '../GUIElement';
import { ToolType } from '../../Tools/ToolSelector';
export class BucketButton extends GUIElement {
    mouseUp() {
        this.drawApp.toolSelector.selectTool = ToolType.BUCKET;
    }
    ui() {
        if (this.active) {
            this.setActive();
        }
        else {
            this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }
}
