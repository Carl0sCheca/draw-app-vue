import { GUIElement } from '../GUIElement'

export class ClearButton extends GUIElement {
  public windowResize () {
    this.position = {
      x: this.drawApp.canvas.width - this.size.x,
      y: 0
    }
  }

  public ui (): void {
    this.drawApp.ctx.drawImage(this.img!, this.position.x, this.position.y, this.size.x, this.size.y)
  }

  public mouseUp (): void {
    this.drawApp.data.clearData()
    this.drawApp.reloadCanvas()
    this.drawApp.gui.reloadGUI()
  }
}
