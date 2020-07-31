import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'

export class BucketButton extends GUIElement {
  public mouseUp (): void {
    this.drawApp.toolSelector.selectTool = ToolType.BUCKET
  }

  public ui (): void {
    if (this.active) {
      this.setActive()
    } else {
      this.drawApp.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y)
    }
  }
}
