import { GUIElement } from '../GUIElement';
import { ToolType } from '../../Tools/ToolSelector';
export class CircleButton extends GUIElement {
    mouseUp() {
        this.drawApp.toolSelector.selectTool = ToolType.CIRCLE;
        const circleTool = this.drawApp.toolSelector.tools[ToolType.CIRCLE];
        if (this.active) {
            circleTool.fill = !circleTool.fill;
        }
    }
    ui() {
        const circleTool = this.drawApp.toolSelector.tools[ToolType.CIRCLE];
        const image = circleTool.fill ? this.imgFilled : this.img;
        if (this.active) {
            this.setActive(image);
        }
        else {
            this.drawApp.ctx.drawImage(image, this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }
}
