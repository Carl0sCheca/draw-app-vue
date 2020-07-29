import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'

export class PencilButton extends GUIElement {
  public action (): void {
    // console.log(`mouse button left up inside ${this.name}`)
    this.drawApp.toolSelector.selectTool = ToolType.PENCIL
  }

  public ui (): void {
    if (this.active) {
      this.setActive()
    } else {
      this.drawApp.ctx.drawImage(this.img, this._position.x, this._position.y, this.size.x, this.size.y)
    }
  }
}
