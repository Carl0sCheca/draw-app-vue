import { GUIElement } from '../GUIElement'

export class RedoButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.data.redo()
    this.drawApp.reloadCanvas()
    this.drawApp.gui.reloadGUI()
  }

  public ui (): void {
    this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
