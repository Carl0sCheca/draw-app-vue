import { GUIElement } from '../GUIElement'

export class UndoButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.data.undo()
  }

  public ui (): void {
    this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
