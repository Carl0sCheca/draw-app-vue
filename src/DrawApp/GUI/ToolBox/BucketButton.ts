import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'

export class BucketButton extends GUIElement {
  public action (): void {
    this.drawApp.toolSelector.selectTool = ToolType.BUCKET
  }

  public ui (): void {
    if (this.active) {
      this.setActive()
    } else {
      this.drawApp.ctx.drawImage(this.img, this._position.x, this._position.y, this.size.x, this.size.y)
    }
  }
}
