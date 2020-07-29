import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'

export class CircleButton extends GUIElement {
  public action (): void {
    // console.log(`mouse button left up inside ${this.name}`)
    this.drawApp.toolSelector.selectTool = ToolType.CIRCLE
  }

  public hide (): void {
    this.enabled = false
  }

  public show (): void {
    this.enabled = true
  }

  public ui (): void {
    if (this.active) {
      this.setActive()
    } else {
      this.drawApp.ctx.drawImage(this.img, this._position.x, this._position.y, this.size.x, this.size.y)
    }
  }
}
