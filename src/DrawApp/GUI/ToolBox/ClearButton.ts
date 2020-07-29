import { GUIElement } from '../GUIElement'

export class ClearButton extends GUIElement {
  public ui (): void {
    this.drawApp.ctx.drawImage(this.img, this._position.x, this._position.y, this.size.x, this.size.y)
  }

  public action (): void {
    this.drawApp.data.clearData()
  }
}
