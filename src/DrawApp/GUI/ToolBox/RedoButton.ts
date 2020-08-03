import { GUIElement } from '../GUIElement'

export class RedoButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.data.redo()
    this.drawApp.reloadCanvas()
    this.drawApp.gui.reloadGUI()
  }

  public hover () {
    if (this.drawApp.data.canRedo()) {
      super.hover()
    }
  }

  public ui (): void {
    if (this.drawApp.data.canRedo()) {
      this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
    } else {
      this.drawApp.ctx.filter = 'grayscale(100%) hue-rotate(180deg)'
      this.drawApp.ctx.globalAlpha = 0.5
      this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
      this.drawApp.ctx.globalAlpha = 1
      this.drawApp.ctx.filter = 'none'
    }
  }
}
