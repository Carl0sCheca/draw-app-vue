import { MouseButton } from '../Mouse';
export class Tool {
    constructor(drawApp, toolType) {
        this.drawApp = drawApp;
        this.toolType = toolType;
        this.name = this.toolType.toString();
        this.event = new Event(this.name);
        this._dragging = false;
        this.canRun = true;
        drawApp.canvas.addEventListener(this.name, () => this.onAction());
    }
    onAction() {
        this.canRun = this.drawApp.mouse.button !== MouseButton.RIGHT;
    }
}
