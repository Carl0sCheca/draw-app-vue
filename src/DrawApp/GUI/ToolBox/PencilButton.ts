import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'

export class PencilButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.toolSelector.selectTool = ToolType.PENCIL
  }

  public ui (): void {
    if (this.active) {
      this.setActive()
    } else {
      this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
    }
  }
}
