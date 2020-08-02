import { GUIElement } from '../GUIElement'

export class RedoButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.data.redo()
  }

  public ui (): void {
    this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
